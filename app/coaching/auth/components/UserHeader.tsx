"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LogoutButton } from "./LogoutButton";

export function UserHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    }
    getUser();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h3 style={{ margin: 0 }}>Coaching Dashboard</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span>{userEmail || "Loading..."}</span>
        <LogoutButton />
      </div>
    </div>
  );
}
