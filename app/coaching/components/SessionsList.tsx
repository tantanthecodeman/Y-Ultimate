"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AddSessionForm } from "./AddSessionForm";

interface Coach {
  id: string;
  name: string;
}

interface Session {
  id: string;
  date: string;
  community: string;
  type: string;
  duration: number;
  coach_id: string | null;
  coaches?: Coach | null;
}

export function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  async function fetchSessions(): Promise<void> {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("sessions")
        .select(
          `
        id,
        date,
        community,
        type,
        duration,
        coach_id,
        coaches ( name, id )
      `
        )
        .order("date", { ascending: false })
        .returns<Session[]>(); // 👈 FIX: explicitly type the return data

      if (error) throw error;

      setSessions(data ?? []); // ✅ now fully type-safe
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    const { error } = await supabase.from("sessions").delete().eq("id", id);
    if (error) {
      console.error("Error deleting session:", error);
      alert("❌ Failed to delete session. Check console for details.");
    } else {
      alert("✅ Session deleted successfully!");
      fetchSessions();
    }
  }

  useEffect(() => {
    void fetchSessions();
  }, []);

  if (loading) return <p>Loading sessions...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          Coaching Sessions
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Add Session
        </button>
      </div>

      <table
        border={1}
        cellPadding={6}
        cellSpacing={0}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#ffffff",
        }}
      >
        <thead style={{ backgroundColor: "#f3f4f6" }}>
          <tr>
            <th>Date</th>
            <th>Community</th>
            <th>Coach</th>
            <th>Type</th>
            <th>Duration (min)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td>{s.date}</td>
              <td>{s.community}</td>
              <td title={s.coaches?.id || s.coach_id || "N/A"}>
                {s.coaches?.name || "Unknown Coach"}
              </td>
              <td>{s.type}</td>
              <td>{s.duration}</td>
              <td>
                <button
                  onClick={() => handleDelete(s.id)}
                  style={{ color: "red", cursor: "pointer" }}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddForm && (
        <AddSessionForm
          onClose={() => setShowAddForm(false)}
          onAdded={fetchSessions}
        />
      )}
    </div>
  );
}
