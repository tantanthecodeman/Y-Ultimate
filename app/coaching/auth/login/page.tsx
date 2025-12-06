// app/coaching/auth/login/page.tsx
'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationHeader, TapeBanner, Card } from '@/lib/ui/components';

export default function CoachingLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/coaching');
      } else {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/coaching');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <>
        <NavigationHeader currentPage="coaching" />
        <div className="loading">LOADING...</div>
      </>
    );
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '64px', background: '#FFF' }}>
      <NavigationHeader currentPage="coaching" />

      <div className="container" style={{ maxWidth: '500px', paddingTop: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <TapeBanner color="red" className="mb-3">TRAINING MODE</TapeBanner>
          
          <h1 style={{
            fontFamily: 'Bangers, cursive',
            fontSize: 'clamp(28px, 6vw, 48px)',
            margin: '16px 0 8px 0',
            textTransform: 'uppercase'
          }}>
            COACHING PORTAL
          </h1>
          
          <p style={{
            color: '#6B7280',
            fontSize: '15px'
          }}>
            Sign in to manage your training sessions
          </p>
        </div>

        <Card white={true} rotation={false}>
          <style>{`
            .supabase-auth-ui_ui-button {
              background: #000 !important;
              color: #FFF !important;
              border: 3px solid #000 !important;
              border-radius: 32px !important;
              padding: 12px 24px !important;
              font-weight: 700 !important;
              font-size: 14px !important;
              text-transform: uppercase !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
              box-shadow: 0 6px 0 rgba(0,0,0,0.40) !important;
            }
            
            .supabase-auth-ui_ui-button:hover {
              transform: translateY(2px) !important;
              box-shadow: 0 4px 0 rgba(0,0,0,0.55) !important;
            }
            
            .supabase-auth-ui_ui-input {
              border: 3px solid #000 !important;
              border-radius: 12px !important;
              padding: 12px 16px !important;
              font-size: 15px !important;
            }
            
            .supabase-auth-ui_ui-label {
              font-family: 'Bangers', cursive !important;
              font-size: 13px !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              text-align: left !important;
              letter-spacing: 0.5px !important;
            }
            
            .supabase-auth-ui_ui-anchor {
              color: #1D4ED8 !important;
              font-weight: 700 !important;
            }
          `}</style>
          
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[]}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/coaching`}
            onlyThirdPartyProviders={false}
            magicLink={true}
            view="sign_in"
          />
        </Card>
      </div>
    </main>
  );
}