"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Attendance } from "../lib/types";
import AttendanceTrendChart from "./Reports/AttendanceTrendChart";
import { generatePDFReport } from "../utils/pdfReport"; // ✅ Ensure this file exists

interface Stats {
  totalChildren: number;
  totalSessions: number;
  totalAttendanceRecords: number;
  attendanceRate: number;
}

export function ReportsDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalChildren: 0,
    totalSessions: 0,
    totalAttendanceRecords: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch report metrics from Supabase
  async function fetchReports(): Promise<void> {
    try {
      setLoading(true);

      // Count children
      const { count: rawChildCount, error: childErr } = await supabase
        .from("children")
        .select("*", { count: "exact", head: true });
      if (childErr) throw childErr;

      // Count sessions
      const { count: rawSessionCount, error: sessErr } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true });
      if (sessErr) throw sessErr;

      // Attendance stats
      const {
        data: attendanceData,
        count: rawAttCount,
        error: attErr,
      } = await supabase
        .from("attendance")
        .select("status", { count: "exact" })
        .returns<Pick<Attendance, "status">[]>(); // Explicit type safety
      if (attErr) throw attErr;

      const childCount = rawChildCount ?? 0;
      const sessionCount = rawSessionCount ?? 0;
      const attCount = rawAttCount ?? 0;
      const presentCount =
        attendanceData?.filter((r) => r.status === "present").length ?? 0;

      const attendanceRate =
        attCount > 0 ? Math.round((presentCount / attCount) * 100) : 0;

      setStats({
        totalChildren: childCount,
        totalSessions: sessionCount,
        totalAttendanceRecords: attCount,
        attendanceRate,
      });
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p>Loading report...</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>📊 Reports & Analytics</h2>

      {/* Summary Card */}
      <div
        style={{
          marginTop: "1rem",
          lineHeight: "1.8",
          background: "#f9fafb",
          padding: "1rem",
          borderRadius: "12px",
        }}
      >
        <p>
          <b>Total Children:</b> {stats.totalChildren}
        </p>
        <p>
          <b>Total Sessions Conducted:</b> {stats.totalSessions}
        </p>
        <p>
          <b>Total Attendance Records:</b> {stats.totalAttendanceRecords}
        </p>
        <p>
          <b>Overall Attendance Rate:</b> {stats.attendanceRate}%
        </p>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={fetchReports}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Refresh Data
        </button>

        <button
          onClick={() => generatePDFReport(stats)}
          style={{
            marginLeft: "0.5rem",
            background: "#10b981",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Download PDF Report
        </button>
      </div>

      {/* Attendance Chart */}
      <div style={{ marginTop: "2rem" }}>
        <AttendanceTrendChart />
      </div>
    </div>
  );
}
