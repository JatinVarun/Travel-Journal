import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      localStorage.removeItem('userInfo');
      setUser(null);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/api/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axiosInstance.post('/api/auth/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };
  
  const updateUserState = (updatedData) => {
      const storedUser = JSON.parse(localStorage.getItem('userInfo'));
      const newUserInfo = { ...storedUser, ...updatedData };
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      setUser(newUserInfo);
  };

  const value = { user, login, logout, register, updateUserState };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};