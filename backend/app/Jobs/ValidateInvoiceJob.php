<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Services\SecurityCheckService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ValidateInvoiceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;

    public function __construct(public Invoice $invoice)
    {
    }

    public function handle(): void
    {
        try {
            $errors   = [];
            $warnings = [];

            // ── 1. Validaciones de datos ──────────────────────────────────
            if (!preg_match('/^\d{9}$/', $this->invoice->nit)) {
                $errors[] = 'NIT inválido: debe tener exactamente 9 dígitos numéricos.';
            }

            if ($this->invoice->total <= 0) {
                $errors[] = 'El total debe ser mayor a cero.';
            }

            if ($this->invoice->total > 1_000_000_000) {
                $warnings[] = 'Total inusualmente alto (> $1,000,000,000). Verificar.';
            }

            $duplicado = Invoice::where('proveedor', $this->invoice->proveedor)
                ->where('id', '!=', $this->invoice->id)
                ->whereMonth('fecha', $this->invoice->fecha->month)
                ->whereYear('fecha', $this->invoice->fecha->year)
                ->exists();

            if ($duplicado) {
                $warnings[] = 'Ya existe una factura de este proveedor en el mismo mes.';
            }

            // ── 2. Revisión de seguridad Abuse.ch ─────────────────────────
            $security = app(SecurityCheckService::class)->check(
                $this->invoice->nit,
                $this->invoice->proveedor
            );

            $this->invoice->update([
                'revision_seguridad' => $security['status'],
                'detalle_seguridad'  => "[{$security['fuente']}] {$security['detalle']}",
            ]);

            // Si es peligroso, se marca como error automáticamente
            if ($security['status'] === 'peligroso') {
                $errors[] = "SEGURIDAD: {$security['detalle']}";
            } elseif ($security['status'] === 'sospechoso') {
                $warnings[] = "SEGURIDAD: {$security['detalle']}";
            }

            // ── 3. Resultado final ────────────────────────────────────────
            if (!empty($errors)) {
                $this->invoice->update([
                    'estado_validacion'  => 'error',
                    'mensaje_validacion' => implode(' | ', $errors),
                ]);
            } elseif (!empty($warnings)) {
                $this->invoice->update([
                    'estado_validacion'  => 'advertencia',
                    'mensaje_validacion' => implode(' | ', $warnings),
                ]);
            } else {
                $this->invoice->update([
                    'estado_validacion'  => 'correcto',
                    'mensaje_validacion' => 'Validación y revisión de seguridad exitosa.',
                ]);
            }

        } catch (\Throwable $e) {
            Log::error("ValidateInvoiceJob failed for invoice #{$this->invoice->id}: {$e->getMessage()}");

            $this->invoice->update([
                'estado_validacion'  => 'error',
                'mensaje_validacion' => 'Error interno durante la validación.',
                'revision_seguridad' => 'sospechoso',
            ]);
        }
    }
}
