import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Loader2, FileDown, AlertCircle, Lock } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { formatCodeInput } from '@/lib/codeGen';

export default function DownloadPage() {
  const [code, setCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setScanning(true);
    setTimeout(async () => {
      try {
        const res = await api.functions.invoke('verify-download-code', { code: code.toUpperCase() });
        const data = res.data;
        if (data.status === 'valid') {
          setResult(data);
        } else {
          setError(data.message || 'Invalid download code.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed. Please try again.');
      } finally {
        setScanning(false);
      }
    }, 1200);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.functions.invoke('download-system-file', { code: code.toUpperCase() });
      const data = res.data;
      if (data.status === 'valid' && data.signed_url) {
        const a = document.createElement('a');
        a.href = data.signed_url;
        a.download = data.file_name || 'system.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Refresh remaining count
        setResult((prev) => prev ? { ...prev, remaining: typeof prev.remaining === 'number' ? prev.remaining - 1 : prev.remaining } : prev);
      } else {
        setError(data.message || 'Download failed.');
        setResult(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20">
            <KeyRound className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Download Your System</h1>
          <p className="mt-3 text-muted-foreground">Enter your unique download code to securely retrieve your software.</p>
        </div>

        <form onSubmit={handleVerify} className="mt-10">
          <label htmlFor="code" className="mb-3 block text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">Enter your Download Code</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"><KeyRound className="h-5 w-5" /></div>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(formatCodeInput(e.target.value))}
              placeholder="KRD-XXXX-XXXX"
              autoComplete="off"
              spellCheck={false}
              className="h-16 w-full rounded-2xl border border-border bg-card/40 pl-14 pr-4 text-center font-mono text-lg font-semibold tracking-[0.15em] backdrop-blur-sm placeholder:tracking-[0.15em] placeholder:text-muted-foreground/40 focus-visible:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            {scanning && <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"><div className="absolute inset-x-0 top-0 h-0.5 bg-accent animate-scan" /></div>}
          </div>
          <Button type="submit" disabled={scanning || !code} className="mt-5 h-12 w-full text-base font-semibold">
            {scanning ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</> : <><ShieldCheck className="mr-2 h-5 w-5" /> Verify Code</>}
          </Button>
        </form>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-card/40 backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-border/40 bg-primary/5 px-5 py-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs uppercase tracking-wider text-primary">Code Verified</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/20">
                  {result.system.logo ? <Image src={result.system.logo} alt={result.system.name} className="h-full w-full object-cover" fittingType="fill" /> : <span className="font-heading text-2xl font-bold text-primary">{result.system.name?.charAt(0)}</span>}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">{result.system.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 font-mono text-[11px] text-muted-foreground">
                    <span>v{result.system.version || '1.0'}</span>
                    <span>·</span>
                    <span>{result.system.file_size || '—'}</span>
                    <span>·</span>
                    <span>{result.system.platform || 'Multi-platform'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Remaining Downloads</span>
                <span className="font-heading text-lg font-bold text-primary">{result.remaining}</span>
              </div>

              <Button onClick={handleDownload} disabled={downloading} className="mt-4 h-12 w-full text-base font-semibold">
                {downloading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Preparing...</> : <><FileDown className="mr-2 h-5 w-5" /> Download Now</>}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Your download link is active for 5 minutes.</p>
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Each code unlocks only its assigned system.
        </div>
      </div>
    </div>
  );
}
