import { useState, useEffect, useCallback } from 'react';
import { Agendamento, agendamentoAPI } from '../services/api';

export function useAgendamentos(filialId: number) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async (data?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await agendamentoAPI.listar(filialId, data);
      setAgendamentos(response.data);
    } catch (err) {
      setError('Erro ao carregar agendamentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filialId]);

  const mudarStatus = async (id: number, novoStatus: string) => {
    try {
      const response = await agendamentoAPI.atualizarStatus(id, novoStatus);
      setAgendamentos(
        agendamentos.map((ag) =>
          ag.id === id ? response.data : ag
        )
      );
    } catch (err) {
      setError('Erro ao atualizar status');
      console.error(err);
    }
  };

  const recarregar = useCallback(() => {
    carregar();
  }, [carregar]);

  const criar = async (data: {
    petId: number;
    filialId: number;
    dataAgendamento: string;
    horaAgendamento: string;
    servicosIds: number[];
    observacoes?: string;
  }) => {
    await agendamentoAPI.criar(data);
    await carregar();
  };

  useEffect(() => {
    carregar();

    // Recarregar a cada 5 segundos
    const interval = setInterval(recarregar, 5000);

    return () => clearInterval(interval);
  }, [carregar, recarregar]);

  return { agendamentos, loading, error, carregar, mudarStatus, recarregar, criar };
}
