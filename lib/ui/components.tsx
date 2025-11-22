// lib/ui/components.tsx
import React from 'react';

/* Tape Banner */
export function TapeBanner({
  children,
  color = 'red',
  className = '',
}: {
  children: React.ReactNode;
  color?: 'red' | 'blue' | 'white';
  className?: string;
}) {
  const colorClass = color === 'blue' ? 'blue' : color === 'white' ? 'secondary' : '';
  return (
    <div className={`tape-banner ${colorClass} ${className}`}>
      {children}
    </div>
  );
}

/* Card */
export function Card({
  children,
  className = '',
  rotation = true,
  white = false,
  sticker,
}: {
  children: React.ReactNode;
  className?: string;
  rotation?: boolean;
  white?: boolean;
  sticker?: { label: string; color?: 'red' | 'blue' };
}) {
  const classes = [
    'card',
    !rotation && 'flat',
    white && 'white',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
      {sticker && (
        <div className={`tape-sticker ${sticker.color === 'blue' ? 'blue' : ''}`}>
          {sticker.label}
        </div>
      )}
    </div>
  );
}

/* Button */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    red: 'btn-accent-red',
    blue: 'btn-accent-blue',
  }[variant];

  const sizeClass = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  }[size];

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* Scoreboard */
export function Scoreboard({
  team1,
  score1,
  team2,
  score2,
}: {
  team1: string;
  score1: number;
  team2: string;
  score2: number;
}) {
  return (
    <div
      style={{
        background: '#000',
        color: '#FFF',
        border: '3px solid #000',
        padding: '16px 24px',
        fontFamily: 'Bangers, cursive',
        fontSize: '20px',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '12px',
        boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
      }}
    >
      <span>{team1}</span>
      <span style={{ minWidth: '80px', textAlign: 'center' }}>
        {score1} - {score2}
      </span>
      <span>{team2}</span>
    </div>
  );
}

/* Stat Box */
export function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: string;
}) {
  return (
    <Card white={true}>
      {icon && (
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>
          {icon}
        </div>
      )}
      <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
        {value}
      </div>
      <div
        style={{
          fontFamily: 'Bangers, cursive',
          fontSize: '14px',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </Card>
  );
}

/* Page Layout */
export function PageHeader({
  title,
  subtitle,
  tapeBanner,
}: {
  title: string;
  subtitle?: string;
  tapeBanner?: string;
}) {
  return (
    <div className="page-header">
      {tapeBanner && <TapeBanner className="mb-3">{tapeBanner}</TapeBanner>}
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  );
}

/* Modal / Dialog */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4">{title}</h2>
        {children}
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={onClose}
        >
          Close
        </Button>
      </Card>
    </div>
  );
}

/* Divider */
export function Divider() {
  return (
    <div
      style={{
        height: '3px',
        background: '#000',
        margin: '24px 0',
        borderRadius: '2px',
      }}
    />
  );
}