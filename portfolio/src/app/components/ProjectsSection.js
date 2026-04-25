"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiGlobe, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';
import { useTheme } from './ThemeContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
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
    title: 'Habitz – Habit Tracker',
    description: 'A gamified, AI-powered habit tracker with social accountability, challenges, and real-time visualizations. Keep your streaks alive.',
    tech: ['React', 'Node.js', 'MongoDB', 'Groq AI'],
    features: ['Streak Tracker', 'AI Coach', 'Visualizer'],
    github: 'https://github.com/Hike-12/HackHazard',
    link: 'https://habitz-three.vercel.app/',
    image: '/HabitTracker.png'
  },
  /*
  {
    title: 'Text To VR Image Converter',
    description: 'Web app that converts text prompts or uploaded images into immersive 360° VR experiences.',
    tech: ['JavaScript', 'WebVR', 'AI Integration'],
    link: 'https://hike-12.github.io/VR_Image/',
    github: 'https://github.com/Hike-12/VR_Image',
    features: ['AI Generation', 'Mobile VR'],
    image: '/VR.png'
  },
  {
    title: 'AR Website',
    description: 'A playful AR web app that lets users view fun 3D models in their camera background and take photos with them. Merging physical and digital seamlessly.',
    tech: ['React', 'Three.js', 'AR.js', 'WebXR'],
    features: ['Camera Overlay', '3D Models', 'Photo Capture'],
    github: 'https://github.com/Hike-12/AR',
    link: 'https://augmint.vercel.app/',
    image: '/AR.png'
  },
  */
];

const ProjectsSection = ({ sectionRef, onImageClick }) => {
  const { currentTheme } = useTheme();

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="pt-24 pb-20 px-4 sm:px-6 md:px-8"
      aria-label="Projects"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div variants={fadeInUp} className="max-w-2xl">
              <h2 className="text-[64px] font-bold mb-4 tracking-tight leading-tight">
                Selected{" "}
                <span
                  style={{ color: currentTheme.primary }}
                >
                  Works
                </span>
              </h2>
              <p className="text-[18px] opacity-70 leading-relaxed max-w-xl">
                A collection of recent projects exploring web technologies, 3D experiences, and real-time collaboration.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
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
                <motion.div
                  key={project.title}
                  variants={fadeInUp}
                  className={`group relative overflow-hidden rounded-xl flex flex-col ${isWide ? 'lg:flex-row' : ''} ${spanClasses} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.primary}40`,
                    boxShadow: `0 8px 32px -8px ${currentTheme.primary}15`
                  }}
                >
                  {/* Content Container */}
                  <div className={`p-6 sm:p-8 flex flex-col flex-grow z-10 ${isWide ? 'lg:w-1/2' : 'w-full'} order-2 ${isWide ? 'lg:order-1' : ''}`}>
                    <div className="mb-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2 flex-wrap">
                          {project.tech.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-[12px] font-medium rounded-md"
                              style={{
                                backgroundColor: `${currentTheme.primary}15`,
                                color: currentTheme.primary,
                                border: `1px solid ${currentTheme.primary}30`
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-3 text-current opacity-60">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity" aria-label="GitHub">
                              <FiGithub size={20} />
                            </a>
                          )}
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity" aria-label="Live Demo">
                              <FiExternalLink size={20} />
                            </a>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-3 tracking-tight transition-colors" style={{ paddingBottom: '0.1em' }}>
                        {project.title}
                      </h3>
                      
                      <p className="text-[15px] opacity-75 mb-6 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${currentTheme.primary}20` }}>
                       <span className="text-[12px] font-medium uppercase tracking-wider opacity-60">
                         {project.features[0]} &middot; {project.features[1]}
                       </span>
                       {project.link && (
                         <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1" style={{ backgroundColor: currentTheme.primary, color: currentTheme.primaryText }}>
                           <FiArrowRight size={16} />
                         </a>
                       )}
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className={`relative overflow-hidden bg-black/5 ${isWide ? 'lg:w-1/2 min-h-[200px] lg:min-h-full' : 'w-full h-[180px] sm:h-[220px]'} order-1 ${isWide ? 'lg:order-2' : ''}`}>
                    <button
                      className="w-full h-full cursor-pointer bg-transparent border-none p-0 block outline-none"
                      onClick={() => onImageClick(project.image)}
                      aria-label={`View ${project.title} screenshot`}
                    >
                      <Image
                        src={project.image}
                        alt={`Screenshot of ${project.title}`}
                        fill
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        className="transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.parentNode.querySelector('.fallback-gradient').style.display = 'flex';
                        }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 2}
                      />
                    </button>
                    
                    <div
                      className="fallback-gradient absolute inset-0 flex items-center justify-center"
                      style={{
                        display: "none",
                        background: `linear-gradient(135deg, ${currentTheme.primary}10, ${currentTheme.accent}20)`,
                      }}
                    >
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <FiGlobe size={32} style={{ color: currentTheme.primary, opacity: 0.5 }} className="mb-3" />
                        <p className="text-[14px] font-medium" style={{ color: currentTheme.primary }}>Preview Unavailable</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;

