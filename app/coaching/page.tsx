"use client";

import { useState } from "react";
import { UserHeader } from "./auth/components/UserHeader";
import { ChildrenList } from "./components/ChildrenList";
import { SessionsList } from "./components/SessionsList";
import { AttendanceList } from "./components/AttendanceList";

export default function CoachingDashboard() {
  const [tab, setTab] = useState("children");

  const tabs = [
    { key: "children", label: "Children" },
    { key: "sessions", label: "Sessions" },
    { key: "attendance", label: "Attendance" },
  ];

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* Header with user info and logout */}
      <UserHeader />

      <div style={{ padding: "1.5rem" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#111827" }}>
          Coaching Programme Dashboard
        </h1>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
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
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Views */}
        <div style={{ background: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          {tab === "children" && <ChildrenList />}
          {tab === "sessions" && <SessionsList />}
          {tab === "attendance" && <AttendanceList />}
        </div>
      </div>
    </div>
  );
}
