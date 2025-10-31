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

  // ✅ Fetch sessions with coach info
  async function fetchSessions(): Promise<void> {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("sessions")
        .select(`
          id,
          date,
          community,
          type,
          duration,
          coach_id,
          coaches ( name, id )
        `)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error);
        setSessions([]);
      } else if (Array.isArray(data)) {
        setSessions(data as unknown as Session[]);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Delete a session (and optionally cascade attendance)
  async function handleDeleteSession(id: string): Promise<void> {
    const confirmDelete = confirm(
      "Are you sure you want to delete this session? Attendance linked to it will also be removed."
    );
    if (!confirmDelete) return;

    try {
      // Optional: delete attendance manually if you haven’t set CASCADE in SQL
      await supabase.from("attendance").delete().eq("session_id", id);

      const { error } = await supabase.from("sessions").delete().eq("id", id);

      if (error) {
        alert("Error deleting session: " + error.message);
        console.error(error);
      } else {
        alert("Session deleted successfully!");
        fetchSessions(); // refresh list
      }
    } catch (err) {
      console.error("Unexpected error deleting session:", err);
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
            <th>Actions</th> {/* ✅ Added Actions column */}
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
                  onClick={() => handleDeleteSession(s.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  Delete
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
