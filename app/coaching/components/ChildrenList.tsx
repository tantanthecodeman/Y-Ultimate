"use client";

import { useEffect, useState } from "react";
import {supabase} from "@/lib/supabaseClient";
import { AddChildForm } from "./AddChildForm";

interface Child {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  community: string;
  school?: string;
}

export function ChildrenList() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editChild, setEditChild] = useState<Child | undefined>(undefined);

  async function fetchChildren() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("children")
        .select("id, name, age, gender, community, school");
      
      if (error) throw error;
      setChildren(data ?? []);
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this child?")) return;
    
    const { error } = await supabase.from("children").delete().eq("id", id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      alert("Child deleted successfully");
      fetchChildren();
    }
  }

  useEffect(() => {
    fetchChildren();
  }, []);

  if (loading) return <p>Loading children...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Children Records</h2>
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
          + Add Child
        </button>
      </div>

      {(showAddForm || editChild) && (
        <AddChildForm
          onAdded={() => {
            fetchChildren();
            setShowAddForm(false);
            setEditChild(undefined);
          }}
          onClose={() => {
            setShowAddForm(false);
            setEditChild(undefined);
          }}
          editData={editChild}
        />
      )}

      {children.length === 0 ? (
        <p>No children found. Click &quot;Add Child&quot; to get started.</p>
      ) : (
        <table
          border={1}
          cellPadding={8}
          cellSpacing={0}
          style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Community</th>
              <th>School</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => (
              <tr key={child.id}>
                <td>{child.name}</td>
                <td>{child.age ?? "-"}</td>
                <td>{child.gender ?? "-"}</td>
                <td>{child.community}</td>
                <td>{child.school ?? "-"}</td>
                <td>
                  <button
                    onClick={() => setEditChild(child)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      marginRight: "0.5rem",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
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
