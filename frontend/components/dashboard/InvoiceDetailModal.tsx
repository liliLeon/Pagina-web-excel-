'use client';

import { Invoice } from '@/lib/api';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2, XCircle, Clock, AlertTriangle,
  ShieldCheck, ShieldAlert, ShieldOff, Shield,
  FileText, Building2, Hash, DollarSign, Calendar, Info,
} from 'lucide-react';

interface Props {
  invoice: Invoice | null;
  onClose: () => void;
}

const STATUS_MAP = {
  correcto:    { label: 'Correcto',    icon: CheckCircle2,  cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  error:       { label: 'Error',       icon: XCircle,       cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  pendiente:   { label: 'Pendiente',   icon: Clock,         cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  advertencia: { label: 'Advertencia', icon: AlertTriangle, cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
};

const SEC_MAP = {
  limpio:     { label: 'Limpio - Sin amenazas',     icon: ShieldCheck, cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  sospechoso: { label: 'Sospechoso',                icon: ShieldAlert, cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  peligroso:  { label: 'Peligroso - Amenaza activa',icon: ShieldOff,   cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  pendiente:  { label: 'Pendiente de revisión',     icon: Shield,      cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
};

function Field({
  icon: Icon, label, value, mono = false,
}: {
  icon: React.ElementType; label: string; value: React.ReactNode; mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800/80 last:border-0">
      <div className="p-1.5 rounded-md bg-slate-800 mt-0.5 shrink-0">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className={`text-white text-sm wrap-break-word ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  );
}

export default function InvoiceDetailModal({ invoice, onClose }: Props) {
  if (!invoice) return null;

  const status = STATUS_MAP[invoice.estado_validacion] ?? STATUS_MAP.pendiente;
  const security = SEC_MAP[invoice.revision_seguridad ?? 'pendiente'] ?? SEC_MAP.pendiente;
  const StatusIcon = status.icon;
  const SecIcon = security.icon;

  return (
    <Dialog open={!!invoice} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileText className="w-4 h-4 text-red-400" />
            Factura {invoice.numero_factura}
          </DialogTitle>
        </DialogHeader>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
          <Badge className={`text-xs border gap-1.5 ${status.cls}`}>
            <StatusIcon className="w-3 h-3" />
            Validación: {status.label}
          </Badge>
          <Badge className={`text-xs border gap-1.5 ${security.cls}`}>
            <SecIcon className="w-3 h-3" />
            Abuse.ch: {security.label}
          </Badge>
        </div>

        {/* Fields */}
        <div className="divide-y divide-slate-800/0">
          <Field icon={FileText}   label="Número de Factura" value={invoice.numero_factura} mono />
          <Field icon={Building2}  label="Proveedor"          value={invoice.proveedor} />
          <Field icon={Hash}       label="NIT"                value={invoice.nit} mono />
          <Field
            icon={DollarSign}
            label="Total"
            value={`$${Number(invoice.total).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
          />
          <Field icon={Calendar}   label="Fecha"              value={invoice.fecha} />
          {invoice.mensaje_validacion && (
            <Field icon={Info} label="Observación de validación" value={invoice.mensaje_validacion} />
          )}
          {invoice.detalle_seguridad && (
            <Field icon={SecIcon} label="Detalle Abuse.ch" value={invoice.detalle_seguridad} />
          )}
          <Field
            icon={Calendar}
            label="Registrada"
            value={new Date(invoice.created_at).toLocaleString('es-CO')}
          />
        </div>

        {/* Security warning box */}
        {(invoice.revision_seguridad === 'peligroso' || invoice.revision_seguridad === 'sospechoso') && (
          <div className={`rounded-xl p-3 border text-xs leading-relaxed
            ${invoice.revision_seguridad === 'peligroso'
              ? 'bg-red-950/40 border-red-700/50 text-red-300'
              : 'bg-yellow-950/40 border-yellow-700/50 text-yellow-300'
            }`}>
            <div className="flex items-center gap-1.5 font-semibold mb-1">
              <SecIcon className="w-3.5 h-3.5" />
              {invoice.revision_seguridad === 'peligroso'
                ? 'Alerta de seguridad — Revisión manual obligatoria'
                : 'Advertencia de seguridad — Verificar proveedor'
              }
            </div>
            <p className="text-slate-400 text-[11px]">
              {invoice.detalle_seguridad ?? 'Este proveedor/NIT fue marcado por Abuse.ch ThreatFox.'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
