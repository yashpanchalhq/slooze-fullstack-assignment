'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_RESTAURANTS } from '@/graphql/queries/restaurants';
import { Restaurant } from '@/types';
import { formatCurrency, getCountryDisplayName } from '@/lib/utils';
import { CreateOrderModal } from '@/components/create-order-modal';

const DS = `
  .rl-root { font-family: 'Inter', sans-serif; }
  .rl-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.5rem; }
  .rl-title { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #333; }
  .rl-count { font-size: 0.7rem; color: #2a2a2a; }
  .rl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1px; background: #141414; border: 1px solid #141414; border-radius: 12px; overflow: hidden; }
  .rl-card { background: #0a0a0a; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; transition: background 0.15s; }
  .rl-card:hover { background: #0e0e0e; }
  .rl-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
  .rl-card-name { font-size: 1rem; font-weight: 600; color: #fafafa; letter-spacing: -0.02em; }
  .rl-card-desc { font-size: 0.8rem; color: #333; margin-top: 0.25rem; line-height: 1.5; }
  .rl-badge { flex-shrink: 0; font-size: 0.65rem; font-weight: 500; padding: 0.2rem 0.55rem; border: 1px solid #1a1a1a; border-radius: 99px; color: #333; letter-spacing: 0.04em; text-transform: uppercase; }
  .rl-menu { border-top: 1px solid #141414; padding-top: 1rem; }
  .rl-menu-label { font-size: 0.65rem; font-weight: 600; color: #2a2a2a; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.6rem; }
  .rl-menu-row { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0; border-bottom: 1px solid #0f0f0f; }
  .rl-menu-row:last-of-type { border-bottom: none; }
  .rl-menu-item { font-size: 0.825rem; color: #555; }
  .rl-menu-price { font-size: 0.8rem; color: #444; font-variant-numeric: tabular-nums; }
  .rl-menu-more { font-size: 0.75rem; color: #222; padding-top: 0.35rem; }
  .rl-order-btn { display: flex; align-items: center; justify-content: center; gap: 0.4rem; width: 100%; padding: 0.65rem; background: #111; border: 1px solid #1e1e1e; border-radius: 8px; color: #888; font-family: inherit; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: background 0.15s, border-color 0.15s, color 0.15s; letter-spacing: 0.02em; }
  .rl-order-btn:hover { background: #161616; border-color: #333; color: #fafafa; }
  .rl-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 2rem; text-align: center; }
  .rl-empty-title { font-size: 0.875rem; color: #333; font-weight: 500; }
  .rl-empty-sub { font-size: 0.78rem; color: #222; }
  .rl-state { font-size: 0.8rem; color: #2a2a2a; padding: 2rem 0; }
`;

export const RestaurantList: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { data, loading, error } = useQuery<{ restaurants: Restaurant[] }>(GET_RESTAURANTS);

  if (loading) return <p style={{ color: '#2a2a2a', fontSize: '0.8rem', padding: '2rem 0' }}>Loading…</p>;
  if (error)   return <p style={{ color: '#555', fontSize: '0.8rem', padding: '2rem 0' }}>Error: {error.message}</p>;

  const restaurants: Restaurant[] = data?.restaurants || [];

  return (
    <>
      <style>{DS}</style>
      <div className="rl-root">
        <div className="rl-header">
          <span className="rl-title">Restaurants</span>
          <span className="rl-count">{restaurants.length} available</span>
        </div>

        {restaurants.length === 0 ? (
          <div className="rl-empty">
            <span className="rl-empty-title">No restaurants</span>
            <span className="rl-empty-sub">None available in your region.</span>
          </div>
        ) : (
          <div className="rl-grid">
            {restaurants.map((r) => (
              <div key={r.id} className="rl-card">
                <div className="rl-card-top">
                  <div>
                    <div className="rl-card-name">{r.name}</div>
                    {r.description && <div className="rl-card-desc">{r.description}</div>}
                  </div>
                  <span className="rl-badge">{getCountryDisplayName(r.country)}</span>
                </div>

                <div className="rl-menu">
                  <div className="rl-menu-label">Menu</div>
                  {r.menuItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="rl-menu-row">
                      <span className="rl-menu-item">{item.name}</span>
                      <span className="rl-menu-price">{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                  {r.menuItems.length > 3 && (
                    <div className="rl-menu-more">+{r.menuItems.length - 3} more</div>
                  )}
                </div>

                <button
                  className="rl-order-btn"
                  onClick={() => { setSelectedRestaurant(r); setIsOrderModalOpen(true); }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Order
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedRestaurant && (
          <CreateOrderModal
            restaurant={selectedRestaurant}
            isOpen={isOrderModalOpen}
            onClose={() => { setIsOrderModalOpen(false); setSelectedRestaurant(null); }}
          />
        )}
      </div>
    </>
  );
};
