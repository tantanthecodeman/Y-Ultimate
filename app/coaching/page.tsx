"use client";

import { useState } from "react";
import { ChildrenList } from "./components/ChildrenList";
import { SessionsList } from "./components/SessionsList";
import { AttendanceList } from "./components/AttendanceList";
import { ReportsDashboard } from "./components/ReportsDashboard";

export default function CoachingDashboard() {
  const [tab, setTab] = useState("children");

  const tabs = [
    { key: "children", label: "Children" },
    { key: "sessions", label: "Sessions" },
    { key: "attendance", label: "Attendance" },
    { key: "reports", label: "Reports" },
  ];

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        Coaching Programme Dashboard
      </h1>

      {/* Tab buttons */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid gray",
              backgroundColor: tab === t.key ? "#2563eb" : "#f0f0f0",
              color: tab === t.key ? "white" : "black",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ marginTop: "2rem" }}>
        {tab === "children" && <ChildrenList />}
        {tab === "sessions" && <SessionsList />}
        {tab === "attendance" && <AttendanceList />}
        {tab === "reports" && <ReportsDashboard />}
      </div>
    </div>
  );
}
