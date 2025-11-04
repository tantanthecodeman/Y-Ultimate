'use client';

import { useEffect, useMemo, useState } from 'react';

type Team = { id: string; name: string };

function Field({
  label, children, hint
}: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export default function NewPlayerPage() {
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
    // Load teams for dropdown (anonymous)
    async function loadTeams() {
      try {
        setLoadingTeams(true);
        const res = await fetch('/api/tournament/teams'); // Adjust if you need tournament filter
        const json = await res.json();
        setTeams(json.teams || []);
      } catch {
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    }
    loadTeams();
  }, []);

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
      const res = await fetch('/api/profiles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname,
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

      setMsg(`✅ Player created: ${json.profile.fullname}`);
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
    <div style={{ maxWidth: 760, margin: '24px auto', padding: 16 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Create Player (No Login)</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>
        Create a player profile with optional details. No sign-in required.
      </p>

      {/* Form container */}
      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16
      }}>
        <div style={{ gridColumn: '1 / -1', display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Full name">
            <input
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Jane Doe"
              required
              style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }}
            />
          </Field>

          <Field label="Role">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }}
            >
              <option value="player">Player</option>
              <option value="coach">Coach</option>
              <option value="manager">Manager</option>
            </select>
          </Field>
        </div>

        <Field label="Team">
          {loadingTeams ? (
            <div style={{ padding: 10, color: '#6b7280' }}>Loading teams…</div>
          ) : (
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }}
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
            style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }}
          />
        </Field>

        <Field label="Preferred position">
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Cutter, Handler, etc."
            style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }}
          />
        </Field>

        <Field label="Date of birth">
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }}
          />
        </Field>

        <Field label="Contact email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="player@example.com"
            style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }}
          />
        </Field>

        <Field label="Contact phone">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }}
          />
        </Field>

        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Medical, availability, preferences…"
              style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }}
            />
          </Field>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span style={{ fontSize: 13, color: '#374151' }}>
            I confirm the information is correct and I have consent to submit it.
          </span>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => {
              setFullname(''); setRole('player'); setTeamId(''); setJersey(''); setPosition('');
              setDob(''); setEmail(''); setPhone(''); setNotes(''); setAgree(false); setMsg(null);
            }}
            style={{ padding: '10px 16px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer' }}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Creating…' : 'Create Player'}
          </button>
        </div>
      </form>

      {msg && (
        <div style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: msg.startsWith('✅') ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${msg.startsWith('✅') ? '#a7f3d0' : '#fecaca'}`,
          borderRadius: 8,
          color: msg.startsWith('✅') ? '#065f46' : '#991b1b'
        }}>
          {msg}
        </div>
      )}
    </div>
  );
}
