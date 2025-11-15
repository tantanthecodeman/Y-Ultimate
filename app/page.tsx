
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {supabase} from "@/lib/supabaseClient";

type UserLike = { email?: string | null } | null | unknown;

function isUserWithEmail(u: UserLike): u is { email: string } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof u === "object" && u !== null && "email" in (u as any) && typeof (u as any).email === "string";
}

export default function Home() {
  const [user, setUser] = useState<UserLike>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await supabase.auth.getUser();
        const fetchedUser = res?.data?.user ?? null;
        setUser(fetchedUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="section">
        <div className="empty">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="page-header text-center">
        <h1>TOURNAMENT & COACHING</h1>
        <p>Ultimate Frisbee programs for competitive play and youth development</p>
      </div>

      <div className="grid-2 section">
        <Link href="/tournament" className="card">
          <h2 className="mb-2">TOURNAMENT</h2>
          <p className="text-muted mb-3">
            Manage events, teams, schedule matches, track scores and standings
          </p>
          <div className="btn btn-primary">Open Dashboard</div>
        </Link>

        <Link href="/coaching" className="card">
          <h2 className="mb-2">COACHING</h2>
          <p className="text-muted mb-3">
            Track attendance, manage sessions, student profiles and progress reports
          </p>
          <div className="btn btn-secondary">Open Dashboard</div>
        </Link>
      </div>

      {isUserWithEmail(user) && (
        <div className="alert alert-success">
          Signed in as {user.email}
        </div>
      )}

      {user == null && (
        <div className="text-center text-muted">
          <a href="/coaching/auth/login">Sign in</a> to access coaching features
        </div>
      )}
    </main>
  );
}
