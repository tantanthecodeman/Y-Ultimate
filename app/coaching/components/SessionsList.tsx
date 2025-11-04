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
  const [error, setError] = useState<string | null>(null);

  async function fetchSessions(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
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

      if (fetchError) throw fetchError;

      setSessions((data as unknown as Session[]) ?? []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(err instanceof Error ? err.message : "Failed to load sessions");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    try {
      const { error: deleteError } = await supabase
        .from("sessions")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      alert("✅ Session deleted successfully!");
      fetchSessions();
    } catch (err) {
      console.error("Error deleting session:", err);
      alert("❌ Failed to delete session. Check console for details.");
    }
  }

  useEffect(() => {
    void fetchSessions();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading sessions...</p>
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
      </div>
    );
  }

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
          Coaching Sessions ({sessions.length})
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm ? "#dc2626" : "#2563eb",
            color: "#fff",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {showAddForm ? "Cancel" : "+ Add Session"}
        </button>
      </div>

      {showAddForm && (
        <div style={{ marginBottom: 24 }}>
          <AddSessionForm
            onClose={() => setShowAddForm(false)}
            onAdded={() => {
              setShowAddForm(false);
              fetchSessions();
            }}
          />
        </div>
      )}

      {sessions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          border: '2px dashed #d1d5db',
          borderRadius: 12,
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px 0' }}>
            No sessions scheduled
          </p>
          <p style={{ fontSize: 14, margin: 0 }}>
            Click &quot;Add Session&quot; to create your first coaching session
          </p>
        </div>
      ) : (
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
                <td>{new Date(s.date).toLocaleDateString()}</td>
                <td>{s.community}</td>
                <td title={s.coaches?.id || s.coach_id || "N/A"}>
                  {s.coaches?.name || "Unassigned"}
                </td>
                <td>{s.type}</td>
                <td>{s.duration}</td>
                <td>
                  <button
                    onClick={() => handleDelete(s.id)}
                    style={{
                      color: "red",
                      cursor: "pointer",
                      background: 'none',
                      border: 'none',
                      fontSize: 16
                    }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}