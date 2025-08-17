import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EntriesPage from './pages/EntriesPage';
import Likes from './pages/Likes';
import AddEntry from './pages/AddEntry';
import ViewEntry from './pages/ViewEntry';
import Profile from './pages/Profile';
import './App.css';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  
  // This key forces EntriesPage to reload on login/logout
  const pageKey = user ? user._id : 'guest';

  return (
    <>
      <Navbar />
      <main style={styles.container}>
        <Routes>
          <Route path="/" element={<EntriesPage key={pageKey} />} />

          {/* Public Routes */}
          <Route path="/entry/:id" element={<ViewEntry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/add-entry" element={<PrivateRoute><AddEntry /></PrivateRoute>} />
          <Route path="/likes" element={<PrivateRoute><Likes /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </main>
    </>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // soft white overlay
    borderRadius: '12px',
    boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(8px)',
    minHeight: 'calc(100vh - 80px)',
  }
};

export default App;
