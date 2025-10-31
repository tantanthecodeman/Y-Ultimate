"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AddChildForm } from "./AddChildForm";
import { Child } from "../lib/types"; // ✅ import the Child interface

export function ChildrenList() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // ✅ Fetch all children
  async function fetchChildren(): Promise<void> {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("children")
        .select("id, name, age, gender, community, school");

      if (error) {
        console.error("Error fetching children:", error);
        return;
      }
      setChildren(data ?? []);
    } catch (err) {
      console.error("Unexpected error fetching children:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Delete a child
  async function handleDeleteChild(id: string): Promise<void> {
    const confirmDelete = confirm("Are you sure you want to delete this child?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("children").delete().eq("id", id);
    if (error) {
      alert("Error deleting child: " + error.message);
      console.error(error);
    } else {
      alert("Child deleted successfully!");
      fetchChildren(); // refresh list
    }
  }

  useEffect(() => {
    fetchChildren();
  }, []);

  if (loading) return <p>Loading children...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Children Records</h2>
        <button onClick={() => setShowAddForm(true)}>+ Add Child</button>
      </div>

      <table
        border={1}
        cellPadding={6}
        cellSpacing={0}
        style={{ marginTop: "1rem", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Community</th>
            <th>School</th>
            <th>Actions</th> {/* ✅ Added column */}
          </tr>
        </thead>
        <tbody>
          {children.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.age}</td>
              <td>{c.gender}</td>
              <td>{c.community}</td>
              <td>{c.school}</td>
              <td>
                <button
                  onClick={() => handleDeleteChild(c.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "red",
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

      {showAddForm && (
        <AddChildForm
          onClose={() => setShowAddForm(false)}
          onAdded={fetchChildren}
        />
      )}
    </div>
  );
}
