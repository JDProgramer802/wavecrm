import { Outlet, Link, useParams, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const { slug } = useParams();
  const location = useLocation();

  const menuItems = [
    { nombre: 'Panel', ruta: `/${slug}/panel`, icono: LayoutDashboard },
    { nombre: 'Chat', ruta: `/${slug}/chat`, icono: MessageSquare },
    { nombre: 'Contactos', ruta: `/${slug}/contactos`, icono: Users },
    { nombre: 'Configuración', ruta: `/${slug}/configuracion`, icono: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-blue-600 tracking-tight">WaveCRM</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.ruta}
              to={item.ruta}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.ruta 
                  ? "bg-blue-50 text-blue-700 font-medium" 
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <item.icono size={20} />
              <span>{item.nombre}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
