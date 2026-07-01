import { useState, useEffect, useCallback } from "react";
import type { Imagem } from "../hooks/usePlantas";

interface LightboxProps {
  images: Imagem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  apiBaseUrl?: string;
}

export default function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  apiBaseUrl = "http://localhost:8080",
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);

  const handleNext = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [images.length]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "ArrowLeft":
          handlePrevious();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          handleResetZoom();
          break;
      }
    },
    [isOpen, onClose, handleNext, handlePrevious, handleZoomIn, handleZoomOut, handleResetZoom]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const imageUrl = `${apiBaseUrl}${currentImage.url}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
        aria-label="Fechar"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M8 8L24 24M24 8L8 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 z-10 p-3 text-white/80 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Imagem anterior"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M25 8L15 20L25 32"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 z-10 p-3 text-white/80 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Próxima imagem"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M15 8L25 20L15 32"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          disabled={zoom <= 1}
          className="p-2 text-white/80 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Reduzir zoom"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="text-white/90 text-sm font-mono min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          disabled={zoom >= 3}
          className="p-2 text-white/80 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Aumentar zoom"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4V16M4 10H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="w-px h-6 bg-white/30 mx-1" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleResetZoom();
          }}
          disabled={zoom === 1}
          className="p-2 text-white/80 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Resetar zoom"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10H16M10 4V16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-white/90 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}

      {/* Image */}
      <div
        className="max-w-[90vw] max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={currentImage.nomeArquivo}
          className="max-w-full max-h-[85vh] object-contain transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            cursor: zoom > 1 ? "grab" : "default",
          }}
          draggable={false}
        />
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-4 right-4 z-10 text-white/50 text-xs hidden md:block">
        <span className="bg-black/50 backdrop-blur-sm rounded px-2 py-1">
          ESC: fechar | ← →: navegar | + -: zoom
        </span>
      </div>
    </div>
  );
}
