'use client';

import Link from 'next/link';
import { LayoutDashboard, FileText, FileSpreadsheet, Settings } from 'lucide-react';

const NAV = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/invoices', icon: FileText, label: 'Facturas' },
];

interface Props { currentPath: string; }

export function Sidebar({ currentPath }: Props) {
  return (
    <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-5 border-b border-slate-800 gap-2.5">
        <FileSpreadsheet className="w-6 h-6 text-red-400 shrink-0" />
        <span className="font-bold text-white text-sm">Facturas Pro</span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = currentPath === href || currentPath.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-red-600/20 text-red-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4 shrink-0" />
          Configuración
        </Link>
      </div>
    </aside>
  );
}
