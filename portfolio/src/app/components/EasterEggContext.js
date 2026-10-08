"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const EasterEggContext = createContext();

export const useEasterEggs = () => {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEggs must be used within an EasterEggProvider');
  }
  return context;
};

export const EasterEggProvider = ({ children }) => {
  const [unlockedEggs, setUnlockedEggs] = useState([]);
  const [justUnlocked, setJustUnlocked] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('aliqyaan_easter_eggs');
    if (saved) {
      try {
        setUnlockedEggs(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const unlockEgg = useCallback((eggId) => {
    setUnlockedEggs((prev) => {
      if (prev.includes(eggId)) return prev;
      
      const newEggs = [...prev, eggId];
      localStorage.setItem('aliqyaan_easter_eggs', JSON.stringify(newEggs));
      
      setJustUnlocked(eggId);
      setTimeout(() => setJustUnlocked(null), 3000);
      
      // Automatically trigger the finale the moment the 5th egg is unlocked
      if (newEggs.length === 5 && typeof window !== 'undefined' && window.triggerMassiveMeteorShower) {
        window.triggerMassiveMeteorShower();
      }
      
      return newEggs;
    });
  }, []);

  return (
    <EasterEggContext.Provider value={{ unlockedEggs, unlockEgg, justUnlocked, isMounted }}>
      {children}
    </EasterEggContext.Provider>
  );
};
