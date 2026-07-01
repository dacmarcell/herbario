import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface Planta {
  id: number;
  nome: string;
  conteudo: string;
}

export function usePlantas() {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlantas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/plantas`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Resposta da API em formato inesperado");
      }
      setPlantas(data);
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
    fetchPlantas();
  }, [fetchPlantas]);

  return { plantas, loading, error, refetch: fetchPlantas };
}

export function usePlanta(id: string | undefined) {
  const [planta, setPlanta] = useState<Planta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/plantas/${id}`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Folha não encontrada");
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setPlanta(data))
      .catch((err: any) => {
        if (err.name === "TypeError" && err.message.includes("fetch")) {
          setError("Não foi possível conectar ao servidor.");
        } else {
          setError(err.message || "Erro desconhecido");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { planta, loading, error };
}

export async function criarPlanta(dados: { nome: string; conteudo: string }) {
  const errors: { nome?: string; conteudo?: string } = {};

  if (!dados.nome || dados.nome.trim().length === 0) {
    errors.nome = "O nome é obrigatório";
  } else if (dados.nome.trim().length < 2) {
    errors.nome = "O nome deve ter ao menos 2 caracteres";
  } else if (dados.nome.trim().length > 100) {
    errors.nome = "O nome deve ter no máximo 100 caracteres";
  }

  if (!dados.conteudo || dados.conteudo.trim().length === 0) {
    errors.conteudo = "O conteúdo é obrigatório";
  } else if (dados.conteudo.trim().length < 10) {
    errors.conteudo = "O conteúdo deve ter ao menos 10 caracteres";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const response = await fetch(`${API_BASE}/plantas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      nome: dados.nome.trim(),
      conteudo: dados.conteudo.trim(),
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

export async function atualizarPlanta(
  id: number,
  dados: { nome?: string; conteudo?: string },
) {
  const response = await fetch(`${API_BASE}/plantas/${id}`, {
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

export async function apagarPlanta(id: number) {
  const response = await fetch(`${API_BASE}/plantas/${id}`, {
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

export async function buscarPlantasPorNome(nome: string): Promise<Planta[]> {
  const response = await fetch(
    `${API_BASE}/plantas/buscar?nome=${encodeURIComponent(nome)}`,
    {
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export interface Imagem {
  id: number;
  nomeArquivo: string;
  url: string;
  tamanho: number;
  tipo: string;
}

export async function buscarImagens(plantaId: number): Promise<Imagem[]> {
  const response = await fetch(`${API_BASE}/plantas/${plantaId}/imagens`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function uploadImagem(
  plantaId: number,
  arquivo: File,
): Promise<{ success: boolean; data?: Imagem; error?: string }> {
  const formData = new FormData();
  formData.append("arquivo", arquivo);

  const response = await fetch(`${API_BASE}/plantas/${plantaId}/imagens`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return {
      success: false,
      error: body.message || `Erro ${response.status}: ${response.statusText}`,
    };
  }

  const data = await response.json();
  return { success: true, data };
}

export async function deletarImagem(
  plantaId: number,
  imagemId: number,
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(
    `${API_BASE}/plantas/${plantaId}/imagens/${imagemId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return {
      success: false,
      error: body.message || `Erro ${response.status}: ${response.statusText}`,
    };
  }

  return { success: true };
}
