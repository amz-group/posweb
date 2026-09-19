import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Copy, Eye, Power, Trash2, X, KeyRound, Loader2 } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { generateDownloadCode } from '@/lib/codeGen';
import { toast } from 'sonner';

const MAX_OPTIONS = [1, 2, 3, 5, 10, -1];

export default function AdminDownloadCodes() {
  const [codes, setCodes] = useState([]);
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showGen, setShowGen] = useState(false);
  const [viewCode, setViewCode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [gen, setGen] = useState({ system_id: '', customer_name: '', customer_phone: '', max_downloads: 1, custom_max: '', expiration_date: '', use_custom: false });

  useEffect(() => {
    Promise.all([
      api.entities.DownloadCode.list('-created_date', 500),
      api.entities.System.list('-created_date', 500)
    ]).then(([c, s]) => { setCodes(c || []); setSystems(s || []); }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return codes;
    const q = query.toLowerCase();
    return codes.filter((c) =>
      c.code?.toLowerCase().includes(q) ||
      c.customer_name?.toLowerCase().includes(q) ||
      c.customer_phone?.toLowerCase().includes(q) ||
      c.system_name?.toLowerCase().includes(q)
    );
  }, [codes, query]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!gen.system_id) { toast.error('Select a system.'); return; }
    setSaving(true);
    try {
      const sys = systems.find((s) => s.id === gen.system_id);
      let max = gen.use_custom ? Number(gen.custom_max) : gen.max_downloads;
      if (gen.use_custom && (!max || max < 1)) { toast.error('Enter a valid custom max.'); setSaving(false); return; }
      // Generate unique code (retry on collision)
      let code, attempts = 0, exists = true;
      while (exists && attempts < 5) {
        code = generateDownloadCode();
        const check = await api.entities.DownloadCode.filter({ code });
        exists = check && check.length > 0;
        attempts++;
      }
      await api.entities.DownloadCode.create({
        code,
        system_id: gen.system_id,
        system_name: sys?.name || '',
        customer_name: gen.customer_name || '',
        customer_phone: gen.customer_phone || '',
        expiration_date: gen.expiration_date || null,
        max_downloads: max,
        current_downloads: 0,
        status: 'Active'
      });
      toast.success(`Code generated: ${code}`);
      setShowGen(false);
      setGen({ system_id: '', customer_name: '', customer_phone: '', max_downloads: 1, custom_max: '', expiration_date: '', use_custom: false });
      const fresh = await api.entities.DownloadCode.list('-created_date', 500);
      setCodes(fresh || []);
    } catch (err) {
      toast.error(err.message || 'Failed to generate code.');
    } finally {
      setSaving(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard.');
  };

  const toggleStatus = async (c) => {
    const newStatus = c.status === 'Disabled' ? 'Active' : 'Disabled';
    try {
      await api.entities.DownloadCode.update(c.id, { status: newStatus });
      setCodes((prev) => prev.map((x) => x.id === c.id ? { ...x, status: newStatus } : x));
      toast.success(newStatus === 'Active' ? 'Code enabled.' : 'Code disabled.');
    } catch (err) { toast.error('Failed to update.'); }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Delete code ${c.code}?`)) return;
    try {
      await api.entities.DownloadCode.delete(c.id);
      setCodes((prev) => prev.filter((x) => x.id !== c.id));
      toast.success('Code deleted.');
    } catch (err) { toast.error('Failed to delete.'); }
  };

  const statusColor = (s) => ({
    Active: 'bg-primary/10 text-primary',
    Used: 'bg-accent/10 text-accent',
    Expired: 'bg-destructive/10 text-destructive',
    Disabled: 'bg-muted text-muted-foreground'
  }[s] || 'bg-muted text-muted-foreground');

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Download Codes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Generate and manage secure download codes.</p>
        </div>
        <Button onClick={() => setShowGen(true)}><Plus className="mr-2 h-4 w-4" /> Generate New Code</Button>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by code, customer, phone, system..." className="h-11 w-full rounded-xl border border-border bg-card/40 pl-11 pr-4 text-sm focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-card/40">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <KeyRound className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">No codes found.</p>
          </div>
        ) : (
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border/40 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">System</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Downloads</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3"><span className="font-mono font-semibold text-primary">{c.code}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.system_name}</td>
                  <td className="px-4 py-3">{c.customer_name || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.customer_phone || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.created_date?.slice(0, 10)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.expiration_date?.slice(0, 10) || 'Never'}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.current_downloads || 0}/{c.max_downloads === -1 ? '∞' : c.max_downloads}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(c.status)}`}>{c.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => copyCode(c.code)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary" title="Copy"><Copy className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setViewCode(c)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary" title="View"><Eye className="h-3.5 w-3.5" /></button>
                      <button onClick={() => toggleStatus(c)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary" title="Enable/Disable"><Power className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(c)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Generate modal */}
      {showGen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowGen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-border/60 bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">Generate New Code</h2>
              <button onClick={() => setShowGen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">System *</label>
                <select required value={gen.system_id} onChange={(e) => setGen({ ...gen, system_id: e.target.value })} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Select a system...</option>
                  {systems.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Name</label>
                  <input value={gen.customer_name} onChange={(e) => setGen({ ...gen, customer_name: e.target.value })} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Phone</label>
                  <input value={gen.customer_phone} onChange={(e) => setGen({ ...gen, customer_phone: e.target.value })} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Downloads</label>
                <div className="flex flex-wrap gap-2">
                  {MAX_OPTIONS.map((m) => (
                    <button type="button" key={m} onClick={() => setGen({ ...gen, max_downloads: m, use_custom: false })} className={`rounded-lg border px-3 py-1.5 text-sm ${!gen.use_custom && gen.max_downloads === m ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                      {m === -1 ? 'Unlimited' : m}
                    </button>
                  ))}
                  <button type="button" onClick={() => setGen({ ...gen, use_custom: true })} className={`rounded-lg border px-3 py-1.5 text-sm ${gen.use_custom ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>Custom</button>
                  {gen.use_custom && <input type="number" min="1" value={gen.custom_max} onChange={(e) => setGen({ ...gen, custom_max: e.target.value })} className="h-9 w-20 rounded-lg border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="N" />}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiration Date</label>
                <input type="datetime-local" value={gen.expiration_date} onChange={(e) => setGen({ ...gen, expiration_date: e.target.value })} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />} Generate Code
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setViewCode(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">Code Details</h2>
              <button onClick={() => setViewCode(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Download Code</div>
                <div className="mt-1 font-mono text-xl font-bold tracking-wider text-primary">{viewCode.code}</div>
                <button onClick={() => copyCode(viewCode.code)} className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"><Copy className="h-3 w-3" /> Copy Code</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><div className="font-mono text-[10px] uppercase text-muted-foreground">System</div><div className="font-medium">{viewCode.system_name}</div></div>
                <div><div className="font-mono text-[10px] uppercase text-muted-foreground">Customer</div><div className="font-medium">{viewCode.customer_name || '—'}</div></div>
                <div><div className="font-mono text-[10px] uppercase text-muted-foreground">Phone</div><div className="font-medium">{viewCode.customer_phone || '—'}</div></div>
                <div><div className="font-mono text-[10px] uppercase text-muted-foreground">Status</div><div className="font-medium">{viewCode.status}</div></div>
                <div><div className="font-mono text-[10px] uppercase text-muted-foreground">Downloads</div><div className="font-medium">{viewCode.current_downloads || 0} / {viewCode.max_downloads === -1 ? '∞' : viewCode.max_downloads}</div></div>
                <div><div className="font-mono text-[10px] uppercase text-muted-foreground">Expires</div><div className="font-medium">{viewCode.expiration_date?.slice(0, 10) || 'Never'}</div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
