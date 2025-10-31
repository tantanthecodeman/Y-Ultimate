"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Coach {
  id: string;
  name: string;
}

interface AddSessionFormProps {
  onClose: () => void;
  onAdded: () => void;
}

export function AddSessionForm({ onClose, onAdded }: AddSessionFormProps) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [formData, setFormData] = useState({
    date: "",
    community: "",
    coach_id: "",
    type: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all coaches to populate dropdown
  useEffect(() => {
    async function fetchCoaches() {
      const { data, error } = await supabase
        .from("coaches")
        .select("id, name")
        .order("name", { ascending: true });
      if (error) console.error("Error fetching coaches:", error);
      else setCoaches(data || []);
    }

    fetchCoaches();
  }, []);

  // ✅ Handle form submission
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { date, community, coach_id, type, duration } = formData;

    const { error } = await supabase.from("sessions").insert([
      {
        date,
        community,
        coach_id, // uses selected coach’s UUID
        type,
        duration: Number(duration),
      },
    ]);

    if (error) {
      console.error("Error adding session:", error);
      alert("Failed to add session.");
    } else {
      alert("✅ Session added successfully!");
      onAdded(); // refresh parent list
      onClose(); // close modal/form
    }

    setLoading(false);
  }

  // ✅ Handle form input change
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div
      style={{
        background: "#f9fafb",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginTop: "1rem",
      }}
    >
      <h3 style={{ marginBottom: "1rem", fontWeight: "bold" }}>
        Add New Session
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Community:</label>
          <input
            type="text"
            name="community"
            value={formData.community}
            onChange={handleChange}
            placeholder="Enter community name"
            required
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Coach:</label>
          <select
            name="coach_id"
            value={formData.coach_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Coach</option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Football, Yoga, etc."
            required
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Duration (min):</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "0.5rem",
            }}
          >
            {loading ? "Adding..." : "Add Session"}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#e5e7eb",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
