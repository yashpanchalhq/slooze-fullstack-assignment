'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { getRoleDisplayName, getCountryDisplayName } from '@/lib/utils';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <>
      <style>{`
        .sl-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 52px;
          background: #0a0a0a;
          border-bottom: 1px solid #1a1a1a;
          font-family: 'Inter', sans-serif;
        }
        .sl-nav-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sl-nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fafafa;
        }
        .sl-nav-name {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fafafa;
        }
        .sl-nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .sl-nav-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
        }
        .sl-nav-user {
          color: #888;
        }
        .sl-nav-pill {
          padding: 0.2rem 0.6rem;
          border: 1px solid #222;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 500;
          color: #555;
          letter-spacing: 0.04em;
        }
        .sl-nav-logout {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.9rem;
          background: none;
          border: 1px solid #222;
          border-radius: 6px;
          color: #555;
          font-size: 0.78rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          letter-spacing: 0.02em;
        }
        .sl-nav-logout:hover {
          border-color: #444;
          color: #aaa;
        }
      `}</style>
      <nav className="sl-nav">
        <div className="sl-nav-brand">
          <div className="sl-nav-dot" />
          <span className="sl-nav-name">Slooze</span>
        </div>

        <div className="sl-nav-right">
          <div className="sl-nav-meta">
            <span className="sl-nav-user">{user.name}</span>
            <div className="sl-nav-pill">{getRoleDisplayName(user.role)}</div>
            <div className="sl-nav-pill">{getCountryDisplayName(user.country)}</div>
          </div>

          <button className="sl-nav-logout" onClick={logout}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};
