"use client";

import { useEffect, useState } from "react";
import {supabase} from "@/lib/supabaseClient";

interface Child {
  id: string;
  name: string;
  community: string;
}

interface Session {
  id: string;
  date: string;
  community: string;
}

export function AttendanceList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>({});
  const [loading, setLoading] = useState(true);
  const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { data: sData, error: sError } = await supabase
          .from("sessions")
          .select("id, date, community")
          .order("date", { ascending: false });

        if (sError) throw sError;

        const { data: cData, error: cError } = await supabase
          .from("children")
          .select("id, name, community");

        if (cError) throw cError;

        setSessions(sData ?? []);
        setChildren(cData ?? []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedSession) {
      setFilteredChildren([]);
      return;
    }
    const selected = sessions.find((s) => s.id === selectedSession);
    if (selected) {
      setFilteredChildren(children.filter((c) => c.community === selected.community));
    } else {
      setFilteredChildren([]);
    }
  }, [selectedSession, sessions, children]);

  function toggleAttendance(childId: string, status: "present" | "absent") {
    setAttendance((prev) => ({ ...prev, [childId]: status }));
  }

  async function saveAttendance() {
    if (!selectedSession) {
      alert("Please select a session first.");
      return;
    }

    const records = Object.entries(attendance).map(([childid, status]) => ({
      sessionid: selectedSession,
      childid,
      status,
    }));

    if (records.length === 0) {
      alert("Please mark attendance for at least one child.");
      return;
    }

    const { error } = await supabase.from("attendance").insert(records);
    if (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving attendance: " + error.message);
    } else {
      alert("Attendance saved successfully!");
      setAttendance({});
    }
  }

  if (loading) return <p>Loading data...</p>;

  return (
    <div>
      <h2>Mark Attendance</h2>
      
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: 600 }}>Select Session:</label>
        <br />
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
        >
          <option value="">-- Select a Session --</option>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {new Date(s.date).toLocaleDateString()} - {s.community}
            </option>
          ))}
        </select>
      </div>

      {selectedSession && (
        <div>
          {filteredChildren.length === 0 ? (
            <p style={{ color: "#6b7280" }}>
              No children found for this session&apos;s community. Add children in the community &quot;{sessions.find(s => s.id === selectedSession)?.community}&quot; first.
            </p>
          ) : (
            <>
              <table
                border={1}
                cellPadding={8}
                cellSpacing={0}
                style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th>Name</th>
                    <th>Community</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChildren.map((child) => (
                    <tr key={child.id}>
                      <td>{child.name}</td>
                      <td>{child.community}</td>
                      <td>
                        <label style={{ marginRight: "1rem" }}>
                          <input
                            type="radio"
                            name={`att-${child.id}`}
                            value="present"
                            checked={attendance[child.id] === "present"}
                            onChange={() => toggleAttendance(child.id, "present")}
                          />{" "}
                          Present
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`att-${child.id}`}
                            value="absent"
                            checked={attendance[child.id] === "absent"}
                            onChange={() => toggleAttendance(child.id, "absent")}
                          />{" "}
                          Absent
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={saveAttendance}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
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
