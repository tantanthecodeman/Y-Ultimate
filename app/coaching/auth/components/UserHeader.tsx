// app/coaching/auth/components/UserHeader.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/lib/ui/components';

export function UserHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    }
    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/coaching/auth/login';
  }

  return (
    <header
      style={{
        background: '#FFF',
        borderBottom: '3px solid #000',
        padding: '20px 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '20px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            COACHING DASHBOARD
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontSize: '14px', color: '#6B7280' }}>
              {userEmail || 'Loading...'}
            </span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}