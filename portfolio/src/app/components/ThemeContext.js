"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

const theme = {
  light: {
    background: '#F1EFEC',
    foreground: '#123458',
    primary: '#123458',
    secondary: '#D4C9BE',
    accent: '#123458',
    cardBg: '#FFFFFF',
    cardBorder: '#D4C9BE',
    primaryText: '#FFFFFF',
    darkBgText: '#FFFFFF',
    lightBgText: '#123458'
  },
  dark: {
    background: '#030303',
    foreground: '#F1EFEC',
    primary: '#D4C9BE',
    secondary: '#123458',
    accent: '#D4C9BE',
    cardBg: '#0A0A0A',
    cardBorder: '#1A1A1A',
    primaryText: '#030303',
    darkBgText: '#F1EFEC',
    lightBgText: '#030303'
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Add data-style attribute for view transitions
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-style', 'horizontal');
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }
  }, []);

  const currentTheme = darkMode ? theme.dark : theme.light;

  const toggleTheme = () => {
    // Check if View Transitions API is supported
    if (typeof document !== 'undefined' && document.startViewTransition) {
      // Update data-theme attribute before transition
      const newTheme = !darkMode ? 'dark' : 'light';
      
      document.startViewTransition(() => {
        flushSync(() => {
          document.documentElement.setAttribute('data-theme', newTheme);
          setDarkMode(!darkMode);
        });
      });
    } else {
      // Fallback for browsers that don't support View Transitions
      const newTheme = !darkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      setDarkMode(!darkMode);
    }
  };

  const value = {
    darkMode,
    setDarkMode,
    currentTheme,
    toggleTheme,
    isMounted
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
