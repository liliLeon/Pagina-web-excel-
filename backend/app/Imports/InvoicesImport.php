<?php

namespace App\Imports;

use App\Jobs\ValidateInvoiceJob;
use App\Models\Invoice;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class InvoicesImport implements ToModel, WithHeadingRow, SkipsEmptyRows
{
    private int $userId;
    private array $imported = [];

    public function __construct(int $userId)
    {
        $this->userId = $userId;
    }

    public function model(array $row): ?Invoice
    {
        // Accept both snake_case and human-readable headers
        $numero   = $row['numero_factura'] ?? $row['numero'] ?? $row['factura'] ?? null;
        $proveedor = $row['proveedor'] ?? $row['provider'] ?? null;
        $nit      = $row['nit'] ?? null;
        $total    = $row['total'] ?? $row['monto'] ?? $row['valor'] ?? null;
        $fecha    = $row['fecha'] ?? $row['date'] ?? now()->format('Y-m-d');

        if (!$numero || !$proveedor || !$nit || $total === null) {
            return null;
        }

        // Skip duplicates
        if (Invoice::withTrashed()->where('numero_factura', $numero)->exists()) {
            return null;
        }

        $invoice = new Invoice([
            'numero_factura'    => (string) $numero,
            'proveedor'         => (string) $proveedor,
            'nit'               => (string) $nit,
            'total'             => (float) $total,
            'fecha'             => $fecha,
            'user_id'           => $this->userId,
            'estado_validacion' => 'pendiente',
        ]);

        $invoice->save();

        ValidateInvoiceJob::dispatch($invoice);

        $this->imported[] = $invoice->id;

        return null; // Handled manually
    }

    public function getImportedCount(): int
    {
        return count($this->imported);
    }
}
