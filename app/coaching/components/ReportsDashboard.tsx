"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Attendance } from "../lib/types";
import AttendanceTrendChart from "./Reports/AttendanceTrendChart";

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
  const [error, setError] = useState<string | null>(null);

  async function fetchReports(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      // Count children
      const { count: childCount, error: childErr } = await supabase
        .from("children")
        .select("*", { count: "exact", head: true });
      
      if (childErr) throw childErr;

      // Count sessions
      const { count: sessionCount, error: sessErr } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true });
      
      if (sessErr) throw sessErr;

      // Attendance stats
      const {
        data: attendanceData,
        count: attCount,
        error: attErr,
      } = await supabase
        .from("attendance")
        .select("status", { count: "exact" });
      
      if (attErr) throw attErr;

      const presentCount =
        attendanceData?.filter((r) => r.status === "present").length ?? 0;

      const totalAtt = attCount ?? 0;
      const attendanceRate = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 0;

      setStats({
        totalChildren: childCount ?? 0,
        totalSessions: sessionCount ?? 0,
        totalAttendanceRecords: totalAtt,
        attendanceRate,
      });
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <p style={{ color: '#6b7280' }}>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: 20,
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: 8,
        color: '#991b1b'
      }}>
        ❌ {error}
        <button
          onClick={fetchReports}
          style={{
            marginLeft: 16,
            padding: '4px 12px',
            backgroundColor: '#fff',
            border: '1px solid #fecaca',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

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
          border: '1px solid #e5e7eb'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              Total Children
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#111827' }}>
              {stats.totalChildren}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              Total Sessions
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#111827' }}>
              {stats.totalSessions}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              Attendance Records
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#111827' }}>
              {stats.totalAttendanceRecords}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              Attendance Rate
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: stats.attendanceRate >= 75 ? '#10b981' : '#ef4444' }}>
              {stats.attendanceRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "1rem", display: 'flex', gap: 12 }}>
        <button
          onClick={fetchReports}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Attendance Chart */}
      <div style={{ marginTop: "2rem" }}>
        <AttendanceTrendChart />
      </div>
    </div>
  );
}