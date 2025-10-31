"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Attendance } from "../lib/types";

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

  // ✅ Fetch all report metrics
 async function fetchReports(): Promise<void> {
  try {
    setLoading(true);

    // 🧮 Count total children
    const { count: rawChildCount, error: childErr } = await supabase
      .from("children")
      .select("*", { count: "exact", head: true });
    if (childErr) throw childErr;
    const childCount: number = rawChildCount ?? 0;

    // 🧮 Count total sessions
    const { count: rawSessionCount, error: sessErr } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true });
    if (sessErr) throw sessErr;
    const sessionCount: number = rawSessionCount ?? 0;

    // 🧮 Get attendance stats
    const {
      data: attendanceData,
      count: rawAttCount,
      error: attErr,
    } = await supabase
      .from("attendance")
      .select("status", { count: "exact" })
      .returns<Pick<Attendance, "status">[]>(); // explicitly typed

    if (attErr) throw attErr;

    const attCount: number = rawAttCount ?? 0;
    const dataArray: Pick<Attendance, "status">[] = attendanceData ?? [];

    // 📊 Compute attendance rate safely
    const presentCount = dataArray.filter(
      (r) => r.status === "present"
    ).length;

    const attendanceRate =
      attCount > 0 ? Math.round((presentCount / attCount) * 100) : 0;

    // ✅ Update state
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
      <h2>Reports & Analytics</h2>
      <div style={{ marginTop: "1rem", lineHeight: "1.8" }}>
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
      <button onClick={fetchReports} style={{ marginTop: "1rem" }}>
        Refresh Data
      </button>
    </div>
  );
}
