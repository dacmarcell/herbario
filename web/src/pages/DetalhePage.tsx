import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePlanta } from "../hooks/usePlantas";
import NavBar from "../components/NavBar";

export default function DetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { planta, loading, error } = usePlanta(id);

  if (loading) return <LoadingView />;
  if (error) return <ErrorView error={error} onBack={() => navigate("/")} />;
  if (!planta) return null;

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />

      <div className="bg-green-900 border-b border-green-700">
        <div className="container flex items-center gap-2 py-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[0.78rem] text-green-300 transition-colors hover:text-cream-100"
          >
            <BackIcon /> Catálogo
          </Link>
          <span className="text-[0.78rem] text-green-600" aria-hidden="true">
            /
          </span>
          <span className="text-[0.78rem] text-green-200 max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
            {planta.nome}
          </span>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero splash */}
        <section className="bg-green-900 relative overflow-hidden pb-12">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <HeroBgSVG />
          </div>

          <div className="container relative z-10 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-center pt-12">
            <div className="">
              <div className="inline-flex items-center bg-white/10 border border-white/10 rounded-full px-3 py-1 mb-5">
                <span className="text-[0.72rem] font-mono text-green-200 tracking-widest">
                  #{String(planta.id || "").padStart(3, "0")}
                </span>
              </div>
              <h1 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-normal text-cream-100 leading-[1.1] tracking-tight mb-4">
                {planta.nome}
              </h1>
              <p className="text-[0.9rem] text-green-300 italic font-display">
                Folha registrada no catálogo botânico
              </p>
            </div>

            <div className="hidden sm:block">
              <LeafIllustration name={planta.nome} />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="flex-1 py-12 pb-20">
          <div className="container grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            {/* Main article */}
            <article className="animate-fadeUp">
              <div className="flex items-center gap-[10px] mb-8">
                <LeafSmallIcon />
                <h2 className="font-display text-[1.1rem] font-medium text-green-600 lowercase tracking-wider">
                  Conteúdo
                </h2>
                <div className="flex-1 h-px bg-cream-300" />
              </div>

              <MarkdownContent content={planta.conteudo} />
            </article>

            {/* Sidebar info */}
            <aside className="flex flex-col gap-4 lg:sticky lg:top-[100px] animate-fadeUp [animation-delay:0.1s]">
              <div className="bg-white border border-cream-300 rounded-lg p-6">
                <h3 className="font-display text-[1.1rem] font-medium text-green-700 mb-5 pb-3 border-b border-cream-200">
                  Ficha técnica
                </h3>
                <dl className="flex flex-col gap-3.5">
                  <InfoRow
                    label="Identificador"
                    value={`#${String(planta.id || "").padStart(3, "0")}`}
                    mono
                  />
                  <InfoRow label="Nome" value={planta.nome} />
                  <InfoRow
                    label="Extensão"
                    value={`${planta.conteudo?.length || 0} caracteres`}
                  />
                </dl>
              </div>

              <div className="bg-white border border-cream-300 rounded-lg overflow-hidden">
                <Link
                  to="/"
                  className="flex items-center gap-[10px] p-4 text-green-600 text-[0.85rem] transition-colors border-b border-cream-200 last:border-b-0 hover:bg-green-50 hover:text-green-800"
                >
                  <GridIcon />
                  <span className="flex-1">Ver catálogo completo</span>
                  <ArrowIcon />
                </Link>
                <Link
                  to="/nova"
                  className="flex items-center gap-[10px] p-4 text-green-600 text-[0.85rem] transition-colors border-b border-cream-200 last:border-b-0 hover:bg-green-50 hover:text-green-800"
                >
                  <PlusCircleIcon />
                  <span className="flex-1">Registrar nova folha</span>
                  <ArrowIcon />
                </Link>
              </div>

              <div
                className="rounded-lg bg-green-50 p-6 hidden lg:flex items-center justify-center h-[120px] overflow-hidden border border-green-100"
                aria-hidden="true"
              >
                <DecorLeafSVG />
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="bg-green-950 text-green-400 text-[0.78rem] text-center py-6 tracking-widest">
        <div className="container">
          <p>Herbário — Catálogo Botânico</p>
        </div>
      </footer>
    </div>
  );
}

