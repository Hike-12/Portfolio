import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const EmailCopyButton = ({ currentTheme, justify = 'center', className = '', color }) => {
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState([]);

  const textColor = color || currentTheme.primary;

  const handleCopy = (e) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('aliqyaan12@gmail.com');
    }
    
    // Generate stardust particles
    const newParticles = Array.from({ length: 18 }).map((_, i) => {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = 25 + Math.random() * 35; // Slightly tighter spread
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        scale: Math.random() * 0.6 + 0.4,
      };
    });
    setParticles(newParticles);
    setCopied(true);
    
    setTimeout(() => setParticles([]), 1000);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`relative flex items-center h-8 ${justify === 'center' ? 'justify-center' : 'justify-start'} ${className}`}>
      <motion.button
        onClick={handleCopy}
        className={`cursor-pointer text-sm transition-colors group relative flex items-center font-medium ${justify === 'center' ? 'justify-center' : 'justify-start'} min-w-[160px]`}
        style={{ color: textColor }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {!copied ? (
            <motion.span
              key="email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="group-hover:underline absolute w-full"
              style={{ textAlign: justify === 'center' ? 'center' : 'left' }}
            >
              aliqyaan12@gmail.com
            </motion.span>
          ) : (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center space-x-1 absolute w-full ${justify === 'center' ? 'justify-center' : 'justify-start'}`}
              style={{ textShadow: `0 0 12px ${textColor}80` }}
            >
              <Check size={16} />
              <span>Copied to Clipboard!</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      
      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ 
            backgroundColor: textColor,
            boxShadow: `0 0 8px ${textColor}`,
            left: justify === 'center' ? '50%' : '10%',
            top: '50%'
          }}
        />
      ))}
    </div>
  );
};

export default EmailCopyButton;
