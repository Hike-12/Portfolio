"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Github, Linkedin } from 'lucide-react';
import { useTheme } from './ThemeContext';

const Footer = () => {
  const { darkMode, currentTheme } = useTheme();
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

  return (
    <footer
      className="py-8 sm:py-10 px-3 sm:px-6 border-t"
      style={{
        borderColor: currentTheme.cardBorder,
        backgroundColor: darkMode ? 'rgba(36, 36, 71, 0.5)' : 'rgba(254, 249, 242, 0.8)'
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          {/* Signature */}
          <div className="pt-2 flex flex-col items-center w-full">
            <svg
              key={signatureKey}
              width="100%"
              viewBox="-1.04 12.4 91.2 43.76"
              fill="none"
              aria-hidden="true"
              className="max-w-28 sm:max-w-36 md:max-w-40"
              style={{ display: "block", background: "none", height: "auto" }}
              preserveAspectRatio="xMidYMid meet"
            >
              <g transform={signatureTransform}>
                {signaturePaths.map((d, i) => (
                  <path
                    key={i}
                    ref={el => (signatureRefs.current[i] = el)}
                    d={d}
                    stroke={darkMode ? "#D4C9BE" : "#123458"}
                    strokeWidth={0.9 / (signatureTransform ? Number(signatureTransform.match(/scale\(([^)]+)\)/)?.[1] || 1) : 1)}
                    fill="none"
                    style={{
                      strokeDasharray: signatureLengths[i] || 0,
                      strokeDashoffset: signatureLengths[i] || 0,
                      animation: `draw-signature 3s cubic-bezier(0.77,0,0.18,1) ${i * (3 / (signaturePaths.length || 1))}s forwards`,
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
          </div>
          <span className="hidden sm:inline-block text-xs opacity-60">|</span>
          <span className="text-xs sm:text-sm opacity-70">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
        <div className="flex gap-3">
          <motion.a
            href="mailto:aliqyaan12@gmail.com"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-full p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-opacity-80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: `${currentTheme.primary}15`, color: currentTheme.primary, '--tw-ring-color': currentTheme.primary }}
            aria-label="Send email to Aliqyaan"
          >
            <Mail size={20} aria-hidden="true" />
          </motion.a>
          <motion.a
            href="https://instagram.com/aliqyaan_12"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-full p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-opacity-80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: `${currentTheme.primary}15`, color: currentTheme.primary, '--tw-ring-color': currentTheme.primary }}
            aria-label="Visit Aliqyaan on Instagram"
          >
            <Instagram size={20} aria-hidden="true" />
          </motion.a>
          <motion.a
            href="https://github.com/Hike-12"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-full p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-opacity-80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: `${currentTheme.primary}15`, color: currentTheme.primary, '--tw-ring-color': currentTheme.primary }}
            aria-label="Visit Aliqyaan on GitHub"
          >
            <Github size={20} aria-hidden="true" />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/aliqyaan-mahimwala-362568292/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-full p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-opacity-80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: `${currentTheme.primary}15`, color: currentTheme.primary, '--tw-ring-color': currentTheme.primary }}
            aria-label="Visit Aliqyaan on LinkedIn"
          >
            <Linkedin size={20} aria-hidden="true" />
          </motion.a>
        </div>
      </div>

      {/* Quote at the very bottom */}
      <div className="mt-12 sm:mt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative inline-block px-4"
        >
          <p 
            className="text-xs sm:text-sm tracking-[0.2em] uppercase font-medium italic mb-2"
            style={{ color: currentTheme.primary, opacity: 0.5 }}
          >
            "Do it scared, Do it tired, Do it broke, Do it unsure, but do it anyways."
          </p>
          <div 
            className="h-px w-12 mx-auto"
            style={{ backgroundColor: currentTheme.primary, opacity: 0.3 }}
          />
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
