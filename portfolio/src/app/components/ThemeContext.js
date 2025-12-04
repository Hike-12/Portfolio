"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  }, []);

  const currentTheme = darkMode ? theme.dark : theme.light;

  const toggleTheme = () => {
    setDarkMode(!darkMode);
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
