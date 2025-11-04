"use client";
import { useState, useEffect } from "react";
import {supabase} from "@/lib/supabaseClient";

interface Child {
  id?: string;
  name: string;
  age?: number;
  gender?: string;
  school?: string;
  community: string;
}

export function AddChildForm({
  onAdded,
  onClose,
  editData,
}: {
  onAdded: () => void;
  onClose: () => void;
  editData?: Child;
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [school, setSchool] = useState("");
  const [community, setCommunity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setAge(editData.age ?? "");
      setGender(editData.gender ?? "");
      setSchool(editData.school ?? "");
      setCommunity(editData.community);
    }
  }, [editData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !community.trim()) {
      setError("Name and Community are required");
      return;
    }

    const payload = {
      name,
      age: age === "" ? null : age,
      gender,
      school,
      community,
    };

    let dbError;
    if (editData?.id) {
      ({ error: dbError } = await supabase.from("children").update(payload).eq("id", editData.id));
    } else {
      ({ error: dbError } = await supabase.from("children").insert(payload));
    }

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
      <h3>{editData ? "Edit Child" : "Add Child"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>Name*:</label>
      <br />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <br />

      <label>Age:</label>
      <br />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <br />

      <label>Gender:</label>
      <br />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      >
        <option value="">Select...</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <br />

      <label>School:</label>
      <br />
      <input
        type="text"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
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
        {editData ? "Update" : "Add"}
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
