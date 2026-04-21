'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PAYMENT_METHODS, CREATE_PAYMENT_METHOD, UPDATE_PAYMENT_METHOD, DELETE_PAYMENT_METHOD } from '@/graphql/mutations/payments';
import { PaymentMethod } from '@/types';
import { useNotification } from '@/lib/notification-context';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DS = `
  .pm-root { font-family: 'Inter', sans-serif; }
  .pm-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.5rem; }
  .pm-title { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #333; }
  .pm-add-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.9rem; background: none; border: 1px solid #1e1e1e; border-radius: 6px; color: #555; font-family: inherit; font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .pm-add-btn:hover { border-color: #333; color: #aaa; }
  .pm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1px; background: #141414; border: 1px solid #141414; border-radius: 12px; overflow: hidden; }
  .pm-card { background: #0a0a0a; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.85rem; transition: background 0.15s; }
  .pm-card:hover { background: #0d0d0d; }
  .pm-card-top { display: flex; align-items: center; justify-content: space-between; }
  .pm-card-type { font-size: 0.875rem; font-weight: 600; color: #fafafa; text-transform: capitalize; letter-spacing: -0.01em; }
  .pm-default-pill { font-size: 0.6rem; font-weight: 600; padding: 0.15rem 0.5rem; border: 1px solid #222; border-radius: 99px; color: #333; letter-spacing: 0.06em; text-transform: uppercase; }
  .pm-card-meta { display: flex; flex-direction: column; gap: 0.25rem; }
  .pm-meta-row { display: flex; justify-content: space-between; font-size: 0.78rem; }
  .pm-meta-key { color: #2a2a2a; }
  .pm-meta-val { color: #444; font-variant-numeric: tabular-nums; }
  .pm-card-actions { display: flex; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #0f0f0f; }
  .pm-action-btn { flex: 1; padding: 0.4rem; background: none; border: 1px solid #1a1a1a; border-radius: 6px; font-family: inherit; font-size: 0.72rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .pm-edit-btn { color: #444; } .pm-edit-btn:hover { border-color: #333; color: #888; }
  .pm-del-btn  { color: #3a1a1a; border-color: #1a0f0f; } .pm-del-btn:hover { border-color: rgba(239,68,68,0.2); color: #f87171; }
  .pm-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 2rem; text-align: center; }
  .pm-empty-title { font-size: 0.875rem; color: #333; font-weight: 500; }

  /* modal */
  .pm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
  .pm-modal { background: #0e0e0e; border: 1px solid #1e1e1e; border-radius: 12px; width: 100%; max-width: 380px; padding: 1.75rem; }
  .pm-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
  .pm-modal-title { font-size: 0.875rem; font-weight: 600; color: #fafafa; }
  .pm-modal-close { background: none; border: none; color: #333; cursor: pointer; padding: 2px; transition: color 0.15s; }
  .pm-modal-close:hover { color: #888; }
  .pm-field { margin-bottom: 1rem; }
  .pm-label { display: block; font-size: 0.65rem; font-weight: 600; color: #333; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem; }
  .pm-input, .pm-select { width: 100%; padding: 0.7rem 1rem; background: #111; border: 1px solid #222; border-radius: 8px; color: #fafafa; font-family: inherit; font-size: 0.85rem; outline: none; -webkit-appearance: none; appearance: none; transition: border-color 0.15s; }
  .pm-input::placeholder { color: #2a2a2a; }
  .pm-input:focus, .pm-select:focus { border-color: #444; }
  .pm-select { cursor: pointer; }
  .pm-select option { background: #111; }
  .pm-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .pm-checkbox-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; }
  .pm-checkbox-row input { accent-color: #fafafa; width: 14px; height: 14px; cursor: pointer; }
  .pm-checkbox-label { font-size: 0.8rem; color: #555; }
  .pm-modal-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
  .pm-modal-submit { flex: 1; padding: 0.7rem; background: #fafafa; border: none; border-radius: 8px; color: #0a0a0a; font-family: inherit; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .pm-modal-submit:hover { opacity: 0.88; }
  .pm-modal-back { padding: 0.7rem 1.25rem; background: none; border: 1px solid #1e1e1e; border-radius: 8px; color: #444; font-family: inherit; font-size: 0.85rem; cursor: pointer; transition: border-color 0.15s, color 0.15s; }
  .pm-modal-back:hover { border-color: #333; color: #888; }
`;

const TYPES = ['credit_card', 'debit_card', 'upi'];
const PROVIDERS = ['visa', 'mastercard', 'amex'];

