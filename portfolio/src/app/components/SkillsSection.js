"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  SiJavascript, SiPython, SiHtml5, SiCss3,
  SiReact, SiTailwindcss, SiThreedotjs, SiWebgl,
  SiNodedotjs, SiExpress, SiDjango, SiFlask, SiFastapi,
  SiMongodb, SiMysql, SiPostgresql,
  SiGithub, SiVercel, SiRender,
  SiPandas, SiNumpy, SiDocker, SiChartdotjs
} from 'react-icons/si';
import { MdVrpano } from 'react-icons/md';
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

const skills = [
  { name: 'JavaScript', category: 'Language', icon: <SiJavascript className="text-[#F7DF1E]" size={22} /> },
  { name: 'Python', category: 'Language', icon: <SiPython className="text-[#3776AB]" size={22} /> },
  { name: 'HTML', category: 'Language', icon: <SiHtml5 className="text-[#E34F26]" size={22} /> },
  { name: 'CSS', category: 'Language', icon: <SiCss3 className="text-[#1572B6]" size={22} /> },
  { name: 'React', category: 'Frontend', icon: <SiReact className="text-[#61DAFB]" size={22} /> },
  { name: 'Tailwind CSS', category: 'Frontend', icon: <SiTailwindcss className="text-[#06B6D4]" size={22} /> },
  { name: 'Three.js', category: 'Frontend', icon: <SiThreedotjs className="text-[#000000]" size={22} /> },
  { name: 'WebGL', category: 'Frontend', icon: <SiWebgl className="text-[#990000]" size={22} /> },
  { name: 'WebVR', category: 'Frontend', icon: <MdVrpano className="text-[#FF4154]" size={22} /> },
  { name: 'Node.js', category: 'Backend', icon: <SiNodedotjs className="text-[#339933]" size={22} /> },
  { name: 'Express.js', category: 'Backend', icon: <SiExpress className="text-[#000000]" size={22} /> },
  { name: 'Django', category: 'Backend', icon: <SiDjango className="text-[#092E20]" size={22} /> },
  { name: 'Flask', category: 'Backend', icon: <SiFlask className="text-[#000000]" size={22} /> },
  { name: 'FastAPI', category: 'Backend', icon: <SiFastapi className="text-[#009688]" size={22} /> },
  { name: 'MongoDB', category: 'Database', icon: <SiMongodb className="text-[#47A248]" size={22} /> },
  { name: 'MySQL', category: 'Database', icon: <SiMysql className="text-[#4479A1]" size={22} /> },
  { name: 'PostgreSQL', category: 'Database', icon: <SiPostgresql className="text-[#336791]" size={22} /> },
  { name: 'Git & GitHub', category: 'Tool', icon: <SiGithub className="text-[#181717]" size={22} /> },
  { name: 'Vercel', category: 'Tool', icon: <SiVercel className="text-[#000000]" size={22} /> },
  { name: 'Render', category: 'Tool', icon: <SiRender className="text-[#46E3B7]" size={22} /> },
  { name: 'Docker', category: 'Tool', icon: <SiDocker className="text-[#2496ED]" size={22} /> },
  { name: 'Pandas', category: 'Library', icon: <SiPandas className="text-[#150458]" size={22} /> },
  { name: 'NumPy', category: 'Library', icon: <SiNumpy className="text-[#013243]" size={22} /> },
  { name: 'Matplotlib', category: 'Library', icon: <SiChartdotjs className="text-[#11557c]" size={22} /> },
];

const categories = ['Language', 'Frontend', 'Backend', 'Database', 'Tool', 'Library'];

const SkillsSection = ({ sectionRef }) => {
  const { darkMode, currentTheme } = useTheme();

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-14 sm:py-20 px-3 sm:px-6"
      style={{
        backgroundColor: darkMode ? 'rgba(36, 36, 71, 0.3)' : 'rgba(254, 249, 242, 0.5)'
      }}
      aria-label="Technical skills"
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
            className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16 tracking-tight"
            style={{ paddingBottom: '0.2em' }}
          >
            Technical{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`
              }}
            >
              Skills
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {categories.map(category => {
              const categorySkills = skills.filter(skill => skill.category === category);
              if (categorySkills.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  variants={fadeInUp}
                  className="skill-category relative"
                >
                  <div
                    className="p-6 rounded-2xl relative overflow-hidden h-full"
                    style={{
                      backgroundColor: currentTheme.cardBg,
                      border: `1px solid ${currentTheme.cardBorder}`,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.05)`
                    }}
                  >
                    <div
                      className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-12 translate-x-12 opacity-5"
                      style={{
                        background: `radial-gradient(circle, ${currentTheme.primary}, ${currentTheme.accent})`
                      }}
                    ></div>

                    <h3
                      className="text-xl font-bold mb-6 sm:mb-8 pb-3 relative"
                      style={{
                        borderBottom: `2px solid ${currentTheme.primary}30`,
                      }}
                    >
                      {category === 'Tool' ? 'Tools & Platforms' : `${category}s`}
                      <span
                        className="absolute bottom-0 left-0 h-0.5 w-16"
                        style={{ backgroundColor: currentTheme.primary }}
                      ></span>
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {categorySkills.map(skill => (
                        <motion.div
                          key={skill.name}
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: currentTheme.primary,
                            color: currentTheme.primaryText
                          }}
                          className="flex items-center gap-2 transition-all duration-200"
                          style={{
                            backgroundColor: currentTheme.background === '#030303' ? '#151515' : '#FFFFFF',
                            borderRadius: "12px",
                            padding: "8px 12px",
                            color: currentTheme.foreground,
                            border: `1px solid ${currentTheme.cardBorder}`
                          }}
                        >
                          <div className="flex-shrink-0 group-hover:text-current">
                            {skill.icon}
                          </div>
                          <span className="skill-name text-sm font-medium">{skill.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            variants={fadeInUp}
            className="text-center opacity-70 italic mt-4 text-sm sm:text-base"
          >
            *Constantly expanding my skillset through new projects and learning.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
