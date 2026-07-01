import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { criarSassanha } from "../hooks/useSassanhas";
import { usePlantas } from "../hooks/usePlantas";
import MultiSelect from "../components/MultiSelect";
import type { Planta } from "../hooks/usePlantas";

export default function SassanhaCreationPage() {
  const navigate = useNavigate();
  const { plantas } = usePlantas();
  const [content, setContent] = useState("");
  const [yorubaContent, setYorubaContent] = useState("");
  const [selectedPlantas, setSelectedPlantas] = useState<Planta[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<any>({});
  const textareaRef = useRef<any>(null);
  const yorubaTextareaRef = useRef<any>(null);

  const validateField = (field: string, value: string) => {
    if (field === "content") {
      if (!value || value.trim().length === 0)
        return "O conteúdo é obrigatório";
      if (value.trim().length < 10) return "Mínimo de 10 caracteres";
    }
    if (field === "yorubaContent") {
      if (!value || value.trim().length === 0)
        return "O conteúdo em Yorubá é obrigatório";
      if (value.trim().length < 3) return "Mínimo de 3 caracteres";
    }
    return "";
  };

  const handleContentBlur = () => {
    setTouched((t: any) => ({ ...t, content: true }));
    const err = validateField("content", content);
    setErrors((e: any) => ({ ...e, content: err }));
  };

  const handleYorubaBlur = () => {
    setTouched((t: any) => ({ ...t, yorubaContent: true }));
    const err = validateField("yorubaContent", yorubaContent);
    setErrors((e: any) => ({ ...e, yorubaContent: err }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (touched.content) {
      const err = validateField("content", e.target.value);
      setErrors((prev: any) => ({ ...prev, content: err }));
    }
  };

  const handleYorubaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setYorubaContent(e.target.value);
    if (touched.yorubaContent) {
      const err = validateField("yorubaContent", e.target.value);
      setErrors((prev: any) => ({ ...prev, yorubaContent: err }));
    }
  };

  const handleSubmit = async () => {
    setTouched({ content: true, yorubaContent: true });
    const contentErr = validateField("content", content);
    const yorubaErr = validateField("yorubaContent", yorubaContent);
    setErrors({ content: contentErr, yorubaContent: yorubaErr });
    if (contentErr || yorubaErr) return;

    setLoading(true);
    setServerError("");
    try {
      const plantaIds = selectedPlantas.map((p) => p.id);
      const result = await criarSassanha({
        content,
        yorubaContent,
        plantaIds,
      });
      if (result.success) {
        navigate(`/sassanha/${result.data?.id}`);
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

  const charCount = content.length;
  const yorubaCharCount = yorubaContent.length;

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
          <span className="text-[0.78rem] text-green-200">Nova sassanha</span>
        </div>
      </div>

      <main className="flex-1 py-12 pb-20">
        <div className="container max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-cream-300 p-8 sm:p-12">
            <h1 className="font-display text-[2rem] font-normal text-green-900 mb-2">
              Registrar nova sassanha
            </h1>
            <p className="text-[0.9rem] text-green-400 mb-8">
              Adicione uma nova oração ou canto sagrado ao catálogo.
            </p>

            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {serverError}
              </div>
            )}

            {/* Conteúdo em Yorubá */}
            <div className="mb-7">
              <label
                className="block text-[0.875rem] font-medium text-green-800 mb-2 tracking-tight"
                htmlFor="yorubaContent"
              >
                Conteúdo em Yorubá
                <span className="text-green-500 ml-[3px]" aria-hidden="true">
                  *
                </span>
              </label>
              <div
                className={`bg-white border-[1.5px] border-cream-300 rounded-lg overflow-hidden transition-all focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-400/5 ${errors.yorubaContent ? "border-[#f87171]" : touched.yorubaContent && yorubaContent.length >= 3 ? "border-green-300" : ""}`}
              >
                <textarea
                  ref={yorubaTextareaRef}
                  id="yorubaContent"
                  value={yorubaContent}
                  onChange={handleYorubaChange}
                  onBlur={handleYorubaBlur}
                  className="w-full h-[150px] bg-white border-none outline-none p-6 sm:p-10 font-body text-[1rem] text-green-900 resize-none placeholder:text-green-300"
                  placeholder="Digite o conteúdo em Yorubá..."
                  aria-invalid={!!errors.yorubaContent}
                  aria-describedby={
                    errors.yorubaContent ? "yorubaContent-error" : undefined
                  }
                />
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-cream-200 border-t border-cream-300">
                  <span
                    className={`text-[0.72rem] font-mono ${yorubaCharCount > 5000 ? "text-red-600" : "text-green-300"}`}
                  >
                    {yorubaCharCount} caracteres
                  </span>
                </div>
              </div>

              {errors.yorubaContent && (
                <p
                  id="yorubaContent-error"
                  className="text-[0.8rem] text-red-600 mt-[0.4rem] flex items-center"
                  role="alert"
                >
                  <AlertSmallIcon /> {errors.yorubaContent}
                </p>
              )}
            </div>

            {/* Conteúdo */}
            <div className="mb-7">
              <label
                className="block text-[0.875rem] font-medium text-green-800 mb-2 tracking-tight"
                htmlFor="content"
              >
                Conteúdo
                <span className="text-green-500 ml-[3px]" aria-hidden="true">
                  *
                </span>
              </label>
              <div
                className={`bg-white border-[1.5px] border-cream-300 rounded-lg overflow-hidden transition-all focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-400/5 ${errors.content ? "border-[#f87171]" : touched.content && content.length >= 10 ? "border-green-300" : ""}`}
              >
                <textarea
                  ref={textareaRef}
                  id="content"
                  value={content}
                  onChange={handleContentChange}
                  onBlur={handleContentBlur}
                  className="w-full h-[300px] bg-white border-none outline-none p-6 sm:p-10 font-body text-[1rem] text-green-900 resize-none placeholder:text-green-300"
                  placeholder="Digite o conteúdo traduzido..."
                  aria-invalid={!!errors.content}
                  aria-describedby={
                    errors.content ? "content-error" : undefined
                  }
                />
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-cream-200 border-t border-cream-300">
                  <span
                    className={`text-[0.72rem] font-mono ${charCount > 5000 ? "text-red-600" : "text-green-300"}`}
                  >
                    {charCount} caracteres
                  </span>
                  <span className="text-[0.72rem] text-green-300">
                    Markdown suportado
                  </span>
                </div>
              </div>

              {errors.content && (
                <p
                  id="content-error"
                  className="text-[0.8rem] text-red-600 mt-[0.4rem] flex items-center"
                  role="alert"
                >
                  <AlertSmallIcon /> {errors.content}
                </p>
              )}
            </div>

            {/* Folhas relacionadas */}
            <div className="mb-7">
              <label className="block text-[0.875rem] font-medium text-green-800 mb-2 tracking-tight">
                Folhas relacionadas
                <span className="text-green-400 text-[0.75rem] ml-2 font-normal">
                  (opcional)
                </span>
              </label>
              <MultiSelect
                options={plantas}
                selected={selectedPlantas}
                onChange={setSelectedPlantas}
                placeholder="Selecione folhas relacionadas..."
              />
              <p className="text-xs text-green-400 mt-2">
                {selectedPlantas.length}{" "}
                {selectedPlantas.length === 1
                  ? "folha selecionada"
                  : "folhas selecionadas"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-cream-200 mt-2">
              <Link
                to="/sassanhas"
                className="text-[0.9rem] text-green-400 px-5 py-2.5 rounded-full transition-colors hover:bg-cream-200 hover:text-green-700"
              >
                Cancelar
              </Link>
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
                    Registrar sassanha
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

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 3V13H13V5H9V3H3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 7H11M5 10H9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlertSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7 4V7.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="7" cy="9.5" r="0.7" fill="currentColor" />
    </svg>
  );
}
