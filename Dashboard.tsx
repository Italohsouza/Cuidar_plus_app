import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Medication, MedicationStatus, AdherenceData, NavItem } from '../types';
import { Card } from './common/Card';
import { ICONS } from '../constants';

// Mock Data
const todaysMedications: Medication[] = [
  { id: 1, name: 'Lisinopril', dosage: '10mg', time: '08:00', status: MedicationStatus.Due },
  { id: 2, name: 'Metformin', dosage: '500mg', time: '09:00', status: MedicationStatus.Taken },
  { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '20:00', status: MedicationStatus.Due },
];

const adherenceData: AdherenceData[] = [
  { day: 'Seg', taken: 3, missed: 0 },
  { day: 'Ter', taken: 2, missed: 1 },
  { day: 'Qua', taken: 3, missed: 0 },
  { day: 'Qui', taken: 3, missed: 0 },
  { day: 'Sex', taken: 2, missed: 1 },
  { day: 'Sáb', taken: 3, missed: 0 },
  { day: 'Dom', taken: 2, missed: 1 },
];

const MedicationReminder: React.FC<{ med: Medication }> = ({ med }) => {
  const isTaken = med.status === MedicationStatus.Taken;
  return (
    <div className="flex items-center justify-between p-3 bg-light rounded-lg mb-2">
      <div>
        <p className={`font-semibold ${isTaken ? 'line-through text-gray-500' : 'text-primary'}`}>{med.name}</p>
        <p className={`text-sm ${isTaken ? 'text-gray-400' : 'text-gray-600'}`}>{med.dosage} - {med.time}</p>
      </div>
      <button
        disabled={isTaken}
        className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
          isTaken
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-secondary hover:bg-primary'
        }`}
      >
        {isTaken ? 'Tomado' : 'Marcar como tomado'}
      </button>
    </div>
  );
};

interface DashboardProps {
    setActiveView: (view: NavItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  return (
    <div className="space-y-6">
      <Card title="Informações de Saúde">
        <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo Sanguíneo</p>
              <p className="text-3xl font-bold text-primary">A+</p>
            </div>
            <div className="border-l border-gray-200">
              <p className="text-sm font-medium text-gray-500">Alergias</p>
              <p className="text-lg font-semibold text-danger pt-2">Penicilina</p>
            </div>
        </div>
      </Card>

      <Card title="Lembretes de Hoje">
        {todaysMedications.map(med => <MedicationReminder key={med.id} med={med} />)}
      </Card>

      <Card title="Acompanhe">
        <div className="grid grid-cols-2 gap-4 text-center">
          <button onClick={() => setActiveView('follow')} className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors">
            {ICONS.car}
            <span className="mt-2 font-semibold text-primary">Pedir Carona</span>
          </button>
          <button onClick={() => setActiveView('follow')} className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors">
            {ICONS.companion}
            <span className="mt-2 font-semibold text-primary">Acompanhante</span>
          </button>
        </div>
      </Card>

      <Card title="Resumo de Dados (Últimos 7 dias)">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={adherenceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="taken" stackId="a" fill="#006d77" name="Tomados" />
              <Bar dataKey="missed" stackId="a" fill="#e29578" name="Perdidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;