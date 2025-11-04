-- =====================================================
-- Y-Ultimate Database Schema
-- Complete schema for Tournament & Coaching Management
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE USER & PROFILE TABLES
-- =====================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('player', 'coach', 'td', 'volunteer', 'guardian')),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    jersey_number INTEGER,
    position TEXT,
    dob DATE,
    contact_email TEXT,
    contact_phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TOURNAMENT MODULE TABLES
-- =====================================================

-- Tournaments
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    location TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    captain_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, name)
);

-- Team Players (Roster Management)
CREATE TABLE IF NOT EXISTS team_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    jersey_number TEXT,
    is_captain BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, profile_id)
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    home_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    away_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed')),
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    field TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spirit Scores
CREATE TABLE IF NOT EXISTS spirit_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    scorer_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 20),
    notes TEXT,
    scores JSONB NOT NULL DEFAULT '{}', -- Individual category scores
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, team_id, scorer_profile_id)
);

-- =====================================================
-- COACHING MODULE TABLES
-- =====================================================

-- Children (Coaching Program Participants)
CREATE TABLE IF NOT EXISTS children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    school TEXT,
    community TEXT NOT NULL,
    guardian_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    community TEXT NOT NULL,
    coach_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type TEXT DEFAULT 'practice' CHECK (type IN ('practice', 'game', 'training', 'workshop')),
    duration INTEGER DEFAULT 90, -- in minutes
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaching Sessions (Individual coaching records)
CREATE TABLE IF NOT EXISTS coaching_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    coach_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_date DATE NOT NULL,
    visit_type TEXT,
    location TEXT,
    notes TEXT,
    topic TEXT,
    attendance BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, child_id)
);

-- Assessments (Life Skills Assessment System - LSAS)
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    values JSONB NOT NULL DEFAULT '{}', -- Assessment values/scores
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home Visits
CREATE TABLE IF NOT EXISTS home_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INTEGRATION TABLES (Tournament + Coaching)
-- =====================================================

-- Player Development (Tracks graduation from coaching to tournament play)
CREATE TABLE IF NOT EXISTS player_development (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    graduated BOOLEAN DEFAULT FALSE,
    graduation_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaching Tournament Participation (Children playing in tournaments)
CREATE TABLE IF NOT EXISTS coaching_tournament_participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    jersey_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(child_id, tournament_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Tournament indexes
CREATE INDEX IF NOT EXISTS idx_teams_tournament ON teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_spirit_scores_match ON spirit_scores(match_id);
CREATE INDEX IF NOT EXISTS idx_team_players_team ON team_players(team_id);
CREATE INDEX IF NOT EXISTS idx_team_players_profile ON team_players(profile_id);

-- Coaching indexes
CREATE INDEX IF NOT EXISTS idx_children_community ON children(community);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_sessions_community ON sessions(community);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_child ON attendance(child_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_child ON coaching_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_date ON coaching_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_assessments_child ON assessments(child_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE spirit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_development ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_tournament_participation ENABLE ROW LEVEL SECURITY;

-- Public read access policies (adjust based on your needs)
CREATE POLICY "Public read access on profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read access on tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public read access on teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access on matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access on team_players" ON team_players FOR SELECT USING (true);

-- Authenticated users can insert (adjust based on your auth requirements)
CREATE POLICY "Authenticated users can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can insert teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can insert team_players" ON team_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can insert spirit_scores" ON spirit_scores FOR INSERT WITH CHECK (true);

-- Coaching module - authenticated coaches only
CREATE POLICY "Authenticated read on children" ON children FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated insert on children" ON children FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read on sessions" ON sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated insert on sessions" ON sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated all on attendance" ON attendance FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated all on coaching_sessions" ON coaching_sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated all on assessments" ON assessments FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- VIEWS FOR REPORTING & ANALYTICS
-- =====================================================

-- Tournament Standings View
CREATE OR REPLACE VIEW tournament_standings AS
SELECT 
    t.id AS tournament_id,
    tm.id AS team_id,
    tm.name AS team_name,
    COUNT(DISTINCT m.id) AS played,
    COUNT(DISTINCT CASE 
        WHEN (m.home_team_id = tm.id AND m.home_score > m.away_score) 
        OR (m.away_team_id = tm.id AND m.away_score > m.home_score) 
        THEN m.id 
    END) AS wins,
    COUNT(DISTINCT CASE 
        WHEN m.home_score = m.away_score 
        THEN m.id 
    END) AS draws,
    COUNT(DISTINCT CASE 
        WHEN (m.home_team_id = tm.id AND m.home_score < m.away_score) 
        OR (m.away_team_id = tm.id AND m.away_score < m.home_score) 
        THEN m.id 
    END) AS losses,
    (COUNT(DISTINCT CASE 
        WHEN (m.home_team_id = tm.id AND m.home_score > m.away_score) 
        OR (m.away_team_id = tm.id AND m.away_score > m.home_score) 
        THEN m.id 
    END) * 3) + COUNT(DISTINCT CASE 
        WHEN m.home_score = m.away_score 
        THEN m.id 
    END) AS points,
    AVG(ss.score) AS avg_spirit
FROM tournaments t
JOIN teams tm ON t.id = tm.tournament_id
LEFT JOIN matches m ON (m.home_team_id = tm.id OR m.away_team_id = tm.id) 
    AND m.status = 'completed'
LEFT JOIN spirit_scores ss ON ss.team_id = tm.id
GROUP BY t.id, tm.id, tm.name
ORDER BY points DESC, avg_spirit DESC;

-- Child Attendance Summary View
CREATE OR REPLACE VIEW child_attendance_summary AS
SELECT 
    c.id AS child_id,
    c.name,
    c.community,
    COUNT(DISTINCT a.session_id) AS sessions_attended,
    COUNT(DISTINCT s.id) FILTER (WHERE s.community = c.community) AS total_sessions,
    ROUND(
        (COUNT(DISTINCT a.session_id)::NUMERIC / 
        NULLIF(COUNT(DISTINCT s.id) FILTER (WHERE s.community = c.community), 0)) * 100, 
        2
    ) AS attendance_rate
FROM children c
LEFT JOIN attendance a ON c.id = a.child_id AND a.status = 'present'
LEFT JOIN sessions s ON s.community = c.community
GROUP BY c.id, c.name, c.community;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update match status automatically
CREATE OR REPLACE FUNCTION update_match_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.home_score > 0 OR NEW.away_score > 0 THEN
        NEW.status = 'live';
    END IF;
    IF NEW.home_score >= 15 OR NEW.away_score >= 15 THEN
        NEW.status = 'completed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER match_status_trigger
BEFORE UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_match_status();

-- Function to auto-assign jersey numbers
CREATE OR REPLACE FUNCTION auto_assign_jersey()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.jersey_number IS NULL THEN
        NEW.jersey_number = (
            SELECT COALESCE(MAX(jersey_number::INTEGER), 0) + 1
            FROM team_players
            WHERE team_id = NEW.team_id
            AND jersey_number ~ '^[0-9]+$'
        )::TEXT;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_jersey_trigger
BEFORE INSERT ON team_players
FOR EACH ROW
EXECUTE FUNCTION auto_assign_jersey();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample data
/*
-- Sample Profiles
INSERT INTO profiles (full_name, role) VALUES
    ('John Doe', 'player'),
    ('Jane Smith', 'coach'),
    ('Mike Johnson', 'td'),
    ('Sarah Williams', 'volunteer');

-- Sample Tournament
INSERT INTO tournaments (name, start_date, end_date, location) VALUES
    ('Summer Championship 2025', '2025-06-01', '2025-06-03', 'Bangalore');

-- Sample Teams
INSERT INTO teams (tournament_id, name, captain_profile_id) 
SELECT id, 'Thunder Bolts', (SELECT id FROM profiles WHERE role = 'player' LIMIT 1)
FROM tournaments LIMIT 1;

INSERT INTO teams (tournament_id, name, captain_profile_id) 
SELECT id, 'Flying Dragons', (SELECT id FROM profiles WHERE role = 'player' LIMIT 1 OFFSET 1)
FROM tournaments LIMIT 1;
*/

-- =====================================================
-- END OF SCHEMA
-- =====================================================