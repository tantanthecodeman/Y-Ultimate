"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/coaching/auth/login");
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "0.4rem 0.8rem",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
