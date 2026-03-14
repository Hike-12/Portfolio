"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

const IntroAnimation = () => {
  const { darkMode, isMounted } = useTheme();
  const [showIntro, setShowIntro] = useState(true);
  const [signaturePaths, setSignaturePaths] = useState([]);
  const signatureRefs = useRef([]);
  const [signatureLengths, setSignatureLengths] = useState([]);
  const [signatureKey, setSignatureKey] = useState(0);
  const [signatureTransform, setSignatureTransform] = useState("");

  // Respect prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setShowIntro(false);
      }
    }
  }, []);

  useEffect(() => {
    fetch("/Aliqyaan.svg")
      .then(res => res.text())
      .then(svg => {
        const matches = [...svg.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/gi)];
        setSignaturePaths(matches.map(m => m[1]).reverse());
      });
  }, []);

  useEffect(() => {
    if (signaturePaths.length) {
      const newLengths = signatureRefs.current.slice(0, signaturePaths.length).map(ref =>
        ref ? ref.getTotalLength() : 0
      );
      setSignatureLengths(newLengths);
    }
  }, [signaturePaths]);

  useEffect(() => {
    if (!signaturePaths.length) return;
    const totalDuration = 3 + (signaturePaths.length - 1) * (3 / (signaturePaths.length || 1));
    const timeout = setTimeout(() => {
      setSignatureKey(k => k + 1);
    }, totalDuration * 1000 + 500);
    return () => clearTimeout(timeout);
  }, [signaturePaths, signatureKey]);

  useEffect(() => {
    if (!signaturePaths.length || !signatureRefs.current[0]) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    signatureRefs.current.forEach(ref => {
      if (ref) {
        const bbox = ref.getBBox();
        minX = Math.min(minX, bbox.x);
        minY = Math.min(minY, bbox.y);
        maxX = Math.max(maxX, bbox.x + bbox.width);
        maxY = Math.max(maxY, bbox.y + bbox.height);
      }
    });
    const vbX = -1.04, vbY = 12.4, vbW = 91.2, vbH = 43.76;
    const scale = Math.min(vbW / (maxX - minX), vbH / (maxY - minY));
    const tx = vbX - minX * scale + (vbW - (maxX - minX) * scale) / 2;
    const ty = vbY - minY * scale + (vbH - (maxY - minY) * scale) / 2;
    setSignatureTransform(`translate(${tx},${ty}) scale(${scale})`);
  }, [signaturePaths, signatureKey]);

  // Auto-hide after 4 seconds
  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => setShowIntro(false), 4000);
    return () => clearTimeout(timer);
  }, [isMounted]);

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
          transition={{ duration: 1.2 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: darkMode ? "#030303" : "#F1EFEC" }}
          onClick={() => setShowIntro(false)}
          role="status"
          aria-label="Loading portfolio — click or press any key to skip"
        >
          <motion.svg
            key={signatureKey}
            width="70vw"
            viewBox="-1.04 12.4 91.2 48"
            fill="none"
            aria-hidden="true"
            className="max-w-[420px]"
            style={{ display: "block", background: "none", height: "auto" }}
            preserveAspectRatio="xMidYMid meet"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <g transform={signatureTransform}>
              {signaturePaths.map((d, i) => (
                <path
                  key={i}
                  ref={el => (signatureRefs.current[i] = el)}
                  d={d}
                  stroke={darkMode ? "#D4C9BE" : "#123458"}
                  strokeWidth={0.8 / (signatureTransform ? Number(signatureTransform.match(/scale\(([^)]+)\)/)?.[1] || 1) : 1)}
                  fill="none"
                  style={{
                    strokeDasharray: signatureLengths[i] || 0,
                    strokeDashoffset: signatureLengths[i] || 0,
                    animation: `draw-signature 1.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * (1.2 / (signaturePaths.length || 1))}s forwards`,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  }}
                />
              ))}
            </g>
          </motion.svg>
          <motion.div 
            className="mt-10 text-center text-sm sm:text-base font-light tracking-wide"
            style={{ color: darkMode ? '#F1EFEC' : '#123458' }}
          >
            Click anywhere or press <span className="font-medium">Enter</span> to skip
          </motion.div>
          <style>{`
            @keyframes draw-signature {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
