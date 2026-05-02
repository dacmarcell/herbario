import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:8080";

export function usePlantas() {
  const [plantas, setPlantas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError(
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando em localhost:8080.",
        );
      } else {
        setError(err.message);
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

export function usePlanta(id) {
  const [planta, setPlanta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      .catch((err) => {
        if (err.name === "TypeError" && err.message.includes("fetch")) {
          setError("Não foi possível conectar ao servidor.");
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { planta, loading, error };
}

export async function criarPlanta(dados: any) {
  const errors: any = {};

  if (!dados.nome || dados.nome.trim().length === 0) {
    errors.nome = "O nome é obrigatório";
  } else if (dados.nome.trim().length < 2) {
    errors.nome = "O nome deve ter ao menos 2 caracteres";
  } else if (dados.nome.trim().length > 100) {
    errors.nome = "O nome deve ter no máximo 100 caracteres";
  }

  if (!dados.descricao || dados.descricao.trim().length === 0) {
    errors.descricao = "A descrição é obrigatória";
  } else if (dados.descricao.trim().length < 10) {
    errors.descricao = "A descrição deve ter ao menos 10 caracteres";
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
      descricao: dados.descricao.trim(),
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
