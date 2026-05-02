import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { criarPlanta } from "../hooks/usePlantas";
import styles from "./CriacaoPage.module.css";

// Simple markdown editor without external dependency
// Uses a textarea with markdown shortcuts and preview
export default function CriacaoPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("escrever"); // 'escrever' | 'preview'
  const [touched, setTouched] = useState<any>({});
  const textareaRef = useRef<any>(null);

  const validateField = (field: string, value: string) => {
    if (field === "nome") {
      if (!value || value.trim().length === 0) return "O nome é obrigatório";
      if (value.trim().length < 2) return "Mínimo de 2 caracteres";
      if (value.trim().length > 100) return "Máximo de 100 caracteres";
    }
    if (field === "descricao") {
      if (!value || value.trim().length === 0)
        return "A descrição é obrigatória";
      if (value.trim().length < 10) return "Mínimo de 10 caracteres";
    }
    return "";
  };

  const handleNomeBlur = () => {
    setTouched((t) => ({ ...t, nome: true }));
    const err = validateField("nome", nome);
    setErrors((e) => ({ ...e, nome: err }));
  };

  const handleDescricaoBlur = () => {
    setTouched((t) => ({ ...t, descricao: true }));
    const err = validateField("descricao", descricao);
    setErrors((e) => ({ ...e, descricao: err }));
  };

  const handleNomeChange = (e) => {
    setNome(e.target.value);
    if (touched.nome) {
      const err = validateField("nome", e.target.value);
      setErrors((prev) => ({ ...prev, nome: err }));
    }
  };

  const handleDescricaoChange = (e) => {
    setDescricao(e.target.value);
    if (touched.descricao) {
      const err = validateField("descricao", e.target.value);
      setErrors((prev) => ({ ...prev, descricao: err }));
    }
  };

  // Toolbar shortcuts
  const insertMarkdown = (prefix, suffix = "", placeholder = "texto") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = descricao.slice(start, end) || placeholder;
    const before = descricao.slice(0, start);
    const after = descricao.slice(end);
    const newText = `${before}${prefix}${selected}${suffix}${after}`;
    setDescricao(newText);
    setTimeout(() => {
      el.focus();
      const newCursor = start + prefix.length + selected.length;
      el.setSelectionRange(newCursor, newCursor);
      if (touched.descricao) {
        const err = validateField("descricao", newText);
        setErrors((prev) => ({ ...prev, descricao: err }));
      }
    }, 0);
  };

  const insertLine = (prefix) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = descricao.lastIndexOf("\n", start - 1) + 1;
    const before = descricao.slice(0, lineStart);
    const rest = descricao.slice(lineStart);
    const newText = `${before}${prefix}${rest}`;
    setDescricao(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        lineStart + prefix.length + (start - lineStart),
        lineStart + prefix.length + (start - lineStart),
      );
    }, 0);
  };

  const handleSubmit = async () => {
    setTouched({ nome: true, descricao: true });
    const nomeErr = validateField("nome", nome);
    const descricaoErr = validateField("descricao", descricao);
    setErrors({ nome: nomeErr, descricao: descricaoErr });
    if (nomeErr || descricaoErr) return;

    setLoading(true);
    setServerError("");
    try {
      const result = await criarPlanta({ nome, descricao });
      if (result.success) {
        navigate(result.data?.id ? `/folha/${result.data.id}` : "/");
      } else if (result.errors) {
        setErrors(result.errors);
      } else if (result.serverError) {
        setServerError(result.serverError);
      }
    } catch (err) {
      setServerError(
        "Erro inesperado. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const charCount = descricao.length;
  const renderPreview = () => {
    if (!descricao.trim())
      return '<em style="color: var(--green-300)">Nada para visualizar ainda…</em>';
    // Basic markdown to HTML conversion for preview
    let html = descricao
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>")
      .replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>")
      .replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>")
      .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
      .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
      .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/^\s*[-*+]\s+(.+)$/gm, "<li>$1</li>")
      .replace(/^\s*\d+\.\s+(.+)$/gm, "<li>$1</li>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/^---$/gm, "<hr/>")
      .replace(/^&gt;\s+(.+)$/gm, "<blockquote>$1</blockquote>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br/>");
    return `<p>${html}</p>`;
  };

  return (
    <div className={styles.page}>
      <NavBar />

      <main className={styles.main}>
        <div className={`container ${styles.layout}`}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <Link to="/" className={styles.backLink}>
              <BackIcon /> Catálogo
            </Link>

            <div className={styles.sidebarCard}>
              <div className={styles.sidebarLeaf} aria-hidden="true">
                <SideLeafSVG />
              </div>
              <h2 className={styles.sidebarTitle}>Nova folha</h2>
              <p className={styles.sidebarDesc}>
                Registre uma folha com seu nome e uma descrição rica em detalhes
                botânicos, curiosidades e significados.
              </p>
            </div>

            <div className={styles.tipsCard}>
              <h3 className={styles.tipsTitle}>Dicas de markdown</h3>
              <ul className={styles.tipsList}>
                {TIPS.map((tip) => (
                  <li key={tip.syntax} className={styles.tip}>
                    <code className={styles.tipCode}>{tip.syntax}</code>
                    <span className={styles.tipLabel}>{tip.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Form */}
          <div className={styles.formArea}>
            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>Registrar folha</h1>
              <p className={styles.formSubtitle}>
                Preencha os dados com cuidado — cada folha conta uma história.
              </p>
            </div>

            {serverError && (
              <div className={styles.serverError} role="alert">
                <AlertIcon />
                <span>{serverError}</span>
              </div>
            )}

            {/* Nome */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="nome">
                Nome da folha
                <span className={styles.required} aria-hidden="true">
                  *
                </span>
              </label>
              <div
                className={`${styles.inputWrap} ${errors.nome ? styles.inputError : touched.nome && nome ? styles.inputSuccess : ""}`}
              >
                <input
                  id="nome"
                  type="text"
                  className={styles.input}
                  value={nome}
                  onChange={handleNomeChange}
                  onBlur={handleNomeBlur}
                  placeholder="Ex: Folha de Bambu, Lótus Sagrado…"
                  maxLength={100}
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                  aria-invalid={!!errors.nome}
                />
                <span className={styles.inputCharCount}>{nome.length}/100</span>
                {touched.nome && !errors.nome && nome && <CheckIcon />}
              </div>
              {errors.nome && (
                <p id="nome-error" className={styles.errorMsg} role="alert">
                  <AlertSmallIcon /> {errors.nome}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="descricao">
                Descrição
                <span className={styles.required} aria-hidden="true">
                  *
                </span>
              </label>

              <div
                className={`${styles.editorBox} ${errors.descricao ? styles.editorError : touched.descricao && descricao.length >= 10 ? styles.editorSuccess : ""}`}
              >
                {/* Toolbar */}
                <div className={styles.editorToolbar}>
                  <div className={styles.toolbarButtons}>
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => insertMarkdown("**", "**", "negrito")}
                      title="Negrito"
                    >
                      <b>B</b>
                    </button>
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => insertMarkdown("*", "*", "itálico")}
                      title="Itálico"
                    >
                      <i>I</i>
                    </button>
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => insertMarkdown("`", "`", "código")}
                      title="Código"
                    >
                      {"</>"}
                    </button>
                    <div className={styles.toolDivider} />
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => insertLine("## ")}
                      title="Título"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => insertLine("### ")}
                      title="Subtítulo"
                    >
                      H3
                    </button>
                    <div className={styles.toolDivider} />
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => insertLine("- ")}
                      title="Lista"
                    >
                      •—
                    </button>
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => insertMarkdown("> ", "", "citação")}
                      title="Citação"
                    >
                      "
                    </button>
                  </div>

                  <div className={styles.tabsWrap}>
                    <button
                      type="button"
                      className={`${styles.tabBtn} ${tab === "escrever" ? styles.tabActive : ""}`}
                      onClick={() => setTab("escrever")}
                    >
                      Escrever
                    </button>
                    <button
                      type="button"
                      className={`${styles.tabBtn} ${tab === "preview" ? styles.tabActive : ""}`}
                      onClick={() => setTab("preview")}
                    >
                      Prévia
                    </button>
                  </div>
                </div>

                {/* Editor / Preview */}
                {tab === "escrever" ? (
                  <textarea
                    ref={textareaRef}
                    id="descricao"
                    className={styles.textarea}
                    value={descricao}
                    onChange={handleDescricaoChange}
                    onBlur={handleDescricaoBlur}
                    placeholder="Descreva a folha em detalhes&#10;&#10;Use **markdown** para formatar seu texto.&#10;&#10;Você pode falar sobre:&#10;- Características morfológicas&#10;- Habitat natural&#10;- Usos e propriedades&#10;- Simbolismo e significado cultural"
                    aria-describedby={
                      errors.descricao ? "desc-error" : undefined
                    }
                    aria-invalid={!!errors.descricao}
                    aria-label="Descrição em markdown"
                  />
                ) : (
                  <div
                    className={`${styles.previewPane} markdown-content`}
                    dangerouslySetInnerHTML={{ __html: renderPreview() }}
                    aria-label="Prévia da descrição"
                  />
                )}

                <div className={styles.editorFooter}>
                  <span
                    className={`${styles.charCount} ${charCount > 5000 ? styles.charWarn : ""}`}
                  >
                    {charCount} caracteres
                  </span>
                  <span className={styles.editorHint}>Suporta markdown</span>
                </div>
              </div>

              {errors.descricao && (
                <p id="desc-error" className={styles.errorMsg} role="alert">
                  <AlertSmallIcon /> {errors.descricao}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <Link to="/" className={styles.cancelBtn}>
                Cancelar
              </Link>
              <button
                type="button"
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    Salvando…
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Registrar folha
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const TIPS = [
  { syntax: "**texto**", label: "negrito" },
  { syntax: "*texto*", label: "itálico" },
  { syntax: "## Título", label: "título" },
  { syntax: "- item", label: "lista" },
  { syntax: "`código`", label: "inline code" },
  { syntax: "> texto", label: "citação" },
];

// ── Icons ──────────────────────────────────────────────

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M9 2L4 7L9 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M9 5.5V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="12.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function AlertSmallIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }}
    >
      <circle
        cx="6.5"
        cy="6.5"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M6.5 4V7.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="6.5" cy="9.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0, color: "var(--green-500)" }}
    >
      <path
        d="M3 8L6.5 11.5L13 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="2"
        y="2"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5 2V6H10V2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 10H11.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SideLeafSVG() {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 60, height: 60 }}
    >
      <path
        d="M10 50C10 50 18 18 50 8C50 8 50 40 18 50"
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M18 50C18 50 24 34 32 28"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
    </svg>
  );
}
