"use client";
import { useState } from "react";
import {supabase} from "@/lib/supabaseClient";

export function AddSessionForm({ onAdded, onClose, childId, coachProfileId }: { onAdded: () => void; onClose: () => void; childId: string; coachProfileId: string; }) {
  const [sessionDate, setSessionDate] = useState("");
  const [visitType, setVisitType] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [topic, setTopic] = useState("");
  const [attendance, setAttendance] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionDate) {
      setError("Session date is required");
      return;
    }
    const { error } = await supabase.from("coaching_sessions").insert({
      child_id: childId,
      coach_profile_id: coachProfileId,
      session_date: sessionDate,
      visit_type: visitType,
      location,
      notes,
      topic,
      attendance,
    });
    if (error) {
      setError(error.message);
    } else {
      onAdded();
      onClose();
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "1rem", border: "1px solid #ccc" }}>
      <h3>Add Coaching Session</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>Session Date*</label><br />
      <input type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)} required /><br />

      <label>Visit Type</label><br />
      <input type="text" value={visitType} onChange={e => setVisitType(e.target.value)} /><br />

      <label>Location</label><br />
      <input type="text" value={location} onChange={e => setLocation(e.target.value)} /><br />

      <label>Topic</label><br />
      <input type="text" value={topic} onChange={e => setTopic(e.target.value)} /><br />

      <label>Notes</label><br />
      <textarea value={notes} onChange={e => setNotes(e.target.value)} /><br />

      <label>Attended?</label><br />
      <select value={attendance === null ? "" : attendance ? "yes" : "no"} onChange={e => setAttendance(e.target.value === "yes" ? true : e.target.value === "no" ? false : null)} >
        <option value=""></option>
        <option value="yes">Present</option>
        <option value="no">Absent</option>
      </select><br />

      <button type="submit" style={{ marginTop: "1rem" }}>Add Session</button>
      <button type="button" onClick={onClose} style={{ marginLeft: "1rem" }}>Cancel</button>
    </form>
  );
}
