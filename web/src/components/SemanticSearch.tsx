import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface Planta {
  id: number;
  nome: string;
  conteudo: string;
}

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSemanticSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/search/semantica`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Erro na busca semântica:", error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-green-50 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-serif font-bold text-green-900 mb-6">
        Busca Semântica com IA
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-green-800 mb-2">
          Descreva o que você está buscando
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSemanticSearch()}
            className="flex-1 px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: plantas para relaxamento, ervas medicinais para dor de cabeça..."
          />
          <button
            onClick={handleSemanticSearch}
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Buscando..." : "Buscar com IA"}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="border-t border-green-200 pt-4">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            Resultados ({results.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((planta) => (
              <div
                key={planta.id}
                className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => (window.location.href = `/folha/${planta.id}`)}
              >
                <h4 className="font-serif font-bold text-green-900 mb-2">
                  {planta.nome}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {planta.conteudo.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && query && (
        <p className="text-gray-500 text-center py-4">
          Nenhum resultado encontrado para sua busca
        </p>
      )}

      <div className="mt-4 p-3 bg-green-100 rounded-md">
        <p className="text-sm text-green-800">
          A busca semântica usa inteligência artificial para entender o contexto
          da sua busca e encontrar plantas relacionadas, mesmo que não usem
          exatamente as mesmas palavras.
        </p>
      </div>
    </div>
  );
}
