"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function AddChildForm({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    community: "",
    school: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("children").insert([
      {
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        community: form.community,
        school: form.school,
      },
    ]);

    if (error) {
      alert("Error adding child: " + error.message);
    } else {
      alert("Child added successfully!");
      onAdded();
      onClose();
    }
  }

  return (
    <div
      style={{
        background: "#f9f9f9",
        border: "1px solid #ccc",
        padding: "1rem",
        marginTop: "1rem",
      }}
    >
      <h3>Add New Child</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <br />

        <input
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <br />

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          required
        >
          <option value="">Select gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <br />

        <input
          placeholder="Community"
          value={form.community}
          onChange={(e) => setForm({ ...form, community: e.target.value })}
          required
        />
        <br />

        <input
          placeholder="School"
          value={form.school}
          onChange={(e) => setForm({ ...form, school: e.target.value })}
          required
        />
        <br />

        <div style={{ marginTop: "1rem" }}>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose} style={{ marginLeft: "0.5rem" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
