import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { agendamentoAPI, Pet, Servico } from '../services/api';

interface NovoAgendamentoModalProps {
  filialId: number;
  onClose: () => void;
  onCriar: (data: {
    petId: number;
    filialId: number;
    dataAgendamento: string;
    horaAgendamento: string;
    servicosIds: number[];
    observacoes?: string;
  }) => Promise<void>;
}

function hojeISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function NovoAgendamentoModal({
  filialId,
  onClose,
  onCriar,
}: NovoAgendamentoModalProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [petId, setPetId] = useState<number | ''>('');
  const [dataAgendamento, setDataAgendamento] = useState(hojeISO());
  const [horaAgendamento, setHoraAgendamento] = useState('09:00');
  const [servicosIds, setServicosIds] = useState<number[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    agendamentoAPI.listarPets(filialId).then((res) => setPets(res.data));
    agendamentoAPI.listarServicos(filialId).then((res) => setServicos(res.data));
  }, [filialId]);

  const toggleServico = (id: number) => {
    setServicosIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!petId) {
      setErro('Selecione um pet');
      return;
    }
    if (servicosIds.length === 0) {
      setErro('Selecione pelo menos um serviço');
      return;
    }

    setSalvando(true);
    try {
      await onCriar({
        petId: Number(petId),
        filialId,
        dataAgendamento,
        horaAgendamento,
        servicosIds,
        observacoes: observacoes || undefined,
      });
      onClose();
    } catch (err) {
      setErro('Erro ao criar agendamento');
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          type="button"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🐾 Novo Agendamento
        </h2>

        {erro && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pet
            </label>
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-senti-teal"
            >
              <option value="">Selecione um pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.nome} ({pet.tutorNome})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                value={dataAgendamento}
                onChange={(e) => setDataAgendamento(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-senti-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Hora
              </label>
              <input
                type="time"
                value={horaAgendamento}
                onChange={(e) => setHoraAgendamento(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-senti-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Serviços
            </label>
            <div className="space-y-2">
              {servicos.map((servico) => (
                <label
                  key={servico.id}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={servicosIds.includes(servico.id)}
                    onChange={() => toggleServico(servico.id)}
                    className="rounded text-senti-teal focus:ring-senti-teal"
                  />
                  {servico.nome} (R$ {servico.preco.toFixed(2)})
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={2}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-senti-teal"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-700 rounded-lg py-2 font-semibold hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 bg-senti-teal text-white rounded-lg py-2 font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
