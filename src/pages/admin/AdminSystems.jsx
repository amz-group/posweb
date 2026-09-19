import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Power, Loader2, Package, X } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import SystemForm from '@/components/admin/SystemForm';
import { toast } from 'sonner';

export default function AdminSystems() {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | {} (new) | existing record
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.entities.System.list('-created_date', 500).then((d) => setSystems(d || [])).catch(() => toast.error('Failed to load systems')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await api.entities.System.update(editing.id, data);
        toast.success('System updated.');
      } else {
        await api.entities.System.create(data);
        toast.success('System added.');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save system.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
    try {
      await api.entities.System.delete(s.id);
      toast.success('System deleted.');
      load();
    } catch (err) {
      toast.error('Failed to delete.');
    }
  };

  const toggleStatus = async (s) => {
    const newStatus = s.status === 'active' ? 'disabled' : 'active';
    try {
      await api.entities.System.update(s.id, { status: newStatus });
      load();
      toast.success(newStatus === 'active' ? 'System enabled.' : 'System disabled.');
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Manage Systems</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add, edit, and control your software catalog.</p>
        </div>
        <Button onClick={() => setEditing({})}><Plus className="mr-2 h-4 w-4" /> Add System</Button>
      </div>

      {editing && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-card/40 p-6 backdrop-blur-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">{editing.id ? 'Edit System' : 'New System'}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
          <SystemForm initial={editing.id ? editing : {}} onSave={handleSave} onCancel={() => setEditing(null)} saving={saving} />
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card/40">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
        ) : systems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">No systems yet. Click "Add System" to create your first.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {systems.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/20">
                  {s.logo ? <Image src={s.logo} alt={s.name} className="h-full w-full object-cover" fittingType="fill" /> : <div className="flex h-full w-full items-center justify-center font-heading font-bold text-primary">{s.name?.charAt(0)}</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{s.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{s.status}</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-2 font-mono text-[11px] text-muted-foreground">
                    <span>v{s.version}</span><span>·</span><span>{s.platform}</span><span>·</span><span>{Number(s.price_iqd || 0).toLocaleString()} IQD</span>
                    {s.system_file_uri ? <><span>·</span><span className="text-primary">GitHub link attached</span></> : <><span>·</span><span className="text-destructive/70">No download link</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing(s)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary" title="Edit"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => toggleStatus(s)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary" title="Enable/Disable"><Power className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(s)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
