"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import {
  SIGNATURE_PATHS,
  SIGNATURE_LENGTHS,
  SIGNATURE_TRANSFORM,
  SIGNATURE_SCALE,
} from './signatureData';

const IntroAnimation = () => {
  const { darkMode } = useTheme();
  const [showIntro, setShowIntro] = useState(true);
  const [startDrawing, setStartDrawing] = useState(false);

  // Respect prefers-reduced-motion, otherwise trigger drawing on first painted frame after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setShowIntro(false);
        return;
      }
    }

    const rafId = requestAnimationFrame(() => {
      setStartDrawing(true);
    });

    // Fallback auto-hide after animation completes (2.85s draw + ~0.8s hold)
    const timer = setTimeout(() => setShowIntro(false), 3800);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, []);

  // Skip on click, Enter, Space, or Escape
  useEffect(() => {
    if (!showIntro) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        setShowIntro(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIntro]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: darkMode ? "#030303" : "#F1EFEC" }}
          onClick={() => setShowIntro(false)}
          role="status"
          aria-label="Loading portfolio — click or press any key to skip"
        >
          <style>{`
            @keyframes draw-signature {
              from { stroke-dashoffset: var(--path-length); }
              to { stroke-dashoffset: 0; }
            }
          `}</style>
          <svg
            width="70vw"
            viewBox="-1.04 12.4 91.2 48"
            fill="none"
            aria-hidden="true"
            className="max-w-[420px]"
            style={{
              display: "block",
              background: "none",
              height: "auto",
              opacity: 1,
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform={SIGNATURE_TRANSFORM}>
              {SIGNATURE_PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke={darkMode ? "#D4C9BE" : "#123458"}
                  strokeWidth={0.8 / SIGNATURE_SCALE}
                  fill="none"
                  onAnimationEnd={
                    i === SIGNATURE_PATHS.length - 1
                      ? () => setTimeout(() => setShowIntro(false), 600)
                      : undefined
                  }
                  style={{
                    '--path-length': SIGNATURE_LENGTHS[i],
                    strokeDasharray: SIGNATURE_LENGTHS[i],
                    strokeDashoffset: SIGNATURE_LENGTHS[i],
                    animation: startDrawing
                      ? `draw-signature 1.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * (1.2 / SIGNATURE_PATHS.length)}s forwards`
                      : "none",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  }}
                />
              ))}
            </g>
          </svg>
          <div
            className="mt-10 text-center text-sm sm:text-base font-light tracking-wide"
            style={{ color: darkMode ? '#F1EFEC' : '#123458' }}
          >
            Click anywhere or press <span className="font-medium">Enter</span> to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
