'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Navigation } from '@/components/navigation';
import { RestaurantList } from '@/components/restaurant-list';
import { OrderList } from '@/components/order-list';

export function ManagerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'restaurants'>('orders');

  if (!user) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .md-root { min-height: 100dvh; background: #0a0a0a; color: #fafafa; font-family: 'Inter', sans-serif; }
        .md-inner { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }
        .md-header { margin-bottom: 2.5rem; padding-bottom: 2rem; border-bottom: 1px solid #1a1a1a; display: flex; align-items: flex-end; justify-content: space-between; }
        .md-header-left {}
        .md-greeting { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.03em; color: #fafafa; margin-bottom: 0.3rem; }
        .md-meta { font-size: 0.75rem; color: #333; letter-spacing: 0.05em; text-transform: uppercase; }
        .md-badge { display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; border: 1px solid #1e1e1e; border-radius: 99px; font-size: 0.68rem; font-weight: 500; color: #333; letter-spacing: 0.06em; text-transform: uppercase; }
        .md-tabs { display: flex; gap: 0; border-bottom: 1px solid #1a1a1a; margin-bottom: 2.5rem; }
        .md-tab { padding: 0.6rem 1.25rem; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -1px; font-family: inherit; font-size: 0.825rem; font-weight: 500; color: #444; cursor: pointer; transition: color 0.15s, border-color 0.15s; letter-spacing: 0.02em; }
        .md-tab:hover { color: #888; }
        .md-tab.active { color: #fafafa; border-bottom-color: #fafafa; }
      `}</style>

      <div className="md-root">
        <Navigation />
        <div className="md-inner">
          <div className="md-header">
            <div className="md-header-left">
              <h1 className="md-greeting">Good evening, {user.name.split(' ')[0]}.</h1>
              <p className="md-meta">Manager · {user.country}</p>
            </div>
            <span className="md-badge">Manager Command</span>
          </div>

          <div className="md-tabs">
            {[
              { id: 'orders',       label: 'Orders' },
              { id: 'restaurants',  label: 'Restaurants' },
            ].map(t => (
              <button
                key={t.id}
                className={`md-tab${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id as any)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'orders'      && <OrderList />}
          {activeTab === 'restaurants' && <RestaurantList />}
        </div>
      </div>
    </>
  );
}
