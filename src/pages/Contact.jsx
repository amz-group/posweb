import React from 'react';
import { MessageCircle, Phone, Clock, MapPin, ArrowRight } from 'lucide-react';

const WHATSAPP_NUMBER = '9647515329774';
const VIBER_NUMBER = '9647515329774';
const PHONE_DISPLAY = '+964 751 532 9774';

const whatsappUrl = `https://wa.me/${+9647515329774}?text=${encodeURIComponent('Hello KRD GROUP, I am interested in your software systems.')}`;
const viberUrl = `viber://chat?number=${+9647515329774}`;
const viberFallback = `https://viber.com/`;

export default function Contact() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#25D366]/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-[#7360F2]/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Get in Touch</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Reach us instantly through Viber or WhatsApp. Our team is ready to help you choose the right system.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-7 transition-all hover:border-[#25D366]/60 hover:bg-[#25D366]/10 hover:shadow-[0_0_40px_-12px_#25D366]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30">
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold">WhatsApp</h2>
                <p className="font-mono text-sm text-muted-foreground">{+9647515329774}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Chat with us directly on WhatsApp for fast responses about systems, pricing, and download codes.
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[#25D366]">
              Open WhatsApp <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </a>

          {/* Viber */}
          <a
            href={viberUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#7360F2]/30 bg-[#7360F2]/5 p-7 transition-all hover:border-[#7360F2]/60 hover:bg-[#7360F2]/10 hover:shadow-[0_0_40px_-12px_#7360F2]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#7360F2] text-white shadow-lg shadow-[#7360F2]/30">
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                  <path d="M11.4 0C5.1 0 .3 4.5.3 10.5c0 3.2 1.3 5.8 3.5 7.6v4.3c0 .3.4.5.6.3l3.7-2.4c1.1.2 2.2.3 3.3.3 6.3 0 11.1-4.5 11.1-10.5S17.7 0 11.4 0zm0 2c5.2 0 9.1 3.7 9.1 8.5s-3.9 8.5-9.1 8.5c-1 0-2-.1-2.9-.3l-.3-.1-2.5 1.6v-2.8l-.4-.3C3.4 15.9 2.3 13.7 2.3 10.5 2.3 5.7 6.2 2 11.4 2zm-2.3 4.3c-.2 0-.4.1-.5.3-.2.3-.6.8-.7 1.5-.2 1.1.2 2.3 1.1 3.5 1.3 1.8 3.4 3.2 5.6 3.2.6 0 1.2-.1 1.7-.4.6-.3 1-.8 1.1-1.4.1-.3.1-.6 0-.8-.1-.2-.3-.3-.5-.4l-1.5-.7c-.2-.1-.4-.1-.5 0-.1.1-.2.2-.3.3l-.3.4c-.1.1-.2.1-.3.1-.1 0-.3-.1-.5-.2-.8-.4-1.5-1-2-1.8-.1-.2-.2-.3-.2-.5 0-.1.1-.2.2-.3l.3-.4c.1-.1.1-.2.1-.3 0-.1 0-.2-.1-.3l-.6-1.5c-.1-.2-.2-.4-.4-.4h-.3c-.1 0-.3 0-.4.1z"/>
                </svg>
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold">Viber</h2>
                <p className="font-mono text-sm text-muted-foreground">{+9647515329774}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Prefer Viber? Send us a message anytime — we will guide you through purchasing and downloading your system.
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[#7360F2]">
              Open Viber <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Phone className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Phone</div>
              <div className="text-sm font-medium">{+9647515329774}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Clock className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Hours</div>
              <div className="text-sm font-medium">Sat – Thu, 9AM – 6PM</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><MapPin className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Location</div>
              <div className="text-sm font-medium">Khabat,Erbil, Kurdistan</div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Tap a card to open the app directly on your phone. Both numbers are the same — choose whichever you prefer.
        </p>
      </div>
    </div>
  );
}