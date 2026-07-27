import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function ExportImport() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const exportToJson = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/export/json`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'herbario-export.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setMessage('Exportação JSON realizada com sucesso!');
    } catch (error) {
      setMessage('Erro ao exportar JSON');
    }
    setLoading(false);
  };

  const exportToCsv = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/export/csv`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'herbario-export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setMessage('Exportação CSV realizada com sucesso!');
    } catch (error) {
      setMessage('Erro ao exportar CSV');
    }
    setLoading(false);
  };

  const exportToPdf = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/export/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'herbario-export.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setMessage('Exportação PDF realizada com sucesso!');
    } catch (error) {
      setMessage('Erro ao exportar PDF');
    }
    setLoading(false);
  };

  const createBackup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/export/backup`, {
        method: 'POST',
      });
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage('Erro ao criar backup');
    }
    setLoading(false);
  };

  const importFromJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/export/import`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage('Erro ao importar arquivo');
    }
    setLoading(false);
  };

  return (
    <div className="bg-green-50 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-serif font-bold text-green-900 mb-6">Exportação/Importação</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportToJson}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Exportar JSON
          </button>
          <button
            onClick={exportToCsv}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Exportar CSV
          </button>
          <button
            onClick={exportToPdf}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Exportar PDF
          </button>
          <button
            onClick={createBackup}
            disabled={loading}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            Criar Backup
          </button>
        </div>

        <div className="border-t border-green-200 pt-4">
          <label className="block text-sm font-medium text-green-800 mb-2">
            Importar de JSON
          </label>
          <input
            type="file"
            accept=".json"
            onChange={importFromJson}
            disabled={loading}
            className="block w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
