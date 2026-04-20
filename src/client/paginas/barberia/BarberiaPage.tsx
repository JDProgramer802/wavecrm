import { useState } from 'react';
import { 
  Scissors, 
  User, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  Star,
  Settings
} from 'lucide-react';

interface CitaBarberia {
  id: string;
  cliente: string;
  barbero: string;
  servicio: string;
  fechaHora: string;
  precio: string;
  estado: 'programada' | 'confirmada' | 'en_espera' | 'finalizada' | 'cancelada';
}

export default function BarberiaPage() {
  const [tab, setTab] = useState<'agenda' | 'barberos' | 'servicios'>('agenda');

  const [citas] = useState<CitaBarberia[]>([
    { id: '1', cliente: 'Carlos Ruiz', barbero: 'Mateo', servicio: 'Corte de Cabello + Barba', fechaHora: '2024-04-21 15:00', precio: '$45.000', estado: 'confirmada' },
    { id: '2', cliente: 'Andrés López', barbero: 'Mateo', servicio: 'Corte de Cabello', fechaHora: '2024-04-21 16:00', precio: '$25.000', estado: 'programada' },
    { id: '3', cliente: 'Juan Pérez', barbero: 'Santi', servicio: 'Tintura', fechaHora: '2024-04-21 17:30', precio: '$80.000', estado: 'en_espera' },
  ]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Módulo Barbería</h2>
          <p className="text-slate-500">Gestión de citas, barberos y catálogo de servicios.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
          <Plus size={18} />
          <span>Nueva Cita</span>
        </button>
      </header>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['agenda', 'barberos', 'servicios'].map((t) => (
          <button 
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <CalendarIcon size={20} />
            </div>
            <span className="text-sm font-medium text-slate-500">Citas Hoy</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">18</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-sm font-medium text-slate-500">Finalizadas</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">12</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-sm font-medium text-slate-500">En Proceso</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">2</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Star size={20} />
            </div>
            <span className="text-sm font-medium text-slate-500">Valoración</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">4.9/5</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar por cliente o barbero..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Cliente</th>
              <th className="px-6 py-4 font-bold">Barbero</th>
              <th className="px-6 py-4 font-bold">Servicio / Precio</th>
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
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                      {cita.cliente.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{cita.cliente}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <User size={14} />
                    <span>{cita.barbero}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{cita.servicio}</p>
                    <p className="text-xs text-blue-600 font-bold">{cita.precio}</p>
                  </div>
                </td>
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
                  <button className="text-slate-400 hover:text-slate-600">
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
