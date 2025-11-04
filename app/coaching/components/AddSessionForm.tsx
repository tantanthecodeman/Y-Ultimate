"use client";
import { useState } from "react";
import {supabase} from "@/lib/supabaseClient";

export function AddSessionForm({
  onAdded,
  onClose,
}: {
  onAdded: () => void;
  onClose: () => void;
}) {
  const [date, setDate] = useState("");
  const [community, setCommunity] = useState("");
  const [type, setType] = useState("practice");
  const [duration, setDuration] = useState<number | "">(90);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !community || !type) {
      setError("Date, Community, and Type are required");
      return;
    }

    const { error: dbError } = await supabase.from("sessions").insert({
      date,
      community,
      type,
      duration: duration === "" ? null : duration,
      notes,
    });

    if (dbError) {
      setError(dbError.message);
    } else {
      onAdded();
      onClose();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "8px",
        backgroundColor: "#f9fafb",
      }}
    >
      <h3>Add Session</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>Date*:</label>
      <br />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <br />

      <label>Community*:</label>
      <br />
      <input
        type="text"
        value={community}
        onChange={(e) => setCommunity(e.target.value)}
        required
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <br />

      <label>Type*:</label>
      <br />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      >
        <option value="practice">Practice</option>
        <option value="game">Game</option>
        <option value="training">Training</option>
        <option value="workshop">Workshop</option>
      </select>
      <br />

      <label>Duration (minutes):</label>
      <br />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <br />

      <label>Notes:</label>
      <br />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <br />

      <button
        type="submit"
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "0.5rem",
        }}
      >
        Add Session
      </button>
      <button
        type="button"
        onClick={onClose}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#6b7280",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginLeft: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        Cancel
      </button>
    </form>
  );
}
