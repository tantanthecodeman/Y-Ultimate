"use client";
import { useState } from "react";
import { Match } from "../lib/types";

interface MatchScoreUpdateFormProps {
  match: Match;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MatchScoreUpdateForm({
  match,
  onSuccess,
  onCancel,
}: MatchScoreUpdateFormProps) {
  const [homeScore, setHomeScore] = useState<number>(match.home_score ?? 0);
  const [awayScore, setAwayScore] = useState<number>(match.away_score ?? 0);
  const [status, setStatus] = useState<string>(match.status || "scheduled");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tournament/match/update-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchid: match.id,
          homescore: homeScore,
          awayscore: awayScore,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update score");
      }

      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700 }}>
        Update Match Score
      </h3>

      {error && (
        <div style={{ padding: 12, backgroundColor: "#fee2e2", border: "1px solid #fecaca", borderRadius: 6, marginBottom: 16, color: "#991b1b" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
          {match.home_team?.name || "Home Team"} Score
        </label>
        <input
          type="number"
          value={homeScore}
          onChange={(e) => setHomeScore(Number(e.target.value))}
          min={0}
          required
          disabled={loading}
          style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
          {match.away_team?.name || "Away Team"} Score
        </label>
        <input
          type="number"
          value={awayScore}
          onChange={(e) => setAwayScore(Number(e.target.value))}
          min={0}
          required
          disabled={loading}
          style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
          style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="scheduled">Scheduled</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: loading ? "#9ca3af" : "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Updating..." : "Update Score"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
