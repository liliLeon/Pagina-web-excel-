'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('admin@facturas.pro');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950">

      {/* ── Animated orbs ── */}
      <div className="absolute w-96 h-96 rounded-full bg-red-700/15 blur-3xl top-0 left-0 float-1 pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-red-900/20 blur-3xl bottom-10 right-0 float-2 pointer-events-none" />
      <div className="absolute w-56 h-56 rounded-full bg-red-600/10 blur-3xl top-1/2 right-1/4 float-3 pointer-events-none" />

      {/* ── Wave bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div className="wave-slow w-[200%]">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20 block" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C180,80 360,0 540,40 C720,80 900,20 1080,40 C1260,60 1440,20 1440,40 L1440,80 L0,80 Z" fill="#7f1d1d" fillOpacity="0.15" />
          </svg>
        </div>
        <div className="wave-med absolute bottom-0 w-[200%] opacity-20">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-14 block" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1440,20 1440,30 L1440,60 L0,60 Z" fill="#dc2626" />
          </svg>
        </div>
      </div>

      {/* ── Back link ── */}
      <Link
        href="/"
        className="absolute top-5 left-5 flex items-center gap-1.5 text-slate-500 hover:text-slate-300
                   text-xs transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Inicio
      </Link>

      {/* ── Login card ── */}
      <div className="relative z-10 w-full max-w-sm mx-4 slide-up">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-3xl bg-red-600/10 blur-xl pointer-events-none" />

        <div className="relative rounded-3xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="pulse-glow p-3.5 rounded-2xl bg-red-600/20 ring-1 ring-red-500/50">
              <FileSpreadsheet className="w-9 h-9 text-red-400" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-black text-white tracking-tight">
                Facturas<span className="text-red-500">Pro</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">Registro inteligente de facturas</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-xs font-medium">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@facturas.pro"
                required
                className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-600
                           focus:border-red-500 focus:ring-red-500/20 h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-300 text-xs font-medium">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-600
                           focus:border-red-500 focus:ring-red-500/20 h-10 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold h-11 rounded-xl
                         transition-all hover:shadow-lg hover:shadow-red-600/30 mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Ingresando...</>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>

          {/* Security badge */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
            <ShieldCheck className="w-3 h-3 text-red-700" />
            Verificación Abuse.ch activa
          </div>
        </div>
      </div>
    </div>
  );
}

