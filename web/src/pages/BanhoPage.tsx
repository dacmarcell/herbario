import { useState } from "react";
import NavBar from "../components/NavBar";
import { usePlantas } from "../hooks/usePlantas";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function BanhoPage() {
  const {
    plantas,
    loading: loadingPlantas,
    error: errorPlantas,
  } = usePlantas();
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [intencao, setIntencao] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [errorAi, setErrorAi] = useState<string | null>(null);

  const handleTogglePlant = (nome: string) => {
    setSelectedPlants((prev) =>
      prev.includes(nome) ? prev.filter((p) => p !== nome) : [...prev, nome],
    );
  };

  const handleAnalisar = async () => {
    if (selectedPlants.length === 0) {
      setErrorAi("Selecione pelo menos uma planta.");
      return;
    }
    if (!intencao.trim()) {
      setErrorAi("Descreva sua intenção para o banho.");
      return;
    }

    setLoadingAi(true);
    setErrorAi(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomes: selectedPlants,
          intencao: intencao.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.text();
      setResult(data);
    } catch (err: any) {
      setErrorAi(err.message || "Erro ao consultar a IA.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />

      <main className="flex-1 py-10">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-[0.75rem] font-normal tracking-[0.15em] uppercase text-green-600 mb-3 font-body">
              Alquimia Botânica
            </p>
            <h1 className="font-display text-[2.5rem] font-normal text-green-900 leading-tight mb-4">
              Sugestão de Banho
            </h1>
            <p className="text-base text-green-700 max-w-[600px] mx-auto leading-relaxed font-light">
              Escolha as plantas que você tem disponível e descreva o que você
              busca. Nossa inteligência ancestral sugerirá a melhor combinação
              para seu ritual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8 items-start">
            {/* Left Column: Result or Selection */}
            <div className="space-y-6 order-2 md:order-1">
              {result ? (
                <div className="bg-white border border-green-100 rounded-2xl p-8 shadow-sm animate-fadeUp">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-cream-200">
                    <h2 className="font-display text-xl text-green-900">
                      Resultado da Análise
                    </h2>
                    <button
                      onClick={() => setResult(null)}
                      className="text-sm text-green-600 hover:text-green-800 transition-colors"
                    >
                      Nova consulta
                    </button>
                  </div>
                  <article className="prose prose-green max-w-none prose-headings:font-display prose-headings:font-normal prose-p:text-green-800 prose-li:text-green-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result}
                    </ReactMarkdown>
                  </article>
                </div>
              ) : (
                <div className="bg-white border border-cream-300 rounded-2xl p-8 shadow-sm">
                  <h2 className="font-display text-xl text-green-900 mb-6">
                    1. Selecione as Plantas
                  </h2>

                  {loadingPlantas ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="h-12 bg-cream-200 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  ) : errorPlantas ? (
                    <p className="text-red-500 text-sm">{errorPlantas}</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {plantas.map((planta) => (
                        <button
                          key={planta.id}
                          onClick={() => handleTogglePlant(planta.nome)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all text-left ${
                            selectedPlants.includes(planta.nome)
                              ? "bg-green-900 border-green-900 text-cream-100 shadow-md"
                              : "bg-cream-50 border-cream-300 text-green-800 hover:border-green-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${selectedPlants.includes(planta.nome) ? "bg-green-300" : "bg-green-200"}`}
                          />
                          <span className="truncate">{planta.nome}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {plantas.length === 0 && !loadingPlantas && (
                    <p className="text-green-500 text-center py-8 italic">
                      Nenhuma planta cadastrada no catálogo.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Intention & Action */}
            <div className="space-y-6 order-1 md:order-2 sticky top-24">
              <div className="bg-green-900 text-cream-100 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="font-display text-xl mb-4">2. Sua Intenção</h2>
                  <textarea
                    value={intencao}
                    onChange={(e) => setIntencao(e.target.value)}
                    placeholder="Ex: Banho para descarrego e proteção..."
                    className="w-full bg-green-800/50 border border-green-700 rounded-xl p-4 text-cream-100 placeholder:text-green-400 focus:outline-none focus:border-green-400 transition-colors h-32 resize-none text-sm mb-4"
                  />

                  <button
                    onClick={handleAnalisar}
                    disabled={
                      loadingAi ||
                      selectedPlants.length === 0 ||
                      !intencao.trim()
                    }
                    className={`w-full py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                      loadingAi ||
                      selectedPlants.length === 0 ||
                      !intencao.trim()
                        ? "bg-green-800 text-green-600 cursor-not-allowed"
                        : "bg-green-300 text-green-900 hover:bg-green-200 hover:-translate-y-0.5 shadow-lg"
                    }`}
                  >
                    {loadingAi ? (
                      <>
                        <div className="w-5 h-5 border-2 border-green-900/20 border-t-green-900 rounded-full animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <span>Sugerir Banho</span>
                        <SparklesIcon />
                      </>
                    )}
                  </button>

                  {errorAi && (
                    <p className="mt-4 text-red-300 text-xs text-center">
                      {errorAi}
                    </p>
                  )}
                </div>

                {/* Decoration */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 text-green-800 opacity-20 pointer-events-none">
                  <BigLeafIcon />
                </div>
              </div>

              <div className="px-4 text-[0.8rem] text-green-600 leading-relaxed italic">
                A IA analisará as propriedades energéticas e terapêuticas das
                plantas selecionadas para o seu propósito.
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-green-950 text-green-400 text-[0.78rem] text-center py-8 font-body tracking-widest mt-auto">
        <div className="container">
          <p>Herbário — Conhecimento Ancestral</p>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3L14.5 9L21 11.5L14.5 14L12 21L9.5 14L3 11.5L9.5 9L12 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BigLeafIcon() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M30 180 C30 180 50 60 170 20 C170 20 170 140 50 180"
        fill="currentColor"
      />
    </svg>
  );
}