const initForm = () => ({ type: 'credit_card', lastFour: '', provider: 'visa', isDefault: false });

export const PaymentMethods: React.FC = () => {
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [form, setForm] = useState(initForm());
  const { showNotification } = useNotification();

  const { data, loading, refetch } = useQuery<{ paymentMethods: PaymentMethod[] | undefined }>(GET_PAYMENT_METHODS);
  const [createPM] = useMutation(CREATE_PAYMENT_METHOD, { onCompleted: () => { setModal(null); setForm(initForm()); refetch(); showNotification('success', 'Card added', 'Payment method saved successfully.'); } });
  const [updatePM] = useMutation(UPDATE_PAYMENT_METHOD, { onCompleted: () => { setModal(null); setEditing(null); setForm(initForm()); refetch(); showNotification('success', 'Changes saved', 'Payment method updated.'); } });
  const [deletePM] = useMutation(DELETE_PAYMENT_METHOD, { onCompleted: () => { refetch(); showNotification('info', 'Card removed', 'Payment method deleted.'); } });

  const methods: PaymentMethod[] = data?.paymentMethods || [];

  const openEdit = (m: PaymentMethod) => {
    setEditing(m);
    setForm({ type: m.type, lastFour: m.lastFour, provider: m.provider, isDefault: m.isDefault });
    setModal('edit');
  };

  const handleSave = async () => {
    try {
      if (modal === 'create') await createPM({ variables: { createPaymentMethodInput: form } });
      else if (modal === 'edit' && editing) await updatePM({ variables: { id: editing.id, updateData: form } });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this payment method?')) return;
    try { await deletePM({ variables: { id } }); } catch {}
  };

  const closeModal = () => { setModal(null); setEditing(null); setForm(initForm()); };

  return (
    <>
      <style>{DS}</style>
      <div className="pm-root">
        <div className="pm-header">
          <span className="pm-title">Payment Methods</span>
          <button className="pm-add-btn" onClick={() => setModal('create')}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: '0.8rem', color: '#2a2a2a', padding: '2rem 0' }}>Loading…</p>
        ) : methods.length === 0 ? (
          <div className="py-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No payment methods</AlertTitle>
              <AlertDescription>
                You haven't added any credit or debit cards yet. Add a payment method to enable checkout functionality.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="pm-grid">
            {methods.map((m) => (
              <div key={m.id} className="pm-card">
                <div className="pm-card-top">
                  <span className="pm-card-type">{m.type.replace('_', ' ')}</span>
                  {m.isDefault && <span className="pm-default-pill">Default</span>}
                </div>
                <div className="pm-card-meta">
                  <div className="pm-meta-row">
                    <span className="pm-meta-key">Provider</span>
                    <span className="pm-meta-val" style={{ textTransform: 'capitalize' }}>{m.provider}</span>
                  </div>
                  <div className="pm-meta-row">
                    <span className="pm-meta-key">Number</span>
                    <span className="pm-meta-val">···· {m.lastFour}</span>
                  </div>
                </div>
                <div className="pm-card-actions">
                  <button className="pm-action-btn pm-edit-btn" onClick={() => openEdit(m)}>Edit</button>
                  <button className="pm-action-btn pm-del-btn"  onClick={() => handleDelete(m.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modal && (
          <div className="pm-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
            <div className="pm-modal">
              <div className="pm-modal-header">
                <span className="pm-modal-title">{modal === 'create' ? 'Add payment method' : 'Edit payment method'}</span>
                <button className="pm-modal-close" onClick={closeModal}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="pm-row2">
                <div className="pm-field">
                  <label className="pm-label">Type</label>
                  <select className="pm-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="pm-field">
                  <label className="pm-label">Provider</label>
                  <select className="pm-select" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}>
                    {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="pm-field">
                <label className="pm-label">Last 4 digits</label>
                <input className="pm-input" value={form.lastFour} maxLength={4} placeholder="1234" onChange={(e) => setForm({ ...form, lastFour: e.target.value })} />
              </div>

              <div className="pm-checkbox-row">
                <input type="checkbox" id="pm-default" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
                <label htmlFor="pm-default" className="pm-checkbox-label">Set as default</label>
              </div>

              <div className="pm-modal-actions">
                <button className="pm-modal-back" onClick={closeModal}>Cancel</button>
                <button className="pm-modal-submit" onClick={handleSave}>
                  {modal === 'create' ? 'Add' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
