import React, { useEffect, useState, useMemo } from 'react';
import { Search, History, Loader2, Download } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import { toast } from 'sonner';

export default function AdminDownloadHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.entities.DownloadHistory.list('-created_date', 500).then((d) => setHistory(d || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return history;
    const q = query.toLowerCase();
    return history.filter((h) =>
      h.code?.toLowerCase().includes(q) ||
      h.system_name?.toLowerCase().includes(q) ||
      h.customer_name?.toLowerCase().includes(q)
    );
  }, [history, query]);

  return (
    <div className="p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Download History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every download recorded with full traceability.</p>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by code, system, customer..." className="h-11 w-full rounded-xl border border-border bg-card/40 pl-11 pr-4 text-sm focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-card/40">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <History className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">No download records yet.</p>
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-border/40 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">System</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((h) => (
                <tr key={h.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3"><span className="font-mono font-semibold text-primary">{h.code}</span></td>
                  <td className="px-4 py-3">{h.system_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{h.customer_name || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{h.download_date}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{h.download_time}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                      <Download className="h-3 w-3" /> {h.download_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
