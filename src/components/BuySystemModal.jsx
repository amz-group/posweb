import React, { useState } from 'react';
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function BuySystemModal({ system, open, onClose }) {
  const [form, setForm] = useState({ customer_name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.entities.PurchaseRequest.create({
        customer_name: form.customer_name,
        phone: form.phone,
        system_id: system.id,
        system_name: system.name,
        message: form.message || 'No additional message',
        status: 'pending'
      });
      setDone(true);
      toast.success('Purchase request sent successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-md overflow-y-auto border-l border-border/60 bg-card shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border/40 bg-card/80 px-6 py-4 backdrop-blur-xl">
          <div>
            <h2 className="font-heading text-lg font-semibold">Purchase Request</h2>
            <p className="text-xs text-muted-foreground">{system?.name}</p>
          </div>
          <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-5 font-heading text-xl font-semibold">Request Sent</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you. Our team will contact you shortly to confirm payment details. Once payment is confirmed, you will receive a Download Code.
            </p>
            <Button onClick={onClose} className="mt-6">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input id="name" required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="Your full name" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07XX XXX XXXX" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Selected System</Label>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-medium">{system?.name}</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">{Number(system?.price_iqd || 0).toLocaleString()} IQD</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any additional details..." rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <Button type="submit" disabled={loading} className="h-11 w-full font-medium">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Send className="mr-2 h-4 w-4" /> Send Purchase Request</>}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              No online payment required. After manual confirmation, you'll receive a Download Code.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
