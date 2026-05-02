import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { usePlantas } from "../hooks/usePlantas";
import styles from "./ListagemPage.module.css";

export default function ListagemPage() {
  const { plantas, loading, error, refetch } = usePlantas();
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("az");

  const plantasFiltradas = useMemo(() => {
    let lista = [...plantas];

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();
      lista = lista.filter(
        (p) =>
          p.nome?.toLowerCase().includes(termo) ||
          p.descricao?.toLowerCase().includes(termo),
      );
    }

    lista.sort((a, b) => {
      if (ordem === "az")
        return (a.nome || "").localeCompare(b.nome || "", "pt-BR");
      if (ordem === "za")
        return (b.nome || "").localeCompare(a.nome || "", "pt-BR");
      if (ordem === "recente") return (b.id || 0) - (a.id || 0);
      if (ordem === "antigo") return (a.id || 0) - (b.id || 0);
      return 0;
    });

    return lista;
  }, [plantas, busca, ordem]);

  return (
    <div className={styles.page}>
      <NavBar />

      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroDecor} aria-hidden="true">
              <BigLeafSVG />
            </div>
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>Catálogo Botânico</p>
              <h1 className={styles.heroTitle}>Herbário de Folhas</h1>
              <p className={styles.heroSubtitle}>
                Um registro vivo do conhecimento sobre folhas, suas formas,
                significados e segredos.
              </p>
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>
                    {loading ? "—" : plantas.length}
                  </span>
                  <span className={styles.statLabel}>espécies registradas</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className={styles.toolbar}>
          <div className={`container ${styles.toolbarInner}`}>
            <div className={styles.searchWrap}>
              <SearchIcon />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Buscar por nome ou descrição…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar folhas"
              />
              {busca && (
                <button
                  className={styles.clearBtn}
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>

            <div className={styles.controls}>
              <label className={styles.selectLabel} htmlFor="ordem">
                Ordenar:
              </label>
              <select
                id="ordem"
                className={styles.select}
                value={ordem}
                onChange={(e) => setOrdem(e.target.value)}
              >
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
                <option value="recente">Mais recentes</option>
                <option value="antigo">Mais antigos</option>
              </select>
            </div>
          </div>
        </section>

        {/* Conteúdo */}
        <section className={styles.content}>
          <div className="container">
            {loading && <SkeletonGrid />}

            {error && !loading && (
              <div className={styles.errorState}>
                <ErrorIcon />
                <h2 className={styles.errorTitle}>
                  Não foi possível carregar o catálogo
                </h2>
                <p className={styles.errorMsg}>{error}</p>
                <button className={styles.retryBtn} onClick={refetch}>
                  Tentar novamente
                </button>
              </div>
            )}

            {!loading && !error && plantas.length === 0 && (
              <div className={styles.emptyState}>
                <EmptyLeafSVG />
                <h2 className={styles.emptyTitle}>Catálogo vazio</h2>
                <p className={styles.emptyMsg}>
                  Nenhuma folha foi registrada ainda. Comece adicionando a
                  primeira.
                </p>
                <Link to="/nova" className={styles.emptyBtn}>
                  Registrar primeira folha
                </Link>
              </div>
            )}

            {!loading &&
              !error &&
              plantas.length > 0 &&
              plantasFiltradas.length === 0 && (
                <div className={styles.emptyState}>
                  <SearchEmptyIcon />
                  <h2 className={styles.emptyTitle}>Nenhum resultado</h2>
                  <p className={styles.emptyMsg}>
                    Não encontramos folhas com "<strong>{busca}</strong>". Tente
                    outro termo.
                  </p>
                  <button
                    className={styles.emptyBtn}
                    onClick={() => setBusca("")}
                  >
                    Limpar filtro
                  </button>
                </div>
              )}

            {!loading && !error && plantasFiltradas.length > 0 && (
              <>
                <div className={styles.resultsInfo}>
                  <span>
                    {plantasFiltradas.length === plantas.length
                      ? `${plantas.length} ${plantas.length === 1 ? "registro" : "registros"}`
                      : `${plantasFiltradas.length} de ${plantas.length} registros`}
                  </span>
                </div>
                <div className={styles.grid}>
                  {plantasFiltradas.map((planta, idx) => (
                    <PlantCard
                      key={planta.id || idx}
                      planta={planta}
                      index={idx}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>Herbário — Catálogo Botânico</p>
        </div>
      </footer>
    </div>
  );
}

function PlantCard({ planta, index }) {
  const preview = useMemo(() => {
    if (!planta.descricao) return "";
    // Remove markdown syntax for preview
    return planta.descricao
      .replace(/#{1,6}\s+/g, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 140);
  }, [planta.descricao]);

  const iniciais = planta.nome
    ? planta.nome
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  const hue = (planta.nome?.charCodeAt(0) || 65) % 8;
  const hues = [
    "#1a3423",
    "#1f4028",
    "#265030",
    "#2e6038",
    "#3a7a47",
    "#1a3423",
    "#1f4028",
    "#265030",
  ];
  const cardAccent = hues[hue];

  return (
    <Link
      to={`/folha/${planta.id}`}
      className={styles.card}
      style={{
        animationDelay: `${index * 60}ms`,
        "--accent": cardAccent,
      }}
    >
      <div className={styles.cardTop}>
        <div className={styles.cardAvatar}>
          <span className={styles.cardAvatarText}>{iniciais}</span>
          <div className={styles.cardAvatarLeaf} aria-hidden="true">
            <SmallLeafSVG />
          </div>
        </div>
        <div className={styles.cardBadge}>
          #{String(planta.id || "?").padStart(3, "0")}
        </div>
      </div>

      <h3 className={styles.cardTitle}>{planta.nome || "Sem nome"}</h3>

      {preview && (
        <p className={styles.cardPreview}>
          {preview}
          {planta.descricao?.length > 140 ? "…" : ""}
        </p>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.cardReadMore}>
          Ver detalhes
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}

// ── SVG Icons & Illustrations ──────────────────────────

function BigLeafSVG() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <path
        d="M30 180 C30 180 50 60 170 20 C170 20 170 140 50 180"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M50 180 C50 180 70 120 110 100"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <path
        d="M110 100 C120 60 150 40 170 20"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M80 150 C85 130 100 118 110 100"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
      <path
        d="M140 60 C130 80 115 90 110 100"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
    </svg>
  );
}

function SmallLeafSVG() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 16, height: 16 }}
    >
      <path
        d="M5 19C5 19 7 9 19 5C19 5 19 15 7 19"
        fill="rgba(255,255,255,0.2)"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M7 19C7 19 9 14 12 12"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="1.5 2"
      />
    </svg>
  );
}

function EmptyLeafSVG() {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 80, height: 80 }}
    >
      <path
        d="M15 65C15 65 25 25 65 12C65 12 65 52 25 65"
        fill="var(--green-50)"
        stroke="var(--green-200)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M25 65C25 65 33 44 42 38"
        stroke="var(--green-200)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
    </svg>
  );
}

function SearchEmptyIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 72, height: 72 }}
    >
      <circle
        cx="34"
        cy="34"
        r="20"
        stroke="var(--green-200)"
        strokeWidth="2"
      />
      <path
        d="M48 48L62 62"
        stroke="var(--green-200)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27 34H41M34 27V41"
        stroke="var(--green-300)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M11 11L14 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M3 7H11M8 4L11 7L8 10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="var(--green-200)"
        strokeWidth="1.5"
      />
      <path
        d="M24 16V26"
        stroke="var(--green-400)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="32" r="1.5" fill="var(--green-400)" />
    </svg>
  );
}
