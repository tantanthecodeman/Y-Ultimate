// =====================================================
// SHARED TYPES
// =====================================================

export interface Profile {
  id: string;
  full_name: string;
  role: 'player' | 'coach' | 'td' | 'volunteer' | 'guardian';
  created_at: string;
}

// =====================================================
// TOURNAMENT MODULE TYPES
// =====================================================

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

export const SPIRIT_CATEGORIES = {
  rules_knowledge: 'Rules Knowledge & Use',
  fouls_body_contact: 'Fouls & Body Contact',
  fair_mindedness: 'Fair-Mindedness',
  positive_attitude: 'Positive Attitude & Self-Control',
  communication: 'Communication'
} as const;

export type SpiritCategory = keyof typeof SPIRIT_CATEGORIES;

// =====================================================
// COACHING MODULE TYPES
// =====================================================

export interface Child {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  community: string;
  school: string;
  guardian_profile_id?: string | null;
  created_at: string;
}

export interface Coach {
  id: string;
  name: string;
  specialization?: string | null;
  bio?: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  date: string;
  community: string;
  coach_id?: string | null;
  type: string;
  duration: number; // in minutes
  notes?: string | null;
  created_at: string;
  coaches?: Coach | null;
}

export interface Attendance {
  id?: string;
  session_id: string;
  child_id: string;
  status: 'present' | 'absent';
  created_at?: string;
}

export interface CoachingSession {
  id: string;
  child_id: string;
  coach_profile_id: string | null;
  session_date: string;
  notes: string | null;
  skills_practiced: string[];
  progress_rating: number | null; // 1-5
  created_at: string;
}

export interface AttendanceRecord {
  date: string;
  presentCount: number;
  absentCount: number;
}

// =====================================================
// INTEGRATION TYPES
// =====================================================

export interface PlayerDevelopment {
  id: string;
  child_id: string;
  profile_id: string | null;
  graduated: boolean;
  graduation_date: string | null;
  notes: string | null;
  created_at: string;
  child?: Child;
  profile?: Profile | null;
}

export interface CoachingTournamentParticipation {
  id: string;
  child_id: string;
  tournament_id: string;
  team_id: string | null;
  jersey_number: string | null;
  created_at: string;
  child?: Child;
  tournament?: Tournament;
  team?: Team | null;
}

// =====================================================
// VIEW/REPORT TYPES
// =====================================================

export interface ChildAttendanceSummary {
  id: string;
  name: string;
  community: string;
  sessions_attended: number;
  total_sessions: number;
  attendance_rate: number;
}

export interface CoachSessionSummary {
  id: string;
  name: string;
  total_sessions: number;
  communities_served: number;
  total_minutes_coached: number;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}