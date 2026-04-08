<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Jobs\ValidateInvoiceJob;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\InvoicesExport;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');

        if ($request->filled('estado_validacion')) {
            $query->where('estado_validacion', $request->estado_validacion);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('proveedor', 'ilike', "%{$search}%")
                  ->orWhere('numero_factura', 'ilike', "%{$search}%")
                  ->orWhere('nit', 'ilike', "%{$search}%");
            });
        }

        $invoices = $query->paginate(15);

        return response()->json($invoices);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'numero_factura' => 'required|string|unique:invoices,numero_factura',
            'proveedor'      => 'required|string|max:255',
            'nit'            => 'required|string|max:20',
            'total'          => 'required|numeric|min:0',
            'fecha'          => 'required|date',
        ]);

        $data['user_id']            = $request->user()->id;
        $data['estado_validacion']  = 'pendiente';

        $invoice = Invoice::create($data);

        // Dispatch background validation job
        ValidateInvoiceJob::dispatch($invoice);

        return response()->json([
            'message' => 'Factura registrada. Validación en proceso.',
            'invoice' => $invoice,
        ], 201);
    }

    public function show(Request $request, Invoice $invoice)
    {
        $this->authorize('view', $invoice);
        return response()->json($invoice);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $data = $request->validate([
            'proveedor' => 'sometimes|string|max:255',
            'nit'       => 'sometimes|string|max:20',
            'total'     => 'sometimes|numeric|min:0',
            'fecha'     => 'sometimes|date',
        ]);

        $invoice->update($data);

        return response()->json($invoice);
    }

    public function destroy(Request $request, Invoice $invoice)
    {
        $this->authorize('delete', $invoice);
        $invoice->delete();

        return response()->json(['message' => 'Factura eliminada.']);
    }

    public function export(Request $request)
    {
        $invoices = Invoice::where('user_id', $request->user()->id)
            ->where('estado_validacion', 'correcto')
            ->get();

        // Mark as exported
        Invoice::where('user_id', $request->user()->id)
            ->where('estado_validacion', 'correcto')
            ->whereNull('exportado_excel')
            ->update(['exportado_excel' => true]);

        return Excel::download(new InvoicesExport($invoices), 'facturas_' . now()->format('Y-m-d') . '.xlsx');
    }

    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        $stats = [
            'total'       => Invoice::where('user_id', $userId)->count(),
            'correctas'   => Invoice::where('user_id', $userId)->where('estado_validacion', 'correcto')->count(),
            'errores'     => Invoice::where('user_id', $userId)->where('estado_validacion', 'error')->count(),
            'pendientes'  => Invoice::where('user_id', $userId)->where('estado_validacion', 'pendiente')->count(),
            'advertencias'=> Invoice::where('user_id', $userId)->where('estado_validacion', 'advertencia')->count(),
            'total_monto' => Invoice::where('user_id', $userId)->where('estado_validacion', 'correcto')->sum('total'),
        ];

        $monthly = Invoice::where('user_id', $userId)
            ->selectRaw("TO_CHAR(fecha, 'YYYY-MM') as mes, COUNT(*) as cantidad, SUM(total) as monto")
            ->groupBy('mes')
            ->orderBy('mes', 'desc')
            ->limit(6)
            ->get();

        return response()->json([
            'stats'   => $stats,
            'monthly' => $monthly,
        ]);
    }
}
