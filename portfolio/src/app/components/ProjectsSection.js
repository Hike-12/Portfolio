"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiGlobe, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';
import { useTheme } from './ThemeContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
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
      staggerChildren: 0.15
    }
  }
};

const projects = [
  {
    title: 'Restaurant Booking System',
    description: 'A comprehensive booking system with VR restaurant preview, QR code check-ins, and chatbot integration. Built to modernize the dining experience from reservation to table.',
    tech: ['React', 'Django', 'SqlLite', 'WebVR', 'QR Codes'],
    features: ['VR Preview', 'Chatbot', 'Real-time Booking', 'Event Management'],
    link: "https://coffee-cup-gamma.vercel.app/",
    github: 'https://github.com/Hike-12/Restaurant-Booking',
    image: '/Restaurant.png',
  },
  {
    title: "Notes App (Scribe)",
    description: "Real-time collaborative note-taking with rich text editing, live cursors, sharing, and PDF export.",
    tech: ["React", "Django", "Yjs", "WebSocket"],
    features: ["Collaboration", "Auto-sync", "PDF Export"],
    github: "https://github.com/Hike-12/Notes-App",
    link: "https://scribe-ruddy.vercel.app/",
    image: "/Scribe.png"
  },
  {
    title: 'Solar System 3D',
    description: 'Interactive 3D solar system with realistic textures and orbital mechanics. A beautiful educational tool.',
    tech: ['Three.js', 'WebGL', 'JavaScript'],
    link: 'https://solar-system-mu-amber.vercel.app/',
    github: 'https://github.com/Hike-12/solar-system',
    features: ['3D Visualization', 'Interactive'],
    image: '/SolarSystem.png'
  },
  {
    title: 'Workspaces',
    description: 'A workspace management dashboard with collaborative features using WebSockets and WebRTC.',
    tech: ['Express', 'React', 'Node.js'],
    features: ['Webrtc', 'Websockets', 'Multi-layout'],
    github: 'https://github.com/Hike-12/Workspaces',
    link: 'https://focalpoint-gamma.vercel.app/',
    image: '/Work.png'
  },
  {
    title: 'Particles to Dust',
    description: 'A visually striking landing page made with Three.js and React Three Fiber, featuring a dynamic particles effect.',
    tech: ['React', 'Three.js', 'R3F'],
    features: ['3D Particles', 'Responsive Design'],
    link: 'https://particles-to-dust.vercel.app/',
    github: 'https://github.com/Hike-12/particles',
    image: '/Dust.png',
  },
  {
    title: 'Budgetly',
    description: 'A comprehensive personal finance application to seamlessly track expenses, manage budgets, and visualize your financial growth across web and mobile platforms.',
    tech: ['Next.js', 'React Native', 'MongoDB', 'Node.js'],
    features: ['Expense Tracking', 'Analytics', 'Budget Management'],
    github: 'https://github.com/Hike-12/budget',
    link: 'https://budget-tracker-hike.vercel.app/',
    image: '/Budgetly.png',
  },
  /* 
  {
    title: 'Habitz – Habit Tracker',
    description: 'A gamified, AI-powered habit tracker with social accountability, challenges, and real-time visualizations. Keep your streaks alive.',
    tech: ['React', 'Node.js', 'MongoDB', 'Groq AI'],
    features: ['Streak Tracker', 'AI Coach', 'Visualizer'],
    github: 'https://github.com/Hike-12/HackHazard',
    link: 'https://habitz-three.vercel.app/',
    image: '/HabitTracker.png'
  }, 
  */
];

