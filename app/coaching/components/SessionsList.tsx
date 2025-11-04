"use client";

import { useEffect, useState } from "react";
import {supabase} from "@/lib/supabaseClient";
import { AddSessionForm } from "./AddSessionForm";

interface Session {
  id: string;
  date: string;
  community: string;
  type: string;
  duration: number;
  notes?: string;
}

export function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  async function fetchSessions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("sessions")
        .select("id, date, community, type, duration, notes")
        .order("date", { ascending: false });
      
      if (error) throw error;
      setSessions(data ?? []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this session?")) return;
    
    const { error } = await supabase.from("sessions").delete().eq("id", id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      alert("Session deleted successfully");
      fetchSessions();
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) return <p>Loading sessions...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Sessions</h2>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Add Session
        </button>
      </div>

      {showAddForm && (
        <AddSessionForm
          onAdded={() => {
            fetchSessions();
            setShowAddForm(false);
          } }
          onClose={() => setShowAddForm(false)} childId={""} coachProfileId={""}        />
      )}

      {sessions.length === 0 ? (
        <p>No sessions found. Click &quot;Add Session&quot; to get started.</p>
      ) : (
        <table
          border={1}
          cellPadding={8}
          cellSpacing={0}
          style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th>Date</th>
              <th>Community</th>
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{new Date(session.date).toLocaleDateString()}</td>
                <td>{session.community}</td>
                <td>{session.type}</td>
                <td>{session.duration}</td>
                <td>{session.notes ?? "-"}</td>
                <td>
                  <button
                    onClick={() => handleDelete(session.id)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
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
      )}
    </div>
  );
}
