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
  onCancel 
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
  }, [search]);

  async function loadProfiles() {
    try {
      setLoading(true);
      const url = `/api/profile/list?role=player${search ? `&search=${search}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        setProfiles(data.profiles || []);
      }
    } catch (err: unknown) {
      console.error('Failed to load profiles');
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
          is_captain: isCaptain
        })
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
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 24,
      backgroundColor: '#fff'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0',
        fontSize: 18,
        fontWeight: 700,
        color: '#111827'
      }}>
        Add Player to Team
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 600,
            color: '#374151'
          }}>
            Search Players
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14
            }}
          />
        </div>

        {/* Player List */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#374151'
          }}>
            Select Player *
          </label>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#6b7280' }}>
              Loading players...
            </div>
          ) : profiles.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 20,
              border: '2px dashed #d1d5db',
              borderRadius: 8,
              color: '#9ca3af'
            }}>
              {search ? 'No players found' : 'No players available'}
            </div>
          ) : (
            <div style={{
              maxHeight: 300,
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 8,
              display: 'grid',
              gap: 8
            }}>
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
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 600,
            color: '#374151'
          }}>
            Jersey Number (Optional)
          </label>
          <input
            type="text"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            placeholder="e.g., 7"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14,
              backgroundColor: submitting ? '#f9fafb' : '#fff'
            }}
          />
        </div>

        {/* Captain Checkbox */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={isCaptain}
              onChange={(e) => setIsCaptain(e.target.checked)}
              disabled={submitting}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#374151'
            }}>
              Make this player team captain
            </span>
          </label>
        </div>

        {error && (
          <div style={{
            padding: 12,
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 14,
            color: '#991b1b'
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          gap: 12,
          justifyContent: 'flex-end'
        }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !selectedProfile}
            style={{
              padding: '10px 20px',
              backgroundColor: submitting || !selectedProfile ? '#9ca3af' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: submitting || !selectedProfile ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {submitting ? 'Adding...' : 'Add Player'}
          </button>
        </div>
      </form>
    </div>
  );
}