const ProjectCard = ({ project, index, isWide, spanClasses, onImageClick, currentTheme }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 0.99 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`group relative overflow-hidden rounded-md flex flex-col ${isWide ? 'lg:flex-row' : ''} ${spanClasses}`}
      style={{
        backgroundColor: currentTheme.cardBg,
        border: `1px solid ${currentTheme.primary}40`,
        boxShadow: isHovered 
          ? `0 20px 40px -10px ${currentTheme.primary}25` 
          : `0 8px 32px -8px ${currentTheme.primary}10`,
      }}
    >
      {/* Content Container */}
      <div className={`p-8 flex flex-col flex-grow z-10 ${isWide ? 'lg:w-[55%]' : 'w-full'} order-2 ${isWide ? 'lg:order-1' : ''}`}>
        <div className="mb-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2 flex-wrap">
              {project.tech.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-[14px] font-semibold rounded-md tracking-wide"
                  style={{
                    backgroundColor: `${currentTheme.primary}15`,
                    color: currentTheme.primary,
                    border: `1px solid ${currentTheme.primary}40`
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-4 text-current opacity-60">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:scale-110 transition-all duration-200" aria-label="GitHub">
                  <FiGithub size={22} />
                </a>
              )}
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:scale-110 transition-all duration-200" aria-label="Live Demo">
                  <FiExternalLink size={22} />
                </a>
              )}
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight transition-colors group-hover:text-current">
            {project.title}
          </h3>
          
          <p className="text-[16px] opacity-75 mb-6 leading-relaxed line-clamp-3 font-medium">
            {project.description}
          </p>
        </div>

        <div className="mt-6 pt-5 flex items-center justify-between" style={{ borderTop: `1px dashed ${currentTheme.primary}30` }}>
           <span className="text-[14px] font-bold uppercase tracking-wider opacity-70">
             {project.features[0]} &middot; {project.features[1]}
           </span>
           {project.link && (
             <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg" style={{ backgroundColor: currentTheme.primary, color: currentTheme.primaryText }}>
               <FiArrowRight size={18} />
             </a>
           )}
        </div>
      </div>

      {/* Image Container */}
      <div className={`relative overflow-hidden bg-black/5 z-10 ${isWide ? 'lg:w-[45%] min-h-[250px] lg:min-h-full' : 'w-full h-[220px] sm:h-[260px]'} order-1 ${isWide ? 'lg:order-2' : ''}`}>
        <button
          className="w-full h-full cursor-pointer bg-transparent border-none p-0 block outline-none relative"
          onClick={() => onImageClick(project.image)}
          aria-label={`View ${project.title} screenshot`}
        >
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            className="transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ objectFit: "cover", objectPosition: "center", display: imgError ? 'none' : 'block' }}
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
          />
        </button>
        
        {imgError && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}10, ${currentTheme.accent}20)`,
            }}
          >
            <div className="flex flex-col items-center justify-center text-center p-4">
              <FiGlobe size={32} style={{ color: currentTheme.primary, opacity: 0.5 }} className="mb-3" />
              <p className="text-[14px] font-medium" style={{ color: currentTheme.primary }}>Preview Unavailable</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProjectsSection = ({ sectionRef, onImageClick }) => {
  const { currentTheme } = useTheme();

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="pt-32 pb-24 px-4 sm:px-6 md:px-8"
      aria-label="Projects"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="flex flex-col gap-16"
        >
          <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-16">
            <motion.div variants={fadeInUp} className="max-w-2xl mx-auto">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 tracking-tight"
                style={{ paddingBottom: '0.1em' }}
              >
                Selected{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`
                  }}
                >
                  Works
                </span>
              </motion.h2>
              <p className="text-base sm:text-lg opacity-80 leading-relaxed max-w-xl font-medium mx-auto text-balance">
                A collection of recent projects exploring web technologies, 3D experiences, and real-time collaboration.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {projects.map((project, index) => {
              // Create the bento grid spans
              const spanClasses = 
                index === 0 ? "md:col-span-12 lg:col-span-7" :
                index === 1 ? "md:col-span-6 lg:col-span-5" :
                index === 2 ? "md:col-span-6 lg:col-span-4" :
                index === 3 ? "md:col-span-6 lg:col-span-4" :
                index === 4 ? "md:col-span-6 lg:col-span-4" :
                index === 5 ? "md:col-span-12 lg:col-span-12" : "md:col-span-12";
              
              const isWide = index === 0 || index === 5;

              return (
                <ProjectCard 
                  key={project.title}
                  project={project}
                  index={index}
                  isWide={isWide}
                  spanClasses={spanClasses}
                  onImageClick={onImageClick}
                  currentTheme={currentTheme}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;

