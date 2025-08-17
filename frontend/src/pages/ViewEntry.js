import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import ImageCarousel from '../components/ImageCarousel';
import { FaHeart, FaShareAlt } from 'react-icons/fa';

const ViewEntry = () => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/entries/${id}`);
        setEntry(data);
        setLiked(data.isLiked || false); // Optional: liked state
      } catch (err) {
        setError('Failed to fetch entry. It may have been deleted or you may not be authorized to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const handleLike = async () => {
    try {
      await axiosInstance.put(`/api/entries/${id}/like`);
      setLiked(prev => !prev);
    } catch (err) {
      console.error('Failed to update like status.');
    }
  };

  const styles = {
    page: {
      padding: '40px 20px',
      minHeight: '70vh',
      background: 'linear-gradient(180deg, #f7fbff 0%, #e0f2fe 100%)',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
    },
    container: {
      maxWidth: 980,
      margin: '0 auto',
      backgroundColor: '#fff',
      padding: 28,
      borderRadius: 18,
      boxShadow: '0 24px 60px rgba(0,0,0,0.08)',
      border: '1px solid rgba(10,20,40,0.05)',
      animation: 'fadeIn 0.5s ease',
    },
    back: {
      color: '#06b6d4',
      textDecoration: 'none',
      fontWeight: 700,
      display: 'inline-block',
      marginBottom: 20,
      transition: 'opacity 0.2s, transform 0.2s',
    },
    header: { borderBottom: '1px solid #eef3fb', paddingBottom: 14, marginBottom: 22 },
    title: { color: '#06263e', margin: 0, fontSize: 32, fontWeight: 900 },
    meta: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10, fontSize: 14, color: '#475569' },
    metaBadge: { background: '#eff6ff', color: '#0369a1', padding: '4px 10px', borderRadius: 8, fontWeight: 600 },
    description: { lineHeight: 1.8, fontSize: 17, color: '#24303a', whiteSpace: 'pre-wrap', marginTop: 18 },
    carouselWrap: { borderRadius: 14, overflow: 'hidden', marginBottom: 24 },
    actions: { display: 'flex', gap: 14, marginTop: 20 },
    actionBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 14px',
      borderRadius: 12,
      border: '1px solid #e6eef6',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: 14,
      color: '#475569',
      transition: 'all 0.2s',
      background: '#fff',
    },
    actionBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' },
    loading: { textAlign: 'center', padding: 40, fontSize: 16, color: '#64748b' },
    error: { color: '#b91c1c', textAlign: 'center', padding: 40 },
  };

  if (loading) return <p style={styles.loading}>Loading entry...</p>;
  if (error) return <p style={styles.error}>{error}</p>;
  if (!entry) return <p style={styles.loading}>Entry not found.</p>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link
          to="/"
          style={styles.back}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.8)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
        >
          &larr; Back to Feed
        </Link>

        <div style={styles.carouselWrap}>
          <ImageCarousel images={entry.images} />
        </div>

        <header style={styles.header}>
          <h1 style={styles.title}>{entry.title}</h1>
          <div style={styles.meta}>
            <span style={styles.metaBadge}>Location: {entry.location}</span>
            <span style={styles.metaBadge}>Date: {new Date(entry.date).toLocaleDateString()}</span>
            <span style={styles.metaBadge}>Author: {entry.user ? entry.user.name : 'Unknown'}</span>
          </div>
        </header>

        <div style={styles.description}>{entry.description}</div>

        <div style={styles.actions}>
          <div
            style={styles.actionBtn}
            onClick={handleLike}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.actionBtnHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: 'none' })}
          >
            <FaHeart color={liked ? '#ef4444' : '#475569'} /> {liked ? 'Liked' : 'Like'}
          </div>
          <div
            style={styles.actionBtn}
            onClick={() => navigator.share ? navigator.share({ title: entry.title, text: entry.description }) : alert('Share feature not supported.')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.actionBtnHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: 'none' })}
          >
            <FaShareAlt /> Share
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEntry;
