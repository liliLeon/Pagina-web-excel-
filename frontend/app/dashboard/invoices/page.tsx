'use client';

import { usePathname } from 'next/navigation';
import InvoiceTable from '@/components/dashboard/InvoiceTable';
import { useCallback, useState } from 'react';
import { FileText } from 'lucide-react';

export default function InvoicesPage() {
  const [refresh, setRefresh] = useState(0);
  const onMutate = useCallback(() => setRefresh(r => r + 1), []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-red-400" />
        <h1 className="text-white font-bold text-lg">Todas las Facturas</h1>
      </div>
      <InvoiceTable key={refresh} onMutate={onMutate} />
    </div>
  );
}
