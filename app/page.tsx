// app/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { TapeBanner, Scoreboard } from '@/lib/ui/components';

export default function Home() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user ? { email: user.email || '' } : null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '64px' }}>
      {/* ---------------- HEADER ---------------- */}
      <header
        style={{
          borderBottom: '3px solid #000',
          padding: '20px 0',
          marginBottom: '48px',
          background: '#FFF',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #E63946, #1D4ED8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-6deg)',
                  border: '2px solid #000',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: 'white',
                    fontSize: '24px',
                  }}
                >
                  Y
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: 'Bangers, cursive',
                    fontSize: '22px',
                    lineHeight: '1',
                  }}
                >
                  Y-ULTIMATE
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    marginTop: '2px',
                  }}
                >
                  Tournament & Coaching portal
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '13px',
              }}
            >
              <Link
                href="/tournament"
                style={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: '#0F1724',
                }}
              >
                Tournament
              </Link>

              <Link
                href="/coaching"
                style={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: '#0F1724',
                }}
              >
                Coaching
              </Link>

              {!loading && !user && (
                <Link href="/coaching/auth/login">
                  <button
                    className="btn btn-primary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '12px',
                    }}
                  >
                    Sign in
                  </button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <TapeBanner color="red" className="mb-3">
            TOURNAMENT & COACHING HUB
          </TapeBanner>

          <h1
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: 'clamp(36px, 8vw, 64px)',
              lineHeight: '1',
              margin: '16px 0',
              letterSpacing: '1px',
              textShadow: '2px 2px 0 rgba(0,0,0,0.10)',
            }}
          >
            TOURNAMENT & COACHING
          </h1>

          <p
            style={{
              color: '#6B7280',
              maxWidth: '720px',
              margin: '0 auto 24px',
              fontSize: '15px',
            }}
          >
            Ultimate Frisbee programs for competitive play and youth development.
            Run brackets, track scores, manage sessions, and keep every player
            on the same page.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              margin: '24px auto',
            }}
          >
            <div style={{ width: '72px', height: '2px', background: '#000' }} />
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: '2px solid #000',
                background: '#1D4ED8',
              }}
            />
            <div style={{ width: '72px', height: '2px', background: '#000' }} />
          </div>
        </div>

        {/* ---------------- HERO CARDS ---------------- */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            alignItems: 'stretch',
            marginBottom: '48px',
            flexWrap: 'wrap',
          }}
        >
          {/* -------- TOURNAMENT CARD -------- */}
          <Link
            href="/tournament"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              maxWidth: '520px',
              width: '100%',
            }}
          >
            <div
              className="card"
              style={{
                minHeight: '240px',
                transform: 'rotate(-1.5deg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Mode label */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-20px',
                  transform: 'rotate(10deg)',
                }}
              >
                <div
                  className="tape-banner blue"
                  style={{ padding: '6px 16px', fontSize: '12px' }}
                >
                  LEAGUE MODE
                </div>
              </div>

             

              <div>
                <div
                  style={{
                    fontFamily: 'Bangers, cursive',
                    fontSize: '32px',
                    margin: '4px 0 8px 0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: '2px solid #000',
                      background:
                        'repeating-linear-gradient(45deg, #1D4ED8, #1D4ED8 4px, #fff 4px, #fff 8px)',
                    }}
                  />
                  TOURNAMENT
                </div>

                

                <p
                  style={{
                    color: '#6B7280',
                    fontSize: '14px',
                    marginBottom: '16px',
                    lineHeight: '1.6',
                    textAlign: 'left',
                  }}
                >
                  Manage events, teams, schedules, scores and standings. Build
                  pools, knockouts and finals that look like a real tournament —
                  without the spreadsheet chaos.
                </p>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }}>
                Open Dashboard
              </button>

              {/* bottom tape */}
              <div
                style={{
                  position: 'absolute',
                  left: '-18px',
                  bottom: '-18px',
                  transform: 'rotate(-8deg)',
                }}
              >
                <div
                  className="tape-banner blue"
                  style={{
                    fontSize: '13px',
                    padding: '7px 14px',
                    transform: 'rotate(-4deg)',
                  }}
                >
                  Brackets · Schedules
                </div>
              </div>
            </div>
          </Link>

          {/* -------- COACHING CARD -------- */}
          <Link
            href="/coaching"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              maxWidth: '520px',
              width: '100%',
            }}
          >
            <div
              className="card"
              style={{
                minHeight: '240px',
                transform: 'rotate(1.5deg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Mode label */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-20px',
                  transform: 'rotate(10deg)',
                }}
              >
                <div
                  className="tape-banner"
                  style={{ padding: '6px 16px', fontSize: '12px' }}
                >
                  TRAINING MODE
                </div>
              </div>

              

              <div>
                <div
                  style={{
                    fontFamily: 'Bangers, cursive',
                    fontSize: '32px',
                    margin: '4px 0 8px 0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: '2px solid #000',
                      background:
                        'repeating-linear-gradient(45deg, #E63946, #E63946 4px, #fff 4px, #fff 8px)',
                    }}
                  />
                  COACHING
                </div>

                {/* pixel ribbon under title */}
                <div className="pixel-ribbon" />

                <p
                  style={{
                    color: '#6B7280',
                    fontSize: '14px',
                    marginBottom: '16px',
                    lineHeight: '1.6',
                    textAlign: 'left',
                  }}
                >
                  Track attendance, sessions, player profiles and progress. Keep
                  drills, feedback and season goals in one retro-styled coaching
                  HQ.
                </p>
              </div>

              <button className="btn btn-accent-blue" style={{ width: '100%' }}>
                Open Dashboard
              </button>

              {/* bottom tape */}
              <div
                style={{
                  position: 'absolute',
                  left: '-18px',
                  bottom: '-18px',
                  transform: 'rotate(-8deg)',
                }}
              >
                <div
                  className="tape-banner"
                  style={{
                    fontSize: '13px',
                    padding: '7px 14px',
                    transform: 'rotate(-4deg)',
                  }}
                >
                  Sessions · Reports
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ---------------- SCOREBOARD ---------------- */}
        <div style={{ maxWidth: '560px', margin: '0 auto 48px' }}>
          <Scoreboard team1="YOUTH" score1={12} team2="CLUB" score2={10} />

          <div
            style={{
              textAlign: 'center',
              color: '#6B7280',
              marginTop: '16px',
              fontSize: '13px',
            }}
          >
            {user ? (
              <>
                Signed in as <strong>{user.email}</strong> •{' '}
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#E63946',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/coaching/auth/login"
                  style={{
                    color: '#E63946',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  Sign in
                </Link>{' '}
                to access coaching features
              </>
            )}
          </div>
        </div>

        {/* ---------------- FOOTER CTA ---------------- */}
        <div
          style={{
            marginTop: '64px',
            padding: '24px',
            borderRadius: '20px',
            border: '3px solid #000',
            background: '#FBFCFD',
            boxShadow: '0 6px 8px rgba(0,0,0,0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '64%' }}>
            <h3
              style={{
                fontFamily: 'Bangers, cursive',
                margin: '0 0 8px 0',
                fontSize: '20px',
              }}
            >
              READY TO RUN A TOURNAMENT LIKE A PRO?
            </h3>
            <p
              style={{
                margin: 0,
                color: '#6B7280',
                fontSize: '13px',
              }}
            >
              Get full team management, auto-scheduling, and coaching reports.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Contact</button>
          </div>
        </div>
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <footer
        style={{
          marginTop: '64px',
          padding: '24px 0',
          borderTop: '3px solid #000',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px',
              color: '#6B7280',
              fontSize: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div>© 2025 Y-ULTIMATE</div>
            <div>
              <a
                href="#privacy"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Privacy
              </a>
              {' · '}
              <a
                href="#terms"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
