'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  data: { mes: string; cantidad: number; monto: number }[];
}

export function InvoiceChart({ data }: Props) {
  const formatted = [...data].reverse().map(d => ({
    ...d,
    mes: d.mes.slice(0, 7),
    monto: Number(d.monto),
  }));

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base font-semibold">
          Facturas por Mes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="mes" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#94a3b8' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="cantidad" name="Facturas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="monto" name="Monto ($)" fill="#b91c1c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
