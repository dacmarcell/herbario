import { useState, useRef, useCallback } from "react";
import { uploadImagem } from "../hooks/usePlantas";
import type { Imagem } from "../hooks/usePlantas";

interface ImageUploadProps {
  plantaId: number;
  onUploadSuccess: (imagem: Imagem) => void;
  currentImageCount: number;
  maxImages?: number;
}

export default function ImageUpload({
  plantaId,
  onUploadSuccess,
  currentImageCount,
  maxImages = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLimitReached = currentImageCount >= maxImages;

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isLimitReached) {
        setIsDragging(true);
      }
    },
    [isLimitReached],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (isLimitReached) {
        setUploadError(`Limite máximo de ${maxImages} imagens atingido`);
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const file = files[0];
      await processFile(file);
    },
    [isLimitReached, maxImages],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      await processFile(file);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [],
  );

  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Apenas arquivos de imagem são permitidos");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Tamanho máximo de 10MB");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const result = await uploadImagem(plantaId, file);
      if (result.success && result.data) {
        onUploadSuccess(result.data);
      } else if (result.error) {
        setUploadError(result.error);
      }
    } catch (error) {
      setUploadError("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!isLimitReached && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-[0.875rem] font-medium text-green-800 mb-2 tracking-tight">
        Fotos da folha
        <span className="text-green-400 text-[0.75rem] ml-2 font-normal">
          (opcional)
        </span>
      </label>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
          ${
            isLimitReached
              ? "border-cream-300 bg-cream-50 cursor-not-allowed opacity-60"
              : isDragging
                ? "border-green-500 bg-green-50"
                : "border-cream-300 bg-white hover:border-green-400 hover:bg-green-50/30"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLimitReached || isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-green-600">Enviando imagem...</p>
          </div>
        ) : isLimitReached ? (
          <div className="flex flex-col items-center gap-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="text-cream-400"
            >
              <path
                d="M20 4V20M20 20L12 12M20 20L28 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 20H36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm text-cream-500">
              Limite máximo de {maxImages} imagens atingido
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="text-green-400"
            >
              <path
                d="M20 4V20M20 20L12 12M20 20L28 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 20H36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p className="text-sm text-green-700 font-medium">
                Arraste uma imagem aqui ou clique para selecionar
              </p>
              <p className="text-xs text-green-400 mt-1">
                JPG, PNG, GIF • Máx. 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mt-2 flex items-center gap-2 text-[0.8rem] text-red-600">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M7 4V7.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="7" cy="9.5" r="0.7" fill="currentColor" />
          </svg>
          {uploadError}
        </div>
      )}

      <p className="text-xs text-green-400 mt-2">
        {currentImageCount} de {maxImages} imagens adicionadas
      </p>
    </div>
  );
}
