// Core tournament types
export interface Tournament {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  config?: Record<string, unknown>;
  created_at: string;
  created_by?: string | null;
}

export interface Team {
  id: string;
  tournament_id: string;
  name: string;
  captain_profile_id: string | null;
  created_at: string;
  captain?: {
    id: string;
    full_name: string;
    role: string;
  } | null;
}

export interface Match {
  id: string;
  tournament_id: string;
  home_team_id: string | null;
  away_team_id: string | null;
  start_time: string | null;
  status: 'scheduled' | 'live' | 'completed';
  home_score: number;
  away_score: number;
  field: string | null;
  created_at: string;
  home_team?: {
    id: string;
    name: string;
  } | null;
  away_team?: {
    id: string;
    name: string;
  } | null;
}

export interface Standing {
  team_id: string;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  avg_spirit?: number | null;
}

export interface TeamPlayer {
  id: string;
  team_id: string;
  profile_id: string;
  jersey_number: string | null;
  is_captain: boolean;
  player?: {
    id: string;
    full_name: string;
    role: string;
  } | null;
}

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface SpiritScore {
  id: string;
  match_id: string;
  team_id: string;
  scorer_profile_id: string;
  score: number;
  notes: string | null;
  scores: Record<string, number>;
  created_at: string;
}

// Spirit scoring categories
export const SPIRIT_CATEGORIES = {
  rules_knowledge: 'Rules Knowledge & Use',
  fouls_body_contact: 'Fouls & Body Contact',
  fair_mindedness: 'Fair-Mindedness',
  positive_attitude: 'Positive Attitude & Self-Control',
  communication: 'Communication'
} as const;

export type SpiritCategory = keyof typeof SPIRIT_CATEGORIES;
