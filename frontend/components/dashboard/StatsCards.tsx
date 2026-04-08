'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react';

interface Props {
  stats: {
    total: number;
    correctas: number;
    errores: number;
    pendientes: number;
    advertencias: number;
    total_monto: number;
  } | null;
}

export function StatsCards({ stats }: Props) {
  const cards = [
    {
      label: 'Total Facturas',
      value: stats?.total ?? '—',
      icon: FileText,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
    {
      label: 'Correctas',
      value: stats?.correctas ?? '—',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Con Error',
      value: stats?.errores ?? '—',
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
    {
      label: 'Pendientes',
      value: stats?.pendientes ?? '—',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Monto Total',
      value: stats
        ? `$${Number(stats.total_monto).toLocaleString('es-CO', { minimumFractionDigits: 0 })}`
        : '—',
      icon: DollarSign,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="bg-slate-900 border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium">{label}</p>
              <p className="text-white text-xl font-bold">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
