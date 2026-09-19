import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import SystemCard from '@/components/SystemCard';

export default function Systems() {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('all');

  useEffect(() => {
    api.entities.System.list('-created_date', 200)
      .then((data) => setSystems(data || []))
      .catch(() => setSystems([]))
      .finally(() => setLoading(false));
  }, []);

  const platforms = useMemo(() => {
    const set = new Set();
    systems.forEach((s) => s.platform && set.add(s.platform));
    return ['all', ...Array.from(set)];
  }, [systems]);

  const filtered = useMemo(() => {
    return systems.filter((s) => {
      const matchQuery = !query ||
        s.name?.toLowerCase().includes(query.toLowerCase()) ||
        s.short_description?.toLowerCase().includes(query.toLowerCase());
      const matchPlatform = platform === 'all' || s.platform === platform;
      return matchQuery && matchPlatform;
    });
  }, [systems, query, platform]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Our Systems</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Professional software solutions built and maintained by KRD GROUP.</p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search systems..."
            className="h-12 w-full rounded-xl border border-border bg-card/40 pl-11 pr-4 text-sm backdrop-blur-sm placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-border bg-card/40 pl-11 pr-9 text-sm backdrop-blur-sm focus-visible:border-primary/40 focus-visible:outline-none sm:w-56"
          >
            {platforms.map((p) => <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 animate-pulse rounded-2xl border border-border/40 bg-muted/20" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
          <Search className="h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-muted-foreground">No systems match your search.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => <SystemCard key={s.id} system={s} />)}
        </div>
      )}
    </div>
  );
}
