// src/pages/EntriesPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

/* Professional inline SearchBar (keeps immediate onChange behavior) */
const SearchBar = ({ value = '', onChange = () => {}, placeholder = 'Search title, location, or author...', id = 'entries-search' }) => {
  const [local, setLocal] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => setLocal(value || ''), [value]);

  // Keep behavior: update parent immediately so filtering remains unchanged
  useEffect(() => onChange(local), [local, onChange]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setLocal('');
      inputRef.current?.focus();
    }
  };

  const styles = {
    wrapper: { width: '100%', maxWidth: 820, margin: '0 auto', position: 'relative', fontFamily: 'Inter, system-ui, -apple-system' },
    inputWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: '#fff',
      borderRadius: 14,
      padding: '10px',
      border: '1px solid rgba(10,20,40,0.06)',
      boxShadow: '0 8px 28px rgba(8,18,36,0.04)',
      transition: 'box-shadow .18s, transform .06s'
    },
    icon: {
      width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 10, color: '#0b2545', background: 'linear-gradient(180deg, rgba(29,78,216,0.06), rgba(6,182,212,0.04))',
      fontWeight: 700, fontSize: 16, userSelect: 'none'
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: 15,
      padding: '10px 12px',
      borderRadius: 10,
      background: 'transparent',
      color: '#0f172a'
    },
    clearBtn: {
      width: 40, height: 40, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(15,23,42,0.04)', color: '#334155', border: 'none', cursor: 'pointer'
    },
    searchBtn: {
      borderRadius: 10, padding: '8px 14px', border: 'none',
      background: 'linear-gradient(90deg,#1d4ed8,#06b6d4)', color: '#fff', fontWeight: 800, cursor: 'pointer',
      boxShadow: '0 10px 28px rgba(14,165,164,0.10)'
    }
  };

  return (
    <div style={styles.wrapper}>
      <style>{`
        @media (max-width: 640px) {
          .entries-search-input { font-size: 14px !important; padding: 8px 10px !important; }
        }
        .entries-search-input:focus { box-shadow: 0 12px 32px rgba(7,105,245,0.08); }
        .entries-search-clear:active { transform: scale(.98); }
        .entries-search-btn:active { transform: translateY(1px); }
      `}</style>

      <div style={styles.inputWrap} role="search" aria-label="Search entries">
        <div style={styles.icon} aria-hidden>🔎</div>

        <input
          id={id}
          ref={inputRef}
          className="entries-search-input"
          placeholder={placeholder}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search entries"
          style={styles.input}
        />

        {local ? (
          <button
            aria-label="Clear search"
            title="Clear"
            onClick={() => setLocal('')}
            className="entries-search-clear"
            style={styles.clearBtn}
          >
            ✕
          </button>
        ) : null}

        <button
          aria-label="Focus search input"
          title="Search"
          onClick={() => inputRef.current?.focus()}
          className="entries-search-btn"
          style={styles.searchBtn}
        >
          Search
        </button>
      </div>
    </div>
  );
};

