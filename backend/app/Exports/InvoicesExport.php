<?php

namespace App\Exports;

use App\Models\Invoice;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InvoicesExport implements FromCollection, WithHeadings, WithStyles, WithTitle
{
    public function __construct(private Collection $invoices)
    {
    }

    public function collection(): Collection
    {
        return $this->invoices->map(fn ($inv) => [
            $inv->numero_factura,
            $inv->proveedor,
            $inv->nit,
            number_format($inv->total, 2, '.', ','),
            $inv->fecha->format('d/m/Y'),
            ucfirst($inv->estado_validacion),
            $inv->mensaje_validacion,
        ]);
    }

    public function headings(): array
    {
        return [
            'Nº Factura',
            'Proveedor',
            'NIT',
            'Total',
            'Fecha',
            'Estado',
            'Observaciones',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font'      => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill'      => ['fillType' => 'solid', 'color' => ['rgb' => '1e3a5f']],
                'alignment' => ['horizontal' => 'center'],
            ],
        ];
    }

    public function title(): string
    {
        return 'Facturas';
    }
}
