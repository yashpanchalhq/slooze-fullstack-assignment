'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navigation } from '@/components/navigation';
import { RestaurantList } from '@/components/restaurant-list';
import { OrderList } from '@/components/order-list';
import { PaymentMethods } from '@/components/payment-methods';
import { NotificationProvider } from '@/lib/notification-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('restaurants');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return <div style={{ background: '#0a0a0a', minHeight: '100dvh' }} />;

  const canViewOrders    = user.role !== 'MEMBER';
  const canManagePayments = user.role === 'ADMIN' || user.role === 'MANAGER';

  const tabs = [
    { id: 'restaurants', label: 'Restaurants' },
    ...(canViewOrders    ? [{ id: 'orders',   label: 'Orders'   }] : []),
    ...(canManagePayments ? [{ id: 'payments', label: 'Payments' }] : []),
  ];

  return (
    <NotificationProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .db-root {
          min-height: 100dvh;
          background: #0a0a0a;
          color: #fafafa;
          font-family: 'Inter', sans-serif;
        }
        .db-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2.5rem 2rem 4rem;
        }
        .db-header {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #1a1a1a;
        }
        .db-greeting {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #fafafa;
          margin-bottom: 0.3rem;
        }
        .db-meta {
          font-size: 0.8rem;
          color: #333;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        /* tabs */
        .db-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #1a1a1a;
          margin-bottom: 2.5rem;
        }
        .db-tab {
          padding: 0.6rem 1.25rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          font-family: inherit;
          font-size: 0.825rem;
          font-weight: 500;
          color: #444;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          letter-spacing: 0.02em;
        }
        .db-tab:hover { color: #888; }
        .db-tab.active {
          color: #fafafa;
          border-bottom-color: #fafafa;
        }
      `}</style>

      <div className="db-root">
        <Navigation />
        <div className="db-inner">
          <div className="db-header">
            <h1 className="db-greeting">Good evening, {user.name.split(' ')[0]}.</h1>
            <p className="db-meta">{user.role} · {user.country}</p>
          </div>

          <div className="db-tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`db-tab${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'restaurants' && <RestaurantList />}
          {activeTab === 'orders'      && canViewOrders     && <OrderList />}
          {activeTab === 'payments'    && canManagePayments  && <PaymentMethods />}
        </div>
      </div>
    </NotificationProvider>
  );
}
