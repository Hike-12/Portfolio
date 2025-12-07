"use client";
import React from 'react';
import { motion } from 'framer-motion';
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const experience = [
  {
    title: 'Frontend Development Intern',
    company: 'Trip Value',
    date: 'January 2025 - March 2025',
    image: '/Trip.jpg',
    bullets: [
      'Developed dynamic and responsive frontend features using React, enhancing user experience and interface interactivity.',
      'Contributed to backend development with Node.js and Express, working on API integration and server-side logic.',
      'Collaborated with the development team to debug, test, and optimize both frontend and backend components.',
      'Gained hands-on experience in full-stack development, version control (Git), and RESTful API design.'
    ]
  },
  {
    title: 'FullStack Development Intern',
    company: 'Rayeva',
    date: 'August 2025 - November 2025',
    image: '/Rayeva.png',
    bullets: [
      'Built and deployed core e-commerce features (catalog, checkout, onboarding) with React, TailwindCSS, Node.js, and PostgreSQL.',
      'Helped onboard 10+ sustainable brands by creating scalable seller dashboards.',
      'Developed AI-powered onboarding tools, reducing setup time by ~30%.',
      'Integrated backend APIs for order management and sustainability tracking.',
      'Launched an impact reporting system displaying the footprint of 100+ purchases.'
    ]
  }
];

const achievements = [
  {
    title: 'First Place - AuraFlix Hackathon',
    date: 'September 2024',
    description: 'Led a team of four developers to create a machine learning-powered video streaming platform that won first place among 30+ competing teams. Our solution featured personalized content recommendations and innovative accessibility features.',
    image: '/Aura.jpg'
  },
  {
    title: 'Domain Winner Sunhacks',
    date: 'August 2025',
    description: 'Developed a generative AI platform that enables students to create personalized learning plans and study materials. The solution also features an AI-powered viva simulator to help students prepare for oral exams with realistic, adaptive questioning.',
    image: '/Sunhacks.png'
  }
];

const ExperienceSection = ({ sectionRef, onImageClick }) => {
  const { darkMode, currentTheme } = useTheme();

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-14 sm:py-20 px-3 sm:px-6"
      style={{
        backgroundColor: darkMode ? 'rgba(36, 36, 71, 0.3)' : 'rgba(254, 249, 242, 0.5)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16"
          >
            Professional{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`
              }}
            >
              Experience
            </span>
          </motion.h2>

          {/* Map over experience array */}
          {experience.map((exp, idx) => (
            <motion.div
              key={exp.title}
              variants={fadeInUp}
            >
              <div
                className="p-6 sm:p-8 rounded-3xl relative overflow-hidden"
                style={{
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.cardBorder}`
                }}
              >
                {/* Image placeholder for professional experience */}
                <div className="mb-4 sm:mb-6 relative h-40 w-full rounded-xl overflow-hidden">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    style={{
                      border: `1px solid ${currentTheme.cardBorder}`
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => onImageClick(exp.image)}
                    onKeyDown={(e) => e.key === 'Enter' && onImageClick(exp.image)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${exp.company} experience image`}
                  >
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <Image src={exp.image} alt={`${exp.company} experience`} fill style={{ objectFit: "contain" }} />
                    </div>
                  </motion.div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
                  <div>
                    <h3
                      className="text-2xl font-bold mb-1"
                      style={{ color: currentTheme.primary }}
                    >
                      {exp.title}
                    </h3>
                    <p className="text-xl opacity-80">{exp.company}</p>
                  </div>
                  <div className="mt-2 md:mt-0 opacity-70">
                    {exp.date}
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {exp.bullets.map((bullet, i) => (
                    <div className="flex items-start" key={i}>
                      <div
                        className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"
                        style={{ backgroundColor: currentTheme.primary }}
                      ></div>
                      <p>{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            variants={fadeInUp}
            className="mt-8 sm:mt-12"
          >
            <h3 className="text-2xl font-bold text-center mb-6 sm:mb-8">Achievements</h3>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="p-6 sm:p-8 rounded-3xl relative overflow-hidden"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.cardBorder}`
                  }}
                >
                  {/* Image placeholder */}
                  <div className="mb-4 sm:mb-6 relative h-40 w-full rounded-xl overflow-hidden">
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      style={{
                        border: `1px solid ${currentTheme.cardBorder}`
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      onClick={() => onImageClick(achievement.image)}
                      onKeyDown={(e) => e.key === 'Enter' && onImageClick(achievement.image)}
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${achievement.title} image`}
                    >
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <Image src={achievement.image} alt={achievement.title} fill style={{ objectFit: "contain" }} />
                      </div>
                    </motion.div>
                  </div>

                  <h4
                    className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-center"
                    style={{ color: currentTheme.primary }}
                  >
                    {achievement.title}
                  </h4>
                  <p className="opacity-80 text-center mb-4">{achievement.date}</p>
                  <p className="opacity-80 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
