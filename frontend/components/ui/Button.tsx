import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/lib/format';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
  }
>;

const variants = {
  primary: 'bg-ivory text-black shadow-[0_14px_38px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-white',
  secondary: 'bg-white/[0.08] text-ivory shadow-[0_14px_38px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] hover:bg-white/[0.12]',
  ghost: 'text-ivory/70 shadow-[0_14px_38px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.08)] hover:text-ivory'
};

export function Button({ children, className, variant = 'primary', fullWidth, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all duration-300',
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}