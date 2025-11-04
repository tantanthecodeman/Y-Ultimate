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
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/coaching");
      } else {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push("/coaching");
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ color: "#6b7280" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "32px",
          margin: "0 16px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          backgroundColor: "white",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍🏫</div>
          <h2 style={{ 
            margin: "0 0 8px 0", 
            fontSize: 24, 
            fontWeight: 700,
            color: "#111827"
          }}>
            Coaching Portal
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: 14, 
            color: "#6b7280" 
          }}>
            Sign in to manage coaching sessions
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#10b981',
                  brandAccent: '#059669',
                }
              }
            },
            style: {
              button: {
                borderRadius: '6px',
              },
              anchor: {
                color: '#10b981',
              },
              input: {
                borderRadius: '6px',
              }
            }
          }}
          theme="light"
          providers={[]}
          redirectTo={`${window.location.origin}/coaching`}
          onlyThirdPartyProviders={false}
          magicLink={true}
          view="sign_in"
        />

        <div style={{
          marginTop: 24,
          paddingTop: 24,
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: 12, 
            color: '#9ca3af' 
          }}>
            Need help? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
}