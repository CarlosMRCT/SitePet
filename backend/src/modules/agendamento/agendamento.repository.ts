import { PrismaClient } from '@prisma/client';
import { StatusAgendamento } from '../../shared/types';

const prisma = new PrismaClient();

export class AgendamentoRepository {
  async listarPorFilial(filialId: number, data?: string) {
    const where: any = { filialId };

    if (data) {
      const dataDate = new Date(data);
      where.dataAgendamento = {
        gte: dataDate,
        lt: new Date(dataDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    return prisma.agendamento.findMany({
      where,
      include: {
        pet: { include: { tutor: true } },
        servicos: { include: { servico: true } },
      },
      orderBy: { horaAgendamento: 'asc' },
    });
  }

  async obterPorId(id: number) {
    return prisma.agendamento.findUnique({
      where: { id },
      include: {
        pet: { include: { tutor: true } },
        servicos: { include: { servico: true } },
        historico: true,
      },
    });
  }

  async criar(data: {
    petId: number;
    filialId: number;
    dataAgendamento: Date;
    horaAgendamento: string;
    servicos: number[];
    observacoes?: string;
  }) {
    return prisma.agendamento.create({
      data: {
        petId: data.petId,
        filialId: data.filialId,
        dataAgendamento: data.dataAgendamento,
        horaAgendamento: data.horaAgendamento,
        observacoes: data.observacoes,
        status: 'AGUARDANDO',
        servicos: {
          create: data.servicos.map((servicoId) => ({
            servicoId,
          })),
        },
      },
      include: {
        pet: { include: { tutor: true } },
        servicos: { include: { servico: true } },
      },
    });
  }

  async atualizarStatus(
    id: number,
    novoStatus: string,
    mudadoPor?: string
  ) {
    // Buscar status anterior
    const agendamento = await prisma.agendamento.findUnique({ where: { id } });

    // Atualizar status
    const updated = await prisma.agendamento.update({
      where: { id },
      data: { status: novoStatus as any },
      include: {
        pet: { include: { tutor: true } },
        servicos: { include: { servico: true } },
      },
    });

    // Registrar no histórico
    await prisma.agendamentoStatusHistorico.create({
      data: {
        agendamentoId: id,
        statusAnterior: agendamento?.status,
        statusNovo: novoStatus,
        mudadoPor,
      },
    });

    return updated;
  }

  async deletar(id: number) {
    return prisma.agendamento.delete({ where: { id } });
  }

  async listarServicos(filialId: number) {
    return prisma.servico.findMany({
      where: { filialId },
    });
  }

  async listarPets(filialId: number) {
    return prisma.pet.findMany({
      where: { filialId },
      include: { tutor: true },
    });
  }
}
