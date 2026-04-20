import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function InicioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 tracking-tight">WaveCRM</div>
          <nav className="hidden md:flex space-x-8 text-slate-600 font-medium">
            <a href="#caracteristicas" className="hover:text-blue-600">Características</a>
            <a href="#precios" className="hover:text-blue-600">Precios</a>
            <a href="#contacto" className="hover:text-blue-600">Contacto</a>
          </nav>
          <div className="flex space-x-4">
            <Link to="/auth/login" className="px-4 py-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">Iniciar Sesión</Link>
            <Link to="/auth/registro" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Registrarse</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-8">
            La plataforma definitiva para gestionar tu negocio y <span className="text-blue-600">vender por WhatsApp</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            WaveCRM centraliza tus conversaciones, automatiza procesos y escala tus ventas en un solo lugar. Multi-tenant, modular y diseñado para crecer contigo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/auth/registro" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 flex items-center justify-center transition-all shadow-lg shadow-blue-200">
              Comenzar gratis <ArrowRight className="ml-2" size={20} />
            </Link>
            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
              Ver demo personalizada
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="caracteristicas" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Todo lo que necesitas en una sola herramienta</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Potencia tu empresa con funcionalidades diseñadas para la eficiencia operativa.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                titulo: 'WhatsApp Multi-agente',
                desc: 'Conecta tu cuenta y permite que todo tu equipo atienda clientes simultáneamente.',
                icono: MessageSquare
              },
              {
                titulo: 'Módulos Especializados',
                desc: 'Personaliza tu CRM según tu industria: CDA, Barberías, Restaurantes y más.',
                icono: Zap
              },
              {
                titulo: 'Automatización Inteligente',
                desc: 'Crea flujos de trabajo que respondan y actúen por ti las 24 horas del día.',
                icono: CheckCircle2
              }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <f.icono size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.titulo}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 bg-blue-600 text-white overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl font-bold mb-6">Seguridad y confiabilidad de nivel empresarial</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck size={24} className="text-blue-200" />
                <span className="text-lg">Encriptación de extremo a extremo en datos sensibles.</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheck size={24} className="text-blue-200" />
                <span className="text-lg">Infraestructura escalable en Supabase y Vercel.</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheck size={24} className="text-blue-200" />
                <span className="text-lg">Backups automáticos y disponibilidad del 99.9%.</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 animate-pulse"></div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl">
                <div className="text-5xl font-black mb-2">1,500+</div>
                <div className="text-blue-100 font-medium">Empresas confían en nosotros</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-8">¿Listo para llevar tu negocio al siguiente nivel?</h2>
          <Link to="/auth/registro" className="inline-block px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 transform hover:-translate-y-1">
            Empieza hoy mismo - Es gratis
          </Link>
          <p className="mt-6 text-slate-500 italic">No requiere tarjeta de crédito</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>© 2026 WaveCRM. Todos los derechos reservados. Desarrollado para el futuro del comercio.</p>
        </div>
      </footer>
    </div>
  );
}

// Icono faltante
const MessageSquare = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