/* EntriesPage: logic unchanged, only styling/UX enhanced */
const EntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/api/entries');
        setEntries(data);
      } catch (err) {
        setError('Failed to fetch locations. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleLikeToggle = async (id) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const { data: updatedEntry } = await axiosInstance.put(`/api/entries/${id}/like`);
      setEntries(entries.map(entry => entry._id === id ? updatedEntry : entry));
    } catch (err) {
      setError('Failed to update like status.');
    }
  };

  const filteredEntries = useMemo(() => {
    if (!searchTerm) return entries;
    return entries.filter(entry =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.user && entry.user.name && entry.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, entries]);

  const deleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await axiosInstance.delete(`/api/entries/${id}`);
        setEntries(entries.filter(entry => entry._id !== id));
      } catch (err) {
        setError('Failed to delete location.');
      }
    }
  };

  const styles = {
    page: { maxWidth: 1200, margin: '28px auto', padding: '20px', fontFamily: 'Inter, system-ui' },
    header: { textAlign: 'center', marginBottom: '20px' },
    title: { color: '#06263e', fontSize: 34, fontWeight: 800, margin: 0 },
    searchWrap: { display: 'flex', justifyContent: 'center', margin: '20px 0 28px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
    card: {
      backgroundColor: '#fff',
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(8,18,36,0.06)',
      transition: 'transform .18s ease, box-shadow .18s',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 320
    },
    cardImageWrap: { position: 'relative', height: 180, overflow: 'hidden', background: '#f7fbff' },
    cardImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .6s ease' },
    locationBadge: {
      position: 'absolute', left: 12, top: 12, padding: '6px 10px', borderRadius: 10,
      background: 'rgba(2,6,23,0.7)', color: '#fff', fontWeight: 700, fontSize: 13
    },
    cardBody: { padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
    cardTitle: { margin: 0, fontSize: 18, color: '#06263e', fontWeight: 700 },
    cardMeta: { color: '#64748b', fontSize: 13 },
    cardFooter: { marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
    viewLink: { color: '#0769f5', textDecoration: 'none', fontWeight: 700, padding: '8px 10px', borderRadius: 10 },
    actionGroup: { display: 'flex', gap: 10, alignItems: 'center' },
    likeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, display: 'inline-flex', alignItems: 'center', gap: 8 },
    deleteBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' },
    empty: { textAlign: 'center', color: '#64748b', padding: 32 },
    error: { color: '#b91c1c', textAlign: 'center', marginBottom: 12 }
  };

  const serverUrl = 'http://localhost:5000';
  const defaultImage = 'https://placehold.co/600x400/ade8f4/023e8a?text=Explore';

  if (loading) return <p style={{ textAlign:'center', padding:48, color:'#64748b' }}>Loading locations...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <main style={styles.page}>
      <style>{`
        .entry-card:hover { transform: translateY(-8px); box-shadow: 0 28px 64px rgba(12,24,48,0.12); }
        .entry-card:hover img { transform: scale(1.04); }
        .view-link:hover { background: rgba(7,105,245,0.06); }
        .like-btn:hover { transform: translateY(-2px) scale(1.02); }
        @media (max-width: 780px) { .entries-title { font-size: 22px !important; } }
      `}</style>

      <header style={styles.header}>
        <h1 style={styles.title} className="entries-title">Explore Amazing Locations</h1>
      </header>

      <div style={styles.searchWrap}>
        <SearchBar value={searchTerm} onChange={(v) => setSearchTerm(v)} placeholder="Search title, location, or author..." />
      </div>

      {filteredEntries.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ margin: 0, fontWeight: 700, color: '#0b2545' }}>No locations found.</p>
          <p style={{ marginTop: 8 }}>Be the first to <Link to="/add-entry" style={{ color: '#0769f5', fontWeight: 700 }}>add one</Link>.</p>
        </div>
      ) : (
        <section style={styles.grid} aria-live="polite">
          {filteredEntries.map(entry => {
            const isLiked = user && Array.isArray(entry.likes) && entry.likes.includes(user._id);
            return (
              <article key={entry._id} style={styles.card} className="entry-card" aria-labelledby={`entry-${entry._id}-title`}>
                <div style={styles.cardImageWrap}>
                  <img src={entry.images.length > 0 ? `${serverUrl}${entry.images[0]}` : defaultImage} alt={entry.title} style={styles.cardImage} />
                  <div style={styles.locationBadge}>{entry.location}</div>
                </div>

                <div style={styles.cardBody}>
                  <h3 id={`entry-${entry._id}-title`} style={styles.cardTitle}>{entry.title}</h3>
                  <div style={styles.cardMeta}><em>By: {entry.user?.name || 'Unknown'}</em></div>

                  <div style={styles.cardFooter}>
                    <Link to={`/entry/${entry._id}`} className="view-link" style={styles.viewLink}>View Details</Link>

                    {user && (
                      <div style={styles.actionGroup}>
                        <button onClick={() => handleLikeToggle(entry._id)} style={styles.likeBtn} className="like-btn" title={isLiked ? 'Unlike' : 'Like'} aria-pressed={isLiked}>
                          <span style={{ fontSize: 18 }}>{isLiked ? '❤️' : '🤍'}</span>
                        </button>

                        {user._id === entry.user?._id && (
                          <button onClick={() => deleteEntry(entry._id)} style={styles.deleteBtn}>Delete</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default EntriesPage;
