import React, { useState, useRef } from 'react';
import { Upload, Loader2, X, ImagePlus, Link2 } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const PLATFORMS = ['Windows', 'macOS', 'Linux', 'Android', 'iOS', 'Web', 'Cross-platform'];

export default function SystemForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name: '',
    logo: '',
    short_description: '',
    full_description: '',
    price_iqd: 0,
    version: '1.0',
    platform: 'Windows',
    file_size: '',
    features: [],
    screenshots: [],
    system_file_uri: '',
    system_file_name: '',
    status: 'active',
    last_update: new Date().toISOString().slice(0, 10),
    ...initial,
  });
  const [featuresText, setFeaturesText] = useState((initial?.features || []).join('\n'));
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingShots, setUploadingShots] = useState([]);
  const logoRef = useRef(null);
  const shotsRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const { file_url } = await api.storage.uploadPublicFile(file);
      set('logo', file_url);
    } catch (err) {
      toast.error('Logo upload failed.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleShots = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingShots(files.map(() => true));
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const { file_url } = await api.storage.uploadPublicFile(files[i]);
        urls.push(file_url);
      } catch (err) {
        toast.error(`Screenshot ${i + 1} upload failed.`);
      }
      setUploadingShots((prev) => prev.map((_, idx) => idx <= i ? false : true));
    }
    set('screenshots', [...form.screenshots, ...urls]);
    setUploadingShots([]);
  };

  const handleDownloadLink = (value) => {
    setForm((current) => {
      let fileName = current.system_file_name;
      try {
        const pathname = new URL(value).pathname;
        fileName = decodeURIComponent(pathname.split('/').filter(Boolean).pop() || '');
      } catch {
        // Keep the current file name while the user is still typing the URL.
      }
      return { ...current, system_file_uri: value, system_file_name: fileName };
    });
  };

  const submit = (e) => {
    e.preventDefault();
    const features = featuresText.split('\n').map((f) => f.trim()).filter(Boolean);
    onSave({ ...form, features, price_iqd: Number(form.price_iqd) || 0 });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>System Name *</Label>
          <Input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="KRD MARKET POS" />
        </div>
        <div className="space-y-2">
          <Label>Platform</Label>
          <select value={form.platform} onChange={(e) => set('platform', e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Short Description</Label>
        <Input value={form.short_description} onChange={(e) => set('short_description', e.target.value)} placeholder="One-line summary" />
      </div>

      <div className="space-y-2">
        <Label>Full Description</Label>
        <textarea value={form.full_description} onChange={(e) => set('full_description', e.target.value)} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Detailed description..." />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Price (IQD)</Label>
          <Input type="number" value={form.price_iqd} onChange={(e) => set('price_iqd', e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Version</Label>
          <Input value={form.version} onChange={(e) => set('version', e.target.value)} placeholder="1.0" />
        </div>
        <div className="space-y-2">
          <Label>File Size</Label>
          <Input value={form.file_size} onChange={(e) => set('file_size', e.target.value)} placeholder="125 MB" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Features (one per line)</Label>
        <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Inventory management&#10;Sales reports&#10;Multi-user support" />
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-xl border border-border/60 bg-muted/20">
            {form.logo ? <img src={form.logo} alt="logo" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-muted-foreground"><ImagePlus className="h-6 w-6" /></div>}
          </div>
          <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
          <Button type="button" variant="outline" onClick={() => logoRef.current?.click()} disabled={uploadingLogo}>
            {uploadingLogo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} Upload Logo
          </Button>
        </div>
      </div>

      {/* Screenshots */}
      <div className="space-y-2">
        <Label>Screenshots</Label>
        <div className="flex flex-wrap gap-3">
          {form.screenshots.map((s, i) => (
            <div key={i} className="relative h-20 w-32 overflow-hidden rounded-lg border border-border/60">
              <img src={s} alt={`shot ${i}`} className="h-full w-full object-cover" />
              <button type="button" onClick={() => set('screenshots', form.screenshots.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 rounded bg-background/80 p-0.5 text-destructive hover:bg-background"><X className="h-3 w-3" /></button>
            </div>
          ))}
          {uploadingShots.some(Boolean) && <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-border"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
          <button type="button" onClick={() => shotsRef.current?.click()} className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
            <ImagePlus className="h-5 w-5" />
          </button>
          <input ref={shotsRef} type="file" accept="image/*" multiple onChange={handleShots} className="hidden" />
        </div>
      </div>

      {/* GitHub release download */}
      <div className="space-y-2">
        <Label htmlFor="github-download-link">GitHub Download Link *</Label>
        <div className="relative">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="github-download-link"
            type="url"
            required
            value={form.system_file_uri}
            onChange={(e) => handleDownloadLink(e.target.value)}
            placeholder="https://github.com/amz-group/posweb/releases/download/v1.0.5/setup.exe"
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">Paste the direct asset link from a GitHub Release. The file name is detected automatically.</p>
        {form.system_file_name && <p className="truncate text-xs text-primary">File: {form.system_file_name}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Last Update</Label>
          <Input type="date" value={form.last_update} onChange={(e) => set('last_update', e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save System</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
