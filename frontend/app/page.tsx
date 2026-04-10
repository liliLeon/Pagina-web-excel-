'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import {
  FileSpreadsheet, Shield, BarChart3, Zap, Download, Code2,
  ArrowRight, CheckCircle2, Globe, Lock, ShieldCheck,
} from 'lucide-react';

/* ─── Wave SVG (doubled width so looping is seamless) ─────────────── */
function WaveLayer({ className, path }: { className: string; path: string }) {
  return (
    <div className={`absolute bottom-0 left-0 w-[200%] overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block w-full h-16 md:h-24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} />
      </svg>
    </div>
  );
}

/* ─── Floating glow orb ────────────────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
  );
}

/* ─── Feature card ─────────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon, title, desc, accent = false,
}: {
  icon: React.ElementType; title: string; desc: string; accent?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-2xl border p-6 transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg hover:shadow-red-900/30
        ${accent
          ? 'bg-red-950/40 border-red-700/50 hover:border-red-500/70'
          : 'bg-slate-900/60 border-slate-700/50 hover:border-red-700/50'
        }`}
    >
      {accent && (
        <div className="absolute inset-0 rounded-2xl bg-red-600/5 pointer-events-none" />
      )}
      <div
        className={`inline-flex p-2.5 rounded-xl mb-4
          ${accent ? 'bg-red-500/20 ring-1 ring-red-500/40' : 'bg-slate-800 ring-1 ring-slate-700'}`}
      >
        <Icon className={`w-5 h-5 ${accent ? 'text-red-400' : 'text-slate-400 group-hover:text-red-400 transition-colors'}`} />
      </div>
      <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Stat counter ─────────────────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-black text-white">{value}</div>
      <div className="text-slate-400 text-xs mt-1">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    if (isAuthenticated()) router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4
                      bg-slate-950/80 backdrop-blur border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-600/20 ring-1 ring-red-500/40">
            <FileSpreadsheet className="w-5 h-5 text-red-400" />
          </div>
          <span className="font-bold text-white tracking-tight">Facturas<span className="text-red-500">Pro</span></span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#features" className="hidden md:block text-slate-400 hover:text-white text-sm transition-colors">
            Características
          </a>
          <a href="#security" className="hidden md:block text-slate-400 hover:text-white text-sm transition-colors">
            Seguridad
          </a>
          <Link
            href="/login"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold
                       px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-red-600/30"
          >
            Ingresar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-40
                          bg-linear-to-br from-slate-950 via-red-950/30 to-slate-950">
        {/* Orbs */}
        <Orb className="w-96 h-96 bg-red-600/20 top-20 -left-32 float-1" />
        <Orb className="w-80 h-80 bg-red-800/15 top-40 right-0 float-2" />
        <Orb className="w-64 h-64 bg-red-500/10 bottom-32 left-1/4 float-3" />

        {/* Badge */}
        <div className="slide-up mb-6 inline-flex items-center gap-2 bg-red-950/60 border border-red-800/60
                        rounded-full px-4 py-1.5 text-xs text-red-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
          Protegido con inteligencia de amenazas Abuse.ch
        </div>

        {/* Title */}
        <h1
          className="slide-up text-center font-black text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight px-4"
          style={{ animationDelay: '0.1s' }}
        >
          Registro de Facturas
          <br />
          <span className="bg-linear-to-r from-red-400 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Inteligente
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="slide-up mt-6 text-center text-slate-400 text-base md:text-lg max-w-xl px-8 leading-relaxed"
          style={{ animationDelay: '0.2s' }}
        >
          Automatiza el registro, validación y exportación a Excel de tus facturas.
          Cada proveedor es verificado en tiempo real contra listas de amenazas globales.
        </p>

        {/* CTA buttons */}
        <div
          className="slide-up mt-8 flex flex-col sm:flex-row items-center gap-3"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            href="/login"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold
                       px-7 py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-red-600/40
                       hover:-translate-y-0.5 pulse-glow"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Acceder al Sistema
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300
                       font-medium px-7 py-3.5 rounded-xl border border-slate-700 transition-all
                       hover:border-red-700/50 hover:-translate-y-0.5"
          >
            Ver características
          </a>
        </div>

        {/* Stats */}
        <div
          className="slide-up mt-16 flex items-center gap-10 md:gap-16"
          style={{ animationDelay: '0.45s' }}
        >
          <Stat value="∞" label="Facturas ilimitadas" />
          <div className="w-px h-10 bg-slate-800" />
          <Stat value="100%" label="Exportación Excel" />
          <div className="w-px h-10 bg-slate-800" />
          <Stat value="24/7" label="Monitoreo Abuse.ch" />
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <div className="wave-slow absolute bottom-0 w-[200%]">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20 block" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,40 L1440,80 L0,80 Z"
                fill="#0f172a"
              />
            </svg>
          </div>
          <div className="wave-med absolute bottom-0 w-[200%] opacity-40">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 block" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0,50 C240,10 480,70 720,50 C960,30 1200,70 1440,50 L1440,80 L0,80 Z"
                fill="#1e293b"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="features" className="bg-slate-950 px-6 md:px-12 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-950/50 border border-red-800/50
                            rounded-full px-4 py-1.5 text-xs text-red-300 mb-4">
              <Zap className="w-3 h-3" /> Características del sistema
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Todo lo que necesitas,{' '}
              <span className="text-red-400">en un solo lugar</span>
            </h2>
            <p className="text-slate-400 mt-3 text-sm max-w-md mx-auto">
              Desde el registro hasta la exportación, con verificación de seguridad automatizada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={FileSpreadsheet}
              title="Registro Inteligente"
              desc="Registra facturas con número, proveedor, NIT, monto y fecha. Validación automática de duplicados y formato."
            />
            <FeatureCard
              icon={Download}
              title="Exportación Excel"
              desc="Descarga todas tus facturas en formato .xlsx con estilos profesionales, filtros y columnas formateadas."
            />
            <FeatureCard
              icon={Zap}
              title="Validación Automática"
              desc="Cada factura pasa por un job de validación: formato NIT, totales positivos, sin duplicados."
            />
            <FeatureCard
              icon={Shield}
              title="Seguridad Abuse.ch"
              desc="Integración con ThreatFox API para verificar proveedores contra bases de datos de amenazas globales."
              accent
            />
            <FeatureCard
              icon={BarChart3}
              title="Dashboard Analítico"
              desc="Estadísticas en tiempo real: totales, estados de validación, montos y alertas de seguridad."
            />
            <FeatureCard
              icon={Code2}
              title="API REST"
              desc="Backend Laravel 12 con autenticación Sanctum, CORS configurado y endpoints documentados."
            />
          </div>
        </div>
      </section>

      {/* ── WAVE SEPARATOR ──────────────────────────────────────── */}
      <div className="relative h-20 bg-slate-950 overflow-hidden">
        <div className="wave-slow absolute bottom-0 w-[200%]">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-16 block" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1440,20 1440,30 L1440,60 L0,60 Z" fill="#0f0a0a" />
          </svg>
        </div>
      </div>

      {/* ── ABUSE.CH SECURITY SECTION ───────────────────────────── */}
      <section id="security" className="relative bg-[#0f0a0a] px-6 md:px-12 py-24 overflow-hidden">
        <Orb className="w-72 h-72 bg-red-700/10 top-10 right-10 float-2" />
        <Orb className="w-48 h-48 bg-red-500/10 bottom-10 left-10 float-1" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Shield visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-52 h-52 rounded-full bg-red-900/20 ring-1 ring-red-700/40 flex items-center justify-center pulse-glow">
                  <div className="w-36 h-36 rounded-full bg-red-800/30 ring-1 ring-red-600/40 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-red-400" />
                  </div>
                </div>
                {/* Orbit badges */}
                {[
                  { label: 'ThreatFox', top: '-top-3', left: 'left-14' },
                  { label: 'URLhaus',   top: 'top-1/2', right: '-right-8' },
                  { label: 'Fraud IQ', bottom: '-bottom-3', left: 'left-10' },
                ].map(b => (
                  <div
                    key={b.label}
                    className={`absolute ${b.top ?? ''} ${b.bottom ?? ''} ${b.left ?? ''} ${b.right ?? ''}
                               bg-red-950 border border-red-700/60 rounded-full px-3 py-1
                               text-[10px] text-red-300 font-semibold shadow-lg`}
                  >
                    {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-red-950/50 border border-red-800/50
                              rounded-full px-3 py-1 text-[11px] text-red-300 mb-5">
                <Globe className="w-3 h-3" /> Inteligencia de amenazas global
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                Verificación de seguridad{' '}
                <span className="text-red-400">Abuse.ch</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Cada factura que ingresas es verificada automáticamente contra las bases de datos
                de inteligencia de amenazas de <strong className="text-red-300">Abuse.ch</strong> —
                el estándar global en detección de malware y fraude.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: ShieldCheck, label: 'ThreatFox API', desc: 'Verifica NITs/proveedores contra IOCs de malware activo' },
                  { icon: Globe,       label: 'URLhaus Check', desc: 'Detecta dominios y URLs asociados a campañas maliciosas' },
                  { icon: Lock,        label: 'Fraud Patterns', desc: 'Análisis de patrones locales: NITs sospechosos, nombres genéricos' },
                  { icon: CheckCircle2,label: 'Estado en tiempo real', desc: 'Limpio / Sospechoso / Peligroso — visible en el dashboard' },
                ].map(item => (
                  <li key={item.label} className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 rounded-md bg-red-900/40 ring-1 ring-red-700/40 shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <div>
                      <span className="text-white text-sm font-medium">{item.label}</span>
                      <p className="text-slate-500 text-xs">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <div className="wave-slow w-[200%]">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-14 block" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,20 C240,60 480,0 720,20 C960,40 1200,10 1440,30 L1440,60 L0,60 Z" fill="#020617" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────── */}
      <section className="relative bg-slate-950 px-6 md:px-12 py-24 overflow-hidden">
        <Orb className="w-80 h-80 bg-red-600/15 top-0 left-1/2 -translate-x-1/2 float-1" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Listo para empezar
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Accede con tus credenciales y comienza a registrar facturas con análisis de seguridad automático.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold
                       px-10 py-4 rounded-xl text-base transition-all hover:shadow-2xl
                       hover:shadow-red-600/40 hover:-translate-y-1"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Ingresar al Sistema
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-800/60 px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-red-500" />
            <span className="text-slate-400 text-sm">FacturasPro</span>
            <span className="text-slate-700 text-sm">— Sistema de registro de facturas</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>Laravel 12</span>
            <span>·</span>
            <span>Next.js 16</span>
            <span>·</span>
            <span className="text-red-700">Abuse.ch ThreatFox</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

