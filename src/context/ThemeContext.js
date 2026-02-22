import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTheme } from '../services/api';
import { API_BASE_URL } from '../config';

const ThemeContext = createContext();

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be within ThemeProvider');
  return ctx;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#FF69B4', secondaryColor: '#FFC0CB', accentColor: '#FFB6C1',
    backgroundColor: '#FFF5F7', textColor: '#333333', fontFamily: 'Cairo, sans-serif',
    logoText: 'Maman Algérienne', logoImage: '', favicon: ''
  });

  useEffect(() => { loadTheme(); }, []);

  const loadTheme = async () => {
    try {
      const res = await getTheme();
      setTheme(res.data);
      applyTheme(res.data);
    } catch (err) {
      console.error('Theme load error:', err);
    }
  };

  const applyTheme = (t) => {
    const r = document.documentElement;
    r.style.setProperty('--primary-color', t.primaryColor);
    r.style.setProperty('--secondary-color', t.secondaryColor);
    r.style.setProperty('--accent-color', t.accentColor);
    r.style.setProperty('--background-color', t.backgroundColor);
    r.style.setProperty('--text-color', t.textColor);
    r.style.setProperty('--font-family', t.fontFamily);

    // Apply font family to body
    if (t.fontFamily) {
      document.body.style.fontFamily = t.fontFamily;
      // Load Google Font dynamically
      const fontName = t.fontFamily.split(',')[0].trim();
      const existingLink = document.querySelector(`link[data-font="${fontName}"]`);
      if (!existingLink && fontName !== 'Cairo') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.dataset.font = fontName;
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
    }

    if (t.favicon) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = `${API_BASE_URL}${t.favicon}`;
      document.head.appendChild(link);
    }
  };

  const updateThemeState = (t) => { setTheme(t); applyTheme(t); };

  return (
    <ThemeContext.Provider value={{ theme, updateThemeState, loadTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
