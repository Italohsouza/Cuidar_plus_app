import React, { useState, useRef } from 'react';
import { Medication as MedType, MedicationStatus } from '../types';
import { Card } from './common/Card';
import { ICONS } from '../constants';
import { extractMedicationInfo } from '../services/geminiService';

// Mock Data
const myMedications: MedType[] = [
  { id: 1, name: 'Lisinopril', dosage: '10mg', time: '08:00', status: MedicationStatus.Taken },
  { id: 2, name: 'Metformin', dosage: '500mg', time: '09:00', status: MedicationStatus.Due },
  { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '20:00', status: MedicationStatus.Overdue },
];

const familyMedications: MedType[] = [
  { id: 4, name: 'Amlodipine', dosage: '5mg', time: '08:00', status: MedicationStatus.Taken, owner: 'Maria Silva' },
  { id: 5, name: 'Simvastatin', dosage: '40mg', time: '21:00', status: MedicationStatus.Due, owner: 'Maria Silva' },
  { id: 6, name: 'Gliclazide', dosage: '30mg', time: '08:30', status: MedicationStatus.Overdue, owner: 'João Pereira' },
];

const scheduleNotification = (med: MedType) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        console.warn("Permissão para notificações não concedida.");
        return;
    }

    const [hours, minutes] = med.time.split(':').map(Number);
    const now = new Date();
    
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);

    if (notificationTime.getTime() < now.getTime()) {
        notificationTime.setDate(notificationTime.getDate() + 1);
    }

    const delay = notificationTime.getTime() - now.getTime();

    if (delay > 0) {
        setTimeout(() => {
            new Notification('Hora do Remédio! 💊', {
                body: `Não se esqueça de tomar seu ${med.name} (${med.dosage}).`,
            });
        }, delay);
    }
};

const StatusIndicator: React.FC<{ status: MedicationStatus }> = ({ status }) => {
  const statusConfig = {
    [MedicationStatus.Taken]: { color: 'bg-green-500', label: 'Tomado' },
    [MedicationStatus.Due]: { color: 'bg-yellow-500', label: 'Na Hora' },
    [MedicationStatus.Overdue]: { color: 'bg-red-500', label: 'Atrasado' },
  };
  const { color, label } = statusConfig[status];
  return (
    <div className="flex items-center">
      <span className={`w-3 h-3 rounded-full mr-2 ${color}`}></span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
};

const AddMedicationModal: React.FC<{ 
    onClose: () => void; 
    onAdd: (med: Omit<MedType, 'id' | 'status'>, owner?: string | null) => void;
    owner?: string | null;
}> = ({ onClose, onAdd, owner }) => {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [time, setTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsLoading(true);
            try {
                const info = await extractMedicationInfo(file);
                setName(info.name);
                setDosage(info.dosage);
            } catch (error) {
                console.error(error);
                alert("Falha ao extrair informações da imagem.");
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    const handleSubmit = () => {
        if(name && dosage && time){
            onAdd({name, dosage, time}, owner);
            onClose();
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    }

    const title = owner ? `Adicionar Medicamento para ${owner}` : "Adicionar Medicamento";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Card title={title} className="w-11/12">
                {isLoading && <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center"><p>Lendo imagem...</p></div>}
                <div className="space-y-4">
                    <input type="text" placeholder="Nome do remédio" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" placeholder="Dosagem (ex: 500mg)" value={dosage} onChange={e => setDosage(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 border rounded" />
                    
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/80">
                        {ICONS.camera}
                        Ler da Embalagem
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

const AddPersonModal: React.FC<{
    onClose: () => void;
    onAdd: (name: string) => void;
}> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onAdd(name.trim());
            onClose();
        } else {
            alert("Por favor, insira um nome.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Card title="Adicionar Pessoa Cuidada" className="w-11/12">
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Nome Completo" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full p-2 border rounded" 
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded">Adicionar</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};


const Medication: React.FC = () => {
  const [isCaregiverView, setIsCaregiverView] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  
  const [meds, setMeds] = useState(myMedications);
  const [familyMeds, setFamilyMeds] = useState(familyMedications);

  const initialCaredPeople = Array.from(new Set(familyMedications.map(m => m.owner!)));
  const [caredPeople, setCaredPeople] = useState<string[]>(initialCaredPeople);
  const [currentOwner, setCurrentOwner] = useState<string | null>(null);

  const handleAddMed = (med: Omit<MedType, 'id' | 'status'>, owner?: string | null) => {
      const newMed: MedType = {
          ...med,
          id: Date.now(),
          status: MedicationStatus.Due,
      };

      if (owner) {
        setFamilyMeds(prev => [...prev, {...newMed, owner}]);
      } else {
        setMeds(prev => [...prev, newMed]);
      }
      scheduleNotification(newMed);
  };

  const handleAddPerson = (name: string) => {
      if (!caredPeople.includes(name)) {
          setCaredPeople(prev => [...prev, name]);
      } else {
          alert("Essa pessoa já está na sua lista.");
      }
  };

  const openMedModalFor = (owner: string | null) => {
      setCurrentOwner(owner);
      setShowMedModal(true);
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-center bg-gray-200 rounded-full p-1">
        <button onClick={() => setIsCaregiverView(false)} className={`w-1/2 py-2 rounded-full ${!isCaregiverView ? 'bg-primary text-white' : ''}`}>Meus Remédios</button>
        <button onClick={() => setIsCaregiverView(true)} className={`w-1/2 py-2 rounded-full ${isCaregiverView ? 'bg-primary text-white' : ''}`}>Visão do Cuidador</button>
      </div>

      {isCaregiverView ? (
        caredPeople.map(owner => {
          const medsForOwner = familyMeds.filter(med => med.owner === owner);
          return (
            <Card key={owner}>
                <div className="flex justify-between items-center mb-3 border-b pb-3">
                    <h2 className="text-xl font-bold text-primary">{owner}</h2>
                    <button onClick={() => openMedModalFor(owner)} title="Adicionar Remédio" className="p-2 text-primary rounded-full hover:bg-secondary/30">
                        {ICONS.plus}
                    </button>
                </div>
                {medsForOwner.length > 0 ? medsForOwner.map(med => (
                    <div key={med.id} className="border-b last:border-b-0 py-3">
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-lg">{med.name}</p>
                            <StatusIndicator status={med.status} />
                        </div>
                        <div className="flex justify-start items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>Dose: <strong>{med.dosage}</strong></span>
                            <span>Horário: <strong>{med.time}</strong></span>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500 py-2">Nenhum medicamento adicionado.</p>}
            </Card>
          )
        })
      ) : (
        <Card title="Minha Medicação">
          {meds.map(med => (
            <div key={med.id} className="border-b last:border-b-0 py-3">
               <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg">{med.name}</p>
                        <p className="text-sm text-gray-500">{med.dosage} - {med.time}</p>
                    </div>
                    <StatusIndicator status={med.status} />
                </div>
            </div>
          ))}
        </Card>
      )}

      <button 
        onClick={() => isCaregiverView ? setShowAddPersonModal(true) : openMedModalFor(null)} 
        className="fixed bottom-24 right-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90"
        title={isCaregiverView ? "Adicionar Pessoa" : "Adicionar Medicamento"}
      >
         {ICONS.plus}
      </button>

      {showMedModal && <AddMedicationModal onClose={() => setShowMedModal(false)} onAdd={handleAddMed} owner={currentOwner} />}
      {showAddPersonModal && <AddPersonModal onClose={() => setShowAddPersonModal(false)} onAdd={handleAddPerson} />}
    </div>
  );
};

export default Medication;
