import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  criarPlanta,
  buscarPlantasPorNome,
  deletarImagem,
  type Planta,
  type Imagem,
} from "../hooks/usePlantas";
import ImageUpload from "../components/ImageUpload";
import ImageGallery from "../components/ImageGallery";

// Simple markdown editor without external dependency
// Uses a textarea with markdown shortcuts and preview
export default function CriacaoPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("escrever"); // 'escrever' | 'preview'
  const [touched, setTouched] = useState<any>({});
  const textareaRef = useRef<any>(null);
  const [sugestoes, setSugestoes] = useState<Planta[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [plantaId, setPlantaId] = useState<number | null>(null);

  // Debounced search for similar plant names
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (nome.trim().length >= 3) {
        setBuscando(true);
        try {
          const resultados = await buscarPlantasPorNome(nome.trim());
          setSugestoes(resultados);
        } catch (err) {
          setSugestoes([]);
        } finally {
          setBuscando(false);
        }
      } else {
        setSugestoes([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [nome]);

  const validateField = (field: string, value: string) => {
    if (field === "nome") {
      if (!value || value.trim().length === 0) return "O nome é obrigatório";
      if (value.trim().length < 2) return "Mínimo de 2 caracteres";
      if (value.trim().length > 100) return "Máximo de 100 caracteres";
    }
    if (field === "conteudo") {
      if (!value || value.trim().length === 0)
        return "O conteúdo é obrigatório";
      if (value.trim().length < 10) return "Mínimo de 10 caracteres";
    }
    return "";
  };

  const handleNomeBlur = () => {
    setTouched((t: any) => ({ ...t, nome: true }));
    const err = validateField("nome", nome);
    setErrors((e: any) => ({ ...e, nome: err }));
  };

  const handleConteudoBlur = () => {
    setTouched((t: any) => ({ ...t, conteudo: true }));
    const err = validateField("conteudo", conteudo);
    setErrors((e: any) => ({ ...e, conteudo: err }));
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
    if (touched.nome) {
      const err = validateField("nome", e.target.value);
      setErrors((prev: any) => ({ ...prev, nome: err }));
    }
  };

  const handleConteudoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConteudo(e.target.value);
    if (touched.conteudo) {
      const err = validateField("conteudo", e.target.value);
      setErrors((prev: any) => ({ ...prev, conteudo: err }));
    }
  };

  // Toolbar shortcuts
  const insertMarkdown = (
    prefix: string,
    suffix = "",
    placeholder = "texto",
  ) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = conteudo.slice(start, end) || placeholder;
    const before = conteudo.slice(0, start);
    const after = conteudo.slice(end);
    const newText = `${before}${prefix}${selected}${suffix}${after}`;
    setConteudo(newText);
    setTimeout(() => {
      el.focus();
      const newCursor = start + prefix.length + selected.length;
      el.setSelectionRange(newCursor, newCursor);
      if (touched.conteudo) {
        const err = validateField("conteudo", newText);
        setErrors((prev: any) => ({ ...prev, conteudo: err }));
      }
    }, 0);
  };

  const insertLine = (prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = conteudo.lastIndexOf("\n", start - 1) + 1;
    const before = conteudo.slice(0, lineStart);
    const rest = conteudo.slice(lineStart);
    const newText = `${before}${prefix}${rest}`;
    setConteudo(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        lineStart + prefix.length + (start - lineStart),
        lineStart + prefix.length + (start - lineStart),
      );
    }, 0);
  };

  const handleSubmit = async () => {
    setTouched({ nome: true, conteudo: true });
    const nomeErr = validateField("nome", nome);
    const conteudoErr = validateField("conteudo", conteudo);
    setErrors({ nome: nomeErr, conteudo: conteudoErr });
    if (nomeErr || conteudoErr) return;

    setLoading(true);
    setServerError("");
    try {
      const result = await criarPlanta({
        nome,
        conteudo,
        categoria,
        tags,
      });
      if (result.success) {
        setPlantaId(result.data?.id || null);
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

  const handleFinish = () => {
    if (plantaId) {
      navigate(`/folha/${plantaId}`);
    } else {
      navigate("/");
    }
  };

  const handleImageUpload = async (imagem: Imagem) => {
    setImagens((prev) => [...prev, imagem]);
  };

  const handleImageDelete = async (imagemId: number) => {
    if (!plantaId) return;
    const result = await deletarImagem(plantaId, imagemId);
    if (result.success) {
      setImagens((prev) => prev.filter((img) => img.id !== imagemId));
    }
  };

  const charCount = conteudo.length;
  const renderPreview = () => {
    if (!conteudo.trim())
      return '<em class="text-green-300">Nada para visualizar ainda…</em>';
    // Basic markdown to HTML conversion for preview
    let html = conteudo
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>")
      .replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>")
      .replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>")
      .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
      .replace(/^#{2}\s+(.+)$/gm, "<h2>$2</h2>")
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
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />

      <main className="flex-1 py-10 pb-20">
        <div className="container grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-start">
          {/* Sidebar */}
          <aside className="flex flex-col gap-4 md:sticky md:top-[100px]">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[0.8rem] text-green-500 transition-all mb-1 hover:text-green-700 hover:gap-1"
            >
              <BackIcon /> Catálogo
            </Link>

            <div className="bg-green-900 rounded-lg p-6 overflow-hidden relative">
              <div
                className="absolute -bottom-[10px] -right-[10px] opacity-50"
                aria-hidden="true"
              >
                <SideLeafSVG />
              </div>
              <h2 className="font-display text-2xl font-normal text-cream-100 mb-3">
                Nova folha
              </h2>
              <p className="text-[0.85rem] text-green-200 leading-[1.65]">
                Registre uma folha com seu nome e uma descrição rica em detalhes
                botânicos, curiosidades e significados.
              </p>
            </div>

            <div className="bg-white border border-cream-300 rounded-lg p-5 hidden md:block">
              <h3 className="font-display text-base font-medium text-green-700 mb-3">
                Dicas de markdown
              </h3>
              <ul className="list-none flex flex-col gap-2">
                {TIPS.map((tip) => (
                  <li key={tip.syntax} className="flex items-center gap-2">
                    <code className="text-[0.75rem] bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
                      {tip.syntax}
                    </code>
                    <span className="text-[0.78rem] text-green-400">
                      {tip.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Form */}
          <div className="animate-fadeUp">
            <div className="mb-8">
              <h1 className="font-display text-[2.25rem] font-normal text-green-900 mb-2">
                Registrar folha
              </h1>
              <p className="text-[0.9rem] text-green-400 leading-relaxed">
                Preencha os dados com cuidado — cada folha conta uma história.
              </p>
            </div>

            {serverError && (
              <div
                className="flex items-start gap-[10px] bg-[#fff5f5] border border-[#fca5a5] text-[#b91c1c] p-4 rounded-md text-[0.875rem] mb-6 leading-relaxed"
                role="alert"
              >
                <AlertIcon />
                <span>{serverError}</span>
              </div>
            )}

            {/* Nome */}
            <div className="mb-7">
              <label
                className="block text-[0.875rem] font-medium text-green-800 mb-2 tracking-tight"
                htmlFor="nome"
              >
                Nome da folha
                <span className="text-green-500 ml-[3px]" aria-hidden="true">
                  *
                </span>
              </label>
              <div
                className={`flex items-center gap-[10px] bg-white border-[1.5px] border-cream-300 rounded-md px-3.5 h-[50px] transition-all focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-400/5 ${errors.nome ? "border-[#f87171]" : touched.nome && nome ? "border-green-300" : ""}`}
              >
                <input
                  id="nome"
                  type="text"
                  className="flex-1 border-none outline-none bg-transparent text-base font-body text-green-900 placeholder:text-green-200"
                  value={nome}
                  onChange={handleNomeChange}
                  onBlur={handleNomeBlur}
                  placeholder="Ex: Folha de Bambu, Lótus Sagrado…"
                  maxLength={100}
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                  aria-invalid={!!errors.nome}
                />
                <span className="text-[0.72rem] text-green-300 whitespace-nowrap font-mono">
                  {nome.length}/100
                </span>
                {touched.nome && !errors.nome && nome && <CheckIcon />}
              </div>
              {errors.nome && (
                <p
                  id="nome-error"
                  className="text-[0.8rem] text-red-600 mt-[0.4rem] flex items-center"
                  role="alert"
                >
                  <AlertSmallIcon /> {errors.nome}
                </p>
              )}

              {/* Search suggestions */}
              {sugestoes.length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-[0.8rem] text-amber-800 font-medium mb-2 flex items-center gap-1.5">
                    <InfoIcon />
                    Folhas semelhantes já cadastradas:
                  </p>
                  <ul className="list-none flex flex-col gap-1.5">
                    {sugestoes.map((sugestao) => (
                      <li key={sugestao.id}>
                        <Link
                          to={`/folha/${sugestao.id}`}
                          className="text-[0.8rem] text-amber-700 hover:text-amber-900 hover:underline block"
                        >
                          {sugestao.nome}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[0.75rem] text-amber-600 mt-2 italic">
                    Esta busca é apenas informativa. Você pode continuar com o
                    cadastro normalmente.
                  </p>
                </div>
              )}

              {buscando && nome.trim().length >= 3 && (
                <p className="text-[0.8rem] text-green-400 mt-[0.4rem] flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                  Buscando folhas semelhantes…
                </p>
              )}
            </div>

            {/* Categoria */}
            <div className="mb-7">
              <label
                className="block text-[0.875rem] font-medium text-green-800 mb-2 tracking-tight"
                htmlFor="categoria"
              >
                Categoria
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-white border-[1.5px] border-cream-300 rounded-md px-3.5 h-[50px] transition-all focus:border-green-400 focus:ring-4 focus:ring-green-400/5 text-base font-body text-green-900"
              >
                <option value="">Selecione uma categoria (opcional)</option>
                <option value="medicinal">Medicinal</option>
                <option value="ornamental">Ornamental</option>
                <option value="comestivel">Comestível</option>
                <option value="tóxica">Tóxica</option>
                <option value="ritualística">Ritualística</option>
              </select>
            </div>

            {/* Tags */}
            <div className="mb-7">
              <label
                className="block text-[0.875rem] font-medium text-green-800 mb-2 tracking-tight"
                htmlFor="tags"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Separe por vírgula: ex: aromática, tropical, rara"
                className="w-full bg-white border-[1.5px] border-cream-300 rounded-md px-3.5 h-[50px] transition-all focus:border-green-400 focus:ring-4 focus:ring-green-400/5 text-base font-body text-green-900 placeholder:text-green-200"
              />
              <p className="text-[0.75rem] text-green-400 mt-1">
                Use vírgulas para separar múltiplas tags
              </p>
            </div>

            {/* Image Upload */}
            {plantaId && (
              <ImageUpload
                plantaId={plantaId}
                onUploadSuccess={handleImageUpload}
                currentImageCount={imagens.length}
                maxImages={5}
              />
            )}

            {/* Image Gallery */}
            {imagens.length > 0 && (
              <div className="mb-7">
                <ImageGallery
                  images={imagens}
                  onDelete={handleImageDelete}
                  readonly={false}
                />
              </div>
            )}

            {/* Conteúdo */}
            <div className="mb-7">
              <label
                className="block text-[0.875rem] font-medium text-green-800 mb-2 tracking-tight"
                htmlFor="conteudo"
              >
                Conteúdo
                <span className="text-green-500 ml-[3px]" aria-hidden="true">
                  *
                </span>
              </label>

              <div
                className={`bg-white border-[1.5px] border-cream-300 rounded-lg overflow-hidden transition-all focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-400/5 ${errors.conteudo ? "border-[#f87171]" : touched.conteudo && conteudo.length >= 10 ? "border-green-300" : ""}`}
              >
                {/* Toolbar */}
                <div className="flex items-center justify-between bg-cream-200 border-b border-cream-300 p-2 gap-2 flex-wrap">
                  <div className="flex items-center gap-[2px]">
                    <button
                      type="button"
                      className="bg-transparent border-none rounded-[5px] px-2 py-1 text-[0.78rem] font-body text-green-600 transition-colors min-w-[28px] h-7 flex items-center justify-center hover:bg-cream-300 hover:text-green-900"
                      onClick={() => insertMarkdown("**", "**", "negrito")}
                      title="Negrito"
                    >
                      <b>B</b>
                    </button>
                    <button
                      type="button"
                      className="bg-transparent border-none rounded-[5px] px-2 py-1 text-[0.78rem] font-body text-green-600 transition-colors min-w-[28px] h-7 flex items-center justify-center hover:bg-cream-300 hover:text-green-900"
                      onClick={() => insertMarkdown("*", "*", "itálico")}
                      title="Itálico"
                    >
                      <i>I</i>
                    </button>
                    <button
                      type="button"
                      className="bg-transparent border-none rounded-[5px] px-2 py-1 text-[0.78rem] font-body text-green-600 transition-colors min-w-[28px] h-7 flex items-center justify-center hover:bg-cream-300 hover:text-green-900"
                      onClick={() => insertMarkdown("`", "`", "código")}
                      title="Código"
                    >
                      {"</>"}
                    </button>
                    <div className="w-px h-5 bg-cream-300 mx-1" />
                    <button
                      type="button"
                      className="bg-transparent border-none rounded-[5px] px-2 py-1 text-[0.78rem] font-body text-green-600 transition-colors min-w-[28px] h-7 flex items-center justify-center hover:bg-cream-300 hover:text-green-900"
                      onClick={() => insertLine("## ")}
                      title="Título"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      className="bg-transparent border-none rounded-[5px] px-2 py-1 text-[0.78rem] font-body text-green-600 transition-colors min-w-[28px] h-7 flex items-center justify-center hover:bg-cream-300 hover:text-green-900"
                      onClick={() => insertLine("### ")}
                      title="Subtítulo"
                    >
                      H3
                    </button>
                    <div className="w-px h-5 bg-cream-300 mx-1" />
                    <button
                      type="button"
                      className="bg-transparent border-none rounded-[5px] px-2 py-1 text-[0.78rem] font-body text-green-600 transition-colors min-w-[28px] h-7 flex items-center justify-center hover:bg-cream-300 hover:text-green-900"
                      onClick={() => insertLine("- ")}
                      title="Lista"
                    >
                      •—
                    </button>
                    <button
                      type="button"
                      className="bg-transparent border-none rounded-[5px] px-2 py-1 text-[0.78rem] font-body text-green-600 transition-colors min-w-[28px] h-7 flex items-center justify-center hover:bg-cream-300 hover:text-green-900"
                      onClick={() => insertMarkdown("> ", "", "citação")}
                      title="Citação"
                    >
                      "
                    </button>
                  </div>

                  <div className="flex bg-cream-100 border border-cream-300 rounded-[6px] p-[2px] gap-[2px]">
                    <button
                      type="button"
                      className={`bg-transparent border-none rounded-[4px] px-3 py-1 text-[0.78rem] font-body transition-all ${tab === "escrever" ? "bg-white text-green-800 shadow-[0_1px_3px_rgba(0,0,0,0.06)]" : "text-green-400"}`}
                      onClick={() => setTab("escrever")}
                    >
                      Escrever
                    </button>
                    <button
                      type="button"
                      className={`bg-transparent border-none rounded-[4px] px-3 py-1 text-[0.78rem] font-body transition-all ${tab === "preview" ? "bg-white text-green-800 shadow-[0_1px_3px_rgba(0,0,0,0.06)]" : "text-green-400"}`}
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
                    id="conteudo"
                    className="block w-full min-h-[320px] border-none outline-none p-5 text-[0.95rem] font-mono leading-relaxed text-green-800 bg-white resize-y placeholder:text-green-200 placeholder:font-body placeholder:italic"
                    value={conteudo}
                    onChange={handleConteudoChange}
                    onBlur={handleConteudoBlur}
                    placeholder="Descreva a folha em detalhes&#10;&#10;Use **markdown** para formatar seu texto.&#10;&#10;Você pode falar sobre:&#10;- Características morfológicas&#10;- Habitat natural&#10;- Usos e propriedades&#10;- Simbolismo e significado cultural"
                    aria-describedby={
                      errors.conteudo ? "conteudo-error" : undefined
                    }
                    aria-invalid={!!errors.conteudo}
                    aria-label="Conteúdo em markdown"
                  />
                ) : (
                  <div
                    className="min-h-[320px] p-6 bg-white markdown-content"
                    dangerouslySetInnerHTML={{ __html: renderPreview() }}
                    aria-label="Prévia do conteúdo"
                  />
                )}

                <div className="flex items-center justify-between px-3.5 py-1.5 bg-cream-200 border-t border-cream-300">
                  <span
                    className={`text-[0.72rem] font-mono ${charCount > 5000 ? "text-red-600" : "text-green-300"}`}
                  >
                    {charCount} caracteres
                  </span>
                  <span className="text-[0.72rem] text-green-300">
                    Suporta markdown
                  </span>
                </div>
              </div>

              {errors.conteudo && (
                <p
                  id="conteudo-error"
                  className="text-[0.8rem] text-red-600 mt-[0.4rem] flex items-center"
                  role="alert"
                >
                  <AlertSmallIcon /> {errors.conteudo}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-cream-200 mt-2">
              <Link
                to="/"
                className="text-[0.9rem] text-green-400 px-5 py-2.5 rounded-full transition-colors hover:bg-cream-200 hover:text-green-700"
              >
                Cancelar
              </Link>
              {!plantaId ? (
                <button
                  type="button"
                  className="flex items-center gap-2 bg-green-800 text-cream-100 border-none px-7 py-3 rounded-full text-[0.9rem] font-body font-normal transition-all hover:enabled:bg-green-600 hover:enabled:-translate-y-px disabled:opacity-65 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="w-[15px] h-[15px] border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"
                        aria-hidden="true"
                      />
                      Salvando…
                    </>
                  ) : (
                    <>
                      <SaveIcon />
                      Registrar folha
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-2 bg-green-600 text-cream-100 border-none px-7 py-3 rounded-full text-[0.9rem] font-body font-normal transition-all hover:bg-green-500 hover:-translate-y-px"
                  onClick={handleFinish}
                >
                  Concluir
                </button>
              )}
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

function InfoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7 3.5V7.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="7" cy="9.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
