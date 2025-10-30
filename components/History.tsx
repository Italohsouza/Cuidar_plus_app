
import React, { useState, useRef } from 'react';
import { Card } from './common/Card';
import { MedicalRecord } from '../types';
import { ICONS } from '../constants';
import { extractExamInfo } from '../services/geminiService';

// Mock Data
const initialRecords: MedicalRecord[] = [
  { id: 1, type: 'exam', title: 'Exame de Sangue Completo', date: '2023-10-15', details: 'Colesterol um pouco alto.' },
  { id: 2, type: 'appointment', title: 'Consulta Cardiologista', date: '2023-10-05', details: 'Dr. Ricardo Lima' },
  { id: 3, type: 'exam', title: 'Raio-X do Tórax', date: '2023-08-20', details: 'Resultados normais.' },
  { id: 4, type: 'appointment', title: 'Consulta Clínico Geral', date: '2023-07-01', details: 'Check-up anual.' },
];

const UploadModal: React.FC<{ onClose: () => void; onAdd: (record: Omit<MedicalRecord, 'id'>) => void; }> = ({ onClose, onAdd }) => {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsLoading(true);
            try {
                const info = await extractExamInfo(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newRecord = {
                        type: 'exam' as const,
                        title: info.examName,
                        date: info.examDate,
                        imageUrl: e.target?.result as string,
                    };
                    onAdd(newRecord);
                    onClose();
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error(error);
                alert("Falha ao processar o documento.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Card title="Upload de Exame" className="w-11/12">
                {isLoading && <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center"><p>Analisando documento...</p></div>}
                <div className="text-center">
                    <p className="mb-4">Selecione uma foto ou PDF do seu exame. A IA irá organizar para você.</p>
                    <input type="file" accept="image/*,application/pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/80">
                        {ICONS.upload}
                        Selecionar Arquivo
                    </button>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                </div>
            </Card>
        </div>
    );
};


const History: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);
  const [showModal, setShowModal] = useState(false);

  const handleAddRecord = (record: Omit<MedicalRecord, 'id'>) => {
      const newRecord = { ...record, id: Date.now() };
      setRecords(prev => [newRecord, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  return (
    <div className="relative">
      <div className="relative pl-8">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-secondary"></div>

        {records.map((record, index) => (
          <div key={record.id} className="mb-8 relative">
            {/* Timeline Dot */}
            <div className={`absolute left-[-2px] top-1.5 w-4 h-4 rounded-full ${record.type === 'exam' ? 'bg-primary' : 'bg-danger'}`} style={{ left: '-0.8rem' }}></div>
            
            <Card className="ml-4">
              <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h3 className="text-lg font-bold text-primary">{record.title}</h3>
              {record.details && <p className="text-gray-700">{record.details}</p>}
              {record.imageUrl && <img src={record.imageUrl} alt={record.title} className="mt-2 rounded-lg max-h-60 w-auto" />}
            </Card>
          </div>
        ))}
      </div>

       <button onClick={() => setShowModal(true)} className="fixed bottom-24 right-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90">
         {ICONS.plus}
      </button>

      {showModal && <UploadModal onClose={() => setShowModal(false)} onAdd={handleAddRecord} />}
    </div>
  );
};

export default History;
