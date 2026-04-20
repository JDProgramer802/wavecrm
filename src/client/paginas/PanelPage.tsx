import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, MessageSquare, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function PanelPage() {
  const { slug } = useParams();

  const datosActividad = [
    { name: 'Lun', mensajes: 400, contactos: 240 },
    { name: 'Mar', mensajes: 300, contactos: 139 },
    { name: 'Mie', mensajes: 200, contactos: 980 },
    { name: 'Jue', mensajes: 278, contactos: 390 },
    { name: 'Vie', mensajes: 189, contactos: 480 },
    { name: 'Sab', mensajes: 239, contactos: 380 },
    { name: 'Dom', mensajes: 349, contactos: 430 },
  ];

  const kpis = [
    { label: 'Contactos Totales', valor: '1,284', cambio: '+12.5%', color: 'blue', icono: Users, sube: true },
    { label: 'Mensajes Hoy', valor: '856', cambio: '+5.2%', color: 'green', icono: MessageSquare, sube: true },
    { label: 'Citas Pendientes', valor: '24', cambio: '-2', color: 'orange', icono: Calendar, sube: false },
    { label: 'Tasa Conversión', valor: '18.5%', cambio: '+2.1%', color: 'purple', icono: TrendingUp, sube: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Panel de Control</h2>
          <p className="text-slate-500 mt-1 italic">Hola, gestionando actualmente <span className="font-bold text-blue-600">{slug}</span></p>
        </div>
        <div className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          Actualizado: Hoy, 10:45 AM
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${kpi.color}-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>
            <div className="relative z-10">
              <div className={`w-12 h-12 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl flex items-center justify-center mb-4`}>
                <kpi.icono size={24} />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{kpi.valor}</h3>
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${
                  kpi.sube ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                }`}>
                  {kpi.sube ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                  {kpi.cambio}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-lg font-bold text-slate-900">Actividad Semanal</h4>
            <select className="bg-slate-50 border-none text-sm font-medium text-slate-500 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={datosActividad}>
                <defs>
                  <linearGradient id="colorMensajes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="mensajes" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMensajes)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-6">Últimas Interacciones</h4>
          <div className="space-y-6">
            {[
              { nombre: 'Juan Pérez', accion: 'Nuevo mensaje de WhatsApp', tiempo: 'Hace 5 min', color: 'blue' },
              { nombre: 'María García', accion: 'Cita programada (Barbería)', tiempo: 'Hace 12 min', color: 'green' },
              { nombre: 'Carlos Ruiz', accion: 'Revisión CDA completada', tiempo: 'Hace 45 min', color: 'purple' },
              { nombre: 'Ana López', accion: 'Suscripción renovada', tiempo: 'Hace 1 hora', color: 'orange' },
              { nombre: 'Pedro Gómez', accion: 'Nuevo contacto registrado', tiempo: 'Hace 3 horas', color: 'slate' },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4 group cursor-pointer">
                <div className={`w-10 h-10 rounded-2xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-600 font-bold group-hover:scale-110 transition-transform`}>
                  {item.nombre.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{item.nombre}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.accion}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium tracking-wider">{item.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-sm font-bold rounded-2xl hover:bg-slate-100 transition-colors">
            Ver Toda la Actividad
          </button>
        </div>
      </div>
    </div>
  );
}
