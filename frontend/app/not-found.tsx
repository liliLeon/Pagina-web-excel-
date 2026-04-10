import Link from 'next/link';
import { FileSpreadsheet, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute w-80 h-80 rounded-full bg-red-700/15 blur-3xl top-10 left-10 float-1 pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full bg-red-900/10 blur-3xl bottom-10 right-10 float-2 pointer-events-none" />

      <div className="relative z-10 text-center px-6 slide-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-2xl bg-red-600/20 ring-1 ring-red-500/40">
            <FileSpreadsheet className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* 404 */}
        <h1
          className="text-9xl font-black text-transparent"
          style={{
            WebkitTextStroke: '2px rgba(220,38,38,0.5)',
            backgroundImage: 'linear-gradient(135deg, #dc2626, #991b1b)',
            WebkitBackgroundClip: 'text',
          }}
        >
          404
        </h1>

        <h2 className="text-white text-2xl font-bold mt-2 mb-3">Página no encontrada</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
          La ruta que buscas no existe o fue movida. Verifica la URL o regresa al inicio.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold
                       px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-red-600/30"
          >
            <Home className="w-4 h-4" /> Ir al Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300
                       font-medium px-6 py-3 rounded-xl border border-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div className="wave-slow w-[200%]">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-14 block" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,20 C360,60 720,0 1080,30 C1260,45 1440,10 1440,30 L1440,60 L0,60 Z" fill="#0f172a" fillOpacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
