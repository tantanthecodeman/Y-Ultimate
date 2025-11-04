"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SpiritScoreForm from "../../components/SpiritScoreForm";
import {supabase} from "@/lib/supabaseClient";

interface Team {
  id: string;
  name: string;
}

interface Match {
  id: string;
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;
  home_score?: number;
  away_score?: number;
  status: string;
}

interface MatchWithTeams extends Match {
  home_team: Team | null;
  away_team: Team | null;
}

export default function SpiritScorePage() {
  const params = useParams();
  const tournamentId = params.id as string;
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [scorerProfileId, setScorerProfileId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setScorerProfileId(user.id);
      }

      // Load all teams first
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("id, name")
        .eq("tournament_id", tournamentId);

      if (teamsError) {
        console.error("Teams fetch error:", teamsError);
        setTeams([]);
      } else {
        setTeams(teamsData || []);
      }

      // Load completed matches
      const { data: matchesData, error: matchError } = await supabase
        .from("matches")
        .select("id, tournament_id, home_team_id, away_team_id, home_score, away_score, status")
        .eq("tournament_id", tournamentId)
        .eq("status", "completed");

      if (matchError) {
        console.error("Match fetch error:", matchError);
        setError("Failed to load matches");
        setMatches([]);
      } else {
        // Manually join team data
        const teamsMap = new Map(teamsData?.map(t => [t.id, t]) || []);
        const matchesWithTeams: MatchWithTeams[] = (matchesData || []).map(match => ({
          ...match,
          home_team: teamsMap.get(match.home_team_id) || null,
          away_team: teamsMap.get(match.away_team_id) || null,
        }));
        setMatches(matchesWithTeams);
      }
    } catch (err: unknown) {
      console.error("Failed to load data", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmitSuccess() {
    setSubmitted(true);
    setSelectedMatch("");
    setSelectedTeam("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  const selectedMatchData = matches.find((m) => m.id === selectedMatch);
  const selectedTeamData = teams.find((t) => t.id === selectedTeam);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!scorerProfileId) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p style={{ color: "#ef4444", marginBottom: 16 }}>
          You must be logged in to submit spirit scores.
        </p>
        <Link href="/tournament/auth/login" style={{ color: "#3b82f6", textDecoration: "underline" }}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Link
        href={`/tournament/${tournamentId}`}
        style={{ display: "inline-block", marginBottom: 16, color: "#3b82f6", fontSize: 14 }}
      >
        ← Back to Tournament
      </Link>

      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Submit Spirit Score</h1>

      {error && (
        <div
          style={{
            padding: 16,
            backgroundColor: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            marginBottom: 24,
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {submitted && (
        <div
          style={{
            padding: 16,
            backgroundColor: "#d1fae5",
            border: "1px solid #6ee7b7",
            borderRadius: 8,
            marginBottom: 24,
            color: "#065f46",
          }}
        >
          Spirit score submitted successfully!
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Select Match
        </label>
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="">-- Select a Match --</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.home_team?.name || "Unknown"} vs {m.away_team?.name || "Unknown"}
            </option>
          ))}
        </select>
      </div>

      {matches.length === 0 && !loading && (
        <p style={{ color: "#6b7280", fontStyle: "italic", marginBottom: 24 }}>
          No completed matches found. Complete a match first to submit spirit scores.
        </p>
      )}

      {selectedMatch && selectedMatchData && (
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Select Team to Score
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6 }}
          >
            <option value="">-- Select a Team --</option>
            {selectedMatchData.home_team && (
              <option value={selectedMatchData.home_team_id}>
                {selectedMatchData.home_team.name}
              </option>
            )}
            {selectedMatchData.away_team && (
              <option value={selectedMatchData.away_team_id}>
                {selectedMatchData.away_team.name}
              </option>
            )}
          </select>
        </div>
      )}

      {selectedMatch && selectedTeam && (
        <SpiritScoreForm
          matchId={selectedMatch}
          teamId={selectedTeam}
          scorerProfileId={scorerProfileId}
          teamName={selectedTeamData?.name}
          onSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
}
