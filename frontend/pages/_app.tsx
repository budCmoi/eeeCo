import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { PageShell } from '@/components/layout/PageShell';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

import '@/styles/globals.css';

export default function App({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    const handleRouteChange = () => {
      const lenis = (window as Window & {
        __lenis?: {
          scrollTo: (target: number, options?: { immediate?: boolean; force?: boolean }) => void;
        };
      }).__lenis;

      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
        return;
      }

      window.scrollTo(0, 0);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <div>
      <SmoothScrollProvider>
        <PageShell>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={router.asPath}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </PageShell>
      </SmoothScrollProvider>
    </div>
  );
}