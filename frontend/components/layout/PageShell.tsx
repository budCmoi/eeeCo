import type { PropsWithChildren } from 'react';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

export function PageShell({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-canvas text-ivory">
      <div className="pointer-events-none fixed inset-0 z-0 bg-glow" />
      <div className="pointer-events-none fixed left-1/2 top-[-18rem] z-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <SiteHeader />
      <main className="relative z-10 pt-24">{children}</main>
      <SiteFooter />
    </div>
  );
}