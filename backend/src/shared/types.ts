export enum StatusAgendamento {
  AGUARDANDO = 'AGUARDANDO',
  EM_SERVICO = 'EM_SERVICO',
  CONCLUIDO_ESPERANDO = 'CONCLUIDO_ESPERANDO',
  CONCLUIDO_ENTREGUE = 'CONCLUIDO_ENTREGUE',
}

export enum TamanhoPet {
  PEQUENO = 'PEQUENO',
  MEDIO = 'MEDIO',
  GRANDE = 'GRANDE',
}

export interface IAgendamentoDTO {
  id: number;
  petId: number;
  petNome: string;
  tutorNome: string;
  filialId: number;
  dataAgendamento: string;
  horaAgendamento: string;
  status: StatusAgendamento;
  servicos: Array<{ id: number; nome: string }>;
  observacoes?: string;
}

export interface IPetDTO {
  id: number;
  nome: string;
  raca?: string;
  tamanho: TamanhoPet;
  tutorNome: string;
}

export interface IFilialDTO {
  id: number;
  nome: string;
  endereco?: string;
}
