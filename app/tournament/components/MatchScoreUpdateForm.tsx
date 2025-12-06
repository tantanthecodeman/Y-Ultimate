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
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const homeName = match.home_team?.name || "Home Team";
  const awayName = match.away_team?.name || "Away Team";

  return (
    <form
      onSubmit={handleSubmit}
      className="card white"
      style={{
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 10px 18px rgba(15,23,42,0.10)",
      }}
    >
      {/* Heading */}
      <div className="mb-2">
        <div
          style={{
            display: "inline-block",
            marginBottom: 8,
          }}
        >
          <span
            className="tape-banner"
            style={{
              display: "inline-block",
              fontSize: 14,
              padding: "6px 14px",
              textTransform: "uppercase",
            }}
          >
            Update match score
          </span>
        </div>

        <h3
          style={{
            margin: "0 0 4px 0",
            fontFamily: '"Bangers", cursive',
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {homeName} vs {awayName}
        </h3>
        <p
          style={{
            margin: 0,
            color: "#6B7280",
            fontSize: 14,
          }}
        >
          Enter scores and update match status.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Home score */}
      <div className="mb-3">
        <label>
          {homeName} Score
        </label>
        <input
          type="number"
          value={homeScore}
          onChange={(e) => setHomeScore(Number(e.target.value))}
          min={0}
          required
          disabled={loading}
        />
      </div>

      {/* Away score */}
      <div className="mb-3">
        <label>
          {awayName} Score
        </label>
        <input
          type="number"
          value={awayScore}
          onChange={(e) => setAwayScore(Number(e.target.value))}
          min={0}
          required
          disabled={loading}
        />
      </div>

      {/* Status */}
      <div className="mb-3">
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
        >
          <option value="scheduled">Scheduled</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 8,
        }}
      >
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{
            flex: 1,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Updating..." : "Update Score"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn btn-secondary"
            style={{
              flex: 1,
              opacity: loading ? 0.9 : 1,
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
