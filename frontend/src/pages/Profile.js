import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';

const Profile = () => {
  const { user, updateUserState } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profilePicture) {
      const url = URL.createObjectURL(profilePicture);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl('');
    }
  }, [profilePicture]);

  const handleFileChange = (e) => {
    setError('');
    setSuccess('');
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicture(file);
  };

  const handleSelectClick = () => fileInputRef.current?.click();
  const handleRemoveSelection = () => {
    setProfilePicture(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      setError('Please select an image to upload.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const { data } = await axiosInstance.put('/api/users/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUserState({ profilePicture: data.profilePicture });
      setSuccess('Profile picture updated successfully!');
      setProfilePicture(null);
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      e.target.reset?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile picture.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      maxWidth: 860,
      margin: '40px auto',
      padding: '32px',
      borderRadius: 18,
      background: '#fff',
      boxShadow: '0 24px 70px rgba(6,24,60,0.08)',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
    },
    header: { display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' },
    avatarWrap: {
      width: 130,
      height: 130,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      boxShadow: '0 12px 40px rgba(6,182,212,0.15)',
      border: '4px solid rgba(6,182,212,0.18)',
      background: 'linear-gradient(180deg, rgba(6,182,212,0.08), rgba(37,99,235,0.03))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    avatarImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%',
      transition: 'transform 0.4s ease',
    },
    userInfo: { display: 'flex', flexDirection: 'column', gap: 6 },
    name: { fontSize: 22, fontWeight: 900, color: '#06263e' },
    email: { color: '#475569', fontSize: 14 },
    lastUpdated: { fontSize: 13, color: '#64748b', marginTop: 6 },
    form: { marginTop: 20, display: 'grid', gap: 14 },
    label: { fontWeight: 700, color: '#0f172a', fontSize: 14 },
    fileArea: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      borderRadius: 14,
      border: '1px dashed rgba(10,20,40,0.08)',
      background: '#f9fbff',
      cursor: 'pointer',
      transition: 'box-shadow 0.16s ease, transform 0.12s ease',
      overflow: 'hidden',
    },
    fileInfo: { display: 'flex', flexDirection: 'column', gap: 6 },
    fileName: { fontSize: 15, color: '#0f172a', fontWeight: 600 },
    fileHint: { fontSize: 13, color: '#64748b' },
    controls: { display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 },
    selectBtn: {
      padding: '10px 16px',
      borderRadius: 12,
      border: 'none',
      background: 'linear-gradient(90deg,#1d4ed8,#06b6d4)',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 700,
      boxShadow: '0 10px 28px rgba(14,165,164,0.12)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    clearBtn: {
      padding: '8px 14px',
      borderRadius: 12,
      border: '1px solid rgba(10,20,40,0.08)',
      background: '#fff',
      color: '#06263e',
      cursor: 'pointer',
      fontWeight: 700,
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    uploadBtn: {
      padding: '12px 18px',
      borderRadius: 14,
      border: 'none',
      background: 'linear-gradient(90deg,#06b6d4,#1d4ed8)',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 800,
      display: 'inline-flex',
      gap: 10,
      alignItems: 'center',
      boxShadow: '0 12px 32px rgba(29,78,216,0.15)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    messageSuccess: {
      color: '#064e3b',
      background: '#ecfdf5',
      padding: 12,
      borderRadius: 12,
      border: '1px solid #dcfce7',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontWeight: 600,
    },
    messageError: {
      color: '#b91c1c',
      background: '#fff1f2',
      padding: 12,
      borderRadius: 12,
      border: '1px solid #fee2e2',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontWeight: 600,
    },
    smallMuted: { color: '#64748b', fontSize: 13 },
  };

  const serverUrl = 'http://localhost:5000';

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.avatarWrap} className="avatar-wrap">
          <img
            src={previewUrl || `${serverUrl}${user.profilePicture}?${new Date().getTime()}`}
            alt={`${user.name} avatar`}
            style={styles.avatarImg}
          />
        </div>

        <div style={styles.userInfo}>
          <div style={styles.name}>{user.name}</div>
          <div style={styles.email}>{user.email}</div>
          <div style={styles.lastUpdated}>
            Last updated:{' '}
            <span style={{ color: '#475569', fontWeight: 700 }}>
              {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form} aria-label="Update profile picture form">
        <label style={styles.label}>Profile Photo</label>

        <div
          style={styles.fileArea}
          onClick={handleSelectClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectClick(); }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div style={{ width: 90, height: 90, borderRadius: 12, overflow: 'hidden', boxShadow: 'inset 0 0 30px rgba(2,6,23,0.02)' }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Selected preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#475569', fontWeight: 700 }}>
                JPG / PNG
              </div>
            )}
          </div>

          <div style={styles.fileInfo}>
            <div style={styles.fileName}>{profilePicture ? profilePicture.name : 'No file selected'}</div>
            <div style={styles.fileHint}>Click to choose an image — square or portrait works best.</div>
            <div style={styles.controls}>
              <button type="button" onClick={handleSelectClick} style={styles.selectBtn}>Choose file</button>
              {profilePicture && (
                <button type="button" onClick={handleRemoveSelection} style={styles.clearBtn}>Remove</button>
              )}
            </div>
          </div>
        </div>

        <button type="submit" style={styles.uploadBtn} disabled={loading}>
          {loading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="4"></circle>
                <path d="M22 12a10 10 0 0 0-10-10" stroke="#fff" strokeWidth="4" strokeLinecap="round"></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Upload Image'
          )}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
        {error && <div role="alert" style={styles.messageError}>❌ {error}</div>}
        {success && <div role="status" style={styles.messageSuccess}>✅ {success}</div>}
        <div style={styles.smallMuted}>Tip: images are displayed across the site — choose a clear headshot or brand image.</div>
      </div>
    </div>
  );
};

export default Profile;
