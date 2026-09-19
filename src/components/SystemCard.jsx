import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Layers } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function SystemCard({ system }) {
  return (
    <article
      aria-labelledby={`system-${system.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.3)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
        {system.logo ? (
          <Image
            src={system.logo}
            alt={system.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 font-heading text-2xl font-bold text-primary">
              {system.name?.charAt(0) || 'K'}
            </div>
          </div>
        )}
        {system.status === 'disabled' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <span className="rounded-full bg-destructive/15 px-3 py-1 text-xs font-medium text-destructive">Unavailable</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 id={`system-${system.id}`} className="font-heading text-lg font-semibold tracking-tight">
          {system.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{system.short_description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
            <Cpu className="h-3 w-3" /> {system.platform || 'Multi-platform'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
            <Layers className="h-3 w-3" /> v{system.version || '1.0'}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Price</span>
            <span className="font-heading text-lg font-bold text-primary">
              {Number(system.price_iqd || 0).toLocaleString()} <span className="text-xs font-medium text-muted-foreground">IQD</span>
            </span>
          </div>
          <Link
            to={`/systems/${system.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}