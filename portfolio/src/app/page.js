"use client";
import React, { useState, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';

import {
  ThemeProvider,
  useTheme,
  IntroAnimation,
  ThreeBackground,
  Navbar,
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  ContactSection,
  Footer,
  ImageModal,
  PdfModal
} from './components';

const PortfolioContent = () => {
  const { darkMode, currentTheme, isMounted } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Section refs for scroll tracking
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    contact: useRef(null)
  };

  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
    setModalOpen(true);
  };

  // If not mounted yet (during SSR), return a minimal loading state
  if (!isMounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: currentTheme.background }}
      >
        <div className="text-center">
          <p style={{ color: currentTheme.foreground }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <IntroAnimation />
      
      <div className="relative min-h-screen" style={{ backgroundColor: currentTheme.background, color: currentTheme.foreground }}>
        <ThreeBackground />
        
        <Navbar onShowPdfModal={setShowPdfModal} />

        <main className="relative z-10">
          <HeroSection 
            sectionRef={sectionRefs.home} 
            onImageClick={handleImageClick} 
          />
          
          <AboutSection sectionRef={sectionRefs.about} />
          
          <SkillsSection sectionRef={sectionRefs.skills} />
          
          <ProjectsSection 
            sectionRef={sectionRefs.projects} 
            onImageClick={handleImageClick} 
          />
          
          <ExperienceSection 
            sectionRef={sectionRefs.experience} 
            onImageClick={handleImageClick} 
          />
          
          <ContactSection sectionRef={sectionRefs.contact} />
          
          <Footer />
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        style={{
          fontSize: '14px'
        }}
      />

      <ImageModal 
        isOpen={modalOpen} 
        imageSrc={modalImage} 
        onClose={() => setModalOpen(false)} 
      />

      <PdfModal 
        isOpen={showPdfModal} 
        onClose={() => setShowPdfModal(false)} 
      />
    </>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
