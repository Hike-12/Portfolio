"use client";
import React from 'react';

const PdfModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
      style={{ cursor: 'zoom-out' }}
    >
      <div className="relative max-w-3xl w-full flex items-center justify-center bg-white rounded-2xl shadow-2xl">
        <iframe
          src="/Resume.pdf"
          title="Aliqyaan Resume"
          width="800"
          height="600"
          className="rounded-2xl"
          style={{ maxWidth: '90vw', maxHeight: '80vh', border: 'none' }}
          onClick={e => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default PdfModal;
