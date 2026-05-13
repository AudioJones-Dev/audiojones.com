// src/components/ui/Badge.tsx
// Audio Jones Brand 2.0 — Priority Badges (§04).
// DM Mono 10px uppercase pill. Always on dark surfaces.
//   P0 (#FF4545)  P1 (#FFB340)  P2 (#4DACFF)  P3 (muted)
//   signal       (#E8FF5A on dark text)

import React from 'react';

type Variant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'signal'
  | 'p0'
  | 'p1'
  | 'p2'
  | 'p3';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const base =
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ' +
  'font-mono text-[10px] font-medium uppercase tracking-[0.16em]';

const variants: Record<Variant, string> = {
  default:
    'bg-[rgba(77,172,255,0.10)] text-accent-blue border border-[rgba(77,172,255,0.45)]',
  secondary:
    'bg-surface-2 text-text-primary border border-border-strong',
  outline:
    'bg-transparent text-text-muted border border-border-strong',
  signal:
    'bg-signal-yellow text-bg-base border border-signal-yellow',
  p0:
    'bg-[rgba(255,69,69,0.10)] text-accent-red border border-[rgba(255,69,69,0.45)]',
  p1:
    'bg-[rgba(255,179,64,0.10)] text-accent-amber border border-[rgba(255,179,64,0.45)]',
  p2:
    'bg-[rgba(77,172,255,0.10)] text-accent-blue border border-[rgba(77,172,255,0.45)]',
  p3:
    'bg-[rgba(102,102,102,0.10)] text-text-muted border border-border-strong',
};

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
