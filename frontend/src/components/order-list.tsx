'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ORDERS } from '@/graphql/queries/orders';
import { CANCEL_ORDER, CHECKOUT_ORDER } from '@/graphql/mutations/orders';
import { GET_PAYMENT_METHODS } from '@/graphql/mutations/payments';
import { Order, PaymentMethod } from '@/types';
import { useAuth } from '@/lib/auth-context';
import { useNotification } from '@/lib/notification-context';
import { formatCurrency, formatDate, getOrderStatusDisplay, getOrderStatusColor, cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DS = `
  .ol-root { font-family: 'Inter', sans-serif; }
  .ol-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.5rem; }
  .ol-title { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #333; }
  .ol-count { font-size: 0.7rem; color: #2a2a2a; }
  .ol-list { display: flex; flex-direction: column; gap: 1px; background: #141414; border: 1px solid #141414; border-radius: 12px; overflow: hidden; }
  .ol-row { background: #0a0a0a; padding: 1.25rem 1.5rem; transition: background 0.15s; }
  .ol-row:hover { background: #0d0d0d; }
  .ol-row-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
  .ol-row-id { font-size: 0.825rem; font-weight: 600; color: #fafafa; letter-spacing: -0.01em; }
  .ol-row-date { font-size: 0.72rem; color: #333; }
  .ol-row-right { display: flex; align-items: center; gap: 0.75rem; }
  .ol-status { font-size: 0.65rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 99px; letter-spacing: 0.06em; text-transform: uppercase; }
  .ol-status-pending  { background: rgba(234,179,8,0.08); color: #713f12; border: 1px solid rgba(234,179,8,0.12); }
  .ol-status-confirmed { background: rgba(34,197,94,0.07); color: #14532d; border: 1px solid rgba(34,197,94,0.12); }
  .ol-status-cancelled { background: rgba(239,68,68,0.07); color: #7f1d1d; border: 1px solid rgba(239,68,68,0.1); }
  .ol-amount { font-size: 0.9rem; font-weight: 600; color: #fafafa; font-variant-numeric: tabular-nums; }
  .ol-items { display: flex; flex-direction: column; gap: 0.2rem; margin-bottom: 0.75rem; }
  .ol-item-row { display: flex; justify-content: space-between; font-size: 0.78rem; }
  .ol-item-name { color: #444; }
  .ol-item-line { color: #2a2a2a; font-variant-numeric: tabular-nums; }
  .ol-payment-note { font-size: 0.72rem; color: #2a2a2a; margin-bottom: 0.75rem; }
  .ol-actions { display: flex; gap: 0.5rem; }
  .ol-btn { padding: 0.4rem 0.9rem; border-radius: 6px; font-family: inherit; font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.15s; letter-spacing: 0.02em; }
  .ol-btn-cancel { background: none; border: 1px solid #1e1e1e; color: #444; }
  .ol-btn-cancel:hover { border-color: #333; color: #888; }
  .ol-btn-checkout { background: #fafafa; border: 1px solid #fafafa; color: #0a0a0a; }
  .ol-btn-checkout:hover { opacity: 0.85; }
  .ol-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 2rem; text-align: center; }
  .ol-empty-title { font-size: 0.875rem; color: #333; font-weight: 500; }

  /* modal */
  .ol-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
  .ol-modal { background: #0e0e0e; border: 1px solid #1e1e1e; border-radius: 12px; width: 100%; max-width: 400px; padding: 1.75rem; }
  .ol-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .ol-modal-title { font-size: 0.875rem; font-weight: 600; color: #fafafa; }
  .ol-modal-close { background: none; border: none; color: #333; cursor: pointer; padding: 2px; transition: color 0.15s; }
  .ol-modal-close:hover { color: #888; }
  .ol-modal-amount { font-size: 2rem; font-weight: 700; color: #fafafa; letter-spacing: -0.04em; margin-bottom: 1.5rem; font-variant-numeric: tabular-nums; }
  .ol-modal-label { font-size: 0.65rem; font-weight: 600; color: #333; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .ol-modal-select { width: 100%; padding: 0.7rem 1rem; background: #111; border: 1px solid #222; border-radius: 8px; color: #fafafa; font-family: inherit; font-size: 0.85rem; outline: none; cursor: pointer; -webkit-appearance: none; appearance: none; }
  .ol-modal-select:focus { border-color: #444; }
  .ol-modal-select option { background: #111; }
  .ol-modal-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
  .ol-modal-confirm { flex: 1; padding: 0.7rem; background: #fafafa; border: none; border-radius: 8px; color: #0a0a0a; font-family: inherit; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .ol-modal-confirm:disabled { opacity: 0.35; cursor: not-allowed; }
  .ol-modal-confirm:hover:not(:disabled) { opacity: 0.88; }
  .ol-modal-cancel-btn { padding: 0.7rem 1.25rem; background: none; border: 1px solid #1e1e1e; border-radius: 8px; color: #444; font-family: inherit; font-size: 0.85rem; cursor: pointer; transition: border-color 0.15s, color 0.15s; }
  .ol-modal-cancel-btn:hover { border-color: #333; color: #888; }
`;

function statusClass(s: string) {
  if (s === 'PENDING') return 'ol-status ol-status-pending';
  if (s === 'CONFIRMED') return 'ol-status ol-status-confirmed';
  return 'ol-status ol-status-cancelled';
}

export const OrderList: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPM, setSelectedPM] = useState('');

  const { data, refetch } = useQuery<{ orders: Order[] | undefined }>(GET_ORDERS);
  const { data: pmData } = useQuery<{ paymentMethods: PaymentMethod[] | undefined }>(GET_PAYMENT_METHODS, {
    skip: user?.role === 'MEMBER',
  });

  const [cancelOrder]   = useMutation(CANCEL_ORDER,   { onCompleted: () => { refetch(); } });
  const [checkoutOrder] = useMutation(CHECKOUT_ORDER, {
    onCompleted: () => { 
      setSelectedOrder(null); 
      setSelectedPM(''); 
      refetch(); 
      showNotification('success', 'Order confirmed', 'Your payment was successful and the order is being prepared.');
    },
    onError: (err) => {
      showNotification('error', 'Checkout failed', err.message);
    }
  });

  const orders: Order[] = data?.orders || [];
  const paymentMethods: PaymentMethod[] = pmData?.paymentMethods || [];

  const canAct = user?.role !== 'MEMBER';

  const handleCancel = async (id: string) => {
    if (!window.confirm('Cancel this order?')) return;
    try { await cancelOrder({ variables: { id } }); } catch {}
  };

  const handleCheckout = async () => {
    if (!selectedOrder || !selectedPM) return;
    try { await checkoutOrder({ variables: { id: selectedOrder.id, paymentMethodId: selectedPM } }); } catch {}
  };

  return (
    <>
      <style>{DS}</style>
      <div className="ol-root">
        <div className="ol-header">
          <span className="ol-title">Orders</span>
          <span className="ol-count">{orders.length} total</span>
        </div>

        {orders.length === 0 ? (
          <div className="ol-empty">
            <span className="ol-empty-title">No orders yet</span>
          </div>
        ) : (
          <div className="ol-list">
            {orders.map((order) => (
              <div key={order.id} className="ol-row">
                <div className="ol-row-top">
                  <div>
                    <div className="ol-row-id">#{order.id.slice(-8)}</div>
                    <div className="ol-row-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="ol-row-right">
                    <span className={statusClass(order.status)}>
                      {getOrderStatusDisplay(order.status)}
                    </span>
                    <span className="ol-amount">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="ol-items">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="ol-item-row">
                      <span className="ol-item-name">{item.menuItem.name} × {item.quantity}</span>
                      <span className="ol-item-line">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {order.payment && (
                  <div className="ol-payment-note">
                    Paid · {order.payment.paymentMethod.type} ···· {order.payment.paymentMethod.lastFour}
                  </div>
                )}

                {canAct && order.status === 'PENDING' && (
                  <div className="ol-actions">
                    <button className="ol-btn ol-btn-cancel" onClick={() => handleCancel(order.id)}>
                      Cancel
                    </button>
                    <button className="ol-btn ol-btn-checkout" onClick={() => { setSelectedOrder(order); setSelectedPM(''); }}>
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Checkout modal */}
        {selectedOrder && (
          <div className="ol-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedOrder(null); }}>
            <div className="ol-modal">
              <div className="ol-modal-header">
                <span className="ol-modal-title">Checkout</span>
                <button className="ol-modal-close" onClick={() => setSelectedOrder(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="ol-modal-amount">{formatCurrency(selectedOrder.totalAmount)}</div>
              <div className="ol-modal-label">Payment method</div>
              <Select
                value={selectedPM}
                onValueChange={setSelectedPM}
              >
                <SelectTrigger className="w-full bg-[#111] border-[#222] text-[#fafafa] h-[45px]">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#222] text-[#fafafa] z-[110] min-w-[300px]">
                  {paymentMethods.length === 0 ? (
                    <div className="p-1">
                      <Alert className="border-none bg-transparent">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-[0.75rem]">No payment methods found</AlertTitle>
                        <AlertDescription className="text-[0.7rem] text-[#333]">
                          Please add a card in the <strong>Payments</strong> tab to proceed with checkout.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    paymentMethods.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.type.replace('_', ' ')} ···· {m.lastFour}{m.isDefault ? ' (default)' : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <div className="ol-modal-actions">
                <button className="ol-modal-cancel-btn" onClick={() => setSelectedOrder(null)}>Cancel</button>
                <button className="ol-modal-confirm" disabled={!selectedPM} onClick={handleCheckout}>
                  Confirm payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
