<h1 align="center">🔴 Facturas Pro</h1>
<p align="center">
  <strong>Sistema empresarial de registro y validación automática de facturas en Excel</strong><br/>
  <sub>Dashboard moderno · API REST · Validación en background · Exportación Excel</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Laravel-12-red?style=for-the-badge&logo=laravel" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/SQLite%20%2F%20PostgreSQL-ready-green?style=for-the-badge&logo=postgresql" />
</p>

---

## 🎯 ¿Qué hace este sistema?

Inspirado en el flujo de **Power Automate + Excel Online**, pero 100% open-source y deployable:

```
Página Web ──► API Laravel ──► Validación Background ──► Excel / Dashboard
                   │                    │
              Sanctum Auth         Jobs (Queue)
                   │                    │
              PostgreSQL           SQLite (dev)
```

El usuario registra facturas desde el dashboard → el sistema las **valida automáticamente en segundo plano** (NIT, totales, duplicados) → resultado visible en tiempo real → exportación a `.xlsx` con un clic.

---

## 🖥️ Stack Tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| **Next.js 16** | SSR + App Router + rendimiento PRO |
| **React 19** | UI reactiva |
| **Tailwind CSS v4** | Diseño rápido, tema rojo |
| **ShadCN UI** | Componentes elegantes (Card, Table, Dialog, Select...) |
| **Recharts** | Gráficas tipo dashboard empresarial |
| **Lucide React** | Íconos limpios |
| **Sonner** | Notificaciones toast |

### Backend
| Tecnología | Uso |
|---|---|
| **Laravel 12** | API REST estructurada |
| **Laravel Sanctum** | Autenticación via Bearer Token |
| **Maatwebsite/Excel** | Exportación `.xlsx` con estilos |
| **Queue Jobs** | Validación de facturas en background |

### Base de Datos / Infra
| Tecnología | Uso |
|---|---|
| **SQLite** | Desarrollo local (zero config) |
| **PostgreSQL 16** | Producción / Supabase |
| **Redis** | Colas en producción (opcional) |
| **n8n** | Automatización (correos, webhooks, integraciones) |

---

## 🚀 Instalación y Arranque

### Requisitos
- PHP 8.3+
- Composer 2+
- Node.js 20+
- npm 10+

### 1. Clonar el repositorio

```bash
git clone https://github.com/liliLeon/Pagina-web-excel-.git
cd "Pagina-web-excel-"
```

### 2. Backend (Laravel)

```bash
cd backend

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Base de datos SQLite (dev)
php artisan migrate:fresh --seed

# Iniciar servidor
php artisan serve          # → http://localhost:8000

# Iniciar queue worker (validación en background)
php artisan queue:work
```

### 3. Frontend (Next.js)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev                # → http://localhost:3000
```

### 4. Todo junto (1 solo script)

```powershell
# Windows PowerShell
.\start.ps1
```

---

## 🔑 Credenciales de Prueba

| Campo | Valor |
|---|---|
| Email | `admin@facturas.pro` |
| Contraseña | `secret123` |

---

## 📁 Estructura del Proyecto

```
📦 Facturas Pro
├── 📂 backend/                    ← Laravel API REST
│   ├── app/
│   │   ├── Http/Controllers/API/
│   │   │   ├── AuthController.php     # Login / Logout / Me
│   │   │   └── InvoiceController.php  # CRUD + Stats + Export
│   │   ├── Jobs/
│   │   │   └── ValidateInvoiceJob.php # Validación async
│   │   ├── Models/
│   │   │   └── Invoice.php
│   │   ├── Exports/
│   │   │   └── InvoicesExport.php     # Excel con estilos
│   │   └── Policies/
│   │       └── InvoicePolicy.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env
│
├── 📂 frontend/                   ← Next.js Dashboard
│   ├── app/
│   │   ├── page.tsx               # Redirect root
│   │   ├── login/page.tsx         # Pantalla login (roja 🔴)
│   │   └── dashboard/
│   │       ├── layout.tsx         # Auth guard + Sidebar
│   │       └── page.tsx           # Dashboard principal
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── StatsCards.tsx     # KPIs (total, correctas, errores...)
│   │   │   ├── InvoiceChart.tsx   # Gráfica barras por mes
│   │   │   ├── InvoiceForm.tsx    # Formulario nueva factura
│   │   │   └── InvoiceTable.tsx   # Tabla con filtros + exportar
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   └── lib/
│       ├── api.ts                 # Cliente HTTP tipado
│       └── auth.ts                # Helpers auth (token)
│
├── 📄 docker-compose.yml          ← PostgreSQL + Redis + n8n
└── 📄 start.ps1                   ← Arranque con 1 clic
```

---

## 🔌 API REST

Base URL: `http://localhost:8000/api`

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/login` | Obtener Bearer token |
| `POST` | `/logout` | Invalidar token |
| `GET` | `/me` | Usuario autenticado |

### Facturas `🔒 requiere token`
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/invoices` | Listar (paginado, filtros) |
| `POST` | `/invoices` | Crear + lanzar validación |
| `PUT` | `/invoices/{id}` | Actualizar |
| `DELETE` | `/invoices/{id}` | Eliminar |
| `GET` | `/invoices-export` | Descargar `.xlsx` |
| `GET` | `/stats` | KPIs + datos mensuales |

### Ejemplo login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@facturas.pro","password":"secret123"}'
```

---

## ✅ Lógica de Validación (Background Job)

Cuando se crea una factura, `ValidateInvoiceJob` corre en segundo plano y verifica:

| Regla | Estado |
|---|---|
| NIT debe tener exactamente 9 dígitos | ❌ Error si falla |
| Total debe ser mayor a 0 | ❌ Error si falla |
| Total > $1,000,000,000 | ⚠️ Advertencia |
| Ya existe factura del mismo proveedor en el mismo mes | ⚠️ Advertencia |
| Todo correcto | ✅ Correcto |

---

## 🐳 Producción con Docker

```bash
# Levanta PostgreSQL + Redis + n8n
docker-compose up -d

# Luego actualizar .env del backend:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_DATABASE=facturas_db
# QUEUE_CONNECTION=redis
```

n8n disponible en `http://localhost:5678` (admin / secret123)

---

## 🔴 Paleta de Colores

El sistema usa un tema **rojo empresarial** sobre fondo oscuro:

| Elemento | Color |
|---|---|
| Primario | `red-600` #dc2626 |
| Hover | `red-500` #ef4444 |
| Acento | `red-400` #f87171 |
| Fondo | `slate-900` / `slate-950` |
| Texto | `white` / `slate-400` |

---

## 📜 Licencia

MIT — libre para uso personal y comercial.

---

<p align="center">Hecho con 🔴 y mucho café</p>