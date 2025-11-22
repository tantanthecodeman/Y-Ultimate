// app/coaching/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { TapeBanner, Card, Button, PageHeader, StatBox } from '@/lib/ui/components';
import { UserHeader } from './auth/components/UserHeader';
import { ChildrenList } from './components/ChildrenList';
import { SessionsList } from './components/SessionsList';
import { AttendanceList } from './components/AttendanceList';
import { ReportsDashboard } from './components/ReportsDashboard';

type TabKey = 'children' | 'sessions' | 'attendance' | 'reports';

export default function CoachingDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('children');

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'children', label: 'Students', icon: '👶' },
    { key: 'sessions', label: 'Sessions', icon: '📅' },
    { key: 'attendance', label: 'Attendance', icon: '✅' },
    { key: 'reports', label: 'Reports', icon: '📊' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <UserHeader />

      <main style={{ paddingBottom: '64px' }}>
        {/* Header */}
        <header style={{ borderBottom: '3px solid #000', padding: '24px 0', marginBottom: '48px' }}>
          <div className="container">
            <TapeBanner color="red">TRAINING MODE</TapeBanner>
          </div>
        </header>

        <div className="container">
          <PageHeader
            title="Coaching Dashboard"
            subtitle="Manage students, track sessions, and watch them grow"
          />

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px',
              flexWrap: 'wrap',
              borderBottom: '3px solid #000',
              paddingBottom: '12px',
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '12px 20px',
                  border: tab === t.key ? '3px solid #000' : '3px solid #E5E7EB',
                  background: tab === t.key ? '#000' : '#FFF',
                  color: tab === t.key ? '#FFF' : '#000',
                  borderRadius: '12px',
                  fontFamily: 'Bangers, cursive',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="section">
            {tab === 'children' && <ChildrenList />}
            {tab === 'sessions' && <SessionsList />}
            {tab === 'attendance' && <AttendanceList />}
            {tab === 'reports' && <ReportsDashboard />}
          </div>
        </div>
      </main>
    </div>
  );
}