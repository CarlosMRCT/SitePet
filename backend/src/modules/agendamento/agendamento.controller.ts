import { Router, Request, Response } from 'express';
import { AgendamentoService } from './agendamento.service';
import { StatusAgendamento } from '../../shared/types';

const router = Router();
const service = new AgendamentoService();

// GET /agendamentos?filialId=1&data=2026-06-09
router.get('/', async (req: Request, res: Response) => {
  try {
    const { filialId, data } = req.query;

    if (!filialId) {
      return res.status(400).json({ error: 'filialId é obrigatório' });
    }

    const agendamentos = await service.listarFilial(
      Number(filialId),
      data as string
    );

    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
});

// GET /agendamentos/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agendamento = await service.obterAgendamento(Number(id));

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json(agendamento);
  } catch (error) {
    console.error('Erro ao obter agendamento:', error);
    res.status(500).json({ error: 'Erro ao obter agendamento' });
  }
});

// POST /agendamentos
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      petId,
      filialId,
      dataAgendamento,
      horaAgendamento,
      servicosIds,
      observacoes,
    } = req.body;

    if (!petId || !filialId || !dataAgendamento || !horaAgendamento) {
      return res.status(400).json({
        error: 'petId, filialId, dataAgendamento e horaAgendamento são obrigatórios',
      });
    }

    const agendamento = await service.criarAgendamento({
      petId,
      filialId,
      dataAgendamento,
      horaAgendamento,
      servicosIds: servicosIds || [],
      observacoes,
    });

    res.status(201).json(agendamento);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// PATCH /agendamentos/:id/status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { novoStatus, usuario } = req.body;

    if (!novoStatus) {
      return res.status(400).json({ error: 'novoStatus é obrigatório' });
    }

    if (!Object.values(StatusAgendamento).includes(novoStatus)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const agendamento = await service.mudarStatus(
      Number(id),
      novoStatus,
      usuario
    );

    res.json(agendamento);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// DELETE /agendamentos/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.deletarAgendamento(Number(id));
    res.json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({ error: 'Erro ao deletar agendamento' });
  }
});

// GET /agendamentos/filial/:filialId/servicos
router.get('/filial/:filialId/servicos', async (req: Request, res: Response) => {
  try {
    const { filialId } = req.params;
    const servicos = await service.listarServicos(Number(filialId));
    res.json(servicos);
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    res.status(500).json({ error: 'Erro ao listar serviços' });
  }
});

// GET /agendamentos/filial/:filialId/pets
router.get('/filial/:filialId/pets', async (req: Request, res: Response) => {
  try {
    const { filialId } = req.params;
    const pets = await service.listarPets(Number(filialId));
    res.json(pets);
  } catch (error) {
    console.error('Erro ao listar pets:', error);
    res.status(500).json({ error: 'Erro ao listar pets' });
  }
});

export const agendamentoRoutes = router;
