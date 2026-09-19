import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Shield } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <BrandLogo size="md" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Professional software solutions engineered for your business. Secure, reliable, and built to perform.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Navigate</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/" className="text-muted-foreground transition-colors hover:text-primary">Home</Link></li>
              <li><Link to="/systems" className="text-muted-foreground transition-colors hover:text-primary">Systems</Link></li>
              <li><Link to="/download" className="text-muted-foreground transition-colors hover:text-primary">Download</Link></li>
              <li><Link to="/contact" className="text-muted-foreground transition-colors hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> krdgroup_dev@gmail.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +964 750 000 0000</li>
            </ul>
            <Link to="/admin/login" className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 transition-colors hover:text-foreground">
              <Shield className="h-3 w-3" /> Admin Panel
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} KRD GROUP. All rights reserved.</p>
          <p className="font-mono text-xs text-muted-foreground">Engineered with precision · Secure distribution</p>
        </div>
      </div>
    </footer>
  );
}