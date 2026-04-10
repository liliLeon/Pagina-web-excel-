'use client';

import { useEffect, useState } from 'react';
import { api, Invoice, PaginatedResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2, XCircle, Clock, AlertTriangle, Download, Search, Trash2, ShieldCheck, ShieldAlert, ShieldOff, Shield,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props { onMutate: () => void; }

const STATUS_MAP = {
  correcto:     { label: 'Correcto',     icon: CheckCircle2,  variant: 'default'     as const, className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  error:        { label: 'Error',        icon: XCircle,       variant: 'destructive' as const, className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  pendiente:    { label: 'Pendiente',    icon: Clock,         variant: 'secondary'   as const, className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  advertencia:  { label: 'Advertencia', icon: AlertTriangle, variant: 'secondary'   as const, className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
};

const SEC_MAP = {
  limpio:      { icon: ShieldCheck,  className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'Limpio'      },
  sospechoso:  { icon: ShieldAlert,  className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',   label: 'Sospechoso'  },
  peligroso:   { icon: ShieldOff,    className: 'bg-red-500/15 text-red-400 border-red-500/30',            label: 'Peligroso'   },
  pendiente:   { icon: Shield,       className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',      label: 'Pendiente'   },
};

export default function InvoiceTable({ onMutate }: Props) {
  const [data, setData]     = useState<PaginatedResponse<Invoice> | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage]     = useState(1);

  async function load() {
    try {
      const res = await api.invoices.list({
        search:              search || undefined,
        estado_validacion:   status || undefined,
        page,
      });
      setData(res);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al cargar facturas');
    }
  }

  useEffect(() => { load(); }, [search, status, page]);

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta factura?')) return;
    try {
      await api.invoices.delete(id);
      toast.success('Factura eliminada');
      onMutate();
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  function handleExport() {
    window.open(api.invoices.exportUrl(), '_blank');
  }

  const invoices = data?.data ?? [];

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-white text-base font-semibold">
            Facturas Registradas
            {data && <span className="text-slate-400 text-sm font-normal ml-2">({data.total})</span>}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <Input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar..."
                className="pl-8 h-8 text-xs bg-slate-800 border-slate-700 text-white w-44 focus:border-red-500"
              />
            </div>

            <Select value={status || 'all'} onValueChange={(v: string | null) => { setStatus(v && v !== 'all' ? v : ''); setPage(1); }}>
              <SelectTrigger className="h-8 text-xs bg-slate-800 border-slate-700 text-white w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="correcto">Correcto</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="advertencia">Advertencia</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleExport}
              size="sm"
              className="h-8 text-xs bg-red-700 hover:bg-red-600 text-white gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Excel
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              {['Nº Factura', 'Proveedor', 'NIT', 'Total', 'Fecha', 'Validación', 'Abuse.ch', 'Observación', ''].map(h => (
                <TableHead key={h} className="text-slate-400 text-xs font-semibold">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                  No hay facturas registradas
                </TableCell>
              </TableRow>
            ) : (
              invoices.map(inv => {
                const s = STATUS_MAP[inv.estado_validacion];
                const Icon = s.icon;
                return (
                  <TableRow key={inv.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-slate-200 text-xs font-mono">{inv.numero_factura}</TableCell>
                    <TableCell className="text-slate-200 text-xs">{inv.proveedor}</TableCell>
                    <TableCell className="text-slate-400 text-xs font-mono">{inv.nit}</TableCell>
                    <TableCell className="text-slate-200 text-xs font-semibold">
                      ${Number(inv.total).toLocaleString('es-CO')}
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs">{inv.fecha}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] border gap-1 ${s.className}`}>
                        <Icon className="w-2.5 h-2.5" />
                        {s.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const sec = SEC_MAP[inv.revision_seguridad ?? 'pendiente'];
                        const SecIcon = sec.icon;
                        return (
                          <Badge
                            className={`text-[10px] border gap-1 ${sec.className}`}
                            title={inv.detalle_seguridad ?? ''}
                          >
                            <SecIcon className="w-2.5 h-2.5" />
                            {sec.label}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs max-w-45 truncate">
                      {inv.mensaje_validacion}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-red-400"
                        onClick={() => handleDelete(inv.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {data && data.last_page > 1 && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-300"
            >Anterior</Button>
            <span className="text-xs text-slate-400">{page} / {data.last_page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
              disabled={page === data.last_page}
              className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-300"
            >Siguiente</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
