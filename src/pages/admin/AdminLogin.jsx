import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import BrandLogo from '@/components/BrandLogo';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If already logged in as admin, go to dashboard
    api.auth.isAuthenticated().then((authed) => {
      if (authed) {
        api.auth.me().then((u) => {
          if (u && (u.role === 'admin' || u.email === 'krdgroup_dev@gmail.com')) {
            navigate('/admin/dashboard', { replace: true });
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.auth.loginViaEmailPassword(email, password);
      // Hard redirect so auth context reinitializes
      const dest = location.state?.from || '/admin/dashboard';
      window.location.href = dest;
    } catch (err) {
      setError('Incorrect email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute left-1/3 top-2/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <BrandLogo size="lg" showText={false} />
          <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight">KRD GROUP</h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">Admin Panel</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <ShieldCheck className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="a-email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input id="a-email" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@krdgroup.com" className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="a-pass" className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input id="a-pass" type={show ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-11 text-sm focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_-6px_hsl(var(--primary))] disabled:opacity-60">
              {loading ? <><Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Logging in...</> : 'Login'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">Authorized personnel only</p>
      </div>
    </div>
  );
}
