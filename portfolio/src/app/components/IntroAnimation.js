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

  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => setShowIntro(false), 4000);
    return () => clearTimeout(timer);
  }, [isMounted]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.98)]"
          style={{ background: darkMode ? "#030303" : "#F1EFEC" }}
        >
          <svg
            key={signatureKey}
            width="80vw"
            height="auto"
            viewBox="-1.04 12.4 91.2 48"
            fill="none"
            aria-hidden="true"
            className="max-w-[500px]"
            style={{ display: "block", background: "none" }}
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform={signatureTransform}>
              {signaturePaths.map((d, i) => (
                <path
                  key={i}
                  ref={el => (signatureRefs.current[i] = el)}
                  d={d}
                  stroke={darkMode ? "#D4C9BE" : "#123458"}
                  strokeWidth={1.2 / (signatureTransform ? Number(signatureTransform.match(/scale\(([^)]+)\)/)?.[1] || 1) : 1)}
                  fill="none"
                  style={{
                    strokeDasharray: signatureLengths[i] || 0,
                    strokeDashoffset: signatureLengths[i] || 0,
                    animation: `draw-signature 2.2s cubic-bezier(0.77,0,0.18,1) ${i * (2.2 / (signaturePaths.length || 1))}s forwards`,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  }}
                />
              ))}
            </g>
          </svg>
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