function MarkdownContent({ content }: { content: string | undefined }) {
  const html = useMemo(() => {
    if (!content) return '<em class="text-green-300 italic">Sem conteúdo</em>';
    return content
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
  }, [content]);

  return (
    <div
      className="bg-white border border-cream-300 rounded-lg px-6 py-10 sm:px-12 sm:py-10 min-h-[200px] markdown-content"
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
    />
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.72rem] text-green-300 uppercase tracking-widest font-normal">
        {label}
      </dt>
      <dd
        className={`text-[0.9rem] text-green-800 font-normal ${mono ? "font-mono text-[0.85rem]" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

// ── Loading / Error States ─────────────────────────────

function LoadingView() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-8 gap-4 text-center">
        <div className="w-10 h-10 border-[2.5px] border-green-100 border-t-green-500 rounded-full animate-spin" />
        <p className="text-[0.9rem] text-green-400">Carregando folha…</p>
      </div>
    </div>
  );
}

function ErrorView({ error, onBack }: { error: string; onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-8 gap-4 text-center">
        <ErrorLeafSVG />
        <h2 className="font-display text-[1.75rem] text-green-700">
          Folha não encontrada
        </h2>
        <p className="text-[0.9rem] text-green-400 max-w-[360px] leading-relaxed">
          {error}
        </p>
        <button
          className="bg-green-800 text-cream-100 border-none px-6 py-2.5 rounded-full text-[0.9rem] font-body transition-colors mt-2 hover:bg-green-600"
          onClick={onBack}
        >
          Voltar ao catálogo
        </button>
      </div>
    </div>
  );
}

// ── Illustrations & Icons ──────────────────────────────

function LeafIllustration({ name }: { name: string }) {
  const seed = name?.charCodeAt(0) || 65;
  const angle = (seed % 30) - 15;
  const scale = 0.9 + (seed % 20) / 100;

  return (
    <div className="w-[200px] h-[200px] drop-shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "100%",
          transform: `rotate(${angle}deg) scale(${scale})`,
        }}
      >
        {/* Main leaf body */}
        <path
          d="M100 160 C100 160 30 130 25 65 C25 65 80 30 140 55 C160 75 160 120 100 160"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Midrib */}
        <path
          d="M100 160 C100 160 90 110 75 80 C65 58 50 45 35 40"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Veins left */}
        <path
          d="M65 115 C75 105 85 100 92 98"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <path
          d="M55 95 C65 88 76 84 85 83"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <path
          d="M48 75 C58 70 70 68 78 67"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* Veins right */}
        <path
          d="M92 98 C100 90 108 85 118 82"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        <path
          d="M85 83 C93 76 102 73 112 71"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Stem */}
        <path
          d="M100 160 C100 160 98 170 96 180"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Decorative dots */}
        <circle cx="130" cy="70" r="1.5" fill="rgba(255,255,255,0.15)" />
        <circle cx="118" cy="90" r="1" fill="rgba(255,255,255,0.1)" />
        <circle cx="105" cy="115" r="1.5" fill="rgba(255,255,255,0.12)" />
      </svg>
    </div>
  );
}

function HeroBgSVG() {
  return (
    <svg
      viewBox="0 0 1000 400"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%" }}
    >
      <path
        d="M800 400 C800 400 900 100 1000 50 C1000 50 1100 300 900 400"
        fill="rgba(255,255,255,0.025)"
      />
      <path
        d="M700 350 C700 350 820 180 900 150 C900 150 920 300 780 380"
        fill="rgba(255,255,255,0.02)"
      />
      <circle cx="950" cy="80" r="120" fill="rgba(255,255,255,0.015)" />
    </svg>
  );
}

function DecorLeafSVG() {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <path
        d="M20 140C20 140 40 50 140 20C140 20 140 110 40 140"
        fill="var(--green-50)"
        stroke="var(--green-100)"
        strokeWidth="1.5"
      />
      <path
        d="M40 140C40 140 60 90 80 75"
        stroke="var(--green-100)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <path
        d="M80 75C90 50 110 35 140 20"
        stroke="var(--green-100)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ErrorLeafSVG() {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 80, height: 80, marginBottom: "1rem" }}
    >
      <path
        d="M15 65C15 65 25 25 65 12C65 12 65 52 25 65"
        fill="var(--green-50)"
        stroke="var(--green-200)"
        strokeWidth="1.5"
      />
      <path
        d="M38 35L42 45M40 48V50"
        stroke="var(--green-300)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LeafSmallIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 15C3 15 5 5 15 2C15 2 15 12 5 15"
        fill="var(--green-50)"
        stroke="var(--green-300)"
        strokeWidth="1.2"
      />
      <path
        d="M5 15C5 15 7 10 9 8.5"
        stroke="var(--green-300)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="1.5 2"
      />
    </svg>
  );
}

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

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2.5 6.5H10.5M7.5 3.5L10.5 6.5L7.5 9.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <rect
        x="1.5"
        y="1.5"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="8.5"
        y="1.5"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="1.5"
        y="8.5"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="8.5"
        y="8.5"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7.5 4.5V10.5M4.5 7.5H10.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
