import type { AppProps } from 'next/app';

import { PageShell } from '@/components/layout/PageShell';

import '@/styles/globals.css';

export default function App({ Component, pageProps, router }: AppProps) {
  void router;
  return (
    <PageShell>
      <Component {...pageProps} />
    </PageShell>
  );
}