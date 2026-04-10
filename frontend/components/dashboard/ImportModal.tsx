'use client';

import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle2, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportModal({ open, onClose, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  function handleFile(f: File) {
    const allowed = ['xlsx', 'xls', 'csv'];
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    if (!allowed.includes(ext)) {
      toast.error('Solo se permiten archivos .xlsx, .xls o .csv');
      return;
    }
    setFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    try {
      const res = await api.invoices.import(file);
      toast.success(res.message);
      setFile(null);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al importar');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setFile(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) handleClose(); }}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Upload className="w-4 h-4 text-red-400" />
            Importar Facturas desde Excel
          </DialogTitle>
        </DialogHeader>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all
            ${dragging
              ? 'border-red-500 bg-red-500/10'
              : file
                ? 'border-emerald-600/60 bg-emerald-900/10'
                : 'border-slate-700 hover:border-red-700/60 hover:bg-red-900/5'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          {file ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <p className="text-white font-medium text-sm">{file.name}</p>
              <p className="text-slate-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
              <button
                onClick={e => { e.stopPropagation(); setFile(null); }}
                className="text-slate-500 hover:text-red-400 transition-colors mt-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FileSpreadsheet className="w-8 h-8 text-slate-500" />
              <p className="text-slate-300 text-sm font-medium">
                Arrastra tu archivo aquí
              </p>
              <p className="text-slate-600 text-xs">o haz clic para seleccionar</p>
              <p className="text-slate-700 text-[11px] mt-1">Formatos: .xlsx, .xls, .csv · Máx 5MB</p>
            </div>
          )}
        </div>

        {/* Column guide */}
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-3">
          <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-2">
            Columnas requeridas en el archivo
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {['numero_factura', 'proveedor', 'nit', 'total', 'fecha (opcional)'].map(col => (
              <p key={col} className="text-slate-400 text-xs font-mono">• {col}</p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || loading}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importando...</>
            ) : (
              <><Upload className="w-4 h-4 mr-1.5" /> Importar</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
