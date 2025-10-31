"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Child, Session, Attendance } from "../lib/types";

export function AttendanceList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [attendance, setAttendance] = useState<Record<string, Attendance["status"]>>({});
  const [loading, setLoading] = useState(true);
  const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);

  // ✅ Load sessions and children
  useEffect(() => {
    async function loadData(): Promise<void> {
      try {
        setLoading(true);

        const { data: sData, error: sError } = await supabase
          .from("sessions")
          .select("id, date, community")
          .returns<Session[]>();
        if (sError) throw sError;

        const { data: cData, error: cError } = await supabase
          .from("children")
          .select("id, name, community")
          .returns<Child[]>();
        if (cError) throw cError;

        setSessions(sData ?? []);
        setChildren(cData ?? []);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ✅ Filter children when session changes
  useEffect(() => {
    if (!selectedSession) {
      setFilteredChildren([]);
      return;
    }

    const selected = sessions.find((s) => s.id === selectedSession);
    if (selected) {
      const sameCommunityChildren = children.filter(
        (child) => child.community === selected.community
      );
      setFilteredChildren(sameCommunityChildren);
    }
  }, [selectedSession, sessions, children]);

  // ✅ Toggle attendance
  function toggleAttendance(childId: string, status: Attendance["status"]) {
    setAttendance((prev) => ({ ...prev, [childId]: status }));
  }

  // ✅ Save attendance
  async function saveAttendance(): Promise<void> {
    if (!selectedSession) {
      alert("Please select a session first.");
      return;
    }

    const records: Attendance[] = Object.entries(attendance).map(
      ([child_id, status]) => ({
        session_id: selectedSession,
        child_id,
        status,
      })
    );

    const { error } = await supabase.from("attendance").insert(records);

    if (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving attendance");
    } else {
      alert("Attendance saved!");
      setAttendance({});
    }
  }

  if (loading) return <p>Loading data...</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>Mark Attendance</h2>

      {/* Session Selector */}
      <label>Select Session: </label>
      <select
        value={selectedSession}
        onChange={(e) => setSelectedSession(e.target.value)}
      >
        <option value="">Select</option>
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.date} – {s.community}
          </option>
        ))}
      </select>

      {/* Children Table */}
      {selectedSession && (
        <div style={{ marginTop: "1rem" }}>
          {filteredChildren.length === 0 ? (
            <p>No students found for this session’s community.</p>
          ) : (
            <>
              <table border={1} cellPadding={6} cellSpacing={0} width="100%">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Community</th>
                    <th>Mark</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChildren.map((child) => (
                    <tr key={child.id}>
                      <td>{child.name}</td>
                      <td>{child.community}</td>
                      <td>
                        <label>
                          <input
                            type="radio"
                            name={`att-${child.id}`}
                            value="present"
                            checked={attendance[child.id] === "present"}
                            onChange={() => toggleAttendance(child.id, "present")}
                          />
                          Present
                        </label>{" "}
                        <label>
                          <input
                            type="radio"
                            name={`att-${child.id}`}
                            value="absent"
                            checked={attendance[child.id] === "absent"}
                            onChange={() => toggleAttendance(child.id, "absent")}
                          />
                          Absent
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={saveAttendance}
                style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
              >
                Save Attendance
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
