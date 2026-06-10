import React from 'react';
import { Agendamento } from '../services/api';
import { ChevronRight, Trash2 } from 'lucide-react';

interface KanbanBoardProps {
  agendamentos: Agendamento[];
  onMudarStatus: (id: number, novoStatus: string) => void;
}

interface ColumnProps {
  status: string;
  titulo: string;
  color: string;
  agendamentos: Agendamento[];
  onMudarStatus: (id: number, novoStatus: string) => void;
}

const StatusColors = {
  AGUARDANDO: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    badge: 'bg-yellow-100 text-yellow-800',
    text: 'text-yellow-700',
  },
  EM_SERVICO: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    badge: 'bg-blue-100 text-blue-800',
    text: 'text-blue-700',
  },
  CONCLUIDO_ESPERANDO: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    badge: 'bg-green-100 text-green-800',
    text: 'text-green-700',
  },
  CONCLUIDO_ENTREGUE: {
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    badge: 'bg-gray-100 text-gray-800',
    text: 'text-gray-700',
  },
};

export function KanbanBoard({ agendamentos, onMudarStatus }: KanbanBoardProps) {
  const colunas = [
    {
      status: 'AGUARDANDO',
      titulo: '⏳ Aguardando',
      color: 'yellow',
    },
    {
      status: 'EM_SERVICO',
      titulo: '🛁 Em Serviço',
      color: 'blue',
    },
    {
      status: 'CONCLUIDO_ESPERANDO',
      titulo: '✅ Pronto',
      color: 'green',
    },
    {
      status: 'CONCLUIDO_ENTREGUE',
      titulo: '🚚 Entregue',
      color: 'gray',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {colunas.map((coluna) => (
        <KanbanColumn
          key={coluna.status}
          status={coluna.status}
          titulo={coluna.titulo}
          color={coluna.color}
          agendamentos={agendamentos.filter(
            (ag) => ag.status === coluna.status
          )}
          onMudarStatus={onMudarStatus}
        />
      ))}
    </div>
  );
}

function KanbanColumn({
  status,
  titulo,
  color,
  agendamentos,
  onMudarStatus,
}: ColumnProps) {
  const colors = StatusColors[status as keyof typeof StatusColors];

  return (
    <div className={`${colors.bg} rounded-lg p-4 min-h-96 border-2 ${colors.border}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-bold text-lg ${colors.text}`}>{titulo}</h2>
        <span className={`${colors.badge} px-3 py-1 rounded-full text-sm font-semibold`}>
          {agendamentos.length}
        </span>
      </div>

      <div className="space-y-3">
        {agendamentos.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">Nenhum pet aqui</p>
          </div>
        ) : (
          agendamentos.map((agendamento) => (
            <CartaoPet
              key={agendamento.id}
              agendamento={agendamento}
              onProximo={() => {
                const proximoStatus = {
                  AGUARDANDO: 'EM_SERVICO',
                  EM_SERVICO: 'CONCLUIDO_ESPERANDO',
                  CONCLUIDO_ESPERANDO: 'CONCLUIDO_ENTREGUE',
                }[agendamento.status];

                if (proximoStatus) {
                  onMudarStatus(agendamento.id, proximoStatus);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface CartaoPetProps {
  agendamento: Agendamento;
  onProximo: () => void;
}

function CartaoPet({ agendamento, onProximo }: CartaoPetProps) {
  const statusColor =
    StatusColors[agendamento.status as keyof typeof StatusColors];

  return (
    <div
      className={`${statusColor.bg} p-4 rounded-lg border-l-4 ${statusColor.border} bg-white shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-900 truncate">
            🐕 {agendamento.petNome}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            {agendamento.tutorNome}
          </p>

          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              ⏰ {agendamento.horaAgendamento}
            </p>
            <div className="flex flex-wrap gap-1">
              {agendamento.servicos.map((servico) => (
                <span
                  key={servico.id}
                  className="text-xs bg-senti-teal text-white px-2 py-1 rounded-full"
                >
                  {servico.nome}
                </span>
              ))}
            </div>
          </div>

          {agendamento.observacoes && (
            <p className="text-xs text-gray-600 mt-2 italic">
              📝 {agendamento.observacoes}
            </p>
          )}
        </div>

        {agendamento.status !== 'CONCLUIDO_ENTREGUE' && (
          <button
            onClick={onProximo}
            className="ml-2 p-2 hover:bg-gray-200 rounded transition flex-shrink-0"
            title="Próximo status"
            type="button"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
