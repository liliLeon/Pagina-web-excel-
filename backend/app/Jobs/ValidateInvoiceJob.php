<?php

namespace App\Jobs;

use App\Models\Invoice;
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
            $errors = [];
            $warnings = [];

            // Validate NIT format (9 digits)
            if (!preg_match('/^\d{9}$/', $this->invoice->nit)) {
                $errors[] = 'NIT inválido: debe tener exactly 9 dígitos numéricos.';
            }

            // Validate total is positive
            if ($this->invoice->total <= 0) {
                $errors[] = 'El total debe ser mayor a cero.';
            }

            // Warn if total is unusually high (> 1,000,000,000)
            if ($this->invoice->total > 1_000_000_000) {
                $warnings[] = 'Total inusualmente alto (> $1,000,000,000). Verificar.';
            }

            // Check for duplicate proveedor + same month
            $duplicado = Invoice::where('proveedor', $this->invoice->proveedor)
                ->where('id', '!=', $this->invoice->id)
                ->whereMonth('fecha', $this->invoice->fecha->month)
                ->whereYear('fecha', $this->invoice->fecha->year)
                ->exists();

            if ($duplicado) {
                $warnings[] = 'Ya existe una factura de este proveedor en el mismo mes.';
            }

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
                    'mensaje_validacion' => 'Validación exitosa.',
                ]);
            }
        } catch (\Throwable $e) {
            Log::error("ValidateInvoiceJob failed for invoice #{$this->invoice->id}: {$e->getMessage()}");

            $this->invoice->update([
                'estado_validacion'  => 'error',
                'mensaje_validacion' => 'Error interno durante la validación.',
            ]);
        }
    }
}
