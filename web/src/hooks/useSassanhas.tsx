import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface Sassanha {
  id: number;
  content: string;
  yorubaContent: string;
  createdAt: string;
  updatedAt: string;
  plantaIds?: number[];
}

export function useSassanhas() {
  const [sassanhas, setSassanhas] = useState<Sassanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSassanhas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/sassanhas`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Resposta da API em formato inesperado");
      }
      setSassanhas(data);
    } catch (err: any) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Não foi possível conectar ao servidor.");
      } else {
        setError(err.message || "Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSassanhas();
  }, [fetchSassanhas]);

  return { sassanhas, loading, error, refetch: fetchSassanhas };
}

export function useSassanha(id: string | undefined) {
  const [sassanha, setSassanha] = useState<Sassanha | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/sassanhas/${id}`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Sassanha não encontrada");
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setSassanha(data))
      .catch((err: any) => {
        if (err.name === "TypeError" && err.message.includes("fetch")) {
          setError("Não foi possível conectar ao servidor.");
        } else {
          setError(err.message || "Erro desconhecido");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { sassanha, loading, error };
}

export async function criarSassanha(dados: {
  content: string;
  yorubaContent: string;
  plantaIds?: number[];
}) {
  const errors: { content?: string; yorubaContent?: string } = {};

  if (!dados.content || dados.content.trim().length === 0) {
    errors.content = "O conteúdo é obrigatório";
  } else if (dados.content.trim().length < 10) {
    errors.content = "O conteúdo deve ter ao menos 10 caracteres";
  }

  if (!dados.yorubaContent || dados.yorubaContent.trim().length === 0) {
    errors.yorubaContent = "O conteúdo em Yorubá é obrigatório";
  } else if (dados.yorubaContent.trim().length < 3) {
    errors.yorubaContent = "O conteúdo em Yorubá deve ter ao menos 3 caracteres";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const response = await fetch(`${API_BASE}/sassanhas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      content: dados.content.trim(),
      yorubaContent: dados.yorubaContent.trim(),
      plantaIds: dados.plantaIds || [],
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return {
      success: false,
      serverError:
        body.message || `Erro ${response.status}: ${response.statusText}`,
    };
  }

  const created = await response.json();
  return { success: true, data: created };
}

export async function atualizarSassanha(
  id: number,
  dados: { content?: string; yorubaContent?: string; plantaIds?: number[] },
) {
  const response = await fetch(`${API_BASE}/sassanhas/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return {
      success: false,
      serverError:
        body.message || `Erro ${response.status}: ${response.statusText}`,
    };
  }

  const updated = await response.json();
  return { success: true, data: updated };
}

export async function apagarSassanha(id: number) {
  const response = await fetch(`${API_BASE}/sassanhas/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return {
      success: false,
      serverError: `Erro ${response.status}: ${response.statusText}`,
    };
  }

  return { success: true };
}

export async function buscarSassanhasPorTermo(termo: string): Promise<Sassanha[]> {
  const response = await fetch(
    `${API_BASE}/sassanhas/buscar?termo=${encodeURIComponent(termo)}`,
    {
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}
