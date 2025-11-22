// app/coaching/auth/login/page.tsx
'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TapeBanner, Card, PageHeader } from '@/lib/ui/components';

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
      <div className="loading" style={{ minHeight: '100vh' }}>
        LOADING...
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '64px' }}>
      {/* Header */}
      <header style={{ borderBottom: '3px solid #000', padding: '24px 0', marginBottom: '48px' }}>
        <div className="container">
          <TapeBanner color="red">TRAINING MODE</TapeBanner>
        </div>
      </header>

      <div className="container" style={{ maxWidth: '500px' }}>
        <PageHeader
          title="Coaching Portal"
          subtitle="Sign in to manage your training sessions"
        />

        <Card white={true} className="text-center">
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
            }
            
            .supabase-auth-ui_ui-button:hover {
              transform: translateY(2px) !important;
            }
            
            .supabase-auth-ui_ui-input {
              border: 3px solid #000 !important;
              border-radius: 12px !important;
              padding: 12px 16px !important;
              font-size: 15px !important;
            }
            
            .supabase-auth-ui_ui-label {
              font-family: 'Bangers', cursive !important;
              font-size: 14px !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              text-align: left !important;
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