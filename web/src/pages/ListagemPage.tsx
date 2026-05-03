import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { usePlantas } from "../hooks/usePlantas";
import type { Planta } from "../hooks/usePlantas";

export default function ListagemPage() {
  const { plantas, loading, error, refetch } = usePlantas();
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("az");
  
  // Pagination states
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 12;

  const plantasFiltradas = useMemo(() => {
    let lista = [...plantas];

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();
      lista = lista.filter(
        (p) =>
          p.nome?.toLowerCase().includes(termo) ||
          p.conteudo?.toLowerCase().includes(termo),
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

  const totalPaginas = Math.ceil(plantasFiltradas.length / itensPorPagina);

  const plantasPaginadas = useMemo(() => {
    const inicio = (pagina - 1) * itensPorPagina;
    return plantasFiltradas.slice(inicio, inicio + itensPorPagina);
  }, [plantasFiltradas, pagina]);

  // Reset page when search or sort changes
  useEffect(() => {
    setPagina(1);
  }, [busca, ordem]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />

      <main>
        {/* Hero */}
        <section className="bg-green-900 relative overflow-hidden border-b border-green-700 before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(42,95,60,0.4)_0%,transparent_70%),radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(26,52,35,0.6)_0%,transparent_60%)] before:pointer-events-none">
          <div className="container grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-8 py-14 relative z-10">
            <div
              className="w-[180px] h-[180px] opacity-60 animate-leafSway hidden sm:block"
              aria-hidden="true"
            >
              <BigLeafSVG />
            </div>
            <div className="">
              <p className="text-[0.75rem] font-normal tracking-[0.15em] uppercase text-green-300 mb-3 font-body">
                Catálogo Botânico
              </p>
              <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-normal text-cream-100 leading-[1.1] tracking-tight mb-4">
                Herbário de Folhas
              </h1>
              <p className="text-base text-green-200 max-w-[480px] leading-relaxed mb-8 font-light">
                Um registro vivo do conhecimento sobre folhas, suas formas,
                significados e segredos.
              </p>
              <div className="flex gap-8">
                <div className="flex flex-col gap-0.5">
                  <span className="font-display text-[2rem] font-medium text-cream-100 leading-none">
                    {loading ? "—" : plantas.length}
                  </span>
                  <span className="text-[0.75rem] text-green-300 lowercase tracking-wider">
                    espécies registradas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="bg-cream-100 border-b border-cream-300 sticky top-16 z-[90]">
          <div className="container flex items-center gap-4 py-4 flex-wrap sm:flex-nowrap">
            <div className="flex-1 min-w-0 sm:min-w-[240px] flex items-center gap-[10px] bg-white border border-cream-300 rounded-full px-4 h-11 text-green-400 transition-all focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-400/5 focus-within:text-green-700">
              <SearchIcon />
              <input
                type="search"
                className="flex-1 border-none outline-none bg-transparent text-[0.9rem] font-body text-green-900 placeholder:text-green-300"
                placeholder="Buscar por nome ou conteúdo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar folhas"
              />
              {busca && (
                <button
                  className="bg-transparent border-none text-green-300 text-[1.2rem] p-0 leading-none w-5 h-5 flex items-center justify-center rounded-full transition-colors hover:bg-green-50 hover:text-green-700"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label
                className="text-[0.8rem] text-green-400 whitespace-nowrap"
                htmlFor="ordem"
              >
                Ordenar:
              </label>
              <select
                id="ordem"
                className="border border-cream-300 bg-white rounded-lg px-3 py-2 pr-7 text-[0.875rem] font-body text-green-800 cursor-pointer outline-none transition-colors appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' fill=\'none\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%235a9e68\' stroke-width=\'1.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] focus:border-green-400"
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
        <section className="flex-1 py-10 pb-16">
          <div className="container">
            {loading && <SkeletonGrid />}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center text-center py-20 px-8 gap-4">
                <ErrorIcon />
                <h2 className="font-display text-[1.75rem] font-normal text-green-700">
                  Não foi possível carregar o catálogo
                </h2>
                <p className="text-[0.95rem] text-green-400 max-w-[400px] leading-relaxed">
                  {error}
                </p>
                <button
                  className="mt-2 bg-green-800 text-cream-100 border-none px-6 py-2.5 rounded-full text-[0.9rem] font-body font-normal transition-all inline-flex items-center hover:bg-green-600 hover:-translate-y-px"
                  onClick={refetch}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!loading && !error && plantas.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 px-8 gap-4">
                <EmptyLeafSVG />
                <h2 className="font-display text-[1.75rem] font-normal text-green-700">
                  Catálogo vazio
                </h2>
                <p className="text-[0.95rem] text-green-400 max-w-[400px] leading-relaxed">
                  Nenhuma folha foi registrada ainda. Comece adicionando a
                  primeira.
                </p>
                <Link
                  to="/nova"
                  className="mt-2 bg-green-800 text-cream-100 border-none px-6 py-2.5 rounded-full text-[0.9rem] font-body font-normal transition-all inline-flex items-center hover:bg-green-600 hover:-translate-y-px"
                >
                  Registrar primeira folha
                </Link>
              </div>
            )}

            {!loading &&
              !error &&
              plantas.length > 0 &&
              plantasFiltradas.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-20 px-8 gap-4">
                  <SearchEmptyIcon />
                  <h2 className="font-display text-[1.75rem] font-normal text-green-700">
                    Nenhum resultado
                  </h2>
                  <p className="text-[0.95rem] text-green-400 max-w-[400px] leading-relaxed">
                    Não encontramos folhas com "<strong>{busca}</strong>". Tente
                    outro termo.
                  </p>
                  <button
                    className="mt-2 bg-green-800 text-cream-100 border-none px-6 py-2.5 rounded-full text-[0.9rem] font-body font-normal transition-all inline-flex items-center hover:bg-green-600 hover:-translate-y-px"
                    onClick={() => setBusca("")}
                  >
                    Limpar filtro
                  </button>
                </div>
              )}

            {!loading && !error && plantasFiltradas.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[0.8rem] text-green-400 font-normal tracking-wide">
                    <span>
                      {plantasFiltradas.length === plantas.length
                        ? `${plantas.length} ${plantas.length === 1 ? "registro" : "registros"}`
                        : `${plantasFiltradas.length} de ${plantas.length} registros`}
                    </span>
                  </div>
                  
                  {totalPaginas > 1 && (
                    <div className="text-[0.8rem] text-green-600 font-medium">
                      Página {pagina} de {totalPaginas}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                  {plantasPaginadas.map((planta, idx) => (
                    <PlantCard
                      key={planta.id || idx}
                      planta={planta}
                      index={idx}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPaginas > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-cream-300">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={pagina === 1}
                      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        pagina === 1
                          ? "text-cream-400 cursor-not-allowed"
                          : "text-green-800 bg-white border border-cream-300 hover:border-green-400 hover:shadow-sm active:translate-y-0.5"
                      }`}
                    >
                      <span className="rotate-180"><ArrowIcon /></span>
                      Anterior
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => setPagina(n)}
                          className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                            pagina === n
                              ? "bg-green-900 text-cream-100 shadow-md scale-110"
                              : "text-green-700 hover:bg-green-50"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      disabled={pagina === totalPaginas}
                      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        pagina === totalPaginas
                          ? "text-cream-400 cursor-not-allowed"
                          : "text-green-800 bg-white border border-cream-300 hover:border-green-400 hover:shadow-sm active:translate-y-0.5"
                      }`}
                    >
                      Próxima
                      <ArrowIcon />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-green-950 text-green-400 text-[0.78rem] text-center py-6 font-body tracking-widest">
        <div className="container">
          <p>Herbário — Catálogo Botânico</p>
        </div>
      </footer>
    </div>
  );
}

function PlantCard({ planta, index }: { planta: Planta; index: number }) {
  const preview = useMemo(() => {
    if (!planta.conteudo) return "";
    // Remove markdown syntax for preview
    return planta.conteudo
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
  }, [planta.conteudo]);

  const iniciais = planta.nome
    ? planta.nome
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0])
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
      className="group bg-white border border-cream-300 rounded-lg p-6 flex flex-col gap-3 transition-all animate-fadeUp cursor-pointer relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[var(--accent)] before:opacity-0 before:transition-opacity before:rounded-t-lg hover:shadow-card-hover hover:-translate-y-px hover:border-green-100 hover:before:opacity-100"
      style={
        {
          animationDelay: `${index * 60}ms`,
          "--accent": cardAccent,
        } as any
      }
    >
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-md bg-green-900 flex items-center justify-center relative overflow-hidden">
          <span className="font-display text-base font-medium text-cream-100 relative z-10">
            {iniciais}
          </span>
          <div
            className="absolute bottom-0.5 right-0.5 opacity-50"
            aria-hidden="true"
          >
            <SmallLeafSVG />
          </div>
        </div>
        <div className="text-[0.7rem] font-mono text-green-300 bg-green-50 border border-green-100 px-2 py-0.5 rounded tracking-wider">
          #{String(planta.id || "?").padStart(3, "0")}
        </div>
      </div>

      <h3 className="font-display text-[1.3rem] font-medium text-green-900 leading-tight">
        {planta.nome || "Sem nome"}
      </h3>

      {preview && (
        <p className="text-[0.875rem] text-green-500 leading-relaxed flex-1">
          {preview}
          {planta.conteudo?.length > 140 ? "…" : ""}
        </p>
      )}

      <div className="flex items-center justify-end border-t border-cream-200 pt-3 mt-1">
        <span className="flex items-center gap-1.5 text-[0.8rem] text-green-500 font-normal transition-all group-hover:gap-2 group-hover:text-green-700">
          Ver detalhes
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-cream-300 rounded-lg h-[200px] relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent_0%,rgba(196,223,200,0.2)_50%,transparent_100%)] after:bg-[length:400px_100%] after:animate-shimmer"
        />
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
