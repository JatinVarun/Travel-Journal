import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
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
      <div style={{
        maxWidth: 460,
        width: '100%',
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 16,
        padding: '32px 28px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        animation: 'fadeInUp 0.5s ease forwards'
      }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: '#0f172a', textAlign: 'center' }}>
          Create your account
        </h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 18, textAlign: 'center' }}>
          Join TravelLog — save and share your favorite places.
        </p>

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
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: '14px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              outline: 'none',
              fontSize: 15,
              background: '#fff'
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '14px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              outline: 'none',
              fontSize: 15,
              background: '#fff'
            }}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={visible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '14px 42px 14px 14px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: 15,
                background: '#fff',
                width: '100%'
              }}
            />
            <button
              type="button"
              onClick={() => setVisible(v => !v)}
              style={{
                position: 'absolute',
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              title={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 700 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
