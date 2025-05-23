"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, Moon, Sun, ExternalLink, Code, Globe, BrainCircuit } from 'lucide-react';
import { toast } from "sonner";
import { 
  SiJavascript, SiPython, SiHtml5, SiCss3,
  SiReact, SiTailwindcss, SiThreedotjs, SiWebgl, 
  SiNodedotjs, SiExpress, SiDjango, SiFlask, SiFastapi,
  SiMongodb, SiMysql, SiPostgresql,
  SiGit, SiGithub, SiVercel, SiRender,
  SiPandas, SiNumpy
} from 'react-icons/si';
import { MdVrpano } from 'react-icons/md';
import dynamic from 'next/dynamic';

// Helper function to detect touch devices
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Dynamically import Three.js to avoid SSR issues
const THREE = dynamic(() => import('three'), { ssr: false });

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const threeCanvasRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    contact: useRef(null)
  };
  
  // Set isMounted to true once component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Consolidated skills array - easy to add or remove skills with official icons
  const skills = [
    // Languages
    { name: 'JavaScript', category: 'Language', icon: <SiJavascript className="text-[#F7DF1E]" size={22} /> },
    { name: 'Python', category: 'Language', icon: <SiPython className="text-[#3776AB]" size={22} /> },
    { name: 'HTML', category: 'Language', icon: <SiHtml5 className="text-[#E34F26]" size={22} /> },
    { name: 'CSS', category: 'Language', icon: <SiCss3 className="text-[#1572B6]" size={22} /> },
    
    // Frontend
    { name: 'React', category: 'Frontend', icon: <SiReact className="text-[#61DAFB]" size={22} /> },
    { name: 'Tailwind CSS', category: 'Frontend', icon: <SiTailwindcss className="text-[#06B6D4]" size={22} /> },
    { name: 'Three.js', category: 'Frontend', icon: <SiThreedotjs className="text-[#000000]" size={22} /> },
    { name: 'WebGL', category: 'Frontend', icon: <SiWebgl className="text-[#990000]" size={22} /> },
    { name: 'WebVR', category: 'Frontend', icon: <MdVrpano className="text-[#FF4154]" size={22} /> },
    
    // Backend
    { name: 'Node.js', category: 'Backend', icon: <SiNodedotjs className="text-[#339933]" size={22} /> },
    { name: 'Express.js', category: 'Backend', icon: <SiExpress className="text-[#000000]" size={22} /> },
    { name: 'Django', category: 'Backend', icon: <SiDjango className="text-[#092E20]" size={22} /> },
    { name: 'Flask', category: 'Backend', icon: <SiFlask className="text-[#000000]" size={22} /> },
    { name: 'FastAPI', category: 'Backend', icon: <SiFastapi className="text-[#009688]" size={22} /> },
    
    // Databases
    { name: 'MongoDB', category: 'Database', icon: <SiMongodb className="text-[#47A248]" size={22} /> },
    { name: 'MySQL', category: 'Database', icon: <SiMysql className="text-[#4479A1]" size={22} /> },
    { name: 'PostgreSQL', category: 'Database', icon: <SiPostgresql className="text-[#336791]" size={22} /> },
    
    // Tools & Platforms
    { name: 'Git & GitHub', category: 'Tool', icon: <SiGithub className="text-[#181717]" size={22} /> },
    { name: 'Vercel', category: 'Tool', icon: <SiVercel className="text-[#000000]" size={22} /> },
    { name: 'Render', category: 'Tool', icon: <SiRender className="text-[#46E3B7]" size={22} /> },
    
    // Libraries
    { name: 'Pandas', category: 'Library', icon: <SiPandas className="text-[#150458]" size={22} /> },
    { name: 'NumPy', category: 'Library', icon: <SiNumpy className="text-[#013243]" size={22} /> }
  ];
  
  // Theme colors - Updated to ensure proper text contrast
  const theme = {
    light: {
      background: '#F1EFEC', // Light cream/off-white
      foreground: '#123458', // Dark navy blue text
      primary: '#123458',    // Navy blue as primary
      secondary: '#D4C9BE',  // Beige/tan as secondary
      accent: '#123458',     // Navy blue as accent
      cardBg: '#FFFFFF',     // White card background
      cardBorder: '#D4C9BE', // Beige/tan for borders
      primaryText: '#FFFFFF', // White text for primary backgrounds
      darkBgText: '#FFFFFF',  // White text for dark backgrounds
      lightBgText: '#123458'  // Navy text for light backgrounds
    },
    dark: {
      background: '#030303', // Almost black background
      foreground: '#F1EFEC', // Light cream text
      primary: '#D4C9BE',    // Beige/tan as primary in dark mode
      secondary: '#123458',  // Navy blue as secondary 
      accent: '#D4C9BE',     // Beige/tan as accent
      cardBg: '#0A0A0A',     // Slightly lighter black for cards
      cardBorder: '#1A1A1A', // Slightly lighter borders
      primaryText: '#030303', // Dark text for primary backgrounds
      darkBgText: '#F1EFEC',  // Light text for dark backgrounds
      lightBgText: '#030303'  // Dark text for light backgrounds
    }
  };
  
  const currentTheme = darkMode ? theme.dark : theme.light;
  
  // Initialize Three.js scene - Only run when component is mounted on client
  useEffect(() => {
    if (!isMounted || !threeCanvasRef.current || typeof window === 'undefined') return;
    
    // Import Three.js dynamically to avoid SSR issues
    import('three').then((THREE) => {
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
    });
  }, [darkMode, isMounted]);
  
  // Scroll observer for navigation - Only run on client
  useEffect(() => {
    if (!isMounted) return;
    
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
  }, [isMounted]);
  
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
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('aliqyaan12@gmail.com');
      toast("Email copied to clipboard!");
    }
  };
  
  // Form handling functions
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success("Message sent successfully!");
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    github: 'https://github.com/Hike-12/Restraunt-Booking',
    image: '/Restaurant.png',
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
    title: 'Trippeer',
    description: 'A dynamic certificate generation platform with batch CSV uploads, live preview, and instant PDF generation.',
    tech: ['React', 'Node.js', 'MongoDB', 'PDFKit'],
    features: ['Live Preview', 'Bulk Upload', 'PDF Export', 'Email Support'],
    github: 'https://github.com/Hike-12/Certifiyo',
    link:'https://certifiyo.vercel.app/',
    image: '/Certifiyo.png'
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
  title: 'InfluenceIQ',
  description: 'A platform built to track fake fame, recency bias, and fleeting trends in the influencer and entertainment space. Combines analytics and insights to highlight short-lived popularity.',
  tech: ['MongoDB', 'Express.js', 'React', 'Node.js', 'FastAPI'],
  features: ['Trend Analysis', 'Influencer Tracking', 'Recency Bias Metrics', 'Interactive Dashboard'],
  github: 'https://github.com/Hike-12/Auraflix',
  link: 'https://influenceiq-nine.vercel.app/',
  image: '/Auraflix.png'
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
  }
];

  
  // Achievements data
  const achievements = [
    {
      title: 'First Place - AuraFlix Hackathon',
      date: 'September 2024',
      description: 'Led a team of four developers to create a machine learning-powered video streaming platform that won first place among 30+ competing teams. Our solution featured personalized content recommendations and innovative accessibility features.',
      image: '/Aura.jpg'
    },
    {
      title: 'Qualified - SIH Internal Round',
      date: 'July 2024',
      description: 'Developed an AI-enhanced educational platform that qualified for the Smart India Hackathon internal round. The project featured interactive learning modules with VR integration and automated assessment capabilities.',
      image: '/SIH.jpg'
    }
  ];

  // If not mounted yet (during SSR), return a minimal loading state
  if (!isMounted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: currentTheme.background }}
      >
        <div className="text-center">
          <p style={{ color: currentTheme.foreground }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }
  
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-xl sm:text-2xl font-extrabold"
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
            <div className="hidden md:flex space-x-3 lg:space-x-8">
              {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((item) => (
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
            <div className="flex items-center space-x-2 sm:space-x-4">
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
              <div className="px-4 py-4 flex flex-col space-y-3">
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
          className="min-h-screen flex items-center justify-center px-3 sm:px-6 pt-24"
        >
          <div className="max-w-3xl sm:max-w-5xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8 sm:space-y-12"
            >
              <motion.div
                variants={fadeInUp}
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <span className="text-3xl sm:text-4xl font-bold text-white">AM</span>
              </motion.div>
              
              <div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4"
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
                  className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-10 opacity-80"
                >
                  Full Stack Developer & Computer Engineering Student
                </motion.p>
              </div>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-4 sm:gap-6"
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
              
              <motion.div
                variants={fadeIn}
                className="pt-8 sm:pt-12"
              >
                <div className="animate-bounce mx-auto w-6 sm:w-8 h-10 sm:h-12 flex justify-center">
                  <div 
                    className="w-0.5 h-6 sm:h-8 rounded-full"
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
                    Hey! I’m Aliqyaan Mahimwala — a 19-year-old Computer Engineering student at Fr. CRCE in Bandra, Mumbai. I’m a full-stack web developer who loves building clean, smooth, and user-friendly web apps that just work.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    I usually work with modern tools and frameworks, and Django’s my go-to on the backend. Whether it’s writing backend logic, fine-tuning the UI, or figuring out a tricky bug, I enjoy the process of making things better — one line of code at a time.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    Always learning, always building — trying to keep things neat, functional, and maybe a little fun too.
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
                      <p>+91 8122005252</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  variants={fadeInUp}
                >
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
                      {[
                        { 
                          title: 'Full-Stack Development', 
                          icon: <Code size={30} style={{ color: currentTheme.primary }} />, 
                          description: 'Creating seamless user experiences with modern frameworks and clean code'
                        },
                        { 
                          title: 'Interactive 3D & VR', 
                          icon: <Globe size={30} style={{ color: currentTheme.primary }} />, 
                          description: 'Building immersive digital experiences with Three.js and WebVR'
                        },
                        { 
                          title: 'AI Integration', 
                          icon: <BrainCircuit size={30} style={{ color: currentTheme.primary }} />, 
                          description: 'Incorporating intelligent features to enhance application capabilities'
                        }
                      ].map((item, index) => (
                        <motion.div
                          key={item.title}
                          whileHover={{ 
                            scale: 1.03, 
                            backgroundColor: currentTheme.primary,
                            color: currentTheme.primaryText // Using correct text color for contrast
                          }}
                          transition={{ duration: 0.3 }}
                          className="p-5 rounded-xl border flex items-start gap-4 cursor-pointer"
                          style={{ borderColor: currentTheme.cardBorder }}
                        >
                          <div className="p-3 rounded-lg" style={{ 
                            backgroundColor: `${currentTheme.primary}15`,
                          }}>
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-bold mb-1">{item.title}</h4>
                            <p className="text-sm opacity-80">{item.description}</p>
                          </div>
                        </motion.div>
                      ))}
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
          className="py-14 sm:py-20 px-3 sm:px-6"
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
                className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16"
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
                                color: currentTheme.primaryText // Text color that contrasts with primary background
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
        
        {/* Projects Section */}
        <section 
          id="projects" 
          ref={sectionRefs.projects}
          className="py-14 sm:py-20 px-3 sm:px-6"
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
                      {/* Image placeholder with gradient overlay */}
                      <div className="mb-6 relative h-48 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-900">
  <img
    src={project.image}
    alt={project.title}
    className="object-cover w-full h-full"
    style={{ objectPosition: "center" }}
    onError={e => {
      e.target.style.display = 'none';
      e.target.parentNode.querySelector('.fallback-gradient').style.display = 'flex';
    }}
  />
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
                              className="px-3 py-1 text-xs rounded-full"
                              style={{ 
                                backgroundColor: currentTheme.primary,
                                color: currentTheme.primaryText // Ensuring proper contrast
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-auto flex flex-wrap gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 rounded-full inline-flex items-center hover:bg-opacity-90 transition-all"
                            style={{ 
                              backgroundColor: currentTheme.cardBg,
                              border: `1px solid ${currentTheme.primary}`,
                              color: currentTheme.primary
                            }}
                          >
                            <Github size={16} className="mr-2" /> View Code
                          </a>
                        )}
                        
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 rounded-full inline-flex items-center"
                            style={{ 
                              backgroundColor: currentTheme.primary,
                              color: currentTheme.primaryText // Ensuring proper contrast
                            }}
                          >
                            <ExternalLink size={16} className="mr-2" /> Live Demo
                          </a>
                        )}
                      </div>
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
          className="py-14 sm:py-20 px-3 sm:px-6"
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
              
              <motion.div
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
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ 
                        border: `1px solid ${currentTheme.cardBorder}`
                      }}
                    >
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="text-4xl sm:text-5xl mb-2 w-full h-full"
                        >
                          <img src="/Trip.jpg" alt="Professional Experience" className="object-contain w-full h-full" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
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
                  
                  <div className="space-y-4 sm:space-y-6">
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
                        <div 
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ 
                            border: `1px solid ${currentTheme.cardBorder}`
                          }}
                        >
                          <div className="flex flex-col items-center justify-center w-full h-full">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="text-4xl sm:text-5xl mb-2 w-full h-full"
                            >
                              <img src={achievement.image} alt={achievement.title} className="object-contain w-full h-full" />
                            </motion.div>
                          </div>
                        </div>
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
        
        {/* Contact Section */}
        <section 
          id="contact" 
          ref={sectionRefs.contact}
          className="py-14 sm:py-20 px-3 sm:px-6"
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
                className="text-3xl sm:text-4xl font-bold mb-8"
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
                className="text-xl mb-8 sm:mb-12 opacity-80"
              >
                I'm always open to discussing new opportunities, collaborations, or just having a chat about technology!
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12"
              >
                <div 
                  className="p-6 sm:p-8 rounded-3xl flex flex-col items-center"
                  style={{ 
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.cardBorder}`
                  }}
                >
                  <Mail size={28} style={{ color: currentTheme.primary }} className="mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <button 
                    onClick={copyEmail}
                    className="text-sm hover:underline transition-colors group"
                    style={{ color: currentTheme.primary }}
                  >
                    <span className="group-hover:text-current">aliqyaan12@gmail.com</span>
                  </button>
                </div>
                
                <div 
                  className="p-6 sm:p-8 rounded-3xl flex flex-col items-center"
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
              </motion.div>
              
              {/* Contact Form */}
              <motion.form
                variants={fadeInUp}
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto mb-8 sm:mb-12"
              >
                <div 
                  className="p-6 sm:p-8 rounded-3xl text-left"
                  style={{ 
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.cardBorder}`
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">Send Me a Message</h3>
                  
                  <div className="mb-4 sm:mb-6">
                    <label htmlFor="name" className="block mb-2 font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl"
                      style={{ 
                        backgroundColor: currentTheme.background,
                        border: `1px solid ${currentTheme.cardBorder}`,
                        color: currentTheme.foreground
                      }}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="mb-4 sm:mb-6">
                    <label htmlFor="email" className="block mb-2 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl"
                      style={{ 
                        backgroundColor: currentTheme.background,
                        border: `1px solid ${currentTheme.cardBorder}`,
                        color: currentTheme.foreground
                      }}
                      placeholder="Your email address"
                      required
                    />
                  </div>
                  
                  <div className="mb-6 sm:mb-8">
                    <label htmlFor="message" className="block mb-2 font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full p-4 rounded-xl resize-none"
                      style={{ 
                        backgroundColor: currentTheme.background,
                        border: `1px solid ${currentTheme.cardBorder}`,
                        color: currentTheme.foreground
                      }}
                      placeholder="Your message"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                      opacity: isSubmitting ? 0.7 : 1,
                      color: currentTheme.primaryText // Ensuring proper contrast
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </motion.form>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-4 sm:gap-6"
              >
                <a 
                  href="mailto:aliqyaan12@gmail.com"
                  className="px-8 py-6 rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-105 inline-flex items-center"
                  style={{ 
                    background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                    color: darkMode ? currentTheme.lightBgText : currentTheme.darkBgText // Dynamic contrast
                  }}
                >
                  <Mail size={18} className="mr-2" /> Email Me
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/aliqyaan-mahimwala-362568292/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-6 rounded-full border-2 hover:shadow-lg transform transition-all duration-300 hover:scale-105 inline-flex items-center hover:bg-opacity-90"
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
          className="py-8 sm:py-10 px-3 sm:px-6 border-t"
          style={{ 
            borderColor: currentTheme.cardBorder,
            backgroundColor: darkMode ? 'rgba(36, 36, 71, 0.5)' : 'rgba(254, 249, 242, 0.8)'
          }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
              <span className="font-semibold text-base sm:text-lg" style={{ color: currentTheme.primary }}>
                Aliqyaan Mahimwala
              </span>
              <span className="hidden sm:inline-block text-xs opacity-60">|</span>
              <span className="text-xs sm:text-sm opacity-70">
                © 2025 All rights reserved.
              </span>
            </div>
            <div className="flex gap-4">
              <a
                href="mailto:aliqyaan12@gmail.com"
                className="rounded-full p-2 hover:bg-opacity-80 transition"
                style={{ backgroundColor: `${currentTheme.primary}15`, color: currentTheme.primary }}
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://github.com/Hike-12"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:bg-opacity-80 transition"
                style={{ backgroundColor: `${currentTheme.primary}15`, color: currentTheme.primary }}
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/aliqyaan-mahimwala-362568292/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:bg-opacity-80 transition"
                style={{ backgroundColor: `${currentTheme.primary}15`, color: currentTheme.primary }}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Use dynamic export with no SSR to prevent hydration issues
export default dynamic(() => Promise.resolve(Index), { ssr: false });