import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useSassanha,
  atualizarSassanha,
  apagarSassanha,
} from "../hooks/useSassanhas";
import { usePlantas } from "../hooks/usePlantas";
import NavBar from "../components/NavBar";
import MultiSelect from "../components/MultiSelect";
import AudioPlayer from "../components/AudioPlayer";
import type { Planta } from "../hooks/usePlantas";

export default function SassanhaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sassanha, loading, error } = useSassanha(id);
  const { plantas } = usePlantas();

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editYorubaContent, setEditYorubaContent] = useState("");
  const [editPlantas, setEditPlantas] = useState<Planta[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync edit states when sassanha is loaded
  useEffect(() => {
    if (sassanha) {
      setEditContent(sassanha.content || "");
      setEditYorubaContent(sassanha.yorubaContent || "");
      // Load related plantas if plantaIds is available
      if (sassanha.plantaIds && sassanha.plantaIds.length > 0) {
        const relatedPlantas = plantas.filter((p) =>
          sassanha.plantaIds?.includes(p.id),
        );
        setEditPlantas(relatedPlantas);
      }
    }
  }, [sassanha, plantas]);

  if (loading) return <LoadingView />;
  if (error)
    return <ErrorView error={error} onBack={() => navigate("/sassanhas")} />;
  if (!sassanha) return null;

  const handleSave = async () => {
    if (!editContent.trim() || !editYorubaContent.trim()) return;

    setIsSaving(true);
    setServerError(null);

    const plantaIds = editPlantas.map((p) => p.id);
    const res = await atualizarSassanha(sassanha.id, {
      content: editContent.trim(),
      yorubaContent: editYorubaContent.trim(),
      plantaIds,
    });

    if (res.success) {
      setIsEditing(false);
      window.location.reload();
    } else {
      setServerError(res.serverError || "Erro ao atualizar");
    }
    setIsSaving(false);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const res = await apagarSassanha(sassanha.id);

    if (res.success) {
      navigate("/sassanhas");
    } else {
      setServerError(res.serverError || "Erro ao apagar");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const relatedPlantas = plantas.filter((p) =>
    sassanha.plantaIds?.includes(p.id),
  );

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />

      <div className="bg-green-900 border-b border-green-700">
        <div className="container flex items-center gap-2 py-2.5">
          <Link
            to="/sassanhas"
            className="inline-flex items-center gap-1.5 text-[0.78rem] text-green-300 transition-colors hover:text-cream-100"
          >
            <BackIcon /> Sassanhas
          </Link>
          <span className="text-[0.78rem] text-green-600" aria-hidden="true">
            /
          </span>
          <span className="text-[0.78rem] text-green-200 max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
            {isEditing ? "Editando..." : sassanha.yorubaContent}
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
            <div className="w-full">
              <div className="inline-flex items-center bg-white/10 border border-white/10 rounded-full px-3 py-1 mb-5">
                <span className="text-[0.72rem] font-mono text-green-200 tracking-widest">
                  #{String(sassanha.id || "").padStart(3, "0")}
                </span>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={editYorubaContent}
                  onChange={(e) => setEditYorubaContent(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-cream-100 font-display text-[clamp(2.25rem,5vw,4rem)] font-normal outline-none focus:border-green-400 transition-colors mb-4"
                  placeholder="Título em Yorubá..."
                />
              ) : (
                <h1 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-normal text-cream-100 leading-[1.1] tracking-tight mb-4">
                  {sassanha.yorubaContent}
                </h1>
              )}

              <p className="text-[0.9rem] text-green-300 italic font-display">
                {isEditing
                  ? "Editando sassanha"
                  : "Sassanha registrada no catálogo"}
              </p>
            </div>

            <div className="hidden sm:block">
              <LeafIllustration />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="flex-1 py-12 pb-20">
          <div className="container grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            {/* Main article */}
            <article className="animate-fadeUp w-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-[10px]">
                  <LeafSmallIcon />
                  <h2 className="font-display text-[1.1rem] font-medium text-green-600 lowercase tracking-wider">
                    {isEditing ? "Editar Conteúdo" : "Conteúdo"}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-cream-300" />
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      Conteúdo em Yorubá
                    </label>
                    <textarea
                      value={editYorubaContent}
                      onChange={(e) => setEditYorubaContent(e.target.value)}
                      className="w-full h-[150px] bg-white border border-cream-300 rounded-lg p-6 font-body text-green-900 outline-none focus:border-green-400 transition-colors shadow-inner resize-none"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      Conteúdo
                    </label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-[300px] bg-white border border-cream-300 rounded-lg p-6 font-body text-green-900 outline-none focus:border-green-400 transition-colors shadow-inner resize-none"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      Folhas relacionadas
                    </label>
                    <MultiSelect
                      options={plantas}
                      selected={editPlantas}
                      onChange={setEditPlantas}
                      placeholder="Selecione folhas relacionadas..."
                    />
                  </div>

                  {serverError && (
                    <p className="text-red-500 text-sm italic">{serverError}</p>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-800 text-cream-100 px-8 py-3 rounded-full font-medium transition-all hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSaving ? "Salvando..." : "Salvar alterações"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(sassanha.content);
                        setEditYorubaContent(sassanha.yorubaContent);
                      }}
                      className="text-green-600 px-6 py-3 rounded-full font-medium transition-all hover:bg-cream-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-green-700 mb-3">
                      Em Yorubá
                    </h3>
                    <p className="text-green-900 whitespace-pre-wrap">
                      {sassanha.yorubaContent}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-green-700 mb-3">
                      Tradução
                    </h3>
                    <div className="prose prose-green max-w-none">
                      <MarkdownContent content={sassanha.content} />
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Audio Player */}
              <AudioPlayer
                sassanhaId={sassanha.id}
                audioUrl={sassanha.audioUrl}
                transricaoFonetica={sassanha.transricaoFonetica}
                onUpdate={(audioUrl, transricaoFonetica) => {
                  // Atualizar sassanha localmente
                  window.location.reload();
                }}
              />

              {/* Related plantas */}
              {relatedPlantas.length > 0 && (
                <div className="bg-white border border-cream-300 rounded-lg p-6">
                  <h3 className="font-display text-[1rem] font-medium text-green-600 lowercase tracking-wider mb-4">
                    Folhas relacionadas
                  </h3>
                  <div className="space-y-3">
                    {relatedPlantas.map((planta) => (
                      <Link
                        key={planta.id}
                        to={`/folha/${planta.id}`}
                        className="block p-3 bg-cream-50 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <p className="text-sm font-medium text-green-900">
                          {planta.nome}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white border border-cream-300 rounded-lg p-6">
                <h3 className="font-display text-[1rem] font-medium text-green-600 lowercase tracking-wider mb-4">
                  Ações
                </h3>
                <div className="space-y-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
                    >
                      Editar sassanha
                    </button>
                  ) : null}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Excluir sassanha
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white border border-cream-300 rounded-lg p-6">
                <h3 className="font-display text-[1rem] font-medium text-green-600 lowercase tracking-wider mb-4">
                  Informações
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-green-400">Criado em:</span>
                    <span className="text-green-700 ml-2">
                      {new Date(sassanha.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-400">Atualizado em:</span>
                    <span className="text-green-700 ml-2">
                      {new Date(sassanha.updatedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-display font-medium text-green-900 mb-2">
              Excluir sassanha
            </h3>
            <p className="text-sm text-green-600 mb-6">
              Esta ação é irreversível. Tem certeza que deseja excluir esta
              sassanha?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-green-600 rounded-lg hover:bg-cream-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingView() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      </main>
    </div>
  );
}

function ErrorView({ error, onBack }: { error: string; onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-green-700 mb-4">Erro</h2>
          <p className="text-green-400 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="bg-green-800 text-cream-100 px-6 py-2.5 rounded-full hover:bg-green-600"
          >
            Voltar
          </button>
        </div>
      </main>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const html = content
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
    .replace(/\n/g, "<br />");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

function LeafSmallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 16C4 16 6 8 16 4C16 4 16 12 6 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="rgba(90,158,104,0.1)"
      />
    </svg>
  );
}

function LeafIllustration() {
  return (
    <div className="w-[200px] h-[200px] opacity-60 animate-leafSway">
      <svg viewBox="0 0 200 200" fill="none">
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
      </svg>
    </div>
  );
}

function HeroBgSVG() {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "rgba(42,95,60,0.3)", stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "rgba(26,52,35,0.1)", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#grad1)" />
    </svg>
  );
}
