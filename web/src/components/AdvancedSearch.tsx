import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface Planta {
  id: number;
  nome: string;
  conteudo: string;
  categoria?: string;
  tags?: string;
}

export default function AdvancedSearch() {
  const [filters, setFilters] = useState({
    nome: '',
    conteudo: '',
    categoria: '',
    tag: '',
    inicio: '',
    fim: '',
  });
  const [results, setResults] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.nome) params.append('nome', filters.nome);
      if (filters.conteudo) params.append('conteudo', filters.conteudo);
      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.inicio) params.append('inicio', filters.inicio);
      if (filters.fim) params.append('fim', filters.fim);

      const response = await fetch(`${API_URL}/api/search/avancada?${params.toString()}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Erro na busca avançada:', error);
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setFilters({
      nome: '',
      conteudo: '',
      categoria: '',
      tag: '',
      inicio: '',
      fim: '',
    });
    setResults([]);
  };

  return (
    <div className="bg-green-50 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-serif font-bold text-green-900 mb-6">Busca Avançada</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">Nome</label>
          <input
            type="text"
            value={filters.nome}
            onChange={(e) => setFilters({ ...filters, nome: e.target.value })}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Buscar por nome..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">Conteúdo</label>
          <input
            type="text"
            value={filters.conteudo}
            onChange={(e) => setFilters({ ...filters, conteudo: e.target.value })}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Buscar no conteúdo..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">Categoria</label>
          <select
            value={filters.categoria}
            onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todas</option>
            <option value="medicinal">Medicinal</option>
            <option value="ornamental">Ornamental</option>
            <option value="comestivel">Comestível</option>
            <option value="tóxica">Tóxica</option>
            <option value="ritualística">Ritualística</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">Tag</label>
          <input
            type="text"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Buscar por tag..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">Data Início</label>
          <input
            type="datetime-local"
            value={filters.inicio}
            onChange={(e) => setFilters({ ...filters, inicio: e.target.value })}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">Data Fim</label>
          <input
            type="datetime-local"
            value={filters.fim}
            onChange={(e) => setFilters({ ...filters, fim: e.target.value })}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Limpar Filtros
        </button>
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
                className="bg-white p-4 rounded-md shadow-sm hover:shadow-md过渡-shadow cursor-pointer"
                onClick={() => window.location.href = `/folha/${planta.id}`}
              >
                <h4 className="font-serif font-bold text-green-900 mb-2">{planta.nome}</h4>
                {planta.categoria && (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-2">
                    {planta.categoria}
                  </span>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {planta.conteudo.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {results.length === 0 && !loading && (
        <p className="text-gray-500 text-center py-4">Nenhum resultado encontrado</p>
      )}
    </div>
  );
}
