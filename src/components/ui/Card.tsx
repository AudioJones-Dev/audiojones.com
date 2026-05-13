// src/components/ui/Card.tsx
// Audio Jones Brand 2.0 — Dark Surface Card (§04).
// Background #0F0F0F, 1px subtle border (#1E1E1E), 4px corners.
// Hover promotes the border to #2A2A2A.

import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`bg-surface-1 border border-border-subtle rounded transition-colors hover:border-border-strong ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: CardProps) {
  return (
    <div className={`px-6 py-4 border-b border-border-subtle ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className = '', children }: CardProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children }: CardProps) {
  return (
    <h3
      className={`font-headline text-lg font-bold tracking-[-0.02em] text-fg-0 ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children }: CardProps) {
  return (
    <p className={`font-body text-sm text-text-muted mt-1 leading-[1.7] ${className}`}>
      {children}
    </p>
  );
}
