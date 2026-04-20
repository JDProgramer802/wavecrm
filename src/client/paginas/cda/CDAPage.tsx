import { useState } from 'react';
import { 
  Car, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical,
  ClipboardList
} from 'lucide-react';

interface CitaCDA {
  id: string;
  placa: string;
  contacto: string;
  tipoVehiculo: string;
  fechaHora: string;
  estado: 'programada' | 'confirmada' | 'en_espera' | 'finalizada' | 'cancelada';
  notas: string;
}

export default function CDAPage() {
  const [citas, setCitas] = useState<CitaCDA[]>([
    { id: '1', placa: 'ABC-123', contacto: 'Juan Pérez', tipoVehiculo: 'Particular', fechaHora: '2024-04-21 09:00', estado: 'confirmada', notas: 'Revisión preventiva.' },
    { id: '2', placa: 'XYZ-789', contacto: 'María García', tipoVehiculo: 'Motocicleta', fechaHora: '2024-04-21 10:30', estado: 'programada', notas: 'Vencimiento mañana.' },
    { id: '3', placa: 'DEF-456', contacto: 'Carlos Ruiz', tipoVehiculo: 'Pesado', fechaHora: '2024-04-21 14:00', estado: 'en_espera', notas: 'Camión de carga.' },
  ]);

  const [tab, setTab] = useState<'citas' | 'vehiculos'>('citas');

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Módulo CDA</h2>
          <p className="text-slate-500">Gestión de revisiones técnico-mecánicas y citas.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
          <Plus size={18} />
          <span>Nueva Cita</span>
        </button>
      </header>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setTab('citas')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'citas' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Citas de Hoy
        </button>
        <button 
          onClick={() => setTab('vehiculos')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'vehiculos' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Base de Vehículos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Citas Pendientes</p>
            <h3 className="text-2xl font-bold text-slate-900">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Finalizadas Hoy</p>
            <h3 className="text-2xl font-bold text-slate-900">8</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">En Espera</p>
            <h3 className="text-2xl font-bold text-slate-900">3</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar por placa..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
          </div>
          <button className="text-slate-500 hover:text-slate-700 flex items-center space-x-2 text-sm font-medium">
            <Filter size={18} />
            <span>Filtrar</span>
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Vehículo</th>
              <th className="px-6 py-4 font-bold">Cliente</th>
              <th className="px-6 py-4 font-bold">Fecha / Hora</th>
              <th className="px-6 py-4 font-bold">Estado</th>
              <th className="px-6 py-4 font-bold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {citas.map((cita) => (
              <tr key={cita.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                      <Car size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{cita.placa}</p>
                      <p className="text-xs text-slate-500">{cita.tipoVehiculo}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{cita.contacto}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{cita.fechaHora}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    cita.estado === 'confirmada' ? 'bg-green-50 text-green-700' :
                    cita.estado === 'en_espera' ? 'bg-orange-50 text-orange-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {cita.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
