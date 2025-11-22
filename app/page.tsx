// app/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { TapeBanner, Card, Button, PageHeader, Scoreboard } from '@/lib/ui/components';

export default function Home() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
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
      {/* Header */}
      <header style={{ borderBottom: '3px solid #000', padding: '24px 0', marginBottom: '48px' }}>
        <div className="container">
          <TapeBanner color="blue">TOURNAMENT & COACHING HUB</TapeBanner>
        </div>
      </header>

      <div className="container">
        {/* Page Header */}
        <PageHeader
          title="Tournament & Coaching"
          subtitle="Play hard. Train harder. Build your ultimate legacy."
        />

        {/* Hero Cards */}
        <div className="grid grid-2 mb-4">
          {/* Tournament Card */}
          <Link href="/tournament">
            <Card sticker={{ label: 'Brackets · Schedules', color: 'blue' }}>
              <TapeBanner color="blue" className="mb-3">
                LEAGUE MODE
              </TapeBanner>
              <h2 className="mb-3">Tournament</h2>
              <p className="mb-4">
                Manage events, create teams, schedule matches, track scores, and dominiate the leaderboards.
              </p>
              <div className="gap-2" style={{ display: 'flex', gap: '12px' }}>
                <Button variant="primary" className="flex-1">
                  Open →
                </Button>
                <Button variant="secondary" className="flex-1">
                  Learn More
                </Button>
              </div>
            </Card>
          </Link>

          {/* Coaching Card */}
          <Link href="/coaching">
            <Card sticker={{ label: 'Sessions · Reports', color: 'red' }}>
              <TapeBanner color="red" className="mb-3">
                TRAINING MODE
              </TapeBanner>
              <h2 className="mb-3">Coaching</h2>
              <p className="mb-4">
                Track attendance, manage sessions, build student profiles, and watch them level up.
              </p>
              <div className="gap-2" style={{ display: 'flex', gap: '12px' }}>
                <Button variant="primary" className="flex-1">
                  Open →
                </Button>
                <Button variant="secondary" className="flex-1">
                  Learn More
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Scoreboard Section */}
        <div className="section">
          <h3 className="text-center mb-3">LAST MATCH</h3>
          <Scoreboard
            team1="THUNDER BOLTS"
            score1={21}
            team2="FLYING DRAGONS"
            score2={19}
          />
        </div>

        {/* Auth Section */}
        <div className="section">
          <Card white={true} className="text-center">
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <>
                <p className="mb-2">Signed in as:</p>
                <p style={{ fontWeight: 700, marginBottom: '16px' }}>{user.email}</p>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <p className="mb-4">Join the tournament or become a coach</p>
                <Link href="/coaching/auth/login">
                  <Button variant="primary" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}