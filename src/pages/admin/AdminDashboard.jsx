import React, { useEffect, useState } from 'react';
import { Package, KeyRound, CheckCircle2, XCircle, Download, Activity } from 'lucide-react';
import { api } from '@/api/supabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ systems: 0, active: 0, used: 0, expired: 0, totalDownloads: 0 });
  const [recent, setRecent] = useState([]);
  const [hot, setHot] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.entities.System.list('-created_date', 500),
      api.entities.DownloadCode.list('-created_date', 500),
      api.entities.DownloadHistory.list('-created_date', 10)
    ]).then(([systems, codes, history]) => {
      const active = codes.filter((c) => c.status === 'Active').length;
      const used = codes.filter((c) => c.status === 'Used').length;
      const expired = codes.filter((c) => c.status === 'Expired').length;
      const totalDownloads = codes.reduce((sum, c) => sum + (c.current_downloads || 0), 0);
      const now = Date.now();
      const hotCount = codes.filter((c) => {
        if (c.status !== 'Active') return false;
        return true;
      }).length;
      setStats({ systems: systems.length, active, used, expired, totalDownloads });
      setHot(hotCount);
      setRecent(history || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Systems', value: stats.systems, icon: Package, color: 'text-primary' },
    { label: 'Active Codes', value: stats.active, icon: KeyRound, color: 'text-primary' },
    { label: 'Used Codes', value: stats.used, icon: CheckCircle2, color: 'text-accent' },
    { label: 'Expired Codes', value: stats.expired, icon: XCircle, color: 'text-destructive' },
    { label: 'Total Downloads', value: stats.totalDownloads, icon: Download, color: 'text-primary' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of your distribution ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <span className="text-sm font-medium text-primary">{hot} Active Codes</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Live Pulse</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </div>
            <div className="mt-3 font-heading text-3xl font-bold">{loading ? '—' : c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Recent Download Activity</h2>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card/40">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">No downloads yet.</div>
          ) : (
            <div className="divide-y divide-border/40">
              {recent.map((h) => (
                <div key={h.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><Download className="h-4 w-4 text-primary" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{h.system_name}</div>
                    <div className="truncate text-xs text-muted-foreground">{h.customer_name} · {h.code}</div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="font-mono text-xs text-muted-foreground">{h.download_date}</div>
                    <div className="font-mono text-[10px] text-muted-foreground/60">{h.download_time}</div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">{h.download_status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
