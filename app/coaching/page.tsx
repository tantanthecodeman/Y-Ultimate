"use client";
import { useState } from "react";
import { UserHeader } from "./auth/components/UserHeader";
import { ChildrenList } from "./components/ChildrenList";
import { SessionsList } from "./components/SessionsList";
import { AttendanceList } from "./components/AttendanceList";
import { ReportsDashboard } from "./components/ReportsDashboard";

type TabKey = "children" | "sessions" | "attendance" | "reports";

export default function CoachingDashboard() {
  const [tab, setTab] = useState<TabKey>("children");

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "children", label: "Children", icon: "👶" },
    { key: "sessions", label: "Sessions", icon: "📅" },
    { key: "attendance", label: "Attendance", icon: "✅" },
    { key: "reports", label: "Reports", icon: "📊" },
  ];

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <UserHeader />
      <div style={{ padding: "1.5rem" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#111827" }}>
          Coaching Programme Dashboard
        </h1>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: tab === t.key ? "#2563eb" : "white",
                color: tab === t.key ? "white" : "black",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: tab === t.key ? 600 : 400,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Views */}
        <div style={{ background: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          {tab === "children" && <ChildrenList />}
          {tab === "sessions" && <SessionsList />}
          {tab === "attendance" && <AttendanceList />}
          {tab === "reports" && <ReportsDashboard />}
        </div>
      </div>
    </div>
  );
}
