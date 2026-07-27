import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface AudioPlayerProps {
  sassanhaId: number;
  audioUrl?: string;
  transricaoFonetica?: string;
  onUpdate?: (audioUrl: string, transricaoFonetica: string) => void;
}

export default function AudioPlayer({
  sassanhaId,
  audioUrl,
  transricaoFonetica,
  onUpdate
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingFonetica, setEditingFonetica] = useState(false);
  const [foneticaText, setFoneticaText] = useState(transricaoFonetica || '');

  const handlePlayPause = () => {
    const audio = document.getElementById(`audio-${sassanhaId}`) as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/sassanhas/${sassanhaId}/audio`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.text();
      
      if (response.ok) {
        // Extrair a URL do áudio da resposta
        const newAudioUrl = data.match(/\/api\/audio\/[^\s]+/)?.[0];
        if (newAudioUrl && onUpdate) {
          onUpdate(newAudioUrl, foneticaText);
        }
      }
    } catch (error) {
      console.error('Erro ao fazer upload do áudio:', error);
    }
    setUploading(false);
  };

  const handleFoneticaUpdate = async () => {
    try {
      const response = await fetch(`${API_URL}/sassanhas/${sassanhaId}/fonetica`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transricaoFonetica: foneticaText }),
      });
      
      if (response.ok && onUpdate) {
        onUpdate(audioUrl || '', foneticaText);
        setEditingFonetica(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar transcrição fonética:', error);
    }
  };

  return (
    <div className="bg-green-50 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-serif font-bold text-green-900 mb-4">Áudio de Pronúncia</h3>
      
      {/* Player de Áudio */}
      <div className="mb-4">
        {audioUrl ? (
          <div className="flex items-center gap-3">
            <audio
              id={`audio-${sassanhaId}`}
              src={`${API_URL}${audioUrl}`}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 w-0" id={`progress-${sassanhaId}`}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              disabled={uploading}
              className="hidden"
              id={`audio-upload-${sassanhaId}`}
            />
            <label
              htmlFor={`audio-upload-${sassanhaId}`}
              className="cursor-pointer"
            >
              <div className="text-green-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-green-800">
                {uploading ? 'Fazendo upload...' : 'Clique para fazer upload do áudio'}
              </p>
              <p className="text-xs text-green-600 mt-1">Formatos aceitos: MP3, WAV, OGG</p>
            </label>
          </div>
        )}
      </div>

      {/* Transcrição Fonética */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-green-800">Transcrição Fonética</h4>
          {!editingFonetica && (
            <button
              onClick={() => setEditingFonetica(true)}
              className="text-xs text-green-600 hover:text-green-800"
            >
              Editar
            </button>
          )}
        </div>
        
        {editingFonetica ? (
          <div className="space-y-2">
            <textarea
              value={foneticaText}
              onChange={(e) => setFoneticaText(e.target.value)}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              rows={3}
              placeholder="Digite a transcrição fonética em Yorubá..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleFoneticaUpdate}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setEditingFonetica(false);
                  setFoneticaText(transricaoFonetica || '');
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-3 rounded-md border border-green-200">
            {transricaoFonetica ? (
              <p className="text-sm text-green-900 italic">{transricaoFonetica}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">Nenhuma transcrição fonética adicionada</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
