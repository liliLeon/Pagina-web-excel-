<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SecurityCheckService
{
    private const THREATFOX_URL = 'https://threatfox-api.abuse.ch/api/v1/';
    private const URLHAUS_URL   = 'https://urlhaus-api.abuse.ch/v1/host/';

    /**
     * Realiza revisión de seguridad del NIT y proveedor contra Abuse.ch ThreatFox.
     *
     * @return array{status: string, detalle: string, fuente: string}
     */
    public function check(string $nit, string $proveedor): array
    {
        try {
            // 1. Buscar NIT en ThreatFox (Indicador de Compromiso)
            $nitResult = $this->checkThreatFox($nit);
            if ($nitResult['found']) {
                return [
                    'status'  => 'peligroso',
                    'detalle' => "NIT detectado en ThreatFox Abuse.ch: {$nitResult['detail']}",
                    'fuente'  => 'ThreatFox',
                ];
            }

            // 2. Buscar nombre del proveedor en ThreatFox
            $provResult = $this->checkThreatFox($proveedor);
            if ($provResult['found']) {
                return [
                    'status'  => 'sospechoso',
                    'detalle' => "Proveedor marcado en ThreatFox Abuse.ch: {$provResult['detail']}",
                    'fuente'  => 'ThreatFox',
                ];
            }

            // 3. Validar patrones internos de fraude
            $fraudResult = $this->checkFraudPatterns($nit, $proveedor);
            if ($fraudResult['found']) {
                return [
                    'status'  => 'sospechoso',
                    'detalle' => $fraudResult['detail'],
                    'fuente'  => 'Revisión interna',
                ];
            }

            return [
                'status'  => 'limpio',
                'detalle' => 'NIT y proveedor verificados. Sin amenazas detectadas en Abuse.ch.',
                'fuente'  => 'ThreatFox + Revisión interna',
            ];

        } catch (\Throwable $e) {
            Log::warning("SecurityCheckService error: {$e->getMessage()}");

            return [
                'status'  => 'sospechoso',
                'detalle' => 'No se pudo contactar Abuse.ch. Revisión manual recomendada.',
                'fuente'  => 'Sin conexión',
            ];
        }
    }

    private function checkThreatFox(string $term): array
    {
        $response = Http::timeout(8)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post(self::THREATFOX_URL, [
                'query'       => 'search_ioc',
                'search_term' => $term,
            ]);

        if (!$response->successful()) {
            return ['found' => false, 'detail' => ''];
        }

        $data = $response->json();

        if (($data['query_status'] ?? '') === 'no_result') {
            return ['found' => false, 'detail' => ''];
        }

        $iocs = $data['data'] ?? [];
        if (!empty($iocs) && is_array($iocs)) {
            $first     = $iocs[0];
            $threatType = $first['threat_type_desc'] ?? 'amenaza desconocida';
            $malware   = $first['malware_printable'] ?? '';
            return [
                'found'  => true,
                'detail' => trim("{$threatType} — {$malware}"),
            ];
        }

        return ['found' => false, 'detail' => ''];
    }

    /**
     * Validaciones de fraude basadas en patrones locales.
     */
    private function checkFraudPatterns(string $nit, string $proveedor): array
    {
        // NIT con todos dígitos iguales (p.ej. 111111111, 999999999)
        if (preg_match('/^(\d)\1{8}$/', $nit)) {
            return [
                'found'  => true,
                'detail' => 'NIT sospechoso: todos los dígitos son iguales.',
            ];
        }

        // NIT secuencial (123456789 / 987654321)
        if (in_array($nit, ['123456789', '987654321', '000000000'], true)) {
            return [
                'found'  => true,
                'detail' => 'NIT genérico o de prueba detectado.',
            ];
        }

        // Proveedor vacío o genérico
        $genericNames = ['test', 'prueba', 'ejemplo', 'sample', 'demo', 'fake', 'xxx'];
        foreach ($genericNames as $generic) {
            if (stripos($proveedor, $generic) !== false) {
                return [
                    'found'  => true,
                    'detail' => "Nombre de proveedor genérico o de prueba: '{$proveedor}'.",
                ];
            }
        }

        return ['found' => false, 'detail' => ''];
    }
}
