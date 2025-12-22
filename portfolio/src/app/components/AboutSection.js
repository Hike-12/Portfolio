"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Code, Globe, BrainCircuit } from 'lucide-react';
import { useTheme } from './ThemeContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
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

const focusAreas = [
  {
    title: 'Full-Stack Development',
    icon: <Code size={30} />,
    description: 'Creating seamless user experiences with modern frameworks and clean code'
  },
  {
    title: 'Interactive 3D & VR',
    icon: <Globe size={30} />,
    description: 'Building immersive digital experiences with Three.js and WebVR'
  },
  {
    title: 'AI Integration',
    icon: <BrainCircuit size={30} />,
    description: 'Incorporating intelligent features to enhance application capabilities'
  }
];

const AboutSection = ({ sectionRef }) => {
  const { currentTheme } = useTheme();

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-14 sm:py-20 px-3 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16"
          >
            About{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`
              }}
            >
              Me
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              className="space-y-4 sm:space-y-6"
            >
              <p className="text-base sm:text-lg leading-relaxed">
                Hey! I am Aliqyaan Mahimwala, a 20 year old Computer Engineering student at Fr. CRCE in Bandra, Mumbai. I am a full stack web developer who enjoys building clean, smooth, and user friendly web apps that people actually like using.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                I work with modern tools and frameworks, with Django being my go to choice on the backend. From writing solid backend logic to polishing the UI or chasing down a tricky bug, I genuinely enjoy improving things step by step and learning along the way.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                I am always building, always learning, and focused on keeping things simple, functional, and thoughtfully crafted.
              </p>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                <div
                  className="p-4 sm:p-6 rounded-2xl"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    borderLeft: `4px solid ${currentTheme.primary}`,
                  }}
                >
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: currentTheme.primary }}
                  >
                    Education
                  </h4>
                  <p>B.E. Computer Engineering</p>
                  <p>CGPA: 9.5</p>
                </div>

                <div
                  className="p-4 sm:p-6 rounded-2xl"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    borderLeft: `4px solid ${currentTheme.accent}`,
                  }}
                >
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: currentTheme.accent }}
                  >
                    Contact
                  </h4>
                  <p>aliqyaan12@gmail.com</p>
                </div>
              </div>
            </motion.div>

            <div variants={fadeInUp}>
              <div
                className="p-6 sm:p-8 rounded-3xl relative overflow-hidden"
                style={{
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.cardBorder}`,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 opacity-10"
                  style={{
                    background: `radial-gradient(circle, ${currentTheme.primary}, ${currentTheme.accent})`
                  }}
                ></div>

                <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
                  Areas of Focus
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  {focusAreas.map((item) => (
                    <motion.div
                      key={item.title}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="p-5 rounded-xl border flex items-start gap-4 cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
                      style={{
                        borderColor: currentTheme.cardBorder,
                        '--tw-ring-color': currentTheme.primary
                      }}
                      tabIndex={0}
                      role="article"
                      aria-label={`${item.title}: ${item.description}`}
                    >
                      <div
                        className="p-3 rounded-lg flex items-center justify-center min-w-[48px] min-h-[48px]"
                        style={{
                          backgroundColor: `${currentTheme.primary}15`,
                          color: currentTheme.primary
                        }}
                      >
                        {React.cloneElement(item.icon, {
                          color: currentTheme.primary,
                          size: 30
                        })}
                      </div>
                      <div>
                        <h4 className="font-bold mb-1" style={{ color: 'inherit' }}>{item.title}</h4>
                        <p className="text-sm opacity-80" style={{ color: 'inherit' }}>{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
