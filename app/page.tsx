// app/page.tsx
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
    <main className="section">
      {/* Hero */}
      <div className="section" style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 999,
            background: "var(--soft)",
            border: "1px solid var(--line)",
            marginBottom: 16,
          }}
        >
          <span className="pill" style={{ background: "#eef2ff", color: "#1e3a8a" }}>Y‑Ultimate</span>
          <span className="subtle">Empowering youth through Ultimate</span>
        </div>

        <h1
          className="h1"
          style={{
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 10,
            lineHeight: 1.1,
          }}
        >
          Y‑Ultimate
        </h1>

        <p
          className="subtle"
          style={{
            maxWidth: 720,
            margin: "0 auto",
            fontSize: "clamp(16px, 2.2vw, 18px)",
          }}
        >
          Ultimate Frisbee Management Platform for tournaments and youth coaching programs
        </p>
      </div>

      {/* Cards */}
      <div className="grid-auto">
        <Link href="/tournament" className="card" style={{ textDecoration: "none" }}>
          <div className="card-body">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
            <h2 className="h2" style={{ fontSize: 22 }}>Tournament Management</h2>
            <p className="subtle" style={{ marginBottom: 16 }}>
              Organize tournaments, manage teams, schedule matches, track scores, and Spirit ratings.
            </p>
            <ul className="grid-tight" style={{ marginBottom: 16 }}>
              <li className="subtle">Create and manage tournaments</li>
              <li className="subtle">Team registration and rosters</li>
              <li className="subtle">Match scheduling and scoring</li>
              <li className="subtle">Live leaderboards and spirit</li>
            </ul>
            <div className="btn btn-primary">Open Tournament Dashboard</div>
          </div>
        </Link>

        <Link href="/coaching" className="card" style={{ textDecoration: "none" }}>
          <div className="card-body">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎒</div>
            <h2 className="h2" style={{ fontSize: 22 }}>Coaching Management</h2>
            <p className="subtle" style={{ marginBottom: 16 }}>
              Track attendance, schedule sessions, manage profiles, and generate reports.
            </p>
            <ul className="grid-tight" style={{ marginBottom: 16 }}>
              <li className="subtle">Student profiles and sessions</li>
              <li className="subtle">Attendance and assessments</li>
              <li className="subtle">Coach assignments</li>
              <li className="subtle">Progress analytics</li>
            </ul>
            <div className="btn btn-accent">Open Coaching Dashboard</div>
          </div>
        </Link>
      </div>

      {/* Signed-in badge */}
      {isUserWithEmail(user) && (
        <div className="card section">
          <div className="card-body" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="pill">Signed in</span>
            <span className="subtle">{user.email}</span>
          </div>
        </div>
      )}

      {/* Auth hint */}
      {user == null && (
        <div className="card section">
          <div className="card-body" style={{ background: "var(--warn-bg)", borderRadius: "var(--radius)" }}>
            <p className="subtle" style={{ margin: 0 }}>
              To access coaching features, please <Link href="/coaching/auth/login" className="link">sign in</Link> first.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="section" style={{ textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
        Y‑Ultimate Platform · Built for the Ultimate community
      </footer>
    </main>
  );
}
