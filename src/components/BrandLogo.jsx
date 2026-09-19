import React from 'react';
import { useSiteLogo } from '@/lib/useSiteLogo';
import { Image } from '@/components/ui/image';

export default function BrandLogo({ size = 'md', showText = true, subtitle = 'Systems', className = '' }) {
  const { logo, loading } = useSiteLogo();

  const sizes = {
    sm: { box: 'h-8 w-8', text: 'text-sm', sub: 'text-[9px]', rounded: 'rounded-lg' },
    md: { box: 'h-9 w-9', text: 'text-base', sub: 'text-[10px]', rounded: 'rounded-lg' },
    lg: { box: 'h-14 w-14', text: 'text-2xl', sub: 'text-xs', rounded: 'rounded-2xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`flex ${s.box} shrink-0 items-center justify-center overflow-hidden ${s.rounded} bg-gradient-to-br from-primary to-accent text-primary-foreground font-heading font-bold`}>
        {logo?.logo && !loading ? (
          <Image src={logo.logo} alt="Logo" className="h-full w-full object-cover" fittingType="fill" />
        ) : (
          'K'
        )}
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-heading ${s.text} font-bold tracking-tight`}>{logo?.site_name || 'KRD GROUP'}</span>
          <span className={`font-mono ${s.sub} uppercase tracking-[0.2em] text-muted-foreground`}>{subtitle}</span>
        </div>
      )}
    </div>
  );
}