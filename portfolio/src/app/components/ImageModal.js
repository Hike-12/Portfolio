"use client";
import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, imageSrc, onClose }) => {
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Trap focus and handle Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    // Simple focus trapping — keep focus on close button
    if (e.key === 'Tab') {
      e.preventDefault();
      closeButtonRef.current?.focus();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      // Focus the close button
      setTimeout(() => closeButtonRef.current?.focus(), 100);
      // Add key listener
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded image view"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative max-w-4xl w-full mx-4 flex items-center justify-center"
          >
            <div className="w-full flex items-center justify-center">
              <Image
                src={imageSrc}
                alt="Expanded view"
                width={1200}
                height={800}
                className="rounded-2xl shadow-2xl max-h-[85vh] max-w-full object-contain"
                onClick={e => e.stopPropagation()}
                sizes="(max-width: 768px) 95vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
            <motion.button
              ref={closeButtonRef}
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-3 -right-3 sm:top-3 sm:right-3 w-10 h-10 flex items-center justify-center text-white bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close image viewer"
            >
              <X size={18} aria-hidden="true" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
