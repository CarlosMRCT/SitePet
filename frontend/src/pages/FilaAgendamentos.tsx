import React, { useState } from 'react';
import { KanbanBoard } from '../components/KanbanBoard';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { RefreshCw } from 'lucide-react';

export function FilaAgendamentos() {
  const [filialSelecionada, setFilialSelecionada] = useState(1);
  const { agendamentos, loading, error, mudarStatus, recarregar } =
    useAgendamentos(filialSelecionada);

  const nomeFilial = filialSelecionada === 1 ? 'Matriz' : 'Centro';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-senti-teal">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🐾 Senti PetStore
              </h1>
              <p className="text-senti-teal font-semibold mt-1">
                Fila de Agendamentos - {nomeFilial}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex gap-4 items-end">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Filial
                </label>
                <select
                  value={filialSelecionada}
                  onChange={(e) => setFilialSelecionada(Number(e.target.value))}
                  className="border-2 border-senti-teal rounded-lg px-4 py-2 font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-senti-orange"
                >
                  <option value={1}>🏢 Matriz</option>
                  <option value={2}>🏪 Centro</option>
                </select>
              </div>

              <button
                onClick={recarregar}
                disabled={loading}
                className="bg-senti-teal hover:bg-opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
                title="Recarregar dados"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Recarregar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 m-4 rounded-lg border-l-4 border-red-500 flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={recarregar}
            className="ml-auto text-red-600 hover:text-red-800 underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {loading && agendamentos.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-senti-teal mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Carregando agendamentos...</p>
          </div>
        </div>
      )}

      {!loading && agendamentos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">😴 Nenhum agendamento para hoje</p>
          <button
            onClick={recarregar}
            className="bg-senti-teal text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Recarregar
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-6 max-w-7xl mx-auto">
            {[
              {
                status: 'AGUARDANDO',
                label: 'Aguardando',
                icon: '⏳',
                color: 'bg-yellow-100 text-yellow-800',
              },
              {
                status: 'EM_SERVICO',
                label: 'Em Serviço',
                icon: '🛁',
                color: 'bg-blue-100 text-blue-800',
              },
              {
                status: 'CONCLUIDO_ESPERANDO',
                label: 'Pronto',
                icon: '✅',
                color: 'bg-green-100 text-green-800',
              },
              {
                status: 'CONCLUIDO_ENTREGUE',
                label: 'Entregue',
                icon: '🚚',
                color: 'bg-gray-100 text-gray-800',
              },
            ].map((stat) => (
              <div
                key={stat.status}
                className={`${stat.color} rounded-lg p-4 text-center border-2 border-current`}
              >
                <p className="text-2xl mb-1">{stat.icon}</p>
                <p className="font-semibold text-sm">{stat.label}</p>
                <p className="text-2xl font-bold">
                  {agendamentos.filter((ag) => ag.status === stat.status).length}
                </p>
              </div>
            ))}
          </div>

          {/* Kanban Board */}
          <KanbanBoard agendamentos={agendamentos} onMudarStatus={mudarStatus} />
        </>
      )}

      {/* Footer */}
      <div className="bg-white border-t mt-8 py-4 text-center text-gray-600 text-sm">
        <p>
          💡 Clique na seta para mover o pet para o próximo status |{' '}
          <span className="text-senti-teal font-semibold">Auto-atualiza a cada 5s</span>
        </p>
      </div>
    </div>
  );
}
