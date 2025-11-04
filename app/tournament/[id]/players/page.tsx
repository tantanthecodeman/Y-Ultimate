'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Profile } from '../../lib/types';
import PlayerProfileCard from '../../components/PlayerProfileCard';
import { supabase } from '@/lib/supabaseClient'; 

export default function PlayersManagementPage() {
  const params = useParams();
  const tournamentId = params.id as string;
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('player');
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('player');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, [search, roleFilter]);

  async function loadProfiles() {
    try {
      setLoading(true);
      const url = `/api/profile/list?role=${roleFilter}${search ? `&search=${search}` : ''}`;
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

 async function handleCreateProfile(e: React.FormEvent) {
  e.preventDefault();
  setCreating(true);
  setError(null);
  setSuccessMessage(null);

  try {
    // Get current session and access token from Supabase client
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      setError("You must be logged in to create a profile. Please sign in first.");
      setCreating(false);
      return;
    }

    const res = await fetch("/api/profile/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullname: fullName, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to create profile");
    }

    setSuccessMessage(`Profile created for ${data.profile.fullname}!`);
    setFullName("");
    setRole("player");
    setShowCreateForm(false);
    loadProfiles();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    setError(message);
  } finally {
    setCreating(false);
  }
}


  async function handleDeleteProfile(id: string) {
    try {
      const res = await fetch(`/api/profile/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to delete profile');
      }

      setSuccessMessage('Profile deleted successfully');
      loadProfiles();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete profile';
      alert('Error: ' + message);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link 
          href={`/tournament/${tournamentId}`}
          style={{
            display: 'inline-block',
            marginBottom: 16,
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          ← Back to Tournament
        </Link>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 700,
              margin: '0 0 8px 0',
              color: '#111827'
            }}>
              Player Management
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
              {profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'} found
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {showCreateForm ? 'Cancel' : '+ Create Profile'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          padding: 16,
          backgroundColor: '#d1fae5',
          border: '1px solid #6ee7b7',
          borderRadius: 8,
          marginBottom: 24,
          color: '#065f46',
          fontSize: 14
        }}>
          ✅ {successMessage}
        </div>
      )}

      {/* Create Profile Form */}
      {showCreateForm && (
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{
            margin: '0 0 16px 0',
            fontSize: 18,
            fontWeight: 700,
            color: '#111827'
          }}>
            Create New Profile
          </h2>

          <form onSubmit={handleCreateProfile}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 600,
                color: '#374151'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., John Doe"
                required
                disabled={creating}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                  backgroundColor: creating ? '#f3f4f6' : '#fff'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 600,
                color: '#374151'
              }}>
                Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={creating}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                  backgroundColor: creating ? '#f3f4f6' : '#fff'
                }}
              >
                <option value="player">Player</option>
                <option value="coach">Coach</option>
                <option value="td">Tournament Director</option>
                <option value="volunteer">Volunteer</option>
                <option value="guardian">Guardian</option>
              </select>
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

            <button
              type="submit"
              disabled={creating}
              style={{
                padding: '10px 20px',
                backgroundColor: creating ? '#9ca3af' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: creating ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              {creating ? 'Creating...' : 'Create Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{
        marginBottom: 24,
        display: 'grid',
        gridTemplateColumns: '1fr 200px',
        gap: 16
      }}>
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          style={{
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14
          }}
        />

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14
          }}
        >
          <option value="all">All Roles</option>
          <option value="player">Players</option>
          <option value="coach">Coaches</option>
          <option value="td">TDs</option>
          <option value="volunteer">Volunteers</option>
          <option value="guardian">Guardians</option>
        </select>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          color: '#6b7280'
        }}>
          Loading profiles...
        </div>
      ) : profiles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          border: '2px dashed #d1d5db',
          borderRadius: 12,
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
          <p style={{ fontSize: 16, margin: '0 0 8px 0', fontWeight: 600 }}>
            No profiles found
          </p>
          <p style={{ fontSize: 14, margin: '0 0 16px 0' }}>
            {search || roleFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Create your first profile to get started'}
          </p>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Create First Profile
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16
        }}>
          {profiles.map((profile) => (
            <PlayerProfileCard
              key={profile.id}
              profile={profile}
              showActions={true}
              onEdit={(id) => alert('Edit functionality coming soon')}
              onDelete={handleDeleteProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
