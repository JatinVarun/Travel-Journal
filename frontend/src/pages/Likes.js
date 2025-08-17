import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Likes = () => {
  const [likedEntries, setLikedEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchLikedEntries = async () => {
      try {
        const { data } = await axiosInstance.get('/api/entries/liked');
        setLikedEntries(data);
      } catch (err) {
        setError('Failed to fetch your liked entries.');
      } finally {
        setLoading(false);
      }
    };
    fetchLikedEntries();
  }, []);

  const handleUnlike = async (id) => {
    // Optimistic UI update
    setLikedEntries(prev => prev.filter(entry => entry._id !== id));
    try {
      await axiosInstance.put(`/api/entries/${id}/like`);
    } catch (err) {
      setError('Failed to update like status. Please refresh.');
    }
  };

  const serverUrl = 'http://localhost:5000';
  const defaultImage = 'https://placehold.co/600x400/ade8f4/023e8a?text=My+Trip';

  const styles = {
    page: {
      maxWidth: 1200,
      margin: '32px auto',
      padding: '0 20px',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial'
    },
    titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 },
    title: { fontSize: 32, fontWeight: 900, color: '#0b2545', margin: 0 },
    subtitle: { color: '#64748b', fontSize: 14 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
    card: {
      borderRadius: 16,
      overflow: 'hidden',
      background: 'linear-gradient(180deg,#ffffff,#f7fbff)',
      boxShadow: '0 20px 60px rgba(8,18,36,0.08)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 360,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    cardHover: { transform: 'translateY(-8px)', boxShadow: '0 28px 64px rgba(8,18,36,0.18)' },
    imageWrap: { position: 'relative', height: 200, overflow: 'hidden' },
    image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' },
    imageOverlay: {
      position: 'absolute', bottom: 12, left: 12, padding: '6px 12px', borderRadius: 12,
      background: 'rgba(2,6,23,0.6)', color: '#fff', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(4px)'
    },
    body: { padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
    h3: { margin: 0, fontSize: 20, fontWeight: 800, color: '#06263e', lineHeight: 1.2 },
    meta: { fontSize: 13, color: '#64748b' },
    footer: { marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
    viewLink: {
      color: '#0b63ff',
      fontWeight: 700,
      textDecoration: 'none',
      padding: '8px 14px',
      borderRadius: 12,
      transition: 'all 0.2s',
      background: 'transparent'
    },
    unlikeBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      border: 'none',
      background: 'linear-gradient(90deg,#f87171,#ef4444)',
      color: '#fff',
      fontSize: 16,
      padding: '8px 12px',
      borderRadius: 12,
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    empty: {
      padding: 40,
      textAlign: 'center',
      borderRadius: 16,
      background: '#f9fbff',
      boxShadow: '0 12px 34px rgba(8,18,36,0.06)',
      color: '#64748b'
    },
    ctaBtn: {
      display: 'inline-block',
      marginTop: 14,
      background: 'linear-gradient(90deg,#1d4ed8,#06b6d4)',
      color: '#fff',
      padding: '10px 18px',
      borderRadius: 14,
      textDecoration: 'none',
      fontWeight: 800,
      boxShadow: '0 12px 32px rgba(29,78,216,0.15)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    error: { color: '#b91c1c', marginBottom: 12 }
  };

  if (loading) return <p style={{ padding: 28, textAlign: 'center', color: '#64748b' }}>Loading your liked adventures...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.page}>
      <style>{`
        .like-card:hover { transform: translateY(-8px); box-shadow: 0 28px 64px rgba(8,18,36,0.18); }
        .like-card:hover img { transform: scale(1.08); }
        .unlike-btn:hover { transform: scale(1.05); box-shadow: 0 10px 28px rgba(239,68,68,0.3); }
        .view-link:hover { background: rgba(11,99,255,0.08); }
        @keyframes fadeInUp { from {opacity:0; transform: translateY(20px);} to {opacity:1; transform: translateY(0);} }
        .like-card { animation: fadeInUp 0.6s ease forwards; }
        @media (max-width: 640px) { .likes-title { font-size: 24px !important; } }
      `}</style>

      <div style={styles.titleRow}>
        <h1 style={styles.title} className="likes-title">My Liked Entries ❤️</h1>
        <div style={styles.subtitle}>{likedEntries.length} {likedEntries.length === 1 ? 'entry' : 'entries'}</div>
      </div>

      {likedEntries.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontWeight: 700, fontSize: 18, margin: 0, color: '#0b2545' }}>You haven't liked any entries yet.</p>
          <p style={{ marginTop: 8 }}>Discover beautiful locations and save your favorites.</p>
          <Link to="/" style={styles.ctaBtn}>Browse the feed</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {likedEntries.map(entry => (
            <article key={entry._id} style={styles.card} className="like-card" aria-labelledby={`liked-${entry._id}`}>
              <div style={styles.imageWrap}>
                <img
                  src={entry.images.length > 0 ? `${serverUrl}${entry.images[0]}` : defaultImage}
                  alt={entry.title}
                  style={styles.image}
                />
                <div style={styles.imageOverlay}>{entry.location}</div>
              </div>

              <div style={styles.body}>
                <h3 id={`liked-${entry._id}`} style={styles.h3}>{entry.title}</h3>
                <div style={styles.meta}><strong>By:</strong> {entry.user ? entry.user.name : 'Unknown'}</div>

                <div style={styles.footer}>
                  <Link to={`/entry/${entry._id}`} className="view-link" style={styles.viewLink}>View Details</Link>

                  <button
                    onClick={() => handleUnlike(entry._id)}
                    className="unlike-btn"
                    style={styles.unlikeBtn}
                    aria-label={`Unlike ${entry.title}`}
                    title="Unlike"
                  >
                    ❤️ Unlike
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Likes;
