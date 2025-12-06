"use client";
import { useEffect, useState } from "react";
import { Standing } from "../lib/types";
import { supabase } from "@/lib/supabaseClient";

interface StandingsTableProps {
  standings: Standing[];
  loading?: boolean;
  showSpirit?: boolean;
}

interface TeamData {
  id: string;
  name: string;
}

export default function StandingsTable({
  standings,
  loading = false,
  showSpirit = true,
}: StandingsTableProps) {
  const [teams, setTeams] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchTeamNames() {
      if (standings.length === 0) return;

      const teamIds = standings.map((s) => s.team_id);
      const { data } = await supabase
        .from("teams")
        .select("id, name")
        .in("id", teamIds);

      if (data) {
        const teamMap: Record<string, string> = {};
        data.forEach((team: TeamData) => {
          teamMap[team.id] = team.name;
        });
        setTeams(teamMap);
      }
    }
    fetchTeamNames();
  }, [standings]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 40,
          color: "#6B7280",
          fontSize: 14,
          borderRadius: 20,
          border: "3px dashed #000",
          background: "#F9FAFB",
        }}
      >
        Loading standings...
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div
        className="empty-state"
        style={{
          padding: 40,
        }}
      >
        <div className="empty-state-title">No standings yet</div>
        <p className="empty-state-text">
          Once matches are completed, standings will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: "center", width: 100 }}>Rank</th>
            <th style={{ textAlign: "left" }}>Team</th>
            <th style={{ textAlign: "center", width: 60 }}>P</th>
            <th style={{ textAlign: "center", width: 60 }}>W</th>
            <th style={{ textAlign: "center", width: 60 }}>D</th>
            <th style={{ textAlign: "center", width: 60 }}>L</th>
            <th
              style={{
                textAlign: "center",
                width: 80,
              }}
            >
              Points
            </th>
            {showSpirit && (
              <th
                style={{
                  textAlign: "center",
                  width: 80,
                }}
              >
                Spirit
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => {
            const isTopThree = index < 3;
            const rank = index + 1;
            const teamName = teams[standing.team_id] || standing.team_id;

            return (
              <tr
                key={standing.team_id}
                style={{
                  backgroundColor: isTopThree ? "#F0FDF4" : "#FFFFFF",
                }}
              >
                <td
                  style={{
                    textAlign: "center",
                    fontFamily: '"Bangers", cursive',
                    fontSize: 18,
                    letterSpacing: "0.09em",
                  }}
                >
                  {rank}
                </td>
                <td
                  style={{
                    fontFamily: '"Bangers", cursive',
                    fontSize: 16,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#111827",
                  }}
                >
                  {teamName}
                </td>
                <td style={{ textAlign: "center" }}>{standing.played}</td>
                <td
                  style={{
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#10B981",
                  }}
                >
                  {standing.wins}
                </td>
                <td style={{ textAlign: "center" }}>{standing.draws}</td>
                <td
                  style={{
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#EF4444",
                  }}
                >
                  {standing.losses}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    fontFamily: '"Bangers", cursive',
                    fontSize: 18,
                    letterSpacing: "0.06em",
                  }}
                >
                  {standing.points}
                </td>
                {showSpirit && (
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1E40AF",
                    }}
                  >
                    {standing.avg_spirit
                      ? standing.avg_spirit.toFixed(1)
                      : "-"}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div
        style={{
          padding: "12px 16px",
          fontSize: 12,
          color: "#6B7280",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginTop: 8,
        }}
      >
        <span>
          <strong>P</strong>: Played
        </span>
        <span>
          <strong>W</strong>: Won
        </span>
        <span>
          <strong>D</strong>: Draw
        </span>
        <span>
          <strong>L</strong>: Lost
        </span>
        <span>
          <strong>Points</strong>: W=3, D=1
        </span>
        {showSpirit && (
          <span>
            <strong>Spirit</strong>: Average spirit score
          </span>
        )}
      </div>
    </div>
  );
}
