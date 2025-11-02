"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AttendanceRecord } from "../../lib/types";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AttendanceTrendChart() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch attendance stats from Supabase
  useEffect(() => {
    async function fetchAttendanceTrend() {
      try {
        setLoading(true);

        // 1️⃣ Get sessions with their dates
        const { data: sessions, error: sErr } = await supabase
          .from("sessions")
          .select("id, date");
        if (sErr) throw sErr;

        // 2️⃣ Get all attendance data
        const { data: attendance, error: aErr } = await supabase
          .from("attendance")
          .select("session_id, status");
        if (aErr) throw aErr;

        if (!sessions || !attendance) {
          setData([]);
          return;
        }

        // 3️⃣ Aggregate attendance by session/date
        const trendMap: Record<string, AttendanceRecord> = {};

        sessions.forEach((session) => {
          const sessionAttendance = attendance.filter(
            (a) => a.session_id === session.id
          );

          const presentCount = sessionAttendance.filter(
            (a) => a.status === "present"
          ).length;
          const absentCount = sessionAttendance.filter(
            (a) => a.status === "absent"
          ).length;

          trendMap[session.date] = {
            date: session.date,
            presentCount,
            absentCount,
          };
        });

        // 4️⃣ Convert to sorted array
        const trendData = Object.values(trendMap).sort((a, b) =>
          a.date.localeCompare(b.date)
        );

        setData(trendData);
      } catch (err) {
        console.error("Error fetching attendance trend:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAttendanceTrend();
  }, []);

  if (loading) return <p>Loading attendance trend...</p>;
  if (data.length === 0) return <p>No attendance data available yet.</p>;

  return (
    <div style={{ marginTop: "2rem", width: "100%", height: 400 }}>
      <h2>📈 Attendance Trend Over Time</h2>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="presentCount"
            stroke="#22c55e"
            strokeWidth={2}
            name="Present"
          />
          <Line
            type="monotone"
            dataKey="absentCount"
            stroke="#ef4444"
            strokeWidth={2}
            name="Absent"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
