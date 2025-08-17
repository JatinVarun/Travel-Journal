import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const AddEntry = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const MAX_IMAGES = 3;
  const MAX_FILE_SIZE_MB = 3;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`File ${file.name} is too large. Max ${MAX_FILE_SIZE_MB}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length + images.length > MAX_IMAGES) {
      setError(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
    setPreview(prev => [...prev, ...validFiles.map(file => URL.createObjectURL(file))]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('date', date);
    formData.append('description', description);
    images.forEach(file => formData.append('images', file));

    try {
      await axiosInstance.post('/api/entries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: 900,
      margin: '48px auto',
      padding: '28px',
      borderRadius: 16,
      background: 'linear-gradient(135deg,#ffffff,#f8fafc)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    title: { fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 },
    subtitle: { color: '#64748b', marginBottom: 24 },
    label: { fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#0f172a' },
    input: {
      padding: '12px 14px',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      background: '#fff',
      fontSize: 15,
      width: '100%',
      outline: 'none',
      transition: 'box-shadow 0.2s ease'
    },
    textarea: {
      padding: '12px 14px',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      background: '#fff',
      fontSize: 15,
      width: '100%',
      minHeight: 160,
      resize: 'vertical',
      outline: 'none'
    },
    previewGrid: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 },
    previewImg: {
      width: 120,
      height: 80,
      objectFit: 'cover',
      borderRadius: 10,
      position: 'relative'
    },
    removeBtn: {
      position: 'absolute',
      top: 4,
      right: 4,
      background: 'rgba(0,0,0,0.5)',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: 24,
      height: 24,
      cursor: 'pointer'
    },
    submitBtn: {
      marginTop: 20,
      padding: '12px 20px',
      fontSize: 16,
      fontWeight: 700,
      borderRadius: 12,
      border: 'none',
      background: 'linear-gradient(90deg,#1d4ed8,#06b6d4)',
      color: '#fff',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    },
    errorBox: { marginBottom: 12, padding: 10, borderRadius: 10, background: '#fff1f2', color: '#b91c1c' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add a New Location</h2>
      <div style={styles.subtitle}>Posting as <strong>{user?.name || '...'}</strong></div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Title</label>
        <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} required />

        <label style={styles.label}>Location</label>
        <input style={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} required />

        <label style={styles.label}>Date Visited</label>
        <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label style={styles.label}>Description</label>
        <textarea style={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} required />

        <label style={styles.label}>Images (Max {MAX_IMAGES})</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        <div style={styles.previewGrid}>
          {preview.map((src, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <img src={src} alt="" style={styles.previewImg} />
              <button type="button" style={styles.removeBtn} onClick={() => removeImage(idx)}>×</button>
            </div>
          ))}
        </div>

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Location'}
        </button>
      </form>
    </div>
  );
};

export default AddEntry;
