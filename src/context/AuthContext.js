import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

var AuthContext = createContext();

export var useAuth = function() {
  var ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};

export var AuthProvider = function(props) {
  var children = props.children;
  var _s1 = useState(null);
  var user = _s1[0], setUser = _s1[1];
  var _s2 = useState(function() { return localStorage.getItem('token'); });
  var token = _s2[0], setToken = _s2[1];
  var _s3 = useState(true);
  var loading = _s3[0], setLoading = _s3[1];

  useEffect(function() {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  var loadUser = async function() {
    try {
      var res = await axios.get(API_URL + '/auth/me', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setUser(res.data);
    } catch (err) {
      // Only logout on 401 (invalid/expired token)
      // Do NOT logout on network errors, timeouts, 500s etc.
      if (err.response && err.response.status === 401) {
        logout();
      }
      // For other errors (network down, 500, timeout) keep user logged in
    } finally {
      setLoading(false);
    }
  };

  var login = async function(phoneNumber, password) {
    try {
      var res = await axios.post(API_URL + '/auth/login', { phoneNumber: phoneNumber, password: password });
      var t = res.data.token;
      var u = res.data.user;
      localStorage.setItem('token', t);
      setToken(t);
      setUser(u);
      return { success: true, message: res.data.message, user: u };
    } catch (err) {
      var msg = (err.response && err.response.data && err.response.data.message) || 'خطأ في تسجيل الدخول';
      return { success: false, message: msg };
    }
  };

  var register = async function(fullName, phoneNumber, password) {
    try {
      var res = await axios.post(API_URL + '/auth/register', { fullName: fullName, phoneNumber: phoneNumber, password: password });
      var t = res.data.token;
      var u = res.data.user;
      localStorage.setItem('token', t);
      setToken(t);
      setUser(u);
      return { success: true, message: res.data.message };
    } catch (err) {
      var msg = (err.response && err.response.data && err.response.data.message) || 'خطأ في التسجيل';
      return { success: false, message: msg };
    }
  };

  var logout = function() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  var value = {
    user: user,
    token: token,
    loading: loading,
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: !!user,
    isAdmin: (user && user.isAdmin) || false
  };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};
