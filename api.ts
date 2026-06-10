import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracaoMinutos: number;
}

export interface Pet {
  id: number;
  nome: string;
  raca?: string;
  tamanho: 'PEQUENO' | 'MEDIO' | 'GRANDE';
  tutorNome: string;
}

export interface Agendamento {
  id: number;
  petId: number;
  petNome: string;
  tutorNome: string;
  filialId: number;
  dataAgendamento: string;
  horaAgendamento: string;
  status: 'AGUARDANDO' | 'EM_SERVICO' | 'CONCLUIDO_ESPERANDO' | 'CONCLUIDO_ENTREGUE';
  servicos: Array<{ id: number; nome: string }>;
  observacoes?: string;
}

export const agendamentoAPI = {
  listar: (filialId: number, data?: string) =>
    api.get<Agendamento[]>('/agendamentos', { params: { filialId, data } }),

  criar: (data: {
    petId: number;
    filialId: number;
    dataAgendamento: string;
    horaAgendamento: string;
    servicosIds: number[];
    observacoes?: string;
  }) => api.post<Agendamento>('/agendamentos', data),

  atualizarStatus: (id: number, novoStatus: string, usuario?: string) =>
    api.patch<Agendamento>(`/agendamentos/${id}/status`, {
      novoStatus,
      usuario,
    }),

  deletar: (id: number) => api.delete(`/agendamentos/${id}`),

  obter: (id: number) => api.get<Agendamento>(`/agendamentos/${id}`),

  listarServicos: (filialId: number) =>
    api.get<Servico[]>(`/agendamentos/filial/${filialId}/servicos`),

  listarPets: (filialId: number) =>
    api.get<Pet[]>(`/agendamentos/filial/${filialId}/pets`),
};
