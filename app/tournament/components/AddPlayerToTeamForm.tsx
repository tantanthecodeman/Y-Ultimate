'use client';

import { useState, useEffect } from 'react';
import { Profile } from '../lib/types';
import PlayerProfileCard from './PlayerProfileCard';

interface AddPlayerToTeamFormProps {
  teamId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddPlayerToTeamForm({
  teamId,
  onSuccess,
  onCancel,
}: AddPlayerToTeamFormProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [isCaptain, setIsCaptain] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function loadProfiles() {
    try {
      setLoading(true);
      const url = `/api/profile/list?role=player${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setProfiles(data.profiles || []);
      } else {
        setProfiles([]);
      }
    } catch (err: unknown) {
      console.error('Failed to load profiles', err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!selectedProfile) {
      setError('Please select a player');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/tournament/team/add-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: teamId,
          profile_id: selectedProfile,
          jersey_number: jerseyNumber || null,
          is_captain: isCaptain,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to add player');
      }

      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="add-player-card card-jiggle">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
        <div>
          <div className="tape-banner">Add player</div>
          <h3 style={{ margin: '16px 0 6px 0', fontSize: 20, fontWeight: 700, fontFamily: '"Bangers", cursive' }}>
            Add Player to Team
          </h3>
          <div style={{ fontSize: 14, color: '#6b7280' }}>Pick a player from existing profiles or search to invite new players.</div>
        </div>

        <div style={{ minWidth: 120, textAlign: 'right' }}>
          
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 16, fontWeight: 700, color: '#374151' }}>
            Search players
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name..."
            className="search-input"
          />
        </div>

        {/* Player List */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 16, fontWeight: 700, color: '#374151' }}>
            Select player 
          </label>

          {loading ? (
            <div className="empty">Loading players...</div>
          ) : profiles.length === 0 ? (
            <div className="empty">{search ? 'No players found' : 'No players available'}</div>
          ) : (
            <div className="profiles-list">
              {profiles.map((profile) => (
                <PlayerProfileCard
                  key={profile.id}
                  profile={profile}
                  selected={selectedProfile === profile.id}
                  onSelect={setSelectedProfile}
                />
              ))}
            </div>
          )}
        </div>

        {/* Jersey Number */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 16, fontWeight: 700, color: '#374151' }}>
            Jersey number (optional)
          </label>
          <input
            type="text"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            placeholder="e.g., 7"
            disabled={submitting}
            className="field-input"
          />
        </div>

        {/* Captain Toggle */}
<div className="form-section" style={{ marginBottom: 18 }}>
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,     // tightened gap
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: 16,
      color: '#111827',
    }}
  >
    <span style={{ flexShrink: 0 }}>Make this player the captain</span>

    <button
      type="button"
      aria-pressed={isCaptain}
      onClick={() => setIsCaptain((s) => !s)}
      className={`toggle-big ${isCaptain ? 'on' : 'off'}`}
      style={{ flexShrink: 0 }}
    >
      <div className="toggle-track">
        <div className="toggle-thumb" />
      </div>
    </button>
  </label>
</div>


        {error && <div className="error-box">❌ {error}</div>}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !selectedProfile}
            className="btn btn-primary"
            style={{ opacity: submitting || !selectedProfile ? 0.85 : 1 }}
          >
            {submitting ? 'Adding...' : 'Add player'}
          </button>
        </div>
      </form>

      <style jsx>{`
  /* BIG, CLEAR, BLUE toggle switch */
  .toggle-big {
    width: 70px;
    height: 40px;
    border-radius: 999px;
    border: 3px solid #000;
    padding: 4px;
    background: #fff;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 180ms ease, box-shadow 180ms ease;
    box-shadow: 0 6px 0 rgba(0,0,0,0.25);
  }

  .toggle-big.on {
    background: #1d4ed8;
  }

  .toggle-track {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    position: relative;
  }

  .toggle-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #000;
    box-shadow: 0 4px 0 rgba(0,0,0,0.25);
    position: absolute;
    top: 3px;
    left: 3px;
    transition: left 200ms cubic-bezier(0.3, 0.7, 0.4, 1.4), transform 200ms;
  }

  .toggle-big.on .toggle-thumb {
    left: calc(100% - 35px);
    transform: rotate(-4deg);
  }

  /* Hover jiggle */
  .toggle-big:hover .toggle-thumb {
    transform: translateY(-2px) rotate(-3deg);
  }

  /* Section spacing fix */
  .add-player-card {
    border-radius: 14px;
    border: 3px solid #000;
    padding: 22px;
    background: #fff;
    margin-bottom: 20px;
  }

  .form-section {
    margin-bottom: 18px;
  }
`}</style>

    </div>
  );
}
