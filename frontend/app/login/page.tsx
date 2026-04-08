'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('admin@facturas.pro');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-red-950 to-slate-900">
      <Card className="w-full max-w-md shadow-2xl border-blue-900/40 bg-slate-900/80 backdrop-blur">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-red-600/20 ring-1 ring-red-500/40">
              <FileSpreadsheet className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Facturas Pro</CardTitle>
          <CardDescription className="text-slate-400">
            Registro automático de facturas en Excel
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@facturas.pro"
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold h-11"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Ingresando...</>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
