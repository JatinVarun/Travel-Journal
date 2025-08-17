import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaPlus, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hover, setHover] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  const handleMouseEnter = (key) => setHover({ ...hover, [key]: true });
  const handleMouseLeave = (key) => setHover({ ...hover, [key]: false });

  // Close dropdown whenever route changes
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const styles = {
    nav: { backdropFilter: 'saturate(180%) blur(12px)', background: 'rgba(255,255,255,0.75)',
      padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 1000, transition: 'all 0.2s ease',
    },
    left: { display: 'flex', alignItems: 'center', gap: 16 },
    logo: { textDecoration: 'none', color: '#0b2545', fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em',
      display: 'flex', alignItems: 'center', gap: 12,
    },
    brandMark: { width: 40, height: 40, borderRadius: 12, display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg,#1d4ed8,#06b6d4)', color: '#fff', fontWeight: 900,
      fontSize: 18, boxShadow: '0 8px 24px rgba(14,165,164,0.14)',
    },
    links: { display: 'flex', alignItems: 'center', gap: 16 },
    link: { textDecoration: 'none', color: '#16324f', fontWeight: 600, padding: '8px 12px', borderRadius: 12, transition: 'all 0.18s' },
    linkHover: { background: 'rgba(29,78,216,0.08)', transform: 'translateY(-1px)' },
    button: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12,
      fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.18s',
    },
    addBtn: { background: 'linear-gradient(90deg,#06b6d4,#1d4ed8)', color: '#fff', boxShadow: '0 10px 26px rgba(6,182,212,0.18)' },
    addBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 14px 36px rgba(6,182,212,0.24)' },
    profilePic: { width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(13,60,120,0.15)',
      cursor: 'pointer', transition: 'all 0.18s', boxShadow: '0 6px 18px rgba(2,6,23,0.1)',
    },
    dropdown: { position: 'absolute', right: 28, top: 64, background: '#fff', borderRadius: 14, boxShadow: '0 18px 48px rgba(0,0,0,0.12)',
      padding: 12, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 2000, minWidth: 160,
    },
    dropdownLink: { textDecoration: 'none', color: '#16324f', padding: '8px 12px', borderRadius: 10, fontWeight: 600, transition: 'all 0.16s' },
    dropdownHover: { background: 'rgba(29,78,216,0.06)' },
  };

  const serverUrl = 'http://localhost:5000';

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>
          <span style={styles.brandMark}>TG</span>
          <span>TravelGuide</span>
        </Link>
      </div>

      <div style={styles.links}>
        {user ? (
          <>
            <button
              style={{ ...styles.button, ...styles.addBtn, ...(hover.add && styles.addBtnHover) }}
              onMouseEnter={() => handleMouseEnter('add')}
              onMouseLeave={() => handleMouseLeave('add')}
              onClick={() => navigate('/add-entry')}
            >
              <FaPlus /> Add
            </button>

            <Link
              to="/likes"
              style={{ ...styles.link, ...(hover.likes && styles.linkHover) }}
              onMouseEnter={() => handleMouseEnter('likes')}
              onMouseLeave={() => handleMouseLeave('likes')}
            >
              <FaHeart /> My Likes
            </Link>

            <div style={{ position: 'relative' }}>
              <img
                src={`${serverUrl}${user.profilePicture}?${new Date().getTime()}`}
                alt="Profile"
                style={styles.profilePic}
                onClick={() => setDropdownOpen(prev => !prev)}
              />
              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <Link to="/profile" style={{ ...styles.dropdownLink, ...(hover.profile && styles.dropdownHover) }}
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={() => handleMouseLeave('profile')}
                  >
                    <FaUserCircle /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{ ...styles.dropdownLink, color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{ ...styles.link, ...(hover.login && styles.linkHover) }}
              onMouseEnter={() => handleMouseEnter('login')}
              onMouseLeave={() => handleMouseLeave('login')}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ ...styles.link, ...(hover.register && styles.linkHover) }}
              onMouseEnter={() => handleMouseEnter('register')}
              onMouseLeave={() => handleMouseLeave('register')}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
