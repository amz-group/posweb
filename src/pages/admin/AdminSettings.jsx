import React, { useEffect, useState } from 'react';
import { Upload, Loader2, Save, Trash2 } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import { useSiteLogo } from '@/lib/useSiteLogo';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { logo: setting, loading, refresh } = useSiteLogo();
  const [siteName, setSiteName] = useState('KRD GROUP');
  const [logoUrl, setLogoUrl] = useState('');
  const [heroUrl, setHeroUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (setting) {
      setSiteName(setting.site_name || 'KRD GROUP');
      setLogoUrl(setting.logo || '');
      setHeroUrl(setting.hero_image || '');
    }
  }, [setting]);

  const uploadFile = async (file, onDone) => {
    try {
      const { file_url } = await api.storage.uploadPublicFile(file);
      onDone(file_url);
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error('Upload failed.');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    await uploadFile(file, (url) => setLogoUrl(url));
    setUploadingLogo(false);
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    await uploadFile(file, (url) => setHeroUrl(url));
    setUploadingHero(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { logo: logoUrl, hero_image: heroUrl, site_name: siteName };
      if (setting) {
        await api.entities.SiteSetting.update(setting.id, payload);
      } else {
        await api.entities.SiteSetting.create(payload);
      }
      await refresh();
      toast.success('Settings saved.');
    } catch (err) {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Site Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your brand logo, hero background, and site name.</p>
      </div>

      <div className="mt-8 max-w-2xl space-y-6">
        {/* Logo Upload */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-heading text-lg font-semibold">Brand Logo</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload your logo to replace the default "K" icon across the site.</p>

          <div className="mt-5 flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary to-accent">
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo preview" className="h-full w-full object-cover" fittingType="fill" />
              ) : (
                <span className="font-heading text-3xl font-bold text-primary-foreground">K</span>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card/40 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-card hover:text-primary">
                {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
              </label>
              {logoUrl && (
                <button onClick={() => setLogoUrl('')} className="ml-2 inline-flex items-center gap-1.5 text-sm text-destructive hover:underline">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              )}
              <p className="text-xs text-muted-foreground">PNG or JPG, square recommended. Replaces the "K" letter icon everywhere.</p>
            </div>
          </div>
        </div>

        {/* Hero Background Upload */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-heading text-lg font-semibold">Hero Background</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload the background image shown on the homepage hero section.</p>

          <div className="mt-5 flex items-center gap-5">
            <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-card/60">
              {heroUrl ? (
                <Image src={heroUrl} alt="Hero preview" className="h-full w-full object-cover" fittingType="fill" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">No image</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card/40 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-card hover:text-primary">
                {uploadingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploadingHero ? 'Uploading...' : 'Upload Background'}
                <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" disabled={uploadingHero} />
              </label>
              {heroUrl && (
                <button onClick={() => setHeroUrl('')} className="ml-2 inline-flex items-center gap-1.5 text-sm text-destructive hover:underline">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              )}
              <p className="text-xs text-muted-foreground">Landscape image recommended (4:3 ratio). Shown on the homepage hero.</p>
            </div>
          </div>
        </div>

        {/* Site Name */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-heading text-lg font-semibold">Site Name</h2>
          <p className="mt-1 text-sm text-muted-foreground">The brand name shown next to the logo.</p>
          <input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="mt-4 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="KRD GROUP"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="h-11 px-6">
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Settings</>}
        </Button>
      </div>
    </div>
  );
}
