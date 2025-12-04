"use client";
import React from 'react';
import Image from 'next/image';

const ImageModal = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
      style={{ cursor: 'zoom-out' }}
    >
      <div className="relative max-w-3xl w-full flex items-center justify-center">
        <div className="w-full h-[500px] flex items-center justify-center">
          <Image
            src={imageSrc}
            alt="Expanded image"
            width={900}
            height={600}
            className="rounded-2xl shadow-2xl max-h-[80vh] max-w-full object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 transition"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
