'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_ORDER } from '@/graphql/mutations/orders';
import { Restaurant, MenuItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Props { restaurant: Restaurant; isOpen: boolean; onClose: () => void; }
interface CartItem extends MenuItem { quantity: number; }

const DS = `
  .com-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
  .com-modal { background: #0e0e0e; border: 1px solid #1e1e1e; border-radius: 12px; width: 100%; max-width: 680px; max-height: 85vh; overflow: hidden; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; }
  .com-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #1a1a1a; flex-shrink: 0; }
  .com-header-left {}
  .com-header-name { font-size: 0.9rem; font-weight: 600; color: #fafafa; letter-spacing: -0.01em; }
  .com-header-sub { font-size: 0.7rem; color: #2a2a2a; margin-top: 0.15rem; }
  .com-close { background: none; border: none; color: #333; cursor: pointer; padding: 4px; transition: color 0.15s; }
  .com-close:hover { color: #888; }
  .com-body { display: grid; grid-template-columns: 1fr 1fr; flex: 1; overflow: hidden; }
  .com-menu { overflow-y: auto; padding: 1.25rem 1.5rem; border-right: 1px solid #141414; }
  .com-cart { overflow-y: auto; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; }
  .com-section-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #2a2a2a; margin-bottom: 0.75rem; }
  .com-menu-item { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid #0f0f0f; }
  .com-menu-item:last-child { border-bottom: none; }
  .com-item-info {}
  .com-item-name { font-size: 0.825rem; color: #aaa; }
  .com-item-price { font-size: 0.75rem; color: #333; margin-top: 0.1rem; font-variant-numeric: tabular-nums; }
  .com-add-btn { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #111; border: 1px solid #1e1e1e; border-radius: 6px; color: #555; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
  .com-add-btn:hover { border-color: #333; color: #aaa; }
  .com-empty-cart { display: flex; flex: 1; align-items: center; justify-content: center; font-size: 0.78rem; color: #1e1e1e; }
  .com-cart-item { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #0f0f0f; }
  .com-cart-item:last-of-type { border-bottom: none; }
  .com-ci-name { font-size: 0.8rem; color: #666; }
  .com-ci-right { display: flex; align-items: center; gap: 0.6rem; }
  .com-qty-controls { display: flex; align-items: center; gap: 0.3rem; }
  .com-qty-btn { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: none; border: 1px solid #1e1e1e; border-radius: 4px; color: #444; cursor: pointer; font-size: 0.7rem; transition: all 0.15s; padding: 0; font-family: inherit; }
  .com-qty-btn:hover { border-color: #333; color: #888; }
  .com-qty-num { font-size: 0.78rem; color: #555; min-width: 16px; text-align: center; font-variant-numeric: tabular-nums; }
  .com-ci-price { font-size: 0.78rem; color: #333; font-variant-numeric: tabular-nums; min-width: 52px; text-align: right; }
  .com-footer { flex-shrink: 0; padding: 1rem 1.5rem; border-top: 1px solid #141414; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .com-total { font-size: 0.8rem; color: #444; }
  .com-total strong { font-size: 1.1rem; font-weight: 700; color: #fafafa; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; margin-left: 0.35rem; }
  .com-submit { padding: 0.65rem 1.5rem; background: #fafafa; border: none; border-radius: 8px; color: #0a0a0a; font-family: inherit; font-size: 0.825rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
  .com-submit:disabled { opacity: 0.3; cursor: not-allowed; }
  .com-submit:hover:not(:disabled) { opacity: 0.88; }
  @media (max-width: 640px) {
    .com-body { grid-template-columns: 1fr; }
    .com-menu { border-right: none; border-bottom: 1px solid #141414; max-height: 240px; }
  }
`;

export const CreateOrderModal: React.FC<Props> = ({ restaurant, isOpen, onClose }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [createOrder] = useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: require('@/graphql/queries/orders').GET_ORDERS }],
  });

  if (!isOpen) return null;

  const add = (item: MenuItem) =>
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      return ex
        ? prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
        : [...prev, { ...item, quantity: 1 }];
    });

  const remove = (id: string) =>
    setCart(prev => {
      const ex = prev.find(c => c.id === id);
      if (ex && ex.quantity > 1) return prev.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c);
      return prev.filter(c => c.id !== id);
    });

  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      await createOrder({
        variables: {
          createOrderInput: {
            userId: '',
            orderItems: cart.map(c => ({ menuItemId: c.id, quantity: c.quantity })),
          },
        },
      });
      setCart([]);
      onClose();
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{DS}</style>
      <div className="com-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="com-modal">
          <div className="com-header">
            <div className="com-header-left">
              <div className="com-header-name">{restaurant.name}</div>
              <div className="com-header-sub">{restaurant.menuItems.length} items available</div>
            </div>
            <button className="com-close" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="com-body">
            {/* Menu */}
            <div className="com-menu">
              <div className="com-section-label">Menu</div>
              {restaurant.menuItems.map(item => (
                <div key={item.id} className="com-menu-item">
                  <div className="com-item-info">
                    <div className="com-item-name">{item.name}</div>
                    <div className="com-item-price">{formatCurrency(item.price)}</div>
                  </div>
                  <button className="com-add-btn" onClick={() => add(item)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Cart */}
            <div className="com-cart">
              <div className="com-section-label">Cart</div>
              {cart.length === 0 ? (
                <div className="com-empty-cart">Empty</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="com-cart-item">
                    <span className="com-ci-name">{item.name}</span>
                    <div className="com-ci-right">
                      <div className="com-qty-controls">
                        <button className="com-qty-btn" onClick={() => remove(item.id)}>−</button>
                        <span className="com-qty-num">{item.quantity}</span>
                        <button className="com-qty-btn" onClick={() => add(item)}>+</button>
                      </div>
                      <span className="com-ci-price">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="com-footer">
            <div className="com-total">
              Total <strong>{formatCurrency(total)}</strong>
            </div>
            <button className="com-submit" disabled={cart.length === 0 || loading} onClick={handleSubmit}>
              {loading ? 'Placing…' : 'Place order'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
