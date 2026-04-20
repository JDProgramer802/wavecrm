import { useState } from 'react';
import { Search, Send, Paperclip, Smile, MoreVertical, CheckCheck, Phone, Video, Info } from 'lucide-react';

interface Mensaje {
  id: number;
  texto: string;
  esEntrante: boolean;
  hora: string;
  leido?: boolean;
}

interface Chat {
  id: number;
  nombre: string;
  ultimoMensaje: string;
  hora: string;
  sinLeer: number;
  online: boolean;
  telefono: string;
}

export default function ChatPage() {
  const [mensaje, setMensaje] = useState('');
  const [chatActivo, setChatActivo] = useState<number>(1);
  const [busqueda, setBusqueda] = useState('');

  const chats: Chat[] = [
    { id: 1, nombre: 'Juan Pérez', ultimoMensaje: 'Hola, ¿qué precio tiene el servicio?', hora: '10:45 AM', sinLeer: 2, online: true, telefono: '+57 300 123 4567' },
    { id: 2, nombre: 'María García', ultimoMensaje: 'Confirmado para mañana', hora: '09:30 AM', sinLeer: 0, online: false, telefono: '+57 310 987 6543' },
    { id: 3, nombre: 'Carlos Rodríguez', ultimoMensaje: 'Gracias por la atención', hora: 'Ayer', sinLeer: 0, online: true, telefono: '+57 320 456 7890' },
    { id: 4, nombre: 'Ana Martínez', ultimoMensaje: '¿Cuándo puedo pasar?', hora: 'Ayer', sinLeer: 1, online: false, telefono: '+57 315 111 2233' },
  ];

  const mensajesChat: { [key: number]: Mensaje[] } = {
    1: [
      { id: 1, texto: 'Hola, ¿qué precio tiene el servicio de CDA para moto?', esEntrante: true, hora: '10:42 AM' },
      { id: 2, texto: '¡Hola Juan! Para motos tiene un costo de $185.000 COP.', esEntrante: false, hora: '10:44 AM', leido: true },
      { id: 3, texto: '¿Y qué incluye el servicio?', esEntrante: true, hora: '10:45 AM' },
    ],
    2: [
      { id: 1, texto: 'Confirmado para mañana a las 10 AM', esEntrante: true, hora: '09:30 AM' },
      { id: 2, texto: 'Perfecto, te esperamos', esEntrante: false, hora: '09:32 AM', leido: true },
    ],
    3: [
      { id: 1, texto: 'Gracias por la atención', esEntrante: true, hora: 'Ayer' },
      { id: 2, texto: 'Con gusto, estamos para servirte', esEntrante: false, hora: 'Ayer', leido: true },
    ],
    4: [
      { id: 1, texto: '¿Cuándo puedo pasar?', esEntrante: true, hora: 'Ayer' },
    ],
  };

  const chatActual = chats.find(chat => chat.id === chatActivo);
  const mensajesActuales = mensajesChat[chatActivo] || [];

  const chatsFiltrados = chats.filter(chat => 
    chat.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    chat.telefono.includes(busqueda)
  );

  const handleEnviarMensaje = () => {
    if (mensaje.trim()) {
      console.log('Enviando mensaje:', mensaje, 'al chat:', chatActivo);
      setMensaje('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensaje();
    }
  };

  const handleSeleccionarChat = (chatId: number) => {
    setChatActivo(chatId);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Lista de Chats */}
      <div className="w-80 border-r border-slate-100 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar chat..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatsFiltrados.map((chat) => (
            <div 
              key={chat.id} 
              className={`p-4 flex items-center space-x-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 ${
                chatActivo === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
              onClick={() => handleSeleccionarChat(chat.id)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {chat.nombre.charAt(0)}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900 truncate text-sm">{chat.nombre}</h4>
                  <span className="text-[10px] text-slate-400">{chat.hora}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{chat.ultimoMensaje}</p>
              </div>
              {chat.sinLeer > 0 && (
                <div className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {chat.sinLeer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ventana de Chat */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {chatActual ? (
          <>
            <header className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {chatActual.nombre.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{chatActual.nombre}</h4>
                  <p className="text-[10px] text-green-500 font-medium">
                    {chatActual.online ? 'En línea' : 'Desconectado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <Phone size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <Video size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <Info size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <MoreVertical size={20} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {mensajesActuales.map((msg) => (
                <div key={msg.id} className={`flex ${msg.esEntrante ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-3 rounded-2xl max-w-[70%] shadow-sm ${
                    msg.esEntrante 
                      ? 'bg-white rounded-tl-none border border-slate-100' 
                      : 'bg-blue-600 rounded-tr-none text-white shadow-md shadow-blue-100'
                  }`}>
                    <p className={`text-sm ${msg.esEntrante ? 'text-slate-800' : 'text-white'}`}>
                      {msg.texto}
                    </p>
                    <div className={`flex items-center justify-end space-x-1 mt-1 ${
                      msg.esEntrante ? 'text-[10px] text-slate-400' : 'text-[10px] text-blue-100'
                    }`}>
                      <span>{msg.hora}</span>
                      {!msg.esEntrante && (
                        <CheckCheck size={12} className={msg.leido ? 'text-blue-100' : 'text-blue-300'} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Smile size={22} />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Paperclip size={22} />
                </button>
                <input 
                  type="text" 
                  placeholder="Escribe un mensaje..." 
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  onClick={handleEnviarMensaje}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100 disabled:opacity-50"
                  disabled={!mensaje.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={40} className="text-slate-300" />
              </div>
              <p className="text-lg font-medium">Selecciona un chat para comenzar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
