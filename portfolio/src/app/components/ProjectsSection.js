"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Globe } from 'lucide-react';
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

const projects = [
  {
    title: 'Restaurant Booking System',
    description: 'A comprehensive booking system with VR restaurant preview, QR code check-ins, and chatbot integration.',
    tech: ['React', 'Django', 'SqlLite', 'WebVR', 'QR Codes'],
    features: ['VR Preview', 'Chatbot', 'Real-time Booking', 'Event Management'],
    link: "https://coffee-cup-gamma.vercel.app/",
    github: 'https://github.com/Hike-12/Restaurant-Booking',
    image: '/Restaurant.png',
  },
  {
    title: "Notes App (Scribe)",
    description: "Real-time collaborative note-taking with rich text editing, live cursors, sharing, and PDF export. Built with React, Django, Yjs, and WebSockets.",
    tech: ["React", "Django", "Tailwind CSS", "Quill.js", "Yjs", "WebSocket"],
    features: ["Rich Text Editor", "Real-time Collaboration", "Auto-sync", "Share Notes", "PDF Export", "Secure Authentication"],
    github: "https://github.com/Hike-12/Notes-App",
    link: "https://scribe-ruddy.vercel.app/",
    image: "/Scribe.png"
  },
  {
    title: 'Solar System 3D',
    description: 'Interactive 3D solar system with realistic textures and orbital mechanics.',
    tech: ['Three.js', 'WebGL', 'JavaScript', 'Realistic Textures'],
    link: 'https://solar-system-mu-amber.vercel.app/',
    github: 'https://github.com/Hike-12/solar-system',
    features: ['3D Visualization', 'Realistic Physics', 'Interactive Controls', 'Educational'],
    image: '/SolarSystem.png'
  },
  {
    title: 'Workspaces',
    description: 'A workspace management dashboard with collaborative features using websockets and webrtc.',
    tech: ['Express.js', 'React', 'Tailwind CSS', 'Node.js'],
    features: ['Webrtc', 'Websockets', 'Multi-layout UI', 'File Sharing'],
    github: 'https://github.com/Hike-12/Workspaces',
    link: 'https://focalpoint-gamma.vercel.app/',
    image: '/Work.png'
  },
  {
    title: 'Particles to Dust',
    description: 'A cool landing page made with Three.js and React Three Fiber, featuring a dynamic particles-to-dust effect.',
    tech: ['React', 'JavaScript', 'Tailwind CSS', 'Three.js', 'React Three Fiber'],
    features: ['3D Particles', 'Three.js Animation', 'Responsive Design', 'Landing Page'],
    link: 'https://particles-to-dust.vercel.app/',
    github: 'https://github.com/Hike-12/particles',
    image: '/Dust.png',
  },
  {
    title: 'Habitz – Habit Tracker',
    description: 'A gamified, AI-powered habit tracker with social accountability, challenges, and real-time visualizations.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Groq AI'],
    features: ['Streak Tracker', 'QR Updates', 'Habit Visualizer', 'AI Coach'],
    github: 'https://github.com/Hike-12/HackHazard',
    link: 'https://habitz-three.vercel.app/',
    image: '/HabitTracker.png'
  },
  {
    title: 'Text To VR Image Converter',
    description: 'Web app that converts text prompts or uploaded images into immersive 360° VR experiences.',
    tech: ['JavaScript', 'WebVR', 'AI Integration', 'Canvas API'],
    link: 'https://hike-12.github.io/VR_Image/',
    github: 'https://github.com/Hike-12/VR_Image',
    features: ['AI Generation', 'Mobile VR', 'Image Upload', 'Cross-platform'],
    image: '/VR.png'
  },
  {
    title: 'AR Website',
    description: 'A playful AR web app that lets users view fun 3D models in their camera background and take photos with them.',
    tech: ['React', 'Three.js', 'AR.js', 'WebXR'],
    features: ['Camera Overlay', '3D Models', 'Photo Capture', 'Web-based AR'],
    github: 'https://github.com/Hike-12/AR',
    link: 'https://augmint.vercel.app/',
    image: '/AR.png'
  },
];

const ProjectsSection = ({ sectionRef, onImageClick }) => {
  const { currentTheme } = useTheme();

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="pt-24 pb-20 px-3 sm:px-6"
      aria-label="Projects"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16"
          >
            Featured{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`
              }}
            >
              Projects
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.cardBorder}`
                }}
              >
                <div
                  className="h-full p-6 relative overflow-hidden"
                >
                  {/* Image placeholder with gradient overlay */}
                  <div className="mb-6 relative h-48 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-900">
                    <button
                      className="w-full h-full cursor-pointer bg-transparent border-none p-0 block focus-visible:ring-2 focus-visible:ring-offset-2 rounded-xl"
                      onClick={() => onImageClick(project.image)}
                      aria-label={`View ${project.title} screenshot`}
                      style={{ '--tw-ring-color': currentTheme.primary }}
                    >
                      <Image
                        src={project.image}
                        alt={`Screenshot of ${project.title}`}
                        fill
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.parentNode.querySelector('.fallback-gradient').style.display = 'flex';
                        }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    </button>
                    <div
                      className="fallback-gradient absolute inset-0 flex items-center justify-center"
                      style={{
                        display: "none",
                        background: `linear-gradient(135deg, ${currentTheme.primary}20, ${currentTheme.accent}40)`,
                        border: `1px solid ${currentTheme.cardBorder}`
                      }}
                    >
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <div
                          className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                          style={{ backgroundColor: `${currentTheme.primary}30` }}
                        >
                          <Globe size={24} style={{ color: currentTheme.primary }} />
                        </div>
                        <p style={{ color: currentTheme.primary }}>Project Preview</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-12 translate-x-12 opacity-10"
                    style={{
                      background: `radial-gradient(circle, ${currentTheme.primary}, ${currentTheme.accent})`
                    }}
                  ></div>

                  <h3 className="text-2xl font-bold mb-4 tracking-tight" style={{ paddingBottom: '0.1em' }}>{project.title}</h3>

                  <p className="opacity-80 mb-6 leading-relaxed text-balance">
                    {project.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {project.features.map((feature) => (
                        <div key={feature} className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: currentTheme.primary }}
                          ></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-semibold mb-3">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: currentTheme.primary,
                            color: currentTheme.primaryText
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3">
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="min-h-[44px] px-6 py-2 rounded-full inline-flex items-center transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                          backgroundColor: currentTheme.cardBg,
                          border: `1px solid ${currentTheme.primary}`,
                          color: currentTheme.primary,
                          '--tw-ring-color': currentTheme.primary
                        }}
                        aria-label={`View ${project.title} source code on GitHub`}
                      >
                        <Github size={16} className="mr-2" aria-hidden="true" /> View Code
                      </motion.a>
                    )}

                    {project.link && (
                      <motion.a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="min-h-[44px] px-6 py-2 rounded-full inline-flex items-center transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                          backgroundColor: currentTheme.primary,
                          color: currentTheme.primaryText,
                          '--tw-ring-color': currentTheme.primary
                        }}
                        aria-label={`View ${project.title} live demo`}
                      >
                        <ExternalLink size={16} className="mr-2" aria-hidden="true" /> Live Demo
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
