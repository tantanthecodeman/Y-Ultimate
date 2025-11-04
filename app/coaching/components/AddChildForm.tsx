"use client";
import { useState } from "react";
import {supabase} from "@/lib/supabaseClient";

export function AddChildForm({ onAdded, onClose }: { onAdded: () => void; onClose: () => void; }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [school, setSchool] = useState("");
  const [community, setCommunity] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !community) {
      setError("Name and Community are required");
      return;
    }
    const { error } = await supabase.from("children").insert({
      name,
      age: age === "" ? null : age,
      gender,
      school,
      community,
    });
    if (error) {
      setError(error.message);
    } else {
      setError("");
      onAdded();
      onClose();
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "1rem" }}>
      <h3>Add Child</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>Name*:</label><br />
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required /><br />

      <label>Age:</label><br />
      <input type="number" value={age} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} /><br />

      <label>Gender:</label><br />
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select...</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select><br />

      <label>School:</label><br />
      <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} /><br />

      <label>Community*:</label><br />
      <input type="text" value={community} onChange={(e) => setCommunity(e.target.value)} required /><br />

      <button type="submit" style={{ marginTop: "1rem" }}>Add Child</button>
      <button type="button" onClick={onClose} style={{ marginLeft: "1rem" }}>Cancel</button>
    </form>
  );
}
