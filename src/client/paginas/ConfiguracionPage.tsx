import { useState } from 'react';
import { Settings, Bell, Shield, CreditCard, Smartphone } from 'lucide-react';

export default function ConfiguracionPage() {
  const [seccion, setSeccion] = useState('perfil');
  const [formulario, setFormulario] = useState({
    nombreEmpresa: 'Mi Empresa S.A.S',
    descripcion: 'Empresa especializada en servicios de calidad',
    tipoNegocio: 'otro',
    emailSoporte: 'soporte@empresa.com',
    telefonoSoporte: '+57 300 123 4567'
  });

  const menu = [
    { id: 'perfil', nombre: 'Perfil de Empresa', icono: Settings },
    { id: 'notificaciones', nombre: 'Notificaciones', icono: Bell },
    { id: 'seguridad', nombre: 'Seguridad y API', icono: Shield },
    { id: 'plan', nombre: 'Plan y Facturación', icono: CreditCard },
    { id: 'whatsapp', nombre: 'WhatsApp', icono: Smartphone },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const handleGuardarPerfil = () => {
    console.log('Guardando perfil:', formulario);
    alert('Configuración guardada exitosamente');
  };

  const handleConectarWhatsApp = () => {
    console.log('Iniciando conexión WhatsApp');
    alert('Abriendo generador de código QR...');
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
        <p className="text-slate-500">Administra las preferencias de tu cuenta y empresa.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Menú Lateral */}
        <aside className="w-full md:w-64 space-y-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setSeccion(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                seccion === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <item.icono size={18} />
              <span>{item.nombre}</span>
            </button>
          ))}
        </aside>

        {/* Contenido */}
        <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {seccion === 'perfil' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Perfil de Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nombre de la Empresa</label>
                  <input 
                    type="text" 
                    name="nombreEmpresa"
                    value={formulario.nombreEmpresa}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tipo de Negocio</label>
                  <select 
                    name="tipoNegocio"
                    value={formulario.tipoNegocio}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="restaurante">Restaurante</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="cda">Centro de Diagnóstico Automotriz</option>
                    <option value="barberia">Barbería</option>
                    <option value="soporte_tecnico">Soporte Técnico</option>
                    <option value="tienda">Tienda</option>
                    <option value="colegio">Colegio</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email de Soporte</label>
                  <input 
                    type="email" 
                    name="emailSoporte"
                    value={formulario.emailSoporte}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Teléfono de Soporte</label>
                  <input 
                    type="tel" 
                    name="telefonoSoporte"
                    value={formulario.telefonoSoporte}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Descripción</label>
                  <textarea 
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24" 
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleGuardarPerfil}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {seccion === 'notificaciones' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Configuración de Notificaciones</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Notificaciones por Email</h4>
                    <p className="text-sm text-slate-500">Recibir alertas importantes en tu correo</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Notificaciones Push</h4>
                    <p className="text-sm text-slate-500">Notificaciones en tiempo real en el navegador</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Reportes Diarios</h4>
                    <p className="text-sm text-slate-500">Resumen diario de actividad por email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {seccion === 'seguridad' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Seguridad y API</h3>
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Claves API</h4>
                  <p className="text-sm text-slate-500 mb-4">Gestiona las claves para integraciones externas</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Generar Nueva Clave API
                  </button>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Autenticación de Dos Factores</h4>
                  <p className="text-sm text-slate-500 mb-4">Añade una capa extra de seguridad a tu cuenta</p>
                  <button className="px-4 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                    Configurar 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {seccion === 'plan' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Plan y Facturación</h3>
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-blue-900">Plan Profesional</h4>
                    <p className="text-blue-700">$99.000 COP/mes</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">Activo</span>
                </div>
                <ul className="space-y-2 text-sm text-blue-800 mb-4">
                  <li>• 1,000 contactos</li>
                  <li>• 3 usuarios</li>
                  <li>• WhatsApp integrado</li>
                  <li>• Soporte prioritario</li>
                </ul>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Actualizar Plan
                </button>
              </div>
            </div>
          )}

          {seccion === 'whatsapp' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Configuración de WhatsApp</h3>
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone size={40} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Conectar WhatsApp</h4>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  Vincula tu dispositivo para comenzar a enviar y recibir mensajes a través de WaveCRM.
                </p>
                <div className="space-y-4">
                  <button 
                    onClick={handleConectarWhatsApp}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                  >
                    Vincular Dispositivo (QR)
                  </button>
                  <div className="text-sm text-slate-400">
                    <p>Estado: <span className="text-orange-600 font-medium">Desconectado</span></p>
                    <p className="mt-1">Última conexión: Nunca</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
