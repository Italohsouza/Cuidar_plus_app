import React, { useState, useRef } from 'react';
import { Exam as ExamType, ExamStatus } from '../types';
import { Card } from './common/Card';
import { ICONS } from '../constants';
import { extractFullExamInfo } from '../services/geminiService';

// Mock Data
const initialExams: ExamType[] = [
  { id: 1, name: 'Ressonância Magnética', date: '2024-08-15', time: '14:00', location: 'Clínica Imagem', preparation: 'Jejum de 4 horas.', status: ExamStatus.Scheduled },
  { id: 2, name: 'Exame de Sangue', date: '2024-07-20', time: '07:30', location: 'Laboratório Central', preparation: 'Jejum de 12 horas.', status: ExamStatus.Completed },
  { id: 3, name: 'Ecocardiograma', date: '2024-06-10', time: '10:00', location: 'Hospital do Coração', preparation: 'Nenhum preparo especial.', status: ExamStatus.Completed },
];

const StatusIndicator: React.FC<{ status: ExamStatus }> = ({ status }) => {
  const statusConfig = {
    [ExamStatus.Scheduled]: { color: 'bg-blue-500', label: 'Agendado' },
    [ExamStatus.Completed]: { color: 'bg-green-500', label: 'Concluído' },
    [ExamStatus.Canceled]: { color: 'bg-red-500', label: 'Cancelado' },
  };
  const { color, label } = statusConfig[status];
  return (
    <div className="flex items-center">
      <span className={`w-3 h-3 rounded-full mr-2 ${color}`}></span>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </div>
  );
};

const AddExamModal: React.FC<{
  onClose: () => void;
  onAdd: (exam: Omit<ExamType, 'id' | 'status'>) => void;
}> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [preparation, setPreparation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const info = await extractFullExamInfo(file);
        setName(info.name);
        setDate(info.date);
        setTime(info.time);
        setLocation(info.location);
        setPreparation(info.preparation);
      } catch (error) {
        console.error(error);
        alert("Falha ao extrair informações da imagem.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = () => {
    if (name && date && time && location) {
      onAdd({ name, date, time, location, preparation });
      onClose();
    } else {
      alert("Por favor, preencha nome, data, hora e local.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card title="Adicionar Novo Exame" className="w-11/12 max-h-[90vh] overflow-y-auto">
        {isLoading && <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center"><p>Lendo imagem...</p></div>}
        <div className="space-y-4">
          <input type="text" placeholder="Nome do Exame" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" />
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <input type="text" placeholder="Local (Clínica/Hospital)" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2 border rounded" />
          <textarea placeholder="Instruções de Preparo" value={preparation} onChange={e => setPreparation(e.target.value)} rows={3} className="w-full p-2 border rounded"></textarea>
          
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/80">
            {ICONS.camera}
            Ler do Pedido Médico
          </button>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded">Adicionar</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Exams: React.FC = () => {
  const [exams, setExams] = useState<ExamType[]>(initialExams);
  const [showModal, setShowModal] = useState(false);

  const handleAddExam = (exam: Omit<ExamType, 'id' | 'status'>) => {
    const newExam: ExamType = {
      ...exam,
      id: Date.now(),
      status: ExamStatus.Scheduled,
    };
    setExams(prev => [...prev, newExam].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  return (
    <div className="space-y-6">
      <Card title="Meus Exames Agendados">
        {exams.length > 0 ? exams.map(exam => (
          <div key={exam.id} className="border-b last:border-b-0 py-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg text-primary">{exam.name}</p>
                <p className="text-sm font-semibold text-gray-600">{exam.location}</p>
              </div>
              <StatusIndicator status={exam.status} />
            </div>
            <div className="flex justify-start items-center gap-4 mt-2 text-sm text-gray-600">
                <span>Data: <strong>{new Date(exam.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</strong></span>
                <span>Hora: <strong>{exam.time}</strong></span>
            </div>
            {exam.preparation && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800"><strong className="font-bold">Preparo:</strong> {exam.preparation}</p>
                </div>
            )}
          </div>
        )) : <p className="text-center text-gray-500 py-4">Nenhum exame agendado.</p>}
      </Card>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90"
        title="Adicionar Exame"
      >
        {ICONS.plus}
      </button>

      {showModal && <AddExamModal onClose={() => setShowModal(false)} onAdd={handleAddExam} />}
    </div>
  );
};

export default Exams;