"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoachingLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/coaching");
      } else {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push("/coaching");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "24px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px"
      }}>
        {/* Header */}
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <div className="accent-bar" style={{ margin: "0 auto 24px" }}></div>
          <h1 style={{ marginBottom: "16px", fontSize: "36px" }}>COACHING PORTAL</h1>
          <p className="text-muted">Sign in to manage coaching sessions</p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: "40px" }}>
          <h3 className="mb-4" style={{ textAlign: "center" }}>SIGN IN</h3>
          
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FF4C29',
                    brandAccent: '#E63E1F',
                    inputBackground: '#FFFFFF',
                    inputText: '#0A0A0A',
                    inputBorder: '#D9D9D9',
                    inputBorderFocus: '#0A0A0A',
                    inputBorderHover: '#0A0A0A',
                  },
                  fontSizes: {
                    baseBodySize: '15px',
                    baseInputSize: '15px',
                    baseLabelSize: '14px',
                    baseButtonSize: '15px',
                  },
                  fonts: {
                    bodyFontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
                    buttonFontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
                    inputFontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
                    labelFontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
                  },
                  radii: {
                    borderRadiusButton: '0px',
                    buttonBorderRadius: '0px',
                    inputBorderRadius: '0px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '0px',
                    inputBorderWidth: '2px',
                  },
                  space: {
                    inputPadding: '12px 16px',
                    buttonPadding: '12px 24px',
                  }
                }
              },
              style: {
                button: {
                  borderRadius: '0px',
                  fontWeight: '600',
                  textTransform: 'none',
                  border: 'none',
                },
                anchor: {
                  color: '#FF4C29',
                  fontWeight: '600',
                },
                label: {
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '14px',
                  marginBottom: '8px',
                },
                input: {
                  borderRadius: '0px',
                  border: '2px solid #D9D9D9',
                  padding: '12px 16px',
                  fontSize: '15px',
                },
                message: {
                  fontSize: '14px',
                  padding: '12px 16px',
                  borderRadius: '0px',
                  borderLeft: '4px solid',
                  fontWeight: '600',
                },
                container: {
                  gap: '16px',
                },
                divider: {
                  background: '#D9D9D9',
                  margin: '24px 0',
                }
              }
            }}
            theme="light"
            providers={[]}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/coaching`}
            onlyThirdPartyProviders={false}
            magicLink={true}
            view="sign_in"
          />
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "32px",
          textAlign: "center",
          fontSize: "14px",
          color: "var(--muted)",
          fontWeight: "600"
        }}>
          Need help? Contact your administrator
        </div>
      </div>
    </div>
  );
}