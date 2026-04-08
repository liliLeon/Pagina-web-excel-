'use client';

import { useEffect, useState } from 'react';
import { api, StatsResponse } from '@/lib/api';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { InvoiceChart } from '@/components/dashboard/InvoiceChart';
import { InvoiceForm } from '@/components/dashboard/InvoiceForm';
import { InvoiceTable } from '@/components/dashboard/InvoiceTable';

export default function DashboardPage() {
  const [stats, setStats]         = useState<StatsResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.invoices.stats().then(setStats).catch(console.error);
  }, [refreshKey]);

  function refresh() {
    setRefreshKey(k => k + 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Registro de Facturas en Excel — tiempo real</p>
      </div>

      <StatsCards stats={stats?.stats ?? null} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <InvoiceChart data={stats?.monthly ?? []} />
        </div>
        <div>
          <InvoiceForm onSuccess={refresh} />
        </div>
      </div>

      <InvoiceTable key={refreshKey} onMutate={refresh} />
    </div>
  );
}
