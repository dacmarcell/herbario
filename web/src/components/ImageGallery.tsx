import { useState } from "react";
import type { Imagem } from "../hooks/usePlantas";
import Lightbox from "./Lightbox";
import ConfirmationModal from "./ConfirmationModal";

interface ImageGalleryProps {
  images: Imagem[];
  onDelete?: (imagemId: number) => void;
  readonly?: boolean;
  apiBaseUrl?: string;
}

export default function ImageGallery({
  images,
  onDelete,
  readonly = false,
  apiBaseUrl = "http://localhost:8080",
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<Imagem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleDeleteClick = (image: Imagem, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageToDelete(image);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete || !onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(imageToDelete.id);
      setDeleteModalOpen(false);
      setImageToDelete(null);
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (images.length === 0) {
    return (
      <div className="bg-cream-50 border-2 border-dashed border-cream-300 rounded-lg p-8 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="mx-auto mb-3 text-cream-400"
        >
          <path
            d="M40 32V40H8V32M24 4V28M16 20L24 28L32 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm text-cream-500">Nenhuma imagem adicionada</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative group aspect-square rounded-lg overflow-hidden bg-cream-100 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => handleImageClick(index)}
          >
            {/* Image */}
            <img
              src={`${apiBaseUrl}${image.url}`}
              alt={image.nomeArquivo}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />

            {/* Actions */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                className="p-2 bg-white/90 rounded-full text-green-800 hover:bg-white transition-colors"
                aria-label="Visualizar imagem"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M1 10C1 10 4 4 10 4C16 4 19 10 19 10C19 10 16 16 10 16C4 16 1 10 1 10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="10" r="2.5" fill="currentColor" />
                </svg>
              </button>
            </div>

            {/* Delete button */}
            {!readonly && onDelete && (
              <button
                type="button"
                onClick={(e) => handleDeleteClick(image, e)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/90 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Excluir imagem"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 3.5L11 3.5M5 3.5V2.5C5 2.22386 5.22386 2 5.5 2H8.5C8.77614 2 9 2.22386 9 2.5V3.5M10 3.5V11.5C10 11.7761 9.77614 12 9.5 12H4.5C4.22386 12 4 11.7761 4 11.5V3.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Image counter badge */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full">
                <span className="text-white text-xs font-medium">
                  {index + 1}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image count */}
      {images.length > 0 && (
        <p className="text-xs text-green-400 mt-2">
          {images.length} {images.length === 1 ? "imagem" : "imagens"} • Máximo:
          5
        </p>
      )}

      {/* Lightbox */}
      <Lightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        apiBaseUrl={apiBaseUrl}
      />

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setImageToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Excluir imagem"
        message="Esta ação é irreversível. Tem certeza que deseja excluir esta imagem?"
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </>
  );
}
