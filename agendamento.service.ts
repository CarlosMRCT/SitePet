import { AgendamentoRepository } from './agendamento.repository';
import { StatusAgendamento, IAgendamentoDTO } from '../../shared/types';

const repository = new AgendamentoRepository();

export class AgendamentoService {
  async listarFilial(filialId: number, data?: string): Promise<IAgendamentoDTO[]> {
    const agendamentos = await repository.listarPorFilial(filialId, data);

    return agendamentos.map((ag) => ({
      id: ag.id,
      petId: ag.petId,
      petNome: ag.pet.nome,
      tutorNome: ag.pet.tutor.nome,
      filialId: ag.filialId,
      dataAgendamento: ag.dataAgendamento.toISOString().split('T')[0],
      horaAgendamento: ag.horaAgendamento,
      status: ag.status as StatusAgendamento,
      servicos: ag.servicos.map((s) => ({
        id: s.servico.id,
        nome: s.servico.nome,
      })),
      observacoes: ag.observacoes ?? undefined,
    }));
  }

  async criarAgendamento(data: {
    petId: number;
    filialId: number;
    dataAgendamento: string; // YYYY-MM-DD
    horaAgendamento: string; // HH:MM
    servicosIds: number[];
    observacoes?: string;
  }) {
    const dataObj = new Date(data.dataAgendamento);

    const created = await repository.criar({
      petId: data.petId,
      filialId: data.filialId,
      dataAgendamento: dataObj,
      horaAgendamento: data.horaAgendamento,
      servicos: data.servicosIds,
      observacoes: data.observacoes,
    });

    return {
      id: created.id,
      petNome: created.pet.nome,
      tutorNome: created.pet.tutor.nome,
      status: created.status,
      horaAgendamento: created.horaAgendamento,
      servicos: created.servicos.map((s) => ({
        id: s.servico.id,
        nome: s.servico.nome,
      })),
    };
  }

  async mudarStatus(
    agendamentoId: number,
    novoStatus: StatusAgendamento,
    usuario?: string
  ) {
    const updated = await repository.atualizarStatus(
      agendamentoId,
      novoStatus,
      usuario
    );

    return {
      id: updated.id,
      status: updated.status,
      petNome: updated.pet.nome,
      tutorNome: updated.pet.tutor.nome,
    };
  }

  async obterAgendamento(id: number) {
    return repository.obterPorId(id);
  }

  async deletarAgendamento(id: number) {
    return repository.deletar(id);
  }

  async listarServicos(filialId: number) {
    return repository.listarServicos(filialId);
  }

  async listarPets(filialId: number) {
    const pets = await repository.listarPets(filialId);
    return pets.map((pet) => ({
      id: pet.id,
      nome: pet.nome,
      raca: pet.raca,
      tamanho: pet.tamanho,
      tutorNome: pet.tutor.nome,
    }));
  }
}
