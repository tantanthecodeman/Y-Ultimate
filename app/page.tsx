'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  // helper type-guard
  function isUserWithEmail(u: unknown): u is { email?: string } {
    return typeof u === 'object' && u !== null && 'email' in (u as object);
  }

  // move the function before useEffect to avoid ordering/hoisting issues
  const checkUser = async () => {
    try {
      const res = await supabase.auth.getUser();
      const fetchedUser = res?.data?.user ?? null;
      setUser(fetchedUser);
    } catch (err) {
      // optional: log the error (keeps behavior unchanged otherwise)
      // console.error('checkUser error', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px'
    }}>
      {/* Header */}
      <header style={{
        maxWidth: 1200,
        margin: '0 auto 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0'
      }}>
        <div style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#111827'
        }}>
          ⚡ Y-Ultimate
        </div>
        {isUserWithEmail(user) && (
          <div style={{
            fontSize: 14,
            color: '#6b7280',
            backgroundColor: '#fff',
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #e5e7eb'
          }}>
            👤 {user.email}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto 48px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 48,
          fontWeight: 700,
          color: '#111827',
          marginBottom: 16,
          lineHeight: 1.2
        }}>
          Ultimate Frisbee<br/>Management Platform
        </h1>
        <p style={{
          fontSize: 18,
          color: '#6b7280',
          maxWidth: 600,
          margin: '0 auto 32px'
        }}>
          Comprehensive tools for tournament organization and youth coaching programs
        </p>
      </div>

      {/* Management Cards */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24
      }}>
        {/* Tournament Management Card */}
        <Link href="/tournament" style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#fff',
            border: '2px solid #e5e7eb',
            borderRadius: 16,
            padding: 32,
            transition: 'all 0.3s',
            cursor: 'pointer',
            height: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.15)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}>
            {/* Icon */}
            <div style={{
              fontSize: 64,
              marginBottom: 16
            }}>
              🏆
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#111827',
              marginBottom: 12
            }}>
              Tournament Management
            </h2>

            {/* Description */}
            <p style={{
              fontSize: 14,
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: 20
            }}>
              Organize tournaments, manage teams, schedule matches, track scores, and calculate Spirit of the Game ratings
            </p>

            {/* Features */}
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 24px 0'
            }}>
              {[
                'Create & manage tournaments',
                'Team registration & rosters',
                'Match scheduling & scoring',
                'Live leaderboards',
                'Spirit score tracking'
              ].map((feature, i) => (
                <li key={i} style={{
                  fontSize: 13,
                  color: '#374151',
                  marginBottom: 8,
                  paddingLeft: 20,
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#10b981'
                  }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600
            }}>
              Open Tournament Dashboard →
            </div>
          </div>
        </Link>

        {/* Coaching Management Card */}
        <Link href="/coaching" style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#fff',
            border: '2px solid #e5e7eb',
            borderRadius: 16,
            padding: 32,
            transition: 'all 0.3s',
            cursor: 'pointer',
            height: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.15)';
            e.currentTarget.style.borderColor = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}>
            {/* Icon */}
            <div style={{
              fontSize: 64,
              marginBottom: 16
            }}>
              👨‍🏫
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#111827',
              marginBottom: 12
            }}>
              Coaching Management
            </h2>

            {/* Description */}
            <p style={{
              fontSize: 14,
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: 20
            }}>
              Manage youth coaching programs, track attendance, schedule sessions, and generate progress reports
            </p>

            {/* Features */}
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 24px 0'
            }}>
              {[
                'Student registration',
                'Session scheduling',
                'Attendance tracking',
                'Coach assignments',
                'Progress analytics'
              ].map((feature, i) => (
                <li key={i} style={{
                  fontSize: 13,
                  color: '#374151',
                  marginBottom: 8,
                  paddingLeft: 20,
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#10b981'
                  }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: '#fff',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600
            }}>
              Open Coaching Dashboard →
            </div>
          </div>
        </Link>
      </div>

      {/* Auth Notice */}
      {user == null && (
        <div style={{
          maxWidth: 600,
          margin: '48px auto 0',
          padding: 20,
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: 12,
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: 14,
            color: '#78350f'
          }}>
            ℹ️ To access coaching features, please{' '}
            <Link href="/coaching/auth/login" style={{ color: '#b45309', fontWeight: 600 }}>
              sign in
            </Link>
            {' '}first
          </p>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        maxWidth: 1200,
        margin: '64px auto 0',
        padding: '24px 0',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        fontSize: 13,
        color: '#9ca3af'
      }}>
        <p style={{ margin: 0 }}>
          Y-Ultimate Platform • Built for Ultimate Frisbee Community
        </p>
      </footer>
    </main>
  );
}
