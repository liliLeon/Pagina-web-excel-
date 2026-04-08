<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_factura',
        'proveedor',
        'nit',
        'total',
        'fecha',
        'estado_validacion',
        'mensaje_validacion',
        'exportado_excel',
        'user_id',
    ];

    protected $casts = [
        'fecha' => 'date',
        'total' => 'decimal:2',
        'exportado_excel' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
