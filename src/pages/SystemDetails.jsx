import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, HardDrive, Layers, Calendar, Check, ShoppingCart } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import BuySystemModal from '@/components/BuySystemModal';

export default function SystemDetails() {
  const { id } = useParams();
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeShot, setActiveShot] = useState(0);
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => {
    api.entities.System.get(id)
      .then(setSystem)
      .catch(() => setSystem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-2xl bg-muted/20" />
      </div>
    );
  }

  if (!system) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold">System not found</h1>
        <p className="mt-2 text-muted-foreground">This system may have been removed.</p>
        <Link to="/systems" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Systems
        </Link>
      </div>
    );
  }

  const specs = [
    { icon: Layers, label: 'Version', value: system.version || '1.0' },
    { icon: HardDrive, label: 'File Size', value: system.file_size || '—' },
    { icon: Cpu, label: 'Platform', value: system.platform || 'Multi-platform' },
    { icon: Calendar, label: 'Last Update', value: system.last_update || '—' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link to="/systems" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Systems
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Left — screenshots */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/30">
            <div className="aspect-[16/10] w-full bg-muted/20">
              {system.screenshots?.length ? (
                <Image src={system.screenshots[activeShot]} alt={`${system.name} screenshot`} className="h-full w-full object-cover" fittingType="fill" />
              ) : system.logo ? (
                <Image src={system.logo} alt={system.name} className="h-full w-full object-cover" fittingType="fill" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-heading text-6xl font-bold text-primary/30">{system.name?.charAt(0)}</div>
              )}
            </div>
          </div>
          {system.screenshots?.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {system.screenshots.map((shot, i) => (
                <button key={i} onClick={() => setActiveShot(i)} className={`aspect-video overflow-hidden rounded-lg border transition-colors ${activeShot === i ? 'border-primary' : 'border-border/60'}`}>
                  <Image src={shot} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" fittingType="fill" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — details */}
        <div>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/20">
              {system.logo ? <Image src={system.logo} alt={system.name} className="h-full w-full object-cover" fittingType="fill" /> : <span className="font-heading text-2xl font-bold text-primary">{system.name?.charAt(0)}</span>}
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{system.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{system.short_description}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {specs.map((s) => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-card/30 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <s.icon className="h-3.5 w-3.5" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">{s.label}</span>
                </div>
                <div className="mt-1.5 font-heading text-sm font-semibold">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border/60 bg-card/30 p-5">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Price</span>
                <div className="font-heading text-3xl font-bold text-primary">{Number(system.price_iqd || 0).toLocaleString()} <span className="text-base font-medium text-muted-foreground">IQD</span></div>
              </div>
              {system.status === 'disabled' ? (
                <span className="rounded-full bg-destructive/15 px-3 py-1 text-xs font-medium text-destructive">Currently Unavailable</span>
              ) : (
                <Button onClick={() => setBuyOpen(true)} className="h-12 px-6">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Buy System
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-heading text-lg font-semibold">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{system.full_description || system.short_description}</p>
          </div>

          {system.features?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-lg font-semibold">Features</h2>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {system.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10"><Check className="h-3 w-3 text-primary" /></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Secure Download:</strong> After purchase confirmation, you'll receive a unique Download Code to securely retrieve your software. No direct links are shared.
            </p>
          </div>
        </div>
      </div>

      <BuySystemModal system={system} open={buyOpen} onClose={() => setBuyOpen(false)} />
    </div>
  );
}
