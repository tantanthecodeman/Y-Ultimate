'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Match } from '../../lib/types';
import MatchCard from '../../components/MatchCard';
import MatchScoreUpdateForm from '../../components/MatchScoreUpdateForm';

export default function MatchesManagementPage() {
  const params = useParams();
  const tournamentId = params.id as string;
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'completed'>('all');

  useEffect(() => {
    loadMatches();
  }, [tournamentId]);

  async function loadMatches() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tournament/matches?tournament_id=${tournamentId}`);
      const data = await res.json();
      
      if (res.ok) {
        setMatches(data.matches || []);
      }
    } catch (err: unknown) {
      console.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  }

  function handleUpdateScore(matchId: string) {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
    }
  }

  function handleScoreUpdated() {
    setSelectedMatch(null);
    loadMatches();
  }

  const filteredMatches = matches.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        Loading matches...
      </div>
    );
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
              Match Management
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
              {matches.length} total matches
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
        overflowX: 'auto'
      }}>
        {[
          { key: 'all' as const, label: 'All', count: matches.length },
          { key: 'scheduled' as const, label: 'Scheduled', count: matches.filter(m => m.status === 'scheduled').length },
          { key: 'live' as const, label: 'Live', count: matches.filter(m => m.status === 'live').length },
          { key: 'completed' as const, label: 'Completed', count: matches.filter(m => m.status === 'completed').length }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '10px 20px',
              backgroundColor: filter === f.key ? '#3b82f6' : '#fff',
              color: filter === f.key ? '#fff' : '#374151',
              border: '1px solid',
              borderColor: filter === f.key ? '#3b82f6' : '#d1d5db',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Modal for Score Update */}
      {selectedMatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 24
        }}>
          <div style={{
            maxWidth: 600,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <MatchScoreUpdateForm
              match={selectedMatch}
              onSuccess={handleScoreUpdated}
              onCancel={() => setSelectedMatch(null)}
            />
          </div>
        </div>
      )}

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div style={{
          padding: 60,
          textAlign: 'center',
          border: '2px dashed #d1d5db',
          borderRadius: 12,
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <p style={{ fontSize: 16, margin: 0 }}>
            {filter === 'all' 
              ? 'No matches scheduled yet.' 
              : `No ${filter} matches.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              showActions={true}
              onUpdateScore={handleUpdateScore}
            />
          ))}
        </div>
      )}
    </div>
  );
}
