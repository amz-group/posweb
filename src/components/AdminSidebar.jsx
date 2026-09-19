import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, KeyRound, History, LogOut, Menu, X, Store, Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import BrandLogo from '@/components/BrandLogo';

const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Systems', to: '/admin/systems', icon: Package },
  { label: 'Download Codes', to: '/admin/download-codes', icon: KeyRound },
  { label: 'Download History', to: '/admin/download-history', icon: History },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (to) => location.pathname === to;

  const handleLogout = () => {
    logout(false);
    navigate('/admin/login', { replace: true });
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/40 px-6">
        <BrandLogo size="md" subtitle="Admin Panel" />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border/40 p-4">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <Store className="h-4 w-4" />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex h-16 items-center justify-between border-b border-border/40 bg-card/40 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" showText={false} />
          <span className="font-heading text-sm font-bold">Admin Panel</span>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border">
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-border/40 bg-card shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
            {content}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-card/30 backdrop-blur-xl lg:block">
        <div className="sticky top-0 h-screen">{content}</div>
      </aside>
    </>
  );
}