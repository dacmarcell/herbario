import { useState, useRef, useEffect } from "react";
import type { Planta } from "../hooks/usePlantas";

interface MultiSelectProps {
  options: Planta[];
  selected: Planta[];
  onChange: (selected: Planta[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Selecione folhas...",
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      !selected.some((s) => s.id === option.id) &&
      option.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: Planta) => {
    onChange([...selected, option]);
    setSearchTerm("");
  };

  const handleRemove = (option: Planta) => {
    onChange(selected.filter((s) => s.id !== option.id));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected items as chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((item) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {item.nome}
              <button
                type="button"
                onClick={() => handleRemove(item)}
                disabled={disabled}
                className="hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Remover ${item.nome}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 3L11 11M11 3L3 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input and dropdown */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-white border border-cream-300 rounded-lg px-4 h-11 transition-all focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-400/5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-green-400">
            <path
              d="M8 3C11.3137 3 14 5.68629 14 9C14 12.3137 11.3137 15 8 15C4.68629 15 2 12.3137 2 9C2 5.68629 4.68629 3 8 3Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 12L15 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => !disabled && setIsOpen(true)}
            disabled={disabled}
            placeholder={selected.length === 0 ? placeholder : "Adicionar mais folhas..."}
            className="flex-1 border-none outline-none bg-transparent text-sm text-green-900 placeholder:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className="text-green-400 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isOpen ? "Fechar" : "Abrir"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-cream-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-sm text-green-400 text-center">
                {searchTerm ? "Nenhuma folha encontrada" : "Todas as folhas já selecionadas"}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-2.5 text-left text-sm text-green-900 hover:bg-green-50 transition-colors"
                >
                  {option.nome}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
