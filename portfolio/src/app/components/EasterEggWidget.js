"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Lock, Unlock } from 'lucide-react';
import { useEasterEggs } from './EasterEggContext';
import { useTheme } from './ThemeContext';

const SECRETS = [
  { id: 'console_scout', title: 'Console Scout', lockedHint: 'Inspect element like a developer (F12)' },
  { id: 'black_hole', title: 'White Hole', lockedHint: 'Patience bends space-time (Hold click > 0.5s). Hold Shift to invert gravity.' },
  { id: 'supernova', title: 'Supernova', lockedHint: 'Double the click, double the light (Theme toggle)' },
  { id: 'copy_email', title: 'Stardust Exchange', lockedHint: 'Reach out and copy (Email)' },
  { id: 'shooting_star', title: 'Meteor Shower', lockedHint: 'Tap the cosmos (Click in space)' },
];

const EasterEggWidget = () => {
  const { unlockedEggs, justUnlocked, isMounted } = useEasterEggs();
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [revealedHints, setRevealedHints] = useState({});

  if (!isMounted) return null;

  const revealHint = (id) => {
    setRevealedHints(prev => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: justUnlocked ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.4 }}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full cursor-pointer backdrop-blur-md border shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{
            backgroundColor: `${currentTheme.cardBg}CC`,
            borderColor: justUnlocked ? currentTheme.primary : currentTheme.cardBorder,
            color: currentTheme.foreground,
            boxShadow: justUnlocked ? `0 0 15px ${currentTheme.primary}40` : `0 4px 6px rgba(0,0,0,0.1)`,
            '--tw-ring-color': currentTheme.primary
          }}
        >
          <Sparkles size={14} color={justUnlocked ? currentTheme.primary : currentTheme.foreground} />
          <span className="text-xs font-medium" style={{ color: justUnlocked ? currentTheme.primary : currentTheme.foreground }}>
            {unlockedEggs.length}/5 Secrets
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: `${currentTheme.background}80` }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-6 rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.cardBorder,
                color: currentTheme.foreground
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles size={20} color={currentTheme.primary} />
                    Secrets Discovered
                  </h3>
                  <p className="text-sm opacity-70 mt-1">Find all the hidden interactions</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:opacity-70 transition-opacity"
                  style={{ backgroundColor: `${currentTheme.foreground}10` }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {SECRETS.map((secret) => {
                  const isUnlocked = unlockedEggs.includes(secret.id);
                  const isRevealed = revealedHints[secret.id];

                  return (
                    <div
                      key={secret.id}
                      onClick={() => !isUnlocked && revealHint(secret.id)}
                      className={`p-4 rounded-xl border transition-all ${!isUnlocked && !isRevealed ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
                      style={{
                        borderColor: isUnlocked ? currentTheme.primary : currentTheme.cardBorder,
                        backgroundColor: isUnlocked ? `${currentTheme.primary}10` : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        {isUnlocked ? (
                          <Unlock size={16} color={currentTheme.primary} />
                        ) : (
                          <Lock size={16} className="opacity-50" />
                        )}
                        <h4 className={`font-semibold ${!isUnlocked ? 'opacity-50' : ''}`}>
                          {isUnlocked ? secret.title : 'Locked Secret'}
                        </h4>
                      </div>
                      
                      <div className="text-sm pl-7">
                        {isUnlocked ? (
                          <div className="flex flex-col gap-1">
                            <span className="opacity-90 italic text-xs" style={{ color: currentTheme.primary }}>"{secret.lockedHint}"</span>
                          </div>
                        ) : isRevealed ? (
                          <span className="italic opacity-90" style={{ color: currentTheme.primary }}>"{secret.lockedHint}"</span>
                        ) : (
                          <span className="opacity-50 text-xs flex items-center gap-1">Click to reveal hint</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEggWidget;
