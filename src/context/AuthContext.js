import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) loadUser();
    else setLoading(false);
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (phoneNumber, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { phoneNumber, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem('token', t);
      setToken(t);
      setUser(u);
      return { success: true, message: res.data.message, user: u };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'خطأ في تسجيل الدخول' };
    }
  };

  const register = async (fullName, phoneNumber, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { fullName, phoneNumber, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem('token', t);
      setToken(t);
      setUser(u);
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'خطأ في التسجيل' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user, isAdmin: user?.isAdmin || false }}>
      {children}
    </AuthContext.Provider>
  );
};
