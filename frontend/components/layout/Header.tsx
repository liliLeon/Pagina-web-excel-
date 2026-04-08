'use client';

import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Bell } from 'lucide-react';
import { toast } from 'sonner';

export function Header() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace('/login');
    toast.success('Sesión cerrada');
  }

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
          <Bell className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-slate-400 hover:text-white hover:bg-slate-800 gap-1.5 text-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}
