import { useState } from 'react';
import { Search, UserPlus, MoreVertical, Phone, Mail, Tag, Filter, Download, Trash2, Edit } from 'lucide-react';

interface Contacto {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  etiquetas: string[];
  notas: string;
  fechaRegistro: string;
}

export default function ContactosPage() {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState<Contacto | null>(null);

  const [contactos, setContactos] = useState<Contacto[]>([
    { id: 1, nombre: 'Juan Pérez', telefono: '+57 300 123 4567', email: 'juan@example.com', etiquetas: ['Cliente VIP', 'CDA'], notas: 'Interesado en revisión técnico-mecánica.', fechaRegistro: '2024-03-15' },
    { id: 2, nombre: 'María García', telefono: '+57 310 987 6543', email: 'maria@example.com', etiquetas: ['Barbería'], notas: 'Prefiere citas los sábados.', fechaRegistro: '2024-03-18' },
    { id: 3, nombre: 'Carlos Rodríguez', telefono: '+57 320 456 7890', email: 'carlos@example.com', etiquetas: ['Soporte'], notas: 'Problema con acceso al panel.', fechaRegistro: '2024-03-20' },
    { id: 4, nombre: 'Ana Martínez', telefono: '+57 315 111 2233', email: 'ana@example.com', etiquetas: ['Cliente VIP'], notas: 'Cliente recurrente desde 2023.', fechaRegistro: '2024-03-22' },
  ]);

  const filtrados = contactos.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.telefono.includes(busqueda) ||
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminar = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este contacto?')) {
      setContactos(contactos.filter(c => c.id !== id));
    }
  };

  const handleExportar = () => {
    const csv = contactos.map(c => `${c.nombre},${c.telefono},${c.email}`).join('\n');
    console.log('Exportando CSV:', csv);
    alert('Contactos exportados exitosamente (ver consola)');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Contactos</h2>
          <p className="text-slate-500">Gestiona la base de datos de tus clientes y prospectos.</p>
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <button 
            onClick={handleExportar}
            className="flex-1 md:flex-none border border-slate-200 bg-white text-slate-600 px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            <span>Exportar</span>
          </button>
          <button 
            onClick={() => setMostrarModal(true)}
            className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
          >
            <UserPlus size={18} />
            <span>Nuevo Contacto</span>
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, teléfono o email..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors w-full md:w-auto justify-center">
            <Filter size={18} />
            <span>Filtros Avanzados</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Contacto</th>
                <th className="px-6 py-4 font-semibold">Información Directa</th>
                <th className="px-6 py-4 font-semibold">Etiquetas</th>
                <th className="px-6 py-4 font-semibold">Registro</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((contacto) => (
                <tr key={contacto.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                        {contacto.nombre.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{contacto.nombre}</span>
                        <span className="text-xs text-slate-400 truncate max-w-[150px]">{contacto.notas}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-slate-600 group-hover:text-blue-600 transition-colors">
                        <Phone size={14} className="mr-2" />
                        {contacto.telefono}
                      </div>
                      <div className="flex items-center text-sm text-slate-600 group-hover:text-blue-600 transition-colors">
                        <Mail size={14} className="mr-2" />
                        {contacto.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {contacto.etiquetas.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full flex items-center border border-slate-200">
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500 font-medium">{contacto.fechaRegistro}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleEliminar(contacto.id)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtrados.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-medium">No se encontraron contactos</p>
            <p className="text-slate-400 text-sm">Intenta con otros términos de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-xs text-slate-400 px-2">
        <span>Mostrando {filtrados.length} de {contactos.length} contactos</span>
        <span>Última sincronización: Hace 2 minutos</span>
      </div>
    </div>
  );
}
