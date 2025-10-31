import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTheme } from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#FF69B4',
    secondaryColor: '#FFC0CB',
    accentColor: '#FFB6C1',
    backgroundColor: '#FFF5F7',
    textColor: '#333333',
    fontFamily: 'Cairo, sans-serif',
    logoText: 'Maman Algérienne',
    logoImage: '',
    favicon: '',
  });

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const response = await getTheme();
      setTheme(response.data);
      applyTheme(response.data);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyTheme = (themeData) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeData.primaryColor);
    root.style.setProperty('--secondary-color', themeData.secondaryColor);
    root.style.setProperty('--accent-color', themeData.accentColor);
    root.style.setProperty('--background-color', themeData.backgroundColor);
    root.style.setProperty('--text-color', themeData.textColor);
    root.style.setProperty('--font-family', themeData.fontFamily);

    if (themeData.favicon) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = `http://localhost:5000${themeData.favicon}`;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  };

  const updateThemeState = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateThemeState, loadTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
