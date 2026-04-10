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
  CheckCircle2, XCircle, Clock, AlertTriangle, Download, Search,
  Trash2, ShieldCheck, ShieldAlert, ShieldOff, Shield,
  Upload, SlidersHorizontal, Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import InvoiceDetailModal from './InvoiceDetailModal';
import ImportModal from './ImportModal';

interface Props { onMutate: () => void; }

const STATUS_MAP = {
  correcto:    { label: 'Correcto',    icon: CheckCircle2,  className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  error:       { label: 'Error',       icon: XCircle,       className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  pendiente:   { label: 'Pendiente',   icon: Clock,         className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  advertencia: { label: 'Advertencia', icon: AlertTriangle, className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
};

const SEC_MAP = {
  limpio:     { icon: ShieldCheck, className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'Limpio'     },
  sospechoso: { icon: ShieldAlert, className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',   label: 'Sospechoso' },
  peligroso:  { icon: ShieldOff,   className: 'bg-red-500/15 text-red-400 border-red-500/30',            label: 'Peligroso'  },
  pendiente:  { icon: Shield,      className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',      label: 'Pendiente'  },
};

export default function InvoiceTable({ onMutate }: Props) {
  const [data, setData]           = useState<PaginatedResponse<Invoice> | null>(null);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [secFilter, setSecFilter] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [montoMin, setMontoMin]   = useState('');
  const [montoMax, setMontoMax]   = useState('');
  const [page, setPage]           = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected]   = useState<Invoice | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  async function load() {
    try {
      const res = await api.invoices.list({
        search:              search || undefined,
        estado_validacion:   status || undefined,
        revision_seguridad:  secFilter || undefined,
        fecha_desde:         fechaDesde || undefined,
        fecha_hasta:         fechaHasta || undefined,
        monto_min:           montoMin ? Number(montoMin) : undefined,
        monto_max:           montoMax ? Number(montoMax) : undefined,
        page,
      });
      setData(res);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al cargar facturas');
    }
  }

  useEffect(() => { load(); }, [search, status, secFilter, fechaDesde, fechaHasta, montoMin, montoMax, page]);

  function resetFilters() {
    setStatus(''); setSecFilter(''); setFechaDesde(''); setFechaHasta('');
    setMontoMin(''); setMontoMax(''); setSearch(''); setPage(1);
  }

  const hasActiveFilters = !!(status || secFilter || fechaDesde || fechaHasta || montoMin || montoMax);

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta factura? (Se puede recuperar)')) return;
    try {
      await api.invoices.delete(id);
      toast.success('Factura eliminada');
      onMutate();
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  const invoices = data?.data ?? [];

  return (
    <>
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            {/* Top bar */}
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
                    className="pl-8 h-8 text-xs bg-slate-800 border-slate-700 text-white w-40 focus:border-red-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(f => !f)}
                  className={`h-8 text-xs border-slate-700 gap-1.5 ${hasActiveFilters ? 'border-red-600 text-red-400 bg-red-900/20' : 'bg-slate-800 text-slate-300'}`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filtros {hasActiveFilters && '•'}
                </Button>
                <Button
                  onClick={() => setImportOpen(true)}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-slate-700 bg-slate-800 text-slate-300 hover:border-red-700/50 gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" /> Importar
                </Button>
                <Button
                  onClick={() => window.open(api.invoices.exportUrl(), '_blank')}
                  size="sm"
                  className="h-8 text-xs bg-red-700 hover:bg-red-600 text-white gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Excel
                </Button>
              </div>
            </div>

            {/* Advanced filters panel */}
            {showFilters && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-800">
                <Select value={status || 'all'} onValueChange={(v: string | null) => { setStatus(v && v !== 'all' ? v : ''); setPage(1); }}>
                  <SelectTrigger className="h-8 text-xs bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Validación" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="all">Todos estados</SelectItem>
                    <SelectItem value="correcto">Correcto</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="advertencia">Advertencia</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={secFilter || 'all'} onValueChange={(v: string | null) => { setSecFilter(v && v !== 'all' ? v : ''); setPage(1); }}>
                  <SelectTrigger className="h-8 text-xs bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Abuse.ch" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="all">Toda seguridad</SelectItem>
                    <SelectItem value="limpio">Limpio</SelectItem>
                    <SelectItem value="sospechoso">Sospechoso</SelectItem>
                    <SelectItem value="peligroso">Peligroso</SelectItem>
                    <SelectItem value="pendiente">Sin revisar</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={fechaDesde}
                  onChange={e => { setFechaDesde(e.target.value); setPage(1); }}
                  className="h-8 text-xs bg-slate-800 border-slate-700 text-white"
                  placeholder="Desde"
                />
                <Input
                  type="date"
                  value={fechaHasta}
                  onChange={e => { setFechaHasta(e.target.value); setPage(1); }}
                  className="h-8 text-xs bg-slate-800 border-slate-700 text-white"
                  placeholder="Hasta"
                />
                <Input
                  type="number"
                  value={montoMin}
                  onChange={e => { setMontoMin(e.target.value); setPage(1); }}
                  className="h-8 text-xs bg-slate-800 border-slate-700 text-white"
                  placeholder="Monto mín"
                />
                <div className="flex gap-1">
                  <Input
                    type="number"
                    value={montoMax}
                    onChange={e => { setMontoMax(e.target.value); setPage(1); }}
                    className="h-8 text-xs bg-slate-800 border-slate-700 text-white"
                    placeholder="Monto máx"
                  />
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="h-8 px-2 text-slate-500 hover:text-red-400 shrink-0"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              </div>
            )}
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
                  <TableCell colSpan={9} className="text-center text-slate-500 py-10">
                    No hay facturas registradas
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map(inv => {
                  const s = STATUS_MAP[inv.estado_validacion] ?? STATUS_MAP.pendiente;
                  const sec = SEC_MAP[inv.revision_seguridad ?? 'pendiente'] ?? SEC_MAP.pendiente;
                  const SIcon = s.icon;
                  const SecIcon = sec.icon;
                  return (
                    <TableRow
                      key={inv.id}
                      className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                      onClick={() => setSelected(inv)}
                    >
                      <TableCell className="text-slate-200 text-xs font-mono">{inv.numero_factura}</TableCell>
                      <TableCell className="text-slate-200 text-xs">{inv.proveedor}</TableCell>
                      <TableCell className="text-slate-400 text-xs font-mono">{inv.nit}</TableCell>
                      <TableCell className="text-slate-200 text-xs font-semibold">
                        ${Number(inv.total).toLocaleString('es-CO')}
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs">{inv.fecha}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] border gap-1 ${s.className}`}>
                          <SIcon className="w-2.5 h-2.5" />
                          {s.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] border gap-1 ${sec.className}`}
                          title={inv.detalle_seguridad ?? ''}
                        >
                          <SecIcon className="w-2.5 h-2.5" />
                          {sec.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs max-w-45 truncate">
                        {inv.mensaje_validacion}
                      </TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:text-red-400"
                            title="Ver detalle"
                            onClick={() => setSelected(inv)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:text-red-400"
                            title="Eliminar"
                            onClick={() => handleDelete(inv.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
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

      <InvoiceDetailModal invoice={selected} onClose={() => setSelected(null)} />
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={() => { onMutate(); load(); }}
      />
    </>
  );
}

