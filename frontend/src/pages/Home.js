import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [hover, setHover] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '3rem 1.25rem',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
      margin: '24px auto',
      background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)'
    },
    inner: {
      width: '100%',
      maxWidth: 1100,
      display: 'grid',
      gridTemplateColumns: '1fr 440px',
      gap: 28,
      alignItems: 'center'
    },
    hero: {
      borderRadius: 20,
      padding: '48px 40px',
      background: 'linear-gradient(180deg, #ffffff 0%, #f7faff 100%)',
      boxShadow: '0 20px 60px rgba(8,18,36,0.08)',
      border: '1px solid rgba(10,20,40,0.03)',
      position: 'relative',
      overflow: 'hidden'
    },
    heroTitle: {
      fontSize: 46,
      color: '#06263e',
      margin: '0 0 16px',
      lineHeight: 1.1,
      fontWeight: 900
    },
    subtitle: { fontSize: 16, color: '#475569', marginBottom: 28, maxWidth: 680, lineHeight: 1.6 },
    cta: {
      display: 'inline-flex',
      gap: 12,
      alignItems: 'center',
      padding: '14px 20px',
      borderRadius: 14,
      background: 'linear-gradient(90deg,#1d4ed8,#06b6d4)',
      color: '#fff',
      fontWeight: 800,
      textDecoration: 'none',
      fontSize: 16,
      boxShadow: '0 14px 40px rgba(13,60,120,0.12)',
      transition: 'all 0.3s ease'
    },
    features: { marginTop: 32, display: 'grid', gap: 14 },
    featureItem: { display: 'flex', gap: 14, alignItems: 'flex-start', opacity: 0, transform: 'translateY(20px)', animation: 'fadeInUp 0.6s forwards' },
    featureIcon: { width: 48, height: 48, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg,#e6f6ff,#eaf9fb)', fontSize: 20, color: '#046b9a' },
    featureTextTitle: { fontWeight: 800, color: '#0b2545', fontSize: 15 },
    featureTextDesc: { color: '#64748b', fontSize: 13, marginTop: 4 },

    card: {
      borderRadius: 20,
      padding: 24,
      background: '#ffffff',
      boxShadow: '0 18px 60px rgba(8,18,36,0.08)',
      border: '1px solid rgba(10,20,40,0.03)',
      transform: 'translateY(0)',
      transition: 'transform 0.4s ease, box-shadow 0.4s ease'
    },
    rightTitle: { margin: 0, fontSize: 20, color: '#06263e', fontWeight: 800, marginBottom: 12 },
    statRow: { display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' },
    statItem: {
      minWidth: 120,
      padding: 14,
      borderRadius: 12,
      background: '#f0f4ff',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'default'
    },
    statItemHover: { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(29,78,216,0.2)' },
    statValue: { fontWeight: 800, color: '#06263e', fontSize: 20 },
    statLabel: { color: '#64748b', fontSize: 13 }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes heroFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .home-inner { animation: heroFade .8s ease-out forwards; }
        .featureItem:nth-child(1) { animation-delay: 0.2s; }
        .featureItem:nth-child(2) { animation-delay: 0.35s; }
        .featureItem:nth-child(3) { animation-delay: 0.5s; }

        @media (max-width: 920px) {
          .home-inner { grid-template-columns: 1fr !important; gap: 18px !important; }
          .hero-title { font-size: 32px !important; }
        }
      `}</style>

      <div style={styles.inner} className="home-inner">
        <div style={styles.hero}>
          <h1 style={styles.heroTitle} className="hero-title">TravelLog — capture places that matter</h1>
          <p style={styles.subtitle}>Beautiful, simple and private travel journal for people who love to explore. Save memories, share highlights, and discover new places from the community.</p>

          <Link
            to="/register"
            style={{ ...styles.cta, ...(hover && { transform: 'translateY(-4px)', boxShadow: '0 18px 48px rgba(13,60,120,0.14)' }) }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M2 12h20" stroke="white" strokeWidth="2" strokeLinecap="round"></path>
              <path d="M16 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            Get Started
          </Link>

          <div style={styles.features}>
            <div style={styles.featureItem} className="featureItem">
              <div style={styles.featureIcon}>✈️</div>
              <div>
                <div style={styles.featureTextTitle}>Journal your travels</div>
                <div style={styles.featureTextDesc}>Save notes, photos and dates — private by default.</div>
              </div>
            </div>

            <div style={styles.featureItem} className="featureItem">
              <div style={styles.featureIcon}>📸</div>
              <div>
                <div style={styles.featureTextTitle}>Beautiful photo support</div>
                <div style={styles.featureTextDesc}>Upload multiple photos and display your moments in a modern gallery.</div>
              </div>
            </div>

            <div style={styles.featureItem} className="featureItem">
              <div style={styles.featureIcon}>🔒</div>
              <div>
                <div style={styles.featureTextTitle}>Control your privacy</div>
                <div style={styles.featureTextDesc}>Keep entries private or share with friends — you decide.</div>
              </div>
            </div>
          </div>
        </div>

        <aside style={styles.card} aria-hidden className="right-card">
          <h3 style={styles.rightTitle}>Quick snapshot</h3>
          <p style={{ color: '#64748b', marginTop: 0 }}>A clean place to store your travel highlights — accessible anywhere.</p>

          <div style={styles.statRow}>
            <div style={styles.statItem} className="stat-item">
              <div style={styles.statValue}>120+</div>
              <div style={styles.statLabel}>Locations saved</div>
            </div>
            <div style={styles.statItem} className="stat-item">
              <div style={styles.statValue}>3.8k</div>
              <div style={styles.statLabel}>Photos uploaded</div>
            </div>
            <div style={styles.statItem} className="stat-item">
              <div style={styles.statValue}>24</div>
              <div style={styles.statLabel}>Featured journeys</div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Link to="/entries" style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>Browse recent entries →</Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
