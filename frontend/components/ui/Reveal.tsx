import type { HTMLAttributes, PropsWithChildren } from 'react';
import { useRef } from 'react';

import { useScrollReveal } from '@/animations/useScrollReveal';

type RevealProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    delay?: number;
    y?: number;
  }
>;

export function Reveal({ children, delay, y, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollReveal(ref, { delay, y });

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}