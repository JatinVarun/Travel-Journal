import React, { useState, useEffect, useRef } from 'react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const serverUrl = 'http://localhost:5000';
  const autoPlayRef = useRef(null);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto-play every 4 seconds
  useEffect(() => {
    autoPlayRef.current = goToNext;
  });

  useEffect(() => {
    const play = () => autoPlayRef.current();
    const interval = setInterval(play, 4000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const styles = {
    root: {
      position: 'relative',
      width: '100%',
      height: 'min(68vh, 520px)',
      maxHeight: '520px',
      margin: '0 auto',
      overflow: 'hidden',
      borderRadius: 16,
      background: 'linear-gradient(180deg, #eef2f6 0%, #f9fafc 100%)',
      boxShadow: '0 12px 40px rgba(10,20,40,0.08)',
    },
    imageWrap: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f7fafc',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: 14,
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0,
      transition: 'opacity 0.8s ease, transform 0.8s ease',
      willChange: 'opacity, transform',
    },
    imageActive: {
      opacity: 1,
      transform: 'scale(1)',
      zIndex: 2,
    },
    arrow: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 50,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      background: 'rgba(15, 23, 42, 0.6)',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 6px 18px rgba(2,6,23,0.3)',
      transition: 'transform .12s ease, background .12s ease',
      zIndex: 5,
      fontSize: 24,
    },
    arrowHover: { transform: 'translateY(-50%) scale(1.05)', background: 'rgba(15, 23, 42, 0.78)' },
    leftArrow: { left: 16 },
    rightArrow: { right: 16 },
    dotsWrap: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: 14,
      display: 'flex',
      gap: 10,
      zIndex: 5,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.6)',
      boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.08)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    activeDot: {
      transform: 'scale(1.4)',
      background: '#0ea5a4',
      boxShadow: '0 6px 18px rgba(14,165,164,0.18)',
    },
    caption: {
      position: 'absolute',
      bottom: 60,
      left: '50%',
      transform: 'translateX(-50%)',
      color: '#fff',
      background: 'rgba(0,0,0,0.36)',
      padding: '6px 12px',
      borderRadius: 10,
      fontWeight: 600,
      fontSize: 14,
      backdropFilter: 'blur(4px)',
      zIndex: 4,
    },
    emptyMessage: {
      padding: 28,
      textAlign: 'center',
      color: '#6b7280',
      fontFamily: 'Inter, system-ui',
      fontSize: 15,
    },
  };

  if (!images || images.length === 0) {
    return <div style={styles.emptyMessage}>No images for this entry.</div>;
  }

  return (
    <div style={styles.root}>
      <style>{`
        .carousel-arrow:active { transform: scale(.98) !important; }
        @media (max-width: 640px) {
          .carousel-arrow { width: 40px !important; height: 40px !important; font-size: 18px !important; }
        }
      `}</style>

      {images.length > 1 && (
        <button
          aria-label="Previous"
          className="carousel-arrow"
          onClick={goToPrevious}
          style={{ ...styles.arrow, ...styles.leftArrow }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, styles.arrowHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, styles.arrow)}
        >
          ‹
        </button>
      )}

      <div style={styles.imageWrap}>
        {images.map((img, idx) => (
          <img
            key={idx}
            src={`${serverUrl}${img}`}
            alt={`Slide ${idx + 1}`}
            style={{ ...styles.image, ...(idx === currentIndex ? styles.imageActive : { transform: 'scale(1.02)' }) }}
          />
        ))}
        {images.length > 1 && (
          <div style={styles.caption}>{`${currentIndex + 1} / ${images.length}`}</div>
        )}
      </div>

      {images.length > 1 && (
        <button
          aria-label="Next"
          className="carousel-arrow"
          onClick={goToNext}
          style={{ ...styles.arrow, ...styles.rightArrow }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, styles.arrowHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, styles.arrow)}
        >
          ›
        </button>
      )}

      {images.length > 1 && (
        <div style={styles.dotsWrap} aria-hidden>
          {images.map((_, idx) => (
            <div
              key={idx}
              style={{ ...styles.dot, ...(idx === currentIndex ? styles.activeDot : {}) }}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
