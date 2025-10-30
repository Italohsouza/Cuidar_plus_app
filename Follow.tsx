

import React, { useState } from 'react';
import { Card } from './common/Card';
import { ServiceRequest, ServiceType } from '../types';

const serviceTypeLabels: { [key in ServiceType]: string } = {
  [ServiceType.Ride]: 'Carona',
  [ServiceType.Companion]: 'Acompanhante',
  [ServiceType.RideAndCompanion]: 'Carona + Acompanhante',
};

// Mock Data
const availableRequests: ServiceRequest[] = [
  { id: 1, requester: 'Carlos Mendes', avatar: 'https://picsum.photos/id/1005/100/100', type: ServiceType.Ride, origin: 'Rua das Flores, 123', destination: 'Clínica Pro-Vida', time: '14:30', value: 25.00, rating: 4.8 },
  { id: 2, requester: 'Ana Beatriz', avatar: 'https://picsum.photos/id/1011/100/100', type: ServiceType.Companion, origin: 'Avenida Principal, 456', destination: 'Hospital Central', time: '10:00', value: 40.00, rating: 4.9 },
  { id: 3, requester: 'Lúcia Ferreira', avatar: 'https://picsum.photos/id/1027/100/100', type: ServiceType.Ride, origin: 'Praça da Matriz, 789', destination: 'Laboratório Exame Certo', time: '08:00', value: 18.50, rating: 4.5 },
  { id: 4, requester: 'Roberto Alves', avatar: 'https://picsum.photos/id/1040/100/100', type: ServiceType.RideAndCompanion, origin: 'Alameda dos Anjos, 101', destination: 'Hospital das Clínicas', time: '09:00', value: 75.00, rating: 4.7 },
];

const RequestForm: React.FC = () => (
  <Card title="Solicitar Serviço">
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de serviço</label>
        <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <option value={ServiceType.Ride}>{serviceTypeLabels[ServiceType.Ride]}</option>
          <option value={ServiceType.Companion}>{serviceTypeLabels[ServiceType.Companion]}</option>
          <option value={ServiceType.RideAndCompanion}>{serviceTypeLabels[ServiceType.RideAndCompanion]}</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Origem</label>
        <input type="text" placeholder="Endereço de partida" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Destino</label>
        <input type="text" placeholder="Endereço da clínica ou hospital" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
         <div className="mt-2 h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
            Mapa Interativo Placeholder
         </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data Início</label>
          <input type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora Início</label>
          <input type="time" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data Fim</label>
          <input type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora Fim</label>
          <input type="time" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea placeholder="Ex: precisa de ajuda para caminhar" rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
      </div>
      <button type="submit" className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary/90">
        Confirmar Solicitação
      </button>
    </form>
  </Card>
);

const CompanionPanel: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-center text-primary">Solicitações Próximas</h2>
    {availableRequests.map(req => (
      <Card key={req.id} className="flex flex-col">
        <div className="flex items-start space-x-4">
            <img src={req.avatar} alt={req.requester} className="w-16 h-16 rounded-full" />
            <div className="flex-1">
                <p className="font-bold">{req.requester} (⭐ {req.rating})</p>
                <p className="text-sm font-semibold text-gray-600">{serviceTypeLabels[req.type]}</p>
                 <div className="mt-1 text-sm text-gray-800">
                    <p className="truncate"><strong className="font-medium text-gray-500">De:</strong> {req.origin}</p>
                    <p className="truncate"><strong className="font-medium text-gray-500">Para:</strong> {req.destination}</p>
                </div>
                <p className="text-gray-600 mt-1">Horário: {req.time}</p>
            </div>
            <p className="font-bold text-lg text-green-600">R${req.value.toFixed(2)}</p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
            <button className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200">Recusar</button>
            <button className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200">Enviar Proposta</button>
            <button className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200">Aceitar</button>
        </div>
      </Card>
    ))}
  </div>
);

const Follow: React.FC = () => {
  const [isRequesting, setIsRequesting] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex justify-center bg-gray-200 rounded-full p-1">
        <button onClick={() => setIsRequesting(true)} className={`w-1/2 py-2 rounded-full ${isRequesting ? 'bg-primary text-white' : ''}`}>Solicitar Serviço</button>
        <button onClick={() => setIsRequesting(false)} className={`w-1/2 py-2 rounded-full ${!isRequesting ? 'bg-primary text-white' : ''}`}>Oferecer Serviço</button>
      </div>

      {isRequesting ? <RequestForm /> : <CompanionPanel />}
    </div>
  );
};

export default Follow;