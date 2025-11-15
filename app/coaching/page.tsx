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

  const tabs: { key: TabKey; label: string }[] = [
    { key: "children", label: "CHILDREN" },
    { key: "sessions", label: "SESSIONS" },
    { key: "attendance", label: "ATTENDANCE" },
    { key: "reports", label: "REPORTS" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <UserHeader />
      
      <div className="container">
        <div className="page-header">
          <h1>COACHING PROGRAMME</h1>
          <p>Manage youth development and training sessions</p>
        </div>

        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`tab ${tab === t.key ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="section">
          {tab === "children" && <ChildrenList />}
          {tab === "sessions" && <SessionsList />}
          {tab === "attendance" && <AttendanceList />}
          {tab === "reports" && <ReportsDashboard />}
        </div>
      </div>
    </div>
  );
}