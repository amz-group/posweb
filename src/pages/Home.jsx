import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ShieldCheck, Zap, Lock } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import { Image } from '@/components/ui/image';
import SystemCard from '@/components/SystemCard';
import { useSiteLogo } from '@/lib/useSiteLogo';

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=85';

export default function Home() {
  const { logo } = useSiteLogo();
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.entities.System.list('-created_date', 6)
      .then((data) => setSystems(data || []))
      .catch(() => setSystems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute right-1/4 top-1/3 h-96 w-96 translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3.5 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Secure Software Distribution</span>
              </div>

              <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                KRD GROUP <span className="text-gradient">Systems</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Professional Software Solutions for Your Business. Engineered with precision, delivered securely through our proprietary code-based distribution ecosystem.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/systems" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_-6px_hsl(var(--primary))]">
                  View Systems <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/download" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/40 px-6 py-3.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary">
                  <Download className="h-4 w-4" /> Download System
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6">
                {[
                  { icon: ShieldCheck, label: 'Secure Delivery' },
                  { icon: Zap, label: 'Fast Performance' },
                  { icon: Lock, label: 'Code-Protected' },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <f.icon className="h-4 w-4 text-primary" /> {f.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-card/30 backdrop-blur-sm">
                <Image src={logo?.hero_image || logo?.logo || FALLBACK_HERO} alt="KRD GROUP" className="h-full w-full object-cover" fittingType="fill" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border/60 bg-card/80 px-4 py-3 backdrop-blur-xl sm:block">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Version</div>
                <div className="font-heading text-sm font-semibold">Enterprise Grade</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Systems */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Available Systems</h2>
            <p className="mt-2 text-muted-foreground">Explore our professional software solutions.</p>
          </div>
          <Link to="/systems" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            View all systems <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl border border-border/40 bg-muted/20" />
            ))}
          </div>
        ) : systems.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
            <p className="text-muted-foreground">No systems available yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {systems.map((s) => <SystemCard key={s.id} system={s} />)}
          </div>
        )}
      </section>
    </div>
  );
}
