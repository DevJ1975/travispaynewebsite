import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'ghost' | 'ghost-gold' | 'link';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center rounded-tp-md font-body font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tp-jade disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-tp-gold text-tp-black hover:bg-tp-gold-dk hover:shadow-glow-gold',
  ghost: 'border border-tp-border text-tp-white hover:border-tp-gold hover:text-tp-gold',
  'ghost-gold': 'border border-tp-gold text-tp-gold hover:bg-tp-gold hover:text-tp-black',
  link: 'text-tp-gold underline-offset-4 hover:underline',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs uppercase tracking-wider',
  md: 'h-11 px-5 text-sm',
  lg: 'h-[52px] px-7 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/** Primary button atom (doc 03 §7.3). Navigation CTAs use a styled <Link>. */
export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
