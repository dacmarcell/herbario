import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import StatisticsDashboard from '../components/StatisticsDashboard';
import AdvancedSearch from '../components/AdvancedSearch';
import SemanticSearch from '../components/SemanticSearch';
import ExportImport from '../components/ExportImport';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('estatisticas');

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <NavBar />

      <main className="flex-1 py-10 pb-20">
        <div className="container">
          <div className="mb-8">
            <h1 className="font-display text-[2.25rem] font-normal text-green-900 mb-2">
              Dashboard
            </h1>
            <p className="text-[0.9rem] text-green-400 leading-relaxed">
              Visão geral do seu herbário e ferramentas avançadas
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setActiveTab('estatisticas')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'estatisticas'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
            >
              Estatísticas
            </button>
            <button
              onClick={() => setActiveTab('busca-avancada')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'busca-avancada'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
            >
              Busca Avançada
            </button>
            <button
              onClick={() => setActiveTab('busca-semantica')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'busca-semantica'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
            >
              Busca com IA
            </button>
            <button
              onClick={() => setActiveTab('export-import')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'export-import'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
            >
              Exportar/Importar
            </button>
          </div>

          {/* Tab Content */}
          <div className="animate-fadeUp">
            {activeTab === 'estatisticas' && <StatisticsDashboard />}
            {activeTab === 'busca-avancada' && <AdvancedSearch />}
            {activeTab === 'busca-semantica' && <SemanticSearch />}
            {activeTab === 'export-import' && <ExportImport />}
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-200"
            >
              <h3 className="font-semibold text-green-900 mb-1">Catálogo</h3>
              <p className="text-sm text-green-600">Ver todas as plantas</p>
            </Link>
            <Link
              to="/nova"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-200"
            >
              <h3 className="font-semibold text-green-900 mb-1">Nova Planta</h3>
              <p className="text-sm text-green-600">Adicionar ao catálogo</p>
            </Link>
            <Link
              to="/sassanhas"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-200"
            >
              <h3 className="font-semibold text-green-900 mb-1">Sassanhas</h3>
              <p className="text-sm text-green-600">Ver rituais e banhos</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
