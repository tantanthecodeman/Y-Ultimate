'use client';

import Link from 'next/link';
import { Tournament } from '../lib/types';

interface TournamentCardProps {
  tournament: Tournament;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TournamentCard({ 
  tournament,
  showActions = false,
  onEdit,
  onDelete
}: TournamentCardProps) {
  const startDate = tournament.start_date 
    ? new Date(tournament.start_date).toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'TBD';

  const endDate = tournament.end_date
    ? new Date(tournament.end_date).toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'TBD';

  return (
    <div className="card" style={{ padding: '24px' }}>
      <Link 
        href={`/tournament/${tournament.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <h3 style={{ marginBottom: '16px', fontSize: '22px' }}>
          {tournament.name}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {(tournament.start_date || tournament.end_date) && (
            <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
              {startDate} - {endDate}
            </div>
          )}

          {tournament.location && (
            <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
              {tournament.location}
            </div>
          )}
        </div>
      </Link>

      {showActions && (onEdit || onDelete) && (
        <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '2px solid var(--border)' }}>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(tournament.id);
              }}
              className="btn btn-ghost"
              style={{ flex: 1 }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${tournament.name}"?`)) {
                  onDelete(tournament.id);
                }
              }}
              className="btn btn-ghost"
              style={{ flex: 1, borderColor: 'var(--error)', color: 'var(--error)' }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}