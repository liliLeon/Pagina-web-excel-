'use client';

import { useState } from 'react';
import { api, InvoiceFormData } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props { onSuccess: () => void; }

const empty: InvoiceFormData = {
  numero_factura: '',
  proveedor: '',
  nit: '',
  total: 0,
  fecha: new Date().toISOString().split('T')[0],
};

export function InvoiceForm({ onSuccess }: Props) {
  const [form, setForm]     = useState<InvoiceFormData>(empty);
  const [loading, setLoading] = useState(false);

  function set(key: keyof InvoiceFormData, value: string | number) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.invoices.create(form);
      toast.success(res.message);
      setForm(empty);
      onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al registrar factura');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-red-400" />
          Nueva Factura
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          {([
            { key: 'numero_factura', label: 'Nº Factura', placeholder: 'FAC-001', type: 'text' },
            { key: 'proveedor',      label: 'Proveedor',  placeholder: 'Empresa S.A.', type: 'text' },
            { key: 'nit',            label: 'NIT',        placeholder: '123456789', type: 'text' },
            { key: 'total',          label: 'Total ($)',  placeholder: '500000', type: 'number' },
            { key: 'fecha',          label: 'Fecha',      placeholder: '', type: 'date' },
          ] as const).map(({ key, label, placeholder, type }) => (
            <div key={key} className="space-y-1">
              <Label className="text-slate-400 text-xs">{label}</Label>
              <Input
                type={type}
                value={String(form[key])}
                onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
                placeholder={placeholder}
                required
                min={type === 'number' ? 0 : undefined}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-red-500 h-9 text-sm"
              />
            </div>
          ))}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white h-9 text-sm font-semibold mt-1"
          >
            {loading ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Validando...</> : 'Registrar Factura'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
