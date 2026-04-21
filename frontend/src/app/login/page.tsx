'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Role, Country } from '@/types';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: Role.MEMBER,
    country: Country.INDIA,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
      }
      router.push('/dashboard');
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sl-root {
          min-height: 100dvh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Inter', sans-serif;
          background: #0a0a0a;
          color: #fafafa;
        }

        /* ── Left panel ── */
        .sl-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          border-right: 1px solid #1a1a1a;
          position: relative;
          overflow: hidden;
        }

        .sl-left-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .sl-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          position: relative;
          z-index: 1;
        }
        .sl-brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #fafafa;
        }
        .sl-brand-name {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fafafa;
        }

        .sl-left-body {
          position: relative;
          z-index: 1;
        }
        .sl-tagline {
          font-size: clamp(2.2rem, 3.5vw, 3.2rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #fafafa;
          margin-bottom: 1.25rem;
        }
        .sl-tagline em {
          font-style: normal;
          color: #555;
        }
        .sl-desc {
          font-size: 0.925rem;
          color: #444;
          line-height: 1.65;
          max-width: 340px;
        }

        .sl-footer-text {
          font-size: 0.72rem;
          color: #2a2a2a;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }

        /* ── Right panel ── */
        .sl-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
        }

        .sl-form-wrap {
          width: 100%;
          max-width: 380px;
        }

        .sl-form-header {
          margin-bottom: 2.5rem;
        }
        .sl-form-title {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #fafafa;
          margin-bottom: 0.35rem;
        }
        .sl-form-sub {
          font-size: 0.875rem;
          color: #444;
        }

        /* ── Error ── */
        .sl-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: #f87171;
          font-size: 0.825rem;
          margin-bottom: 1.5rem;
          animation: errIn 0.2s ease both;
        }
        @keyframes errIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Fields ── */
        .sl-field {
          margin-bottom: 1rem;
        }
        .sl-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #555;
          margin-bottom: 0.4rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .sl-input-wrap {
          position: relative;
        }
        .sl-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #111;
          border: 1px solid #222;
          border-radius: 8px;
          color: #fafafa;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s;
          -webkit-appearance: none;
          appearance: none;
        }
        .sl-input::placeholder { color: #2e2e2e; }
        .sl-input:focus {
          border-color: #444;
          background: #141414;
        }
        .sl-input option { background: #111; color: #fafafa; }

        .sl-input-pw { padding-right: 2.75rem; }

        .sl-eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #333;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .sl-eye:hover { color: #888; }

        /* ── Signup extra fields ── */
        .sl-extra {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease;
        }
        .sl-extra.open  { max-height: 300px; opacity: 1; }
        .sl-extra.closed { max-height: 0; opacity: 0; pointer-events: none; }

        .sl-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

        .sl-select-wrap { position: relative; }
        .sl-select-wrap::after {
          content: '';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 0; height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #444;
          pointer-events: none;
        }
        .sl-select { padding-right: 2.5rem; cursor: pointer; }

        /* ── Submit ── */
        .sl-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.8rem 1.5rem;
          margin-top: 1.5rem;
          background: #fafafa;
          color: #0a0a0a;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: inherit;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          letter-spacing: 0.01em;
        }
        .sl-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .sl-submit:active:not(:disabled) { transform: translateY(0); }
        .sl-submit:disabled { opacity: 0.35; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .sl-spin { animation: spin 0.75s linear infinite; }

        /* ── Toggle ── */
        .sl-toggle-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 1.5rem;
          font-size: 0.825rem;
          color: #444;
        }
        .sl-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.825rem;
          font-weight: 600;
          color: #fafafa;
          transition: opacity 0.15s;
          padding: 0;
        }
        .sl-toggle-btn:hover { opacity: 0.7; }

        /* ── Demo hint ── */
        .sl-hint {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #1a1a1a;
        }
        .sl-hint-label {
          font-size: 0.68rem;
          font-weight: 600;
          color: #333;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.7rem;
        }
        .sl-hint-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #141414;
        }
        .sl-hint-row:last-child { border-bottom: none; }
        .sl-hint-user {
          font-size: 0.78rem;
          color: #555;
        }
        .sl-hint-cred {
          font-size: 0.72rem;
          color: #2e2e2e;
          font-family: monospace;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .sl-root { grid-template-columns: 1fr; }
          .sl-left { display: none; }
          .sl-right { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="sl-root">
        {/* ── Left panel ── */}
        <div className="sl-left">
          <div className="sl-left-noise" />

          <div className="sl-brand">
            <div className="sl-brand-dot" />
            <span className="sl-brand-name">Slooze</span>
          </div>

          <div className="sl-left-body">
            <h1 className="sl-tagline">
              Food ordering,<br />
              <em>without the noise.</em>
            </h1>
            <p className="sl-desc">
              Role-based access for your entire team. Order, manage, and track — all in one place.
            </p>
          </div>

          <span className="sl-footer-text">© 2025 Slooze</span>
        </div>

        {/* ── Right panel ── */}
        <div className="sl-right">
          <div className="sl-form-wrap">
            <div className="sl-form-header">
              <h2 className="sl-form-title">
                {isLogin ? 'Sign in' : 'Create account'}
              </h2>
              <p className="sl-form-sub">
                {isLogin ? 'Enter your credentials to continue.' : 'Fill in your details to get started.'}
              </p>
            </div>

            {error && (
              <div className="sl-error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="sl-field">
                <label htmlFor="sl-email" className="sl-label">Email</label>
                <div className="sl-input-wrap">
                  <input
                    id="sl-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@slooze.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="sl-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="sl-field">
                <label htmlFor="sl-password" className="sl-label">Password</label>
                <div className="sl-input-wrap">
                  <input
                    id="sl-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="sl-input sl-input-pw"
                  />
                  <button
                    type="button"
                    className="sl-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Sign-up extra fields */}
              <div className={`sl-extra ${!isLogin ? 'open' : 'closed'}`}>
                <div className="sl-field">
                  <label htmlFor="sl-name" className="sl-label">Full name</label>
                  <input
                    id="sl-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="sl-input"
                  />
                </div>

                <div className="sl-row2">
                  <div className="sl-field">
                    <label htmlFor="sl-role" className="sl-label">Role</label>
                    <div className="sl-select-wrap">
                      <select id="sl-role" name="role" value={formData.role} onChange={handleChange} className="sl-input sl-select">
                        <option value={Role.MEMBER}>Member</option>
                        <option value={Role.MANAGER}>Manager</option>
                        <option value={Role.ADMIN}>Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="sl-field">
                    <label htmlFor="sl-country" className="sl-label">Country</label>
                    <div className="sl-select-wrap">
                      <select id="sl-country" name="country" value={formData.country} onChange={handleChange} className="sl-input sl-select">
                        <option value={Country.INDIA}>India</option>
                        <option value={Country.AMERICA}>America</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button id="sl-submit" type="submit" disabled={loading} className="sl-submit">
                {loading ? (
                  <>
                    <svg className="sl-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    {isLogin ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </form>

            <div className="sl-toggle-row">
              <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
              <button id="sl-toggle" type="button" className="sl-toggle-btn" onClick={toggleMode}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>

            {isLogin && (
              <div className="sl-hint">
                <div className="sl-hint-label">Demo accounts</div>
                {[
                  { user: 'Nick Fury · Admin', cred: 'nick.fury@slooze.com' },
                  { user: 'Capt. Marvel · Manager', cred: 'captain.marvel@slooze.com' },
                  { user: 'Thanos · Member', cred: 'thanos@slooze.com' },
                ].map((r) => (
                  <div key={r.cred} className="sl-hint-row">
                    <span className="sl-hint-user">{r.user}</span>
                    <span className="sl-hint-cred">password123</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
