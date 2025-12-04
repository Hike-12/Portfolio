"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

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
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  
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

      setTimeout(() => {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - 20;

        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          window.scrollTo(0, offsetPosition);
        }
      }, 300);
    }
  };

  return (
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
          <div className="hidden md:flex space-x-3 lg:space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="capitalize transition-all duration-300 hover:font-medium relative py-1 hover:text-opacity-100"
                style={{
                  color: activeSection === item ? currentTheme.primary : currentTheme.foreground,
                  opacity: activeSection === item ? 1 : 0.8
                }}
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
              </button>
            ))}
            <button
              onClick={() => onShowPdfModal(true)}
              className="capitalize transition-all duration-300 hover:font-medium relative py-1 hover:text-opacity-100"
              style={{
                color: currentTheme.primary,
                opacity: 1
              }}
            >
              Resume
            </button>
          </div>

          {/* Mobile Navigation Toggle & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: currentTheme.cardBg }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} color={currentTheme.primary} />
              ) : (
                <Moon size={20} color={currentTheme.primary} />
              )}
            </button>

            <button
              className="md:hidden w-10 h-10 rounded-full flex flex-col items-center justify-center space-y-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ backgroundColor: currentTheme.cardBg }}
              aria-label="Toggle menu"
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
            </button>
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
          >
            <div className="px-4 py-4 flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="capitalize text-left py-2 transition-colors"
                  style={{ color: activeSection === item ? currentTheme.primary : currentTheme.foreground }}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
