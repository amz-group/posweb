import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 text-foreground transition-colors hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}