"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Github, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from './ThemeContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HeroSection = ({ sectionRef, onImageClick }) => {
  const { darkMode, currentTheme } = useTheme();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setTimeout(() => {
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
      }, 100);
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-3 sm:px-6 pt-24"
    >
      <div className="max-w-3xl sm:max-w-5xl mx-auto w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8 sm:space-y-12"
        >
          {/* Responsive Layout Container */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-8">
            {/* Text Content */}
            <div className="text-center md:text-left md:flex-1">
              <motion.h1
                variants={fadeInUp}
                className="text-3xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4"
                style={{
                  lineHeight: 1.15,
                  paddingBottom: '0.2em',
                }}
              >
                <span
                  className={darkMode ? "inline-block bg-clip-text text-transparent animate-shine" : "inline-block"}
                  style={
                    darkMode
                      ? {
                          backgroundImage: `linear-gradient(120deg, #b5b5b5 40%, #ffffff 50%, #b5b5b5 60%)`,
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          animationDuration: '5s',
                          animationTimingFunction: 'linear',
                          animationIterationCount: 'infinite',
                        }
                      : {
                          color: '#123458'
                        }
                  }
                >
                  Aliqyaan
                </span>{" "}
                <span
                  className={darkMode ? "inline-block bg-clip-text text-transparent animate-shine" : "inline-block"}
                  style={
                    darkMode
                      ? {
                          backgroundImage: `linear-gradient(120deg, ${currentTheme.primary} 40%, #ffffff 50%, ${currentTheme.primary} 60%)`,
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          animationDuration: '2.5s',
                          animationTimingFunction: 'linear',
                          animationIterationCount: 'infinite',
                        }
                      : {
                          color: currentTheme.primary
                        }
                  }
                >
                  Mahimwala
                </span>
                {darkMode && (
                  <style>{`
                    @keyframes shine {
                      0% { background-position: 100%; }
                      100% { background-position: -100%; }
                    }
                    .animate-shine {
                      animation-name: shine;
                    }
                  `}</style>
                )}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-10 opacity-80"
              >
                Full Stack Developer &amp; Computer Engineering Student
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6"
              >
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-6 py-4 sm:px-8 sm:py-6 rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: currentTheme.primary,
                    color: currentTheme.primaryText
                  }}
                >
                  Get In Touch
                </button>

                <a
                  href="https://github.com/Hike-12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 sm:px-8 sm:py-6 rounded-full border-2 hover:shadow-lg transform transition-all duration-300 hover:scale-105 inline-flex items-center"
                  style={{
                    borderColor: currentTheme.primary,
                    color: currentTheme.primary
                  }}
                >
                  <Github size={18} className="mr-2" /> GitHub
                </a>
              </motion.div>
            </div>

            {/* Photo */}
            <motion.div
              variants={fadeInUp}
              className="mx-auto md:mx-0 mt-8 md:mt-0 md:flex-shrink-0 flex flex-col items-center"
            >
              <div
                className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 overflow-hidden border-4 shadow-lg flex items-center justify-center relative"
                style={{ borderColor: currentTheme.primary }}
              >
                <div
                  className="cursor-pointer w-full h-full flex items-center justify-center"
                  onClick={() => onImageClick('/Me.jpg')}
                >
                  <Image
                    src="/Me.jpg"
                    alt="Aliqyaan Mahimwala"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeIn}
            className="pt-8 sm:pt-12"
          >
            <div className="animate-bounce mx-auto w-6 sm:w-8 h-10 sm:h-12 flex justify-center">
              <ChevronDown
                size={24}
                className="sm:w-8 sm:h-8"
                style={{ color: currentTheme.primary }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
