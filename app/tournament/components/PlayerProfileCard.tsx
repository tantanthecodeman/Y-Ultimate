'use client';

import { Profile } from '../lib/types';

interface PlayerProfileCardProps {
  profile: Profile;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
  selected?: boolean;
}

export default function PlayerProfileCard({ 
  profile,
  showActions = false,
  onEdit,
  onDelete,
  onSelect,
  selected = false
}: PlayerProfileCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'player': return '#3b82f6';
      case 'coach': return '#10b981';
      case 'td': return '#f59e0b';
      case 'volunteer': return '#8b5cf6';
      case 'guardian': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getRoleBg = (role: string) => {
    switch (role) {
      case 'player': return '#dbeafe';
      case 'coach': return '#d1fae5';
      case 'td': return '#fef3c7';
      case 'volunteer': return '#ede9fe';
      case 'guardian': return '#fce7f3';
      default: return '#f3f4f6';
    }
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(profile.id)}
      style={{
        padding: 16,
        backgroundColor: selected ? '#dbeafe' : '#fff',
        border: '1px solid',
        borderColor: selected ? '#3b82f6' : '#e5e7eb',
        borderRadius: 8,
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.2s'
      }}
    >
      {/* Profile Info */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontWeight: 600,
          fontSize: 16,
          color: '#111827',
          marginBottom: 4
        }}>
          {profile.full_name}
        </div>
        <div style={{
          display: 'inline-block',
          padding: '4px 8px',
          backgroundColor: getRoleBg(profile.role),
          color: getRoleColor(profile.role),
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          {profile.role}
        </div>
      </div>

      {/* Actions */}
      {showActions && (onEdit || onDelete) && (
        <div style={{
          paddingTop: 12,
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: 8
        }}>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(profile.id);
              }}
              style={{
                flex: 1,
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600
              }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${profile.full_name}? This cannot be undone.`)) {
                  onDelete(profile.id);
                }
              }}
              style={{
                flex: 1,
                padding: '6px 12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
