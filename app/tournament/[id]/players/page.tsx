'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { NavigationHeader, TapeBanner, Card, Button } from '@/lib/ui/components';

type Team = { id: string; name: string };

function Field({
  label, children, hint
}: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 18, color: '#374151', marginBottom: 10 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>{hint}</div>}
    </div>
  );
}

export default function NewPlayerPage() {
  const params = useParams();
  const tournamentId = params.id as string;
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Form fields
  const [fullname, setFullname] = useState('');
  const [role, setRole] = useState('player');
  const [teamId, setTeamId] = useState('');
  const [jersey, setJersey] = useState<string>('');
  const [position, setPosition] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [agree, setAgree] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load teams for dropdown
    async function loadTeams() {
      try {
        setLoadingTeams(true);
        const res = await fetch(`/api/tournament/teams?tournament_id=${tournamentId}`);
        const json = await res.json();
        setTeams(json.teams || []);
      } catch {
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    }
    loadTeams();
  }, [tournamentId]);

  const jerseyNum = useMemo(() => {
    const n = Number(jersey);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }, [jersey]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!agree) {
      setMsg('Please accept the declaration to continue.');
      return;
    }

    setSubmitting(true);
    try {
      // FIXED: Changed from /api/profiles/create to /api/profile/create
      // FIXED: Changed fullname to full_name to match API expectation
      const res = await fetch('/api/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullname, // CHANGED: was 'fullname'
          role,
          team_id: teamId || null,
          jersey_number: jerseyNum,
          position: position || null,
          dob: dob || null,
          contact_email: email || null,
          contact_phone: phone || null,
          notes: notes || null,
        }),
      });

      const text = await res.text();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Server did not return JSON. Response: ${text.slice(0, 120)}…`);
      }

      if (!res.ok) throw new Error(json.error || 'Failed to create player');

      setMsg(`✅ Player created: ${json.profile.full_name}`);
      // Reset form
      setFullname('');
      setRole('player');
      setTeamId('');
      setJersey('');
      setPosition('');
      setDob('');
      setEmail('');
      setPhone('');
      setNotes('');
      setAgree(false);
    } catch (err: unknown) {
      setMsg(`❌ ${err instanceof Error ? err.message : 'Unexpected error'}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '64px', background: '#FFF' }}>
      <NavigationHeader currentPage="tournament" />

      <div className="container" style={{ maxWidth: '880px', paddingTop: '20px' }}>
        {/* Back link */}
        <Link
          href={`/tournament/${tournamentId}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginBottom: '18px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#6B7280',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          ← BACK TO TOURNAMENT
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <TapeBanner color="blue">PLAYER REGISTRATION</TapeBanner>
          </div>

          <h1
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: 'clamp(32px, 10vw, 40px)',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              margin: '0 0 6px 0',
            }}
          >
            CREATE NEW PLAYER
          </h1>

          <div
            style={{
              width: '80px',
              height: '4px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #E63946, #1D4ED8)',
              margin: '8px 0 10px',
            }}
          />
          
          
        </div>

        {/* Form Card */}
        <Card white rotation={false}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Full name">
                <input
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  disabled={submitting}
                  style={{ width: '100%', padding: 10, border: '3px solid #000', borderRadius: 12 }}
                />
              </Field>

              <Field label="Role">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={submitting}
                  style={{ width: '100%', padding: 10, border: '3px solid #000', borderRadius: 12 }}
                >
                  <option value="player">Player</option>
                  <option value="coach">Coach</option>
                  <option value="td">Tournament Director</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Team">
                {loadingTeams ? (
                  <div style={{ padding: 10, color: '#6b7280' }}>Loading teams...</div>
                ) : (
                  <select
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    disabled={submitting}
                    style={{ width: '100%', padding: 10, border: '3px solid #000', borderRadius: 12 }}
                  >
                    <option value="">No team</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                )}
              </Field>

              <Field label="Jersey number" hint="Optional, numeric">
                <input
                  value={jersey}
                  onChange={(e) => setJersey(e.target.value)}
                  inputMode="numeric"
                  placeholder="10"
                  disabled={submitting}
                  style={{ width: '100%', padding: 10, border: '3px solid #000', borderRadius: 12 }}
                />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Preferred position">
                <input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Cutter, Handler, etc."
                  disabled={submitting}
                  style={{ width: '100%', padding: 10, border: '3px solid #000', borderRadius: 12 }}
                />
              </Field>

              <Field label="Date of birth">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  disabled={submitting}
                  style={{ width: '100%', padding: 10, border: '3px solid #000', borderRadius: 12 }}
                />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Contact email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  disabled={submitting}
                  style={{ width: '100%', padding: 10, border: '3px solid #000', borderRadius: 12 }}
                />
              </Field>

              <Field label="Contact phone">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  disabled={submitting}
                  style={{ width: '100%', padding: 10, border: '3px solid #000', borderRadius: 12 }}
                />
              </Field>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Field label="Notes">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Medical conditions, availability, preferences…"
                  disabled={submitting}
                  style={{ width: '100%', padding: 10, border: '3px solid #000', borderRadius: 12 }}
                />
              </Field>
            </div>

            {/* Consent Section - Improved visibility */}
            <div style={{
              padding: '16px',
              background: '#F9FAFB',
              border: '3px solid #000',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                <input 
                  type="checkbox" 
                  checked={agree} 
                  onChange={(e) => setAgree(e.target.checked)}
                  disabled={submitting}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginTop: '2px',
                    cursor: 'pointer',
                    accentColor: '#1D4ED8'
                  }}
                />
                <span style={{ 
                  color: '#111827',
                  fontWeight: 500
                }}>
                  I confirm that the information provided is accurate and I have obtained 
                  the necessary consent to submit this player registration.
                </span>
              </label>
            </div>

            {msg && (
              <div style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: msg.startsWith('✅') ? '#ecfdf5' : '#fef2f2',
                border: `3px solid ${msg.startsWith('✅') ? '#a7f3d0' : '#fecaca'}`,
                borderRadius: 12,
                color: msg.startsWith('✅') ? '#065f46' : '#991b1b'
              }}>
                {msg}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setFullname(''); setRole('player'); setTeamId(''); setJersey(''); 
                  setPosition(''); setDob(''); setEmail(''); setPhone(''); 
                  setNotes(''); setAgree(false); setMsg(null);
                }}
                disabled={submitting}
              >
                CLEAR
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || !agree}
              >
                {submitting ? 'CREATING...' : 'CREATE PLAYER'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}