import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface Planta {
  id: number;
  nome: string;
  visualizacoes: number;
}

interface Statistics {
  totalPlantas: number;
  totalSassanhas: number;
  maisVisualizadas: Planta[];
  porCategoria: [string, number][];
}

interface EvolutionData {
  evolucaoPorMes: Record<string, number>;
}

export default function StatisticsDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [evolution, setEvolution] = useState<EvolutionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    fetchEvolution();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/statistics/overview`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchEvolution = async () => {
    try {
      const response = await fetch(`${API_URL}/api/statistics/evolucao`);
      const data = await response.json();
      setEvolution(data);
    } catch (error) {
      console.error('Erro ao buscar evolução:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-green-50 rounded-lg p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-green-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-green-200 rounded"></div>
            <div className="h-24 bg-green-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-serif font-bold text-green-900 mb-6">Dashboard de Estatísticas</h2>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-sm font-medium text-green-600 mb-1">Total de Plantas</h3>
          <p className="text-3xl font-bold text-green-900">{stats?.totalPlantas || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-sm font-medium text-green-600 mb-1">Total de Sassanhas</h3>
          <p className="text-3xl font-bold text-green-900">{stats?.totalSassanhas || 0}</p>
        </div>
      </div>

      {/* Plantas Mais Visualizadas */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Plantas Mais Visualizadas</h3>
        {stats?.maisVisualizadas && stats.maisVisualizadas.length > 0 ? (
          <div className="space-y-2">
            {stats.maisVisualizadas.slice(0, 5).map((planta, index) => (
              <div
                key={planta.id}
                className="flex items-center justify-between p-2 bg-green-50 rounded hover:bg-green-100 cursor-pointer transition-colors"
                onClick={() => window.location.href = `/folha/${planta.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-green-600">#{index + 1}</span>
                  <span className="font-medium text-green-900">{planta.nome}</span>
                </div>
                <span className="text-sm text-green-600">{planta.visualizacoes} visualizações</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhuma planta visualizada ainda</p>
        )}
      </div>

      {/* Por Categoria */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Plantas por Categoria</h3>
        {stats?.porCategoria && stats.porCategoria.length > 0 ? (
          <div className="space-y-2">
            {stats.porCategoria.map(([categoria, count]) => (
              <div key={categoria} className="flex items-center justify-between">
                <span className="text-green-900 capitalize">
                  {categoria || 'Sem categoria'}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhuma categoria registrada</p>
        )}
      </div>

      {/* Evolução do Catálogo */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Evolução do Catálogo</h3>
        {evolution?.evolucaoPorMes && Object.keys(evolution.evolucaoPorMes).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(evolution.evolucaoPorMes).map(([mes, count]) => (
              <div key={mes} className="flex items-center justify-between">
                <span className="text-green-900">{mes}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((count / (stats?.totalPlantas || 1)) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-green-600 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Sem dados de evolução</p>
        )}
      </div>
    </div>
  );
}
