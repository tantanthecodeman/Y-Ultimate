"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function AddChildModal({
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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("children").insert([
      {
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        community: form.community,
        school: form.school,
      },
    ]);

    if (error) alert("Error adding child: " + error.message);
    else {
      onAdded();
      onClose();
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Child</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Age"
            required
            className="w-full border p-2 rounded"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          <select
            required
            className="w-full border p-2 rounded"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            type="text"
            placeholder="Community"
            required
            className="w-full border p-2 rounded"
            value={form.community}
            onChange={(e) => setForm({ ...form, community: e.target.value })}
          />

          <input
            type="text"
            placeholder="School"
            required
            className="w-full border p-2 rounded"
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
