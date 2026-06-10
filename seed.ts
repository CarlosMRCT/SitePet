import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...\n');

  // Limpar dados antigos
  await prisma.agendamento.deleteMany();
  await prisma.agendamentoServico.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.tutor.deleteMany();
  await prisma.filial.deleteMany();

  // ===== FILIAIS =====
  const matriz = await prisma.filial.create({
    data: {
      nome: 'Senti PetStore - Matriz',
      endereco: 'Rua Principal, 123 - Centro',
    },
  });

  const centro = await prisma.filial.create({
    data: {
      nome: 'Senti PetStore - Centro',
      endereco: 'Avenida Centro, 456 - Centro',
    },
  });

  console.log('✅ Filiais criadas:', { matriz: matriz.nome, centro: centro.nome });

  // ===== TUTORES =====
  const tutor1 = await prisma.tutor.create({
    data: {
      nome: 'João Silva',
      telefone: '11999999999',
      email: 'joao@email.com',
      filialId: matriz.id,
    },
  });

  const tutor2 = await prisma.tutor.create({
    data: {
      nome: 'Maria Santos',
      telefone: '11988888888',
      email: 'maria@email.com',
      filialId: centro.id,
    },
  });

  const tutor3 = await prisma.tutor.create({
    data: {
      nome: 'Pedro Oliveira',
      telefone: '11987654321',
      email: 'pedro@email.com',
      filialId: matriz.id,
    },
  });

  const tutor4 = await prisma.tutor.create({
    data: {
      nome: 'Ana Costa',
      telefone: '11912345678',
      email: 'ana@email.com',
      filialId: centro.id,
    },
  });

  const tutor5 = await prisma.tutor.create({
    data: {
      nome: 'Carlos Mendes',
      telefone: '11911111111',
      email: 'carlos@email.com',
      filialId: matriz.id,
    },
  });

  console.log('✅ Tutores criados: 5 donos registrados');

  // ===== PETS =====
  const pet1 = await prisma.pet.create({
    data: {
      nome: 'Thor',
      raca: 'Labrador Retriever',
      tamanho: 'GRANDE',
      tutorId: tutor1.id,
      filialId: matriz.id,
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      nome: 'Bella',
      raca: 'Poodle',
      tamanho: 'PEQUENO',
      tutorId: tutor2.id,
      filialId: centro.id,
    },
  });

  const pet3 = await prisma.pet.create({
    data: {
      nome: 'Max',
      raca: 'Golden Retriever',
      tamanho: 'GRANDE',
      tutorId: tutor3.id,
      filialId: matriz.id,
    },
  });

  const pet4 = await prisma.pet.create({
    data: {
      nome: 'Luna',
      raca: 'Shih Tzu',
      tamanho: 'PEQUENO',
      tutorId: tutor4.id,
      filialId: centro.id,
    },
  });

  const pet5 = await prisma.pet.create({
    data: {
      nome: 'Rex',
      raca: 'Pinscher',
      tamanho: 'PEQUENO',
      tutorId: tutor5.id,
      filialId: matriz.id,
    },
  });

  console.log('✅ Pets criados: 5 animais registrados');

  // ===== SERVIÇOS =====
  const banhoMatriz = await prisma.servico.create({
    data: {
      nome: 'Banho',
      preco: 50.0,
      duracaoMinutos: 30,
      filialId: matriz.id,
    },
  });

  const tosaBanhoMatriz = await prisma.servico.create({
    data: {
      nome: 'Tosa',
      preco: 60.0,
      duracaoMinutos: 45,
      filialId: matriz.id,
    },
  });

  const hidratacaoMatriz = await prisma.servico.create({
    data: {
      nome: 'Hidratação',
      preco: 40.0,
      duracaoMinutos: 20,
      filialId: matriz.id,
    },
  });

  const banhoCentro = await prisma.servico.create({
    data: {
      nome: 'Banho',
      preco: 50.0,
      duracaoMinutos: 30,
      filialId: centro.id,
    },
  });

  const tosaCentro = await prisma.servico.create({
    data: {
      nome: 'Tosa',
      preco: 60.0,
      duracaoMinutos: 45,
      filialId: centro.id,
    },
  });

  console.log('✅ Serviços criados: Banho, Tosa e Hidratação');

  // ===== AGENDAMENTOS =====
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const agendamento1 = await prisma.agendamento.create({
    data: {
      petId: pet1.id,
      filialId: matriz.id,
      dataAgendamento: hoje,
      horaAgendamento: '10:00',
      status: 'AGUARDANDO',
      servicos: {
        create: [
          { servicoId: banhoMatriz.id },
          { servicoId: tosaBanhoMatriz.id },
        ],
      },
    },
  });

  const agendamento2 = await prisma.agendamento.create({
    data: {
      petId: pet2.id,
      filialId: centro.id,
      dataAgendamento: hoje,
      horaAgendamento: '10:30',
      status: 'AGUARDANDO',
      servicos: {
        create: [{ servicoId: banhoCentro.id }],
      },
    },
  });

  const agendamento3 = await prisma.agendamento.create({
    data: {
      petId: pet3.id,
      filialId: matriz.id,
      dataAgendamento: hoje,
      horaAgendamento: '11:00',
      status: 'EM_SERVICO',
      servicos: {
        create: [
          { servicoId: banhoMatriz.id },
          { servicoId: hidratacaoMatriz.id },
        ],
      },
    },
  });

  const agendamento4 = await prisma.agendamento.create({
    data: {
      petId: pet4.id,
      filialId: centro.id,
      dataAgendamento: hoje,
      horaAgendamento: '11:15',
      status: 'CONCLUIDO_ESPERANDO',
      servicos: {
        create: [
          { servicoId: banhoCentro.id },
          { servicoId: tosaCentro.id },
        ],
      },
    },
  });

  const agendamento5 = await prisma.agendamento.create({
    data: {
      petId: pet5.id,
      filialId: matriz.id,
      dataAgendamento: hoje,
      horaAgendamento: '09:00',
      status: 'CONCLUIDO_ENTREGUE',
      servicos: {
        create: [{ servicoId: tosaBanhoMatriz.id }],
      },
    },
  });

  console.log('✅ Agendamentos criados: 5 agendamentos com diferentes status');
  console.log('\n📊 Resumo dos dados:');
  console.log('   • 2 Filiais (Matriz e Centro)');
  console.log('   • 5 Tutores');
  console.log('   • 5 Pets');
  console.log('   • 5 Serviços (Banho, Tosa, Hidratação)');
  console.log('   • 5 Agendamentos para hoje');
  console.log('\n✨ Seed concluído com sucesso!\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
