"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {supabase} from "@/lib/supabaseClient";

export default function TournamentLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/tournament");
      }
    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/tournament");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Sign In to Tournament Portal
      </h2>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        redirectTo={typeof window !== "undefined" ? window.location.origin + "/tournament" : undefined}
      />
    </div>
  );
}
