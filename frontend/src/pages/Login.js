import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password Strength
  const strength = useMemo(() => {
    if (!password) return { label: '', color: '' };
    let score = 0;
    if (password.length > 5) score++;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: 'Weak', color: '#ef4444' },
      { label: 'Fair', color: '#f59e0b' },
      { label: 'Good', color: '#3b82f6' },
      { label: 'Strong', color: '#10b981' }
    ];
    return levels[Math.min(score - 1, levels.length - 1)] || { label: '', color: '' };
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc, #e0f2fe)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    }}>
      <style>{`
        .login-card {
          animation: fadeInUp 0.5s ease forwards;
          backdrop-filter: blur(12px);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .input-group {
          position: relative;
        }
        .input-label {
          position: absolute;
          left: 14px;
          top: 14px;
          font-size: 14px;
          color: #64748b;
          pointer-events: none;
          transition: 0.2s ease all;
        }
        input:focus + .input-label,
        input:not(:placeholder-shown) + .input-label {
          top: -8px;
          left: 10px;
          background: #fff;
          padding: 0 6px;
          font-size: 12px;
          font-weight: 600;
          color: #2563eb;
          border-radius: 6px;
        }
        .btn-glow:hover {
          box-shadow: 0 0 20px rgba(37,99,235,0.3);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="login-card" style={{
        maxWidth: 420,
        width: '100%',
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 16,
        padding: '32px 28px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: '#0f172a' }}>Welcome Back 👋</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 18 }}>Sign in to continue your journey</p>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: 10,
            borderRadius: 8,
            marginBottom: 12
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: 15,
                background: '#fff'
              }}
            />
            <label className="input-label">Email</label>
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type={visible ? 'text' : 'password'}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 42px 14px 14px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: 15,
                background: '#fff'
              }}
            />
            <label className="input-label">Password</label>
            <button
              type="button"
              onClick={() => setVisible(v => !v)}
              style={{
                position: 'absolute',
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer'
              }}
              title={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? '🙈' : '👁️'}
            </button>
          </div>

          {strength.label && (
            <div style={{ fontSize: 12, color: strength.color }}>
              Password Strength: {strength.label}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow"
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(90deg,#2563eb,#06b6d4)',
              color: '#fff',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{
                  width: 18,
                  height: 18,
                  border: '3px solid rgba(255,255,255,0.35)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }}></div>
                Logging in...
                <style>{`@keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }`}</style>
              </>
            ) : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 700 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
