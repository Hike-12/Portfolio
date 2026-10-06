"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useEasterEggs } from './EasterEggContext';

const navItems = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];

const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.2
    }
  }
};

const Navbar = ({ onShowPdfModal }) => {
  const { darkMode, currentTheme, toggleTheme, isMounted } = useTheme();
  const { unlockEgg } = useEasterEggs();
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleThemeToggle = (e) => {
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 2) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickCountRef.current = 0;
      toggleTheme('center-out');
      unlockEgg('supernova');
      if (e && e.currentTarget) e.currentTarget.blur();
      return;
    }

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
      toggleTheme('horizontal');
      if (e && e.currentTarget) e.currentTarget.blur();
    }, 250); 
  };

  const sectionRefs = useRef({
    home: null,
    about: null,
    skills: null,
    projects: null,
    experience: null,
    contact: null
  });

  // Scroll observer for navigation
  useEffect(() => {
    if (!isMounted) return;

    const visibleSections = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections[entry.target.id] = entry.intersectionRatio;

          if (entry.target.id === 'projects' && entry.isIntersecting && entry.intersectionRatio > 0.05) {
            setActiveSection('projects');
            return;
          }
        });

        let maxRatio = 0;
        let maxSection = null;

        Object.entries(visibleSections).forEach(([section, ratio]) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxSection = section;
          }
        });

        if (maxSection && maxRatio > 0.05) {
          setActiveSection(maxSection);
        }
      },
      {
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        rootMargin: '-80px 0px -40px 0px'
      }
    );

    navItems.forEach(item => {
      const element = document.getElementById(item);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      navItems.forEach(item => {
        const element = document.getElementById(item);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [isMounted]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setMenuOpen(false);

      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 20;

      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      let startTime = null;
      const duration = 1000; // 1 second for a slightly slower, premium glide

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        
        // easeInOutQuart for an ultra-smooth cinematic stop
        const progress = timeElapsed / duration;
        const ease = progress < 0.5 
          ? 8 * progress * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 4) / 2;

        window.scrollTo(0, startPosition + (distance * ease));
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          window.scrollTo(0, offsetPosition);
        }
      }
      
      requestAnimationFrame(animation);
    }
  };

  return (
    <>
      <motion.header
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: `${currentTheme.background}80`,
          borderBottom: `1px solid ${currentTheme.cardBorder}`
        }}
      >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer"
            style={{
              backgroundColor: currentTheme.primary,
            }}
            onClick={() => scrollToSection('home')}
          >
            <span
              className="text-2xl font-bold"
              style={{
                color: currentTheme.primaryText,
                fontFamily: 'var(--font-dancing-script)'
              }}
            >
              A
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex space-x-3 lg:space-x-8 items-center">
            {navItems.map((item) => (
              <motion.button
                key={item}
                onClick={() => scrollToSection(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="capitalize transition-all duration-300 hover:font-medium relative py-2 px-2 min-h-[44px] flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md"
                style={{
                  color: activeSection === item ? currentTheme.primary : currentTheme.foreground,
                  opacity: activeSection === item ? 1 : 0.8,
                  '--tw-ring-color': currentTheme.primary
                }}
                aria-label={`Navigate to ${item} section`}
                aria-current={activeSection === item ? 'true' : undefined}
              >
                {item}
                {activeSection === item && (
                  <motion.div
                    layoutId="desktopNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: currentTheme.primary }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
            <motion.button
              onClick={() => onShowPdfModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="capitalize transition-all duration-300 hover:font-medium relative py-2 px-2 min-h-[44px] flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md"
              style={{
                color: currentTheme.primary,
                opacity: 1,
                '--tw-ring-color': currentTheme.primary
              }}
              aria-label="View resume"
            >
              Resume
            </motion.button>
          </nav>

          {/* Mobile Navigation Toggle & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.button
              onClick={handleThemeToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none"
              style={{ backgroundColor: currentTheme.cardBg, '--tw-ring-color': currentTheme.primary }}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun size={20} color={currentTheme.primary} className="relative z-10" />
              ) : (
                <Moon size={20} color={currentTheme.primary} className="relative z-10" />
              )}
            </motion.button>

            <motion.button
              className="md:hidden w-11 h-11 rounded-full flex flex-col items-center justify-center cursor-pointer space-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ backgroundColor: currentTheme.cardBg, '--tw-ring-color': currentTheme.primary }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <motion.div
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
                className="w-5 h-0.5 rounded-full"
                style={{ backgroundColor: currentTheme.primary }}
              />
              <motion.div
                animate={{ opacity: menuOpen ? 0 : 1 }}
                className="w-5 h-0.5 rounded-full"
                style={{ backgroundColor: currentTheme.primary }}
              />
              <motion.div
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
                className="w-5 h-0.5 rounded-full"
                style={{ backgroundColor: currentTheme.primary }}
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: currentTheme.cardBg }}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-4 flex flex-col space-y-2">
              {navItems.map((item) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="capitalize text-left py-3 px-2 min-h-[44px] cursor-pointer transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    color: activeSection === item ? currentTheme.primary : currentTheme.foreground,
                    '--tw-ring-color': currentTheme.primary
                  }}
                  aria-label={`Navigate to ${item} section`}
                  aria-current={activeSection === item ? 'true' : undefined}
                >
                  {item}
                </motion.button>
              ))}
              <motion.button
                onClick={() => { onShowPdfModal(true); setMenuOpen(false); }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="capitalize text-left py-3 px-2 min-h-[44px] cursor-pointer transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2"
                style={{ color: currentTheme.primary, '--tw-ring-color': currentTheme.primary }}
                aria-label="View resume"
              >
                Resume
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    </>
  );
};

export default Navbar;
