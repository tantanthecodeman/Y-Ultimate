// lib/ui/components.tsx
import React from 'react';
import Link from 'next/link';

/* Navigation Header */
export function NavigationHeader({ currentPage }: { currentPage?: 'home' | 'tournament' | 'coaching' }) {
  return (
    <header style={{ 
      borderBottom: '3px solid #000', 
      padding: '20px 0', 
      marginBottom: '48px',
      background: '#FFF'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #E63946, #1D4ED8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotate(-6deg)',
                border: '2px solid #000',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}>
                <span style={{
                  fontFamily: 'Bangers, cursive',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  Y
                </span>
              </div>
              <div>
                <div style={{
                  fontFamily: 'Bangers, cursive',
                  fontSize: '22px',
                  lineHeight: '1',
                  color: '#0F1724'
                }}>
                  Y-ULTIMATE
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  marginTop: '2px'
                }}>
                  Tournament & Coaching portal
                </div>
              </div>
            </div>
          </Link>

          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px'
          }}>
            <Link href="/" style={{
              fontWeight: currentPage === 'home' ? 800 : 600,
              textDecoration: 'none',
              color: '#0F1724',
              position: 'relative',
              padding: '8px 12px',
              borderRadius: '8px',
              background: currentPage === 'home' ? '#F3F4F6' : 'transparent'
            }}>
              HOME
            </Link>
            <Link href="/tournament" style={{
              fontWeight: currentPage === 'tournament' ? 800 : 600,
              textDecoration: 'none',
              color: '#0F1724',
              position: 'relative',
              padding: '8px 12px',
              borderRadius: '8px',
              background: currentPage === 'tournament' ? '#F3F4F6' : 'transparent'
            }}>
              TOURNAMENT
            </Link>
            <Link href="/coaching" style={{
              fontWeight: currentPage === 'coaching' ? 800 : 600,
              textDecoration: 'none',
              color: '#0F1724',
              position: 'relative',
              padding: '8px 12px',
              borderRadius: '8px',
              background: currentPage === 'coaching' ? '#F3F4F6' : 'transparent'
            }}>
              COACHING
            </Link>
            <Link href="/coaching/auth/login">
              <button className="btn btn-primary" style={{
                padding: '8px 16px',
                fontSize: '12px'
              }}>
                Sign in
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

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
  onClick,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  rotation?: boolean;
  white?: boolean;
  sticker?: { label: string; color?: 'red' | 'blue' };
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}) {
  const classes = [
    'card',
    !rotation && 'flat',
    white && 'white',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} style={style}>
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

  return (
    <button
      className={`btn ${variantClass} ${className}`}
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
    <div className="scoreboard">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          padding: '4px 10px',
          borderRadius: '999px',
          border: '2px solid #FFF',
          fontSize: '11px',
          letterSpacing: '0.08em'
        }}>
          SCRIM SCOREBOARD
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontSize: '14px'
        }}>
          <span>{team1}</span>
          <span style={{
            minWidth: '28px',
            textAlign: 'center',
            padding: '2px 6px',
            borderRadius: '6px',
            border: '2px solid #FFF',
            marginLeft: '2px',
            fontSize: '16px'
          }}>
            {score1}
          </span>
          <span style={{ opacity: 0.7 }}>vs</span>
          <span>{team2}</span>
          <span style={{
            minWidth: '28px',
            textAlign: 'center',
            padding: '2px 6px',
            borderRadius: '6px',
            border: '2px solid #FFF',
            marginLeft: '2px',
            fontSize: '16px'
          }}>
            {score2}
          </span>
        </div>
      </div>
      <div style={{
        fontSize: '10px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        opacity: 0.8
      }}>
        next round auto-scheduled · 02:15
      </div>
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
    <Card white={true} rotation={false}>
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

/* Page Header */
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
        padding: '24px'
      }}
      onClick={onClose}
    >
      <Card
        rotation={false}
        white={true}
        className="w-full"
        style={{ maxWidth: '600px' }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <h2 className="mb-4" style={{
          fontFamily: 'Bangers, cursive',
          fontSize: '24px',
          textTransform: 'uppercase'
        }}>
          {title}
        </h2>
        {children}
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