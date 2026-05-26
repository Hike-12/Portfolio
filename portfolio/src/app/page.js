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
  Footer
} from './components';

const ImageModal = dynamic(() => import('./components/ImageModal'));
const PdfModal = dynamic(() => import('./components/PdfModal'));

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

        <main id="main-content" className="relative z-10" tabIndex={-1} aria-label="Portfolio content">
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
      {/* 
        SSR-visible content for search engine crawlers.
        This noscript/hidden content ensures crawlers see meaningful text
        even though the interactive UI is client-rendered.
      */}
      <noscript>
        <header>
          <nav aria-label="Main navigation">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <article>
            <h1>Aliqyaan Mahimwala — Full Stack Developer</h1>
            <p>Full Stack Developer and Computer Engineering student specializing in modern web applications, interactive 3D experiences with Three.js and WebVR, and AI integration. Based in Mumbai, India.</p>
            <section>
              <h2>About Me</h2>
              <p>Aliqyaan Mahimwala is a 20-year-old Computer Engineering student at Fr. Conceicao Rodrigues College of Engineering in Bandra, Mumbai. A full stack web developer who enjoys building clean, smooth, and user-friendly web apps.</p>
            </section>
            <section>
              <h2>Contact</h2>
              <p>Email: aliqyaan12@gmail.com</p>
              <ul>
                <li><a href="https://github.com/Hike-12">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/aliqyaan-mahimwala/">LinkedIn</a></li>
                <li><a href="https://instagram.com/aliqyaan_12">Instagram</a></li>
              </ul>
            </section>
          </article>
        </main>
      </noscript>

      {/* 
        Hidden SEO content visible to crawlers but not to users.
        Provides semantic HTML structure, headings, and content
        that client-only rendering would otherwise miss.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        <h1>Aliqyaan Mahimwala — Full Stack Developer</h1>
        <p>Full Stack Developer and Computer Engineering student specializing in modern web applications, interactive 3D experiences, and AI integration. Explore projects, skills, and get in touch.</p>
        <nav aria-label="Page navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
        <article>
          <h2>About</h2>
          <p>Aliqyaan Mahimwala is a 20-year-old Computer Engineering student at Fr. CRCE in Bandra, Mumbai. A full stack web developer focused on creating clean, smooth, and user-friendly web apps using modern frameworks like React, Next.js, and Django.</p>
          <h2>Areas of Focus</h2>
          <ul>
            <li>Full-Stack Development: Creating seamless user experiences with modern frameworks and clean code</li>
            <li>Interactive 3D and VR: Building immersive digital experiences with Three.js and WebVR</li>
            <li>AI Integration: Incorporating intelligent features to enhance application capabilities</li>
          </ul>
          <h2>Education</h2>
          <p>B.E. Computer Engineering — CGPA: 9.6</p>
          <h2>Contact</h2>
          <p>Email: aliqyaan12@gmail.com</p>
          <p>GitHub: https://github.com/Hike-12</p>
          <p>LinkedIn: https://www.linkedin.com/in/aliqyaan-mahimwala/</p>
        </article>
      </div>

      <PortfolioContent />
    </ThemeProvider>
  );
};

export default Index;
