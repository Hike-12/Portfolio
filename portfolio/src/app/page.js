"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Github, Linkedin, Mail, Phone, Moon, Sun, ExternalLink } from 'lucide-react';
import { toast } from "sonner";

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const threeCanvasRef = useRef(null);
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    contact: useRef(null)
  };
  
  // Consolidated skills array - easy to add or remove skills
  const skills = [
    // Languages
    { name: 'JavaScript', category: 'Language', icon: '🟨' },
    { name: 'Python', category: 'Language', icon: '🐍' },
    { name: 'HTML', category: 'Language', icon: '📄' },
    { name: 'CSS', category: 'Language', icon: '🎨' },
    
    // Frontend
    { name: 'React', category: 'Frontend', icon: '⚛️' },
    { name: 'Tailwind CSS', category: 'Frontend', icon: '🌊' },
    { name: 'Three.js', category: 'Frontend', icon: '🔺' },
    { name: 'WebGL', category: 'Frontend', icon: '🌐' },
    { name: 'WebVR', category: 'Frontend', icon: '🥽' },
    
    // Backend
    { name: 'Node.js', category: 'Backend', icon: '🟢' },
    { name: 'Express.js', category: 'Backend', icon: '🚂' },
    { name: 'Django', category: 'Backend', icon: '🐍' },
    { name: 'Flask', category: 'Backend', icon: '🧪' },
    { name: 'FastAPI', category: 'Backend', icon: '⚡' },
    
    // Databases
    { name: 'MongoDB', category: 'Database', icon: '🍃' },
    { name: 'MySQL', category: 'Database', icon: '🐬' },
    { name: 'PostgreSQL', category: 'Database', icon: '🐘' },
    
    // Tools & Platforms
    { name: 'Git & GitHub', category: 'Tool', icon: '📊' },
    { name: 'Vercel', category: 'Tool', icon: '▲' },
    { name: 'Render', category: 'Tool', icon: '🚀' },
    
    // Libraries
    { name: 'Pandas', category: 'Library', icon: '🐼' },
    { name: 'NumPy', category: 'Library', icon: '🔢' }
  ];
  
  // Theme colors - Updated with new color scheme
  const theme = {
    light: {
      background: '#F1EFEC', // Light cream/off-white
      foreground: '#123458', // Dark navy blue text
      primary: '#123458',    // Navy blue as primary
      secondary: '#D4C9BE',  // Beige/tan as secondary
      accent: '#123458',     // Navy blue as accent
      cardBg: '#FFFFFF',     // White card background
      cardBorder: '#D4C9BE'  // Beige/tan for borders
    },
    dark: {
      background: '#030303', // Almost black background
      foreground: '#F1EFEC', // Light cream text
      primary: '#D4C9BE',    // Beige/tan as primary in dark mode
      secondary: '#123458',  // Navy blue as secondary 
      accent: '#D4C9BE',     // Beige/tan as accent
      cardBg: '#0A0A0A',     // Slightly lighter black for cards
      cardBorder: '#1A1A1A'  // Slightly lighter borders
    }
  };
  
  const currentTheme = darkMode ? theme.dark : theme.light;
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!threeCanvasRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: threeCanvasRef.current,
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    // Set up particles with our theme colors
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 10;
      
      // Colors - convert hex to RGB
      if (i % 3 === 0) {
        // Use the color palette based on theme
        const colorOptions = darkMode ? 
          ['#789DBC', '#564256', '#2A7D4F'] : 
          ['#789DBC', '#FFE3E3', '#C9E9D2'];
        
        const color = new THREE.Color(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Camera position
    camera.position.z = 4;
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate particles based on mouse position
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      
      // Follow mouse with subtle movement
      particlesMesh.rotation.x += mouseY * 0.0003;
      particlesMesh.rotation.y += mouseX * 0.0003;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [darkMode]);
  
  // Scroll observer for navigation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    Object.values(sectionRefs).forEach(
      (ref) => ref.current && observer.observe(ref.current)
    );
    
    return () => {
      Object.values(sectionRefs).forEach(
        (ref) => ref.current && observer.unobserve(ref.current)
      );
    };
  }, []);
  
  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setMenuOpen(false);
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  
  // Copy email to clipboard
  const copyEmail = () => {
    navigator.clipboard.writeText('aliqyaan12@gmail.com');
    toast("Email copied to clipboard!");
  };
  
  // Animation variants
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
  
  // Project data
  const projects = [
    {
      title: 'Restaurant Booking System',
      description: 'A comprehensive booking system with VR restaurant preview, QR code check-ins, and chatbot integration.',
      tech: ['React', 'Node.js', 'MongoDB', 'WebVR', 'QR Codes'],
      features: ['VR Preview', 'Chatbot', 'Real-time Booking', 'Event Management'],
      image: '/placeholder.svg'
    },
    {
      title: 'Text To VR Image Converter',
      description: 'Web app that converts text prompts or uploaded images into immersive 360° VR experiences.',
      tech: ['JavaScript', 'WebVR', 'AI Integration', 'Canvas API'],
      link: 'https://hike-12.github.io/VR_Image/',
      features: ['AI Generation', 'Mobile VR', 'Image Upload', 'Cross-platform'],
      image: '/placeholder.svg'
    },
    {
      title: 'Solar System 3D',
      description: 'Interactive 3D solar system with realistic textures and orbital mechanics.',
      tech: ['Three.js', 'WebGL', 'JavaScript', 'Realistic Textures'],
      link: 'https://solar-system-mu-amber.vercel.app/',
      features: ['3D Visualization', 'Realistic Physics', 'Interactive Controls', 'Educational'],
      image: '/placeholder.svg'
    }
  ];
  
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: currentTheme.background, color: currentTheme.foreground }}>
      {/* Three.js Canvas */}
      <canvas 
        ref={threeCanvasRef} 
        className="fixed inset-0 w-full h-full z-0 opacity-40 pointer-events-none"
      />
      
      {/* Navigation */}
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-extrabold"
            >
              {/* Reduced gradient to solid color */}
              <span className="text-transparent" 
                style={{ 
                  color: currentTheme.primary
                }}
              >
                Aliqyaan
              </span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="capitalize transition-all duration-300 hover:font-medium relative py-1"
                  style={{ color: activeSection === item ? currentTheme.primary : currentTheme.foreground }}
                >
                  {item}
                  {activeSection === item && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: currentTheme.primary }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
            
            {/* Mobile Navigation Toggle & Theme Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
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
              <div className="px-6 py-4 flex flex-col space-y-4">
                {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((item) => (
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
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section 
          id="home" 
          ref={sectionRefs.home}
          className="min-h-screen flex items-center justify-center px-6 pt-24"
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-12"
            >
              <motion.div
                variants={fadeInUp}
                className="w-32 h-32 mx-auto rounded-full overflow-hidden flex items-center justify-center"
                style={{ 
                  backgroundColor: currentTheme.primary // Changed from gradient to solid color
                }}
              >
                <span className="text-4xl font-bold text-white">AM</span>
              </motion.div>
              
              <div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl md:text-7xl font-bold mb-4"
                >
                  Aliqyaan{" "}
                  <span 
                    className="text-transparent"
                    style={{ 
                      color: currentTheme.primary // Changed from gradient to solid color
                    }}
                  >
                    Mahimwala
                  </span>
                </motion.h1>
                
                <motion.p
                  variants={fadeInUp}
                  className="text-xl md:text-2xl mb-10 opacity-80"
                >
                  Full Stack Developer & Computer Engineering Student
                </motion.p>
              </div>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-6"
              >
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-6 text-white rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: currentTheme.primary // Changed from gradient to solid color
                  }}
                >
                  Get In Touch
                </button>
                
                <a 
                  href="https://github.com/Hike-12" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-6 rounded-full border-2 hover:shadow-lg transform transition-all duration-300 hover:scale-105 inline-flex items-center"
                  style={{ 
                    borderColor: currentTheme.primary,
                    color: currentTheme.primary
                  }}
                >
                  <Github size={18} className="mr-2" /> GitHub
                </a>
              </motion.div>
              
              <motion.div
                variants={fadeIn}
                className="pt-12"
              >
                <div className="animate-bounce mx-auto w-8 h-12 flex justify-center">
                  <div 
                    className="w-0.5 h-8 rounded-full"
                    style={{ backgroundColor: currentTheme.primary }}
                  ></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* About Section */}
        <section 
          id="about" 
          ref={sectionRefs.about}
          className="py-20 px-6"
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
                className="text-4xl font-bold text-center mb-16"
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
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div 
                  variants={fadeInUp}
                  className="space-y-6"
                >
                  <p className="text-lg leading-relaxed">
                    I'm a passionate Computer Engineering student at Father Conceicao Rodrigues College Of Engineering with a CGPA of 9.5.
                    I specialize in full-stack development with expertise in React, Node.js, and cutting-edge web technologies.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    My journey includes winning first place at the AuraFlix Hackathon and qualifying for SIH Internal Rounds.
                    I love creating immersive web experiences using Three.js and building scalable applications.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div 
                      className="p-6 rounded-2xl"
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
                      className="p-6 rounded-2xl"
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
                      <p>+91 8122005252</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  variants={fadeInUp}
                >
                  <div 
                    className="p-8 rounded-3xl relative overflow-hidden"
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
                    
                    <h3 className="text-2xl font-bold mb-8">
                      Quick Stats
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Projects Completed</span>
                          <span 
                            className="font-bold"
                            style={{ color: currentTheme.primary }}
                          >
                            10+
                          </span>
                        </div>
                        <div 
                          className="w-full h-2 rounded-full"
                          style={{ backgroundColor: `${currentTheme.primary}30` }}
                        >
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '80%' }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: currentTheme.primary }}
                          ></motion.div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Technologies Mastered</span>
                          <span 
                            className="font-bold"
                            style={{ color: currentTheme.primary }}
                          >
                            15+
                          </span>
                        </div>
                        <div 
                          className="w-full h-2 rounded-full"
                          style={{ backgroundColor: `${currentTheme.primary}30` }}
                        >
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '90%' }}
                            transition={{ duration: 1, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: currentTheme.primary }}
                          ></motion.div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Hackathon Performance</span>
                          <span 
                            className="font-bold"
                            style={{ color: currentTheme.accent }}
                          >
                            1st Place
                          </span>
                        </div>
                        <div 
                          className="w-full h-2 rounded-full"
                          style={{ backgroundColor: `${currentTheme.accent}30` }}
                        >
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ duration: 1, delay: 0.6 }}
                            viewport={{ once: true }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: currentTheme.accent }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Skills Section */}
        <section 
          id="skills" 
          ref={sectionRefs.skills}
          className="py-20 px-6"
          style={{ 
            backgroundColor: darkMode ? 'rgba(36, 36, 71, 0.3)' : 'rgba(254, 249, 242, 0.5)'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl font-bold text-center mb-16"
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
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {['Language', 'Frontend', 'Backend', 'Database', 'Tool', 'Library'].map(category => {
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
                        {/* Accent circle in the background */}
                        <div 
                          className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-12 translate-x-12 opacity-5"
                          style={{ 
                            background: `radial-gradient(circle, ${currentTheme.primary}, ${currentTheme.accent})` 
                          }}
                        ></div>
                        
                        <h3 
                          className="text-xl font-bold mb-6 pb-3 relative"
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
                                color: "#FFFFFF"
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
                              <span className="skill-icon text-lg">{skill.icon}</span>
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
                className="text-center opacity-70 italic mt-4"
              >
                *Constantly expanding my skillset through new projects and learning.
              </motion.p>
              
            </motion.div>
          </div>
        </section>
        
        {/* Projects Section */}
        <section 
          id="projects" 
          ref={sectionRefs.projects}
          className="py-20 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl font-bold text-center mb-16"
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
              
              <div className="grid lg:grid-cols-2 gap-10">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    variants={fadeInUp}
                    whileHover={{ y: -10 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="h-full p-6 rounded-3xl relative overflow-hidden"
                      style={{ 
                        backgroundColor: currentTheme.cardBg,
                        border: `1px solid ${currentTheme.cardBorder}`
                      }}
                    >
                      <div 
                        className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-12 translate-x-12 opacity-10"
                        style={{ 
                          background: `radial-gradient(circle, ${currentTheme.primary}, ${currentTheme.accent})` 
                        }}
                      ></div>
                      
                      <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                      
                      <p className="opacity-80 mb-6 leading-relaxed">
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
                              className="px-3 py-1 text-xs rounded-full text-white"
                              style={{ 
                                backgroundColor: currentTheme.primary // Changed from gradient to solid
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {project.link && (
                        <div className="mt-auto">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 rounded-full text-white inline-flex items-center"
                            style={{ 
                              backgroundColor: currentTheme.primary // Changed from gradient to solid
                            }}
                          >
                            View Live Demo <ExternalLink size={16} className="ml-2" />
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Experience Section */}
        <section 
          id="experience" 
          ref={sectionRefs.experience}
          className="py-20 px-6"
          style={{ 
            backgroundColor: darkMode ? 'rgba(36, 36, 71, 0.3)' : 'rgba(254, 249, 242, 0.5)'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl font-bold text-center mb-16"
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
              
              <motion.div
                variants={fadeInUp}
              >
                <div 
                  className="p-8 rounded-3xl relative overflow-hidden"
                  style={{ 
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.cardBorder}`
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                      <h3 
                        className="text-2xl font-bold mb-1"
                        style={{ color: currentTheme.primary }}
                      >
                        Frontend Development Intern
                      </h3>
                      <p className="text-xl opacity-80">Trip Value</p>
                    </div>
                    <div className="mt-2 md:mt-0 opacity-70">
                      January 2025 - March 2025
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"
                        style={{ backgroundColor: currentTheme.primary }}
                      ></div>
                      <p>Developed dynamic and responsive frontend features using React, enhancing user experience and interface interactivity.</p>
                    </div>
                    <div className="flex items-start">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"
                        style={{ backgroundColor: currentTheme.primary }}
                      ></div>
                      <p>Contributed to backend development with Node.js and Express, working on API integration and server-side logic.</p>
                    </div>
                    <div className="flex items-start">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"
                        style={{ backgroundColor: currentTheme.primary }}
                      ></div>
                      <p>Collaborated with the development team to debug, test, and optimize both frontend and backend components.</p>
                    </div>
                    <div className="flex items-start">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"
                        style={{ backgroundColor: currentTheme.primary }}
                      ></div>
                      <p>Gained hands-on experience in full-stack development, version control (Git), and RESTful API design.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                variants={fadeInUp}
                className="mt-12"
              >
                <h3 className="text-2xl font-bold text-center mb-8">Achievements</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div 
                    className="p-8 rounded-3xl flex flex-col items-center text-center"
                    style={{ 
                      backgroundColor: currentTheme.cardBg,
                      border: `1px solid ${currentTheme.cardBorder}`
                    }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="text-4xl mb-4"
                    >
                      🏆
                    </motion.div>
                    <h4 
                      className="text-xl font-bold mb-2"
                      style={{ color: currentTheme.primary }}
                    >
                      First Place
                    </h4>
                    <p className="opacity-80">AuraFlix Hackathon Winner</p>
                  </div>
                  <div 
                    className="p-8 rounded-3xl flex flex-col items-center text-center"
                    style={{ 
                      backgroundColor: currentTheme.cardBg,
                      border: `1px solid ${currentTheme.cardBorder}`
                    }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="text-4xl mb-4"
                    >
                      🎯
                    </motion.div>
                    <h4 
                      className="text-xl font-bold mb-2"
                      style={{ color: currentTheme.primary }}
                    >
                      Qualified
                    </h4>
                    <p className="opacity-80">SIH Internal Round</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section 
          id="contact" 
          ref={sectionRefs.contact}
          className="py-20 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="text-center"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl font-bold mb-8"
              >
                Let's{" "}
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})` 
                  }}
                >
                  Connect
                </span>
              </motion.h2>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl mb-12 opacity-80"
              >
                I'm always open to discussing new opportunities, collaborations, or just having a chat about technology!
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="grid md:grid-cols-3 gap-8 mb-12"
              >
                <div 
                  className="p-8 rounded-3xl flex flex-col items-center"
                  style={{ 
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.cardBorder}`
                  }}
                >
                  <Mail size={28} style={{ color: currentTheme.primary }} className="mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <button 
                    onClick={copyEmail}
                    className="text-sm hover:underline transition-colors"
                    style={{ color: currentTheme.primary }}
                  >
                    aliqyaan12@gmail.com
                  </button>
                </div>
                
                <div 
                  className="p-8 rounded-3xl flex flex-col items-center"
                  style={{ 
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.cardBorder}`
                  }}
                >
                  <Phone size={28} style={{ color: currentTheme.primary }} className="mb-4" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <a 
                    href="tel:+918122005252" 
                    className="text-sm hover:underline transition-colors"
                    style={{ color: currentTheme.primary }}
                  >
                    +91 8122005252
                  </a>
                </div>
                
                <div 
                  className="p-8 rounded-3xl flex flex-col items-center"
                  style={{ 
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.cardBorder}`
                  }}
                >
                  <Github size={28} style={{ color: currentTheme.primary }} className="mb-4" />
                  <h3 className="font-semibold mb-2">GitHub</h3>
                  <a 
                    href="https://github.com/Hike-12" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:underline transition-colors"
                    style={{ color: currentTheme.primary }}
                  >
                    Hike-12
                  </a>
                </div>
              </motion.div>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-6"
              >
                <a 
                  href="mailto:aliqyaan12@gmail.com"
                  className="px-8 py-6 text-white rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-105 inline-flex items-center"
                  style={{ 
                    background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})` 
                  }}
                >
                  <Mail size={18} className="mr-2" /> Email Me
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/aliqyaan-mahimwala-362568292/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-6 rounded-full border-2 hover:shadow-lg transform transition-all duration-300 hover:scale-105 inline-flex items-center"
                  style={{ 
                    borderColor: currentTheme.primary,
                    color: currentTheme.primary
                  }}
                >
                  <Linkedin size={18} className="mr-2" /> LinkedIn
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer 
          className="py-8 px-6 border-t"
          style={{ 
            borderColor: currentTheme.cardBorder,
            backgroundColor: darkMode ? 'rgba(36, 36, 71, 0.5)' : 'rgba(254, 249, 242, 0.8)'
          }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <p className="opacity-70">
              © 2025 Aliqyaan Mahimwala. Built with React, Three.js, and Anime.js
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;