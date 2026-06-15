import type { PropsWithChildren, ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';

// ── Brand atoms ───────────────────────────────────────────────────────────

/** Otisak prsta = brand potpis. Savršeno za passkey/biometrijski identitet. */
export function Fingerprint({ size = 28, mono = false }: { size?: number; mono?: boolean }) {
  return (
    <img
      src={mono ? '/brand/fingerprint-mono.svg' : '/brand/fingerprint.svg'}
      alt=""
      aria-hidden
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  );
}

/** Logotip e-DEMOKRACIJA (vektor). Asset, nikad živi tekst. */
export function Logo({ variant = 'color', className = '' }: { variant?: 'color' | 'white'; className?: string }) {
  return (
    <img
      src={variant === 'white' ? '/brand/logo-horizontal-white.svg' : '/brand/logo-horizontal.svg'}
      alt="e-Demokracija"
      className={className}
    />
  );
}

export function Eyebrow({ children }: PropsWithChildren) {
  return <p className="eyebrow">{children}</p>;
}

/** Pulsirajuća orange točka — "live / aktivno" (živi site potpis). */
export function StatusDot() {
  return <span className="inline-block h-2.5 w-2.5 rounded-pill bg-orange animate-pulseDot" aria-hidden />;
}

// ── Layout primitives ───────────────────────────────────────────────────────

export function Card({ children, className = '', ...rest }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={`rounded-card border border-navy/10 bg-surface shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Chip({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'neutral' | 'live' }>) {
  return (
    <span className="inline-flex items-center gap-2 rounded-pill border border-chipline bg-chip px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy">
      {tone === 'live' && <StatusDot />}
      {children}
    </span>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'navy' | 'ghost';
  full?: boolean;
};

/** Pill gumb. Primary = orange (jedina hero akcija), navy = sekundarno. */
export function Button({ variant = 'primary', full, className = '', children, ...rest }: BtnProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3.5 text-[0.95rem] font-semibold transition active:scale-[0.98] disabled:opacity-50';
  const tones = {
    primary: 'bg-orange text-white hover:brightness-95 shadow-soft',
    navy: 'bg-navy text-white hover:bg-navy-deep',
    ghost: 'bg-transparent text-navy hover:bg-navy/5',
  } as const;
  return (
    <button className={`${base} ${tones[variant]} ${full ? 'w-full' : ''} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/** Veliki prikaz iznosa — SemiBold, tight tracking. */
export function Amount({ value, size = 'lg' }: { value: string; size?: 'lg' | 'xl' }) {
  return (
    <span
      className={`font-semibold tracking-display tabular-nums text-navy ${
        size === 'xl' ? 'text-5xl' : 'text-3xl'
      }`}
    >
      {value}
    </span>
  );
}

export function ScreenTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: ReactNode }) {
  return (
    <header className="px-5 pb-3 pt-2">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="mt-1 text-[1.7rem] leading-[1.05]">{title}</h1>
      {sub && <p className="mt-2 text-sm leading-relaxed text-muted">{sub}</p>}
    </header>
  );
}