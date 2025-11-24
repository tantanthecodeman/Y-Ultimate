'use client';

import { useState } from 'react';
import { TapeBanner, Card, Button, PageHeader } from '@/lib/ui/components';
import { UserHeader } from './auth/components/UserHeader';
import { ChildrenList } from './components/ChildrenList';
import { SessionsList } from './components/SessionsList';
import { AttendanceList } from './components/AttendanceList';
import { ReportsDashboard } from './components/ReportsDashboard';

type TabKey = 'children' | 'sessions' | 'attendance' | 'reports';

export default function CoachingDashboard() {
  const [tab, setTab] = useState<TabKey>('children');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'children', label: 'STUDENTS' },
    { key: 'sessions', label: 'SESSIONS' },
    { key: 'attendance', label: 'ATTENDANCE' },
    { key: 'reports', label: 'REPORTS' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FFF' }}>
      <UserHeader />

      <main style={{ paddingBottom: '64px' }}>
        {/* Header */}
        <header style={{ 
          borderBottom: '3px solid #000', 
          padding: '24px 0', 
          marginBottom: '48px',
          background: '#FFF'
        }}>
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
                className={tab === t.key ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{
                  minWidth: 'auto',
                  padding: '10px 20px',
                  fontWeight: 700,
                  letterSpacing: '0.05em'
                }}
              >
                {t.label}
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
