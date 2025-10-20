"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Moon, Sun, ExternalLink, Code, Globe, BrainCircuit, ChevronDown, Instagram } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  SiJavascript, SiPython, SiHtml5, SiCss3,
  SiReact, SiTailwindcss, SiThreedotjs, SiWebgl,
  SiNodedotjs, SiExpress, SiDjango, SiFlask, SiFastapi,
  SiMongodb, SiMysql, SiPostgresql,
  SiGithub, SiVercel, SiRender,
  SiPandas, SiNumpy, SiDocker, SiChartdotjs
} from 'react-icons/si';
import { MdVrpano } from 'react-icons/md';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const threeCanvasRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    contact: useRef(null)
  };

  useEffect(() => { setIsMounted(true); }, []);

  const [signaturePaths, setSignaturePaths] = useState([]);
  const signatureRefs = useRef([]);
  const [signatureLengths, setSignatureLengths] = useState([]);
  const [signatureKey, setSignatureKey] = useState(0);

  useEffect(() => {
    fetch("/Aliqyaan.svg")
      .then(res => res.text())
      .then(svg => {
        const matches = [...svg.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/gi)];
        setSignaturePaths(matches.map(m => m[1]).reverse());
      });
  }, []);

  useEffect(() => {
    if (signaturePaths.length) {
      const newLengths = signatureRefs.current.slice(0, signaturePaths.length).map(ref =>
        ref ? ref.getTotalLength() : 0
      );
      setSignatureLengths(newLengths);
    }
  }, [signaturePaths]);

  useEffect(() => {
    if (!signaturePaths.length) return;
    const totalDuration = 3 + (signaturePaths.length - 1) * (3 / (signaturePaths.length || 1));
    const timeout = setTimeout(() => {
      setSignatureKey(k => k + 1);
    }, totalDuration * 1000 + 500);
    return () => clearTimeout(timeout);
  }, [signaturePaths, signatureKey]);

  const [signatureTransform, setSignatureTransform] = useState("");
  useEffect(() => {
    if (!signaturePaths.length || !signatureRefs.current[0]) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    signatureRefs.current.forEach(ref => {
      if (ref) {
        const bbox = ref.getBBox();
        minX = Math.min(minX, bbox.x);
        minY = Math.min(minY, bbox.y);
        maxX = Math.max(maxX, bbox.x + bbox.width);
        maxY = Math.max(maxY, bbox.y + bbox.height);
      }
    });
    const vbX = -1.04, vbY = 12.4, vbW = 91.2, vbH = 43.76;
    const scale = Math.min(vbW / (maxX - minX), vbH / (maxY - minY));
    const tx = vbX - minX * scale + (vbW - (maxX - minX) * scale) / 2;
    const ty = vbY - minY * scale + (vbH - (maxY - minY) * scale) / 2;
    setSignatureTransform(`translate(${tx},${ty}) scale(${scale})`);
  }, [signaturePaths, signatureKey]);

  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => setShowIntro(false), 4000);
    return () => clearTimeout(timer);
  }, [isMounted]);

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

  const theme = {
    light: {
      background: '#F1EFEC',
      foreground: '#123458',
      primary: '#123458',
      secondary: '#D4C9BE',
      accent: '#123458',
      cardBg: '#FFFFFF',
      cardBorder: '#D4C9BE',
      primaryText: '#FFFFFF',
      darkBgText: '#FFFFFF',
      lightBgText: '#123458'
    },
    dark: {
      background: '#030303',
      foreground: '#F1EFEC',
      primary: '#D4C9BE',
      secondary: '#123458',
      accent: '#D4C9BE',
      cardBg: '#0A0A0A',
      cardBorder: '#1A1A1A',
      primaryText: '#030303',
      darkBgText: '#F1EFEC',
      lightBgText: '#030303'
    }
  };
  const currentTheme = darkMode ? theme.dark : theme.light;
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    setForceUpdate(prev => prev + 1);
  };

  // Initialize Three.js scene - Only run when component is mounted on client
  useEffect(() => {
    if (!isMounted || !threeCanvasRef.current || typeof window === 'undefined') return;

    let animationId;
    let scene, camera, renderer, particlesMesh;

    import('three').then((THREE) => {
      try {
        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({
          canvas: threeCanvasRef.current,
          alpha: true,
          antialias: true,
          precision: 'highp'
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create particles - same high count for all devices
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 8000; // High performance count for all devices
        const posArray = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        // Set up particles with our theme colors
        for (let i = 0; i < particlesCount * 3; i += 3) {
          // Position
          posArray[i] = (Math.random() - 0.5) * 10;
          posArray[i + 1] = (Math.random() - 0.5) * 10;
          posArray[i + 2] = (Math.random() - 0.5) * 10;

          // Colors - convert hex to RGB
          const colorOptions = darkMode ?
            ['#D4C9BE', '#789DBC', '#564256'] :
            ['#123458', '#789DBC', '#D4C9BE'];

          const color = new THREE.Color(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
          colors[i] = color.r;
          colors[i + 1] = color.g;
          colors[i + 2] = color.b;
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

        particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
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

        // Animation loop - same performance for all devices
        const animate = () => {
          animationId = requestAnimationFrame(animate);

          if (particlesMesh) {
            // Rotate particles based on mouse position
            const rotationSpeed = 0.0005; // Same speed for all devices
            particlesMesh.rotation.x += rotationSpeed;
            particlesMesh.rotation.y += rotationSpeed;

            // Mouse effect - same for all devices
            const mouseEffect = 0.0003;
            particlesMesh.rotation.x += mouseY * mouseEffect;
            particlesMesh.rotation.y += mouseX * mouseEffect;
          }

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };

        animate();

        // Handle resize
        const handleResize = () => {
          if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);

          if (animationId) {
            cancelAnimationFrame(animationId);
          }

          // Dispose of resources
          if (particlesGeometry) particlesGeometry.dispose();
          if (particlesMaterial) particlesMaterial.dispose();
          if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
          }
        };
      } catch (error) {
        console.warn('Three.js initialization failed:', error);
      }
    }).catch(error => {
      console.warn('Failed to load Three.js:', error);
    });
  }, [darkMode, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = document.getElementById('shooting-stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resize);

    // Shooting star properties
    const stars = [];
    const maxStars = 8; // Keep it subtle

    function spawnStar() {
      const angle = Math.random() * Math.PI / 4 + Math.PI / 8; // ~22° to ~67°
      const speed = Math.random() * 8 + 6;
      const x = Math.random() * width * 0.8 + width * 0.1;
      const y = Math.random() * height * 0.2;
      stars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: Math.random() * 80 + 80,
        life: 0,
        alpha: 1
      });
    }

    let lastSpawn = 0;
    function animate(ts) {
      ctx.clearRect(0, 0, width, height);

      // Spawn new star every 1.5-3s
      if (stars.length < maxStars && ts - lastSpawn > 2000 + Math.random() * 2000) {
        spawnStar();
        lastSpawn = ts;
      }

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = darkMode ? "#fff" : "#123458";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
        ctx.stroke();
        ctx.restore();

        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;
        s.alpha -= 0.012;

        if (s.life > s.len || s.alpha <= 0) {
          stars.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    }
    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [darkMode, isMounted]);

  // Scroll observer for navigation - Only run on client
  useEffect(() => {
    if (!isMounted) return;

    // Track both visible sections and their ratios
    const visibleSections = {};

    const observer = new IntersectionObserver(
      (entries) => {
        // Update our tracking of visible sections
        entries.forEach((entry) => {
          // Store the intersection ratio for all sections (whether entering or leaving)
          visibleSections[entry.target.id] = entry.intersectionRatio;

          // Special case for projects section
          if (entry.target.id === 'projects' && entry.isIntersecting && entry.intersectionRatio > 0.05) {
            setActiveSection('projects');
            return;
          }
        });

        // Find the most visible section
        let maxRatio = 0;
        let maxSection = null;

        // Check all sections we're tracking
        Object.entries(visibleSections).forEach(([section, ratio]) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxSection = section;
          }
        });

        // Set the active section if we found one with sufficient visibility
        if (maxSection && maxRatio > 0.05) {
          setActiveSection(maxSection);
        }
      },
      {
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], // More threshold points
        rootMargin: '-80px 0px -40px 0px' // Better balanced margins
      }
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
      // Close mobile menu first
      setMenuOpen(false);

      // Use a longer timeout to ensure menu closes properly on mobile
      setTimeout(() => {
        // Get the header height for offset
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 80;

        // Calculate position with better mobile compatibility
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - 20; // Extra 20px buffer

        // Use different scroll methods for better mobile support
        if ('scrollBehavior' in document.documentElement.style) {
          // Modern browsers
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          // Fallback for older mobile browsers
          window.scrollTo(0, offsetPosition);
        }
      }, 300); // Increased timeout for mobile
    } else {
      console.error('Element not found:', sectionId);
    }
  };

  // Copy email to clipboard
  const copyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('aliqyaan12@gmail.com');
      console.log("Email copied to clipboard!");
      toast.success("Email copied to clipboard!");
    } else {
      console.error("Clipboard API not supported");
      toast.error("Failed to copy email. Please try manually.");
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
      // Try API endpoint first
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Message sent successfully!");
        toast.success("Message sent successfully! I'll get back to you soon.");
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error("API endpoint not available");
      }
    } catch (error) {
      // Fallback to mailto for mobile compatibility
      console.warn("API failed, using mailto fallback:", error);

      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoUrl = `mailto:aliqyaan12@gmail.com?subject=${subject}&body=${body}`;

      // Check if we can open mailto (works on most mobile devices)
      try {
        window.location.href = mailtoUrl;
        toast.success("Opening email app with your message!");

        // Reset form after successful mailto
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            message: ''
          });
        }, 1000);
      } catch (mailtoError) {
        // Final fallback - copy to clipboard
        const messageText = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;

        if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(messageText);
            toast.info("Message copied to clipboard! Please email it to aliqyaan12@gmail.com");
          } catch (clipboardError) {
            toast.error("Please email your message directly to aliqyaan12@gmail.com");
          }
        } else {
          toast.error("Please email your message directly to aliqyaan12@gmail.com");
        }
      }
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
      tech: ['React', 'Django', 'SqlLite', 'WebVR', 'QR Codes'],
      features: ['VR Preview', 'Chatbot', 'Real-time Booking', 'Event Management'],
      link: "https://coffee-cup-gamma.vercel.app/",
      github: 'https://github.com/Hike-12/Restaurant-Booking',
      image: '/Restaurant.png',
    },
    {
      "title": "Notes App (Scribe)",
      "description": "Real-time collaborative note-taking with rich text editing, live cursors, sharing, and PDF export. Built with React, Django, Yjs, and WebSockets.",
      "tech": ["React", "Django", "Tailwind CSS", "Quill.js", "Yjs", "WebSocket"],
      "features": ["Rich Text Editor","Real-time Collaboration","Auto-sync","Share Notes","PDF Export","Secure Authentication"],
      "github": "https://github.com/Hike-12/Notes-App",
      "link": "https://scribe-ruddy.vercel.app/",
      "image": "/Scribe.png"
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
      features: ['Webrtc','Websockets','Multi-layout UI', 'File Sharing'],
      github: 'https://github.com/Hike-12/Workspaces',
      link: 'https://focalpoint-gamma.vercel.app/',
      image: '/Focal.png'
    },
    // {
    //   title: 'Trippeer',
    //   description: 'A comprehensive travel planning platform that helps users discover destinations and create personalized itineraries with smart recommendations.',
    //   tech: ['React', 'Node.js', 'MongoDB', 'Express.js'],
    //   features: ['Destination Discovery', 'Itinerary Builder', 'Smart Recommendations', 'Travel Planning'],
    //   github: 'https://github.com/Hike-12/Certifiyo',
    //   link:'https://certifiyo.vercel.app/',
    //   image: '/Certifiyo.png'
    // },
    {
      title: 'Habitz – Habit Tracker',
      description: 'A gamified, AI-powered habit tracker with social accountability, challenges, and real-time visualizations.',
      tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Groq AI'],
      features: ['Streak Tracker', 'QR Updates', 'Habit Visualizer', 'AI Coach'],
      github: 'https://github.com/Hike-12/HackHazard',
      link: 'https://habitz-three.vercel.app/',
      image: '/HabitTracker.png'
    },
    // {
    //   title: "Healix",
    //   description: "AI-powered medical assistant and patient management platform with AI symptom checker, appointment scheduling, e-prescriptions, patient records, and real-time chat.",
    //   tech: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "OpenAI API", "Socket.io"],
    //   features: ["AI Symptom Checker", "Doctor & Patient Dashboards", "Appointment Scheduling", "E-Prescriptions", "Medical Records", "Real-time Chat", "Authentication & Roles", "OpenAI Integration"],
    //   github: "https://github.com/Hike-12/Healix",
    //   link: "https://healix-med.vercel.app/",
    //   image: "/Healix.png"
    // },
    // {
    //   title: 'E-Gurukul',
    //   description: 'AI-powered multilingual educational platform for India. Features Lyzr AI tutoring, course generation from PDFs, and support for 20+ Indian languages with intelligent Q&A system.',
    //   tech: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Lyzr AI', 'Groq API'],
    //   features: ['Lyzr AI Tutor', 'Multi-language Support', 'PDF Course Generation', 'Real-time Translation'],
    //   link: 'https://egurukul.vercel.app/',
    //   github: 'https://github.com/Hike-12/BharatAI',
    //   image: '/BharatAI.png'
    // },
  //   {
  //   title: 'InfluenceIQ',
  //   description: 'A platform built to track fake fame, recency bias, and fleeting trends in the influencer and entertainment space. Combines analytics and insights to highlight short-lived popularity.',
  //   tech: ['MongoDB', 'Express.js', 'React', 'Node.js', 'FastAPI'],
  //   features: ['Trend Analysis', 'Influencer Tracking', 'Recency Bias Metrics', 'Interactive Dashboard'],
  //   github: 'https://github.com/Hike-12/Auraflix',
  //   link: 'https://influenceiq-nine.vercel.app/',
  //   image: '/Auraflix.png'
  // },
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


  // Achievements data
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

  // Experience data (now an array)
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
    <>
      <AnimatePresence>
    {showIntro && (
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.98)]"
        style={{ background: darkMode ? "#030303" : "#F1EFEC" }}
      >
        <svg
          key={signatureKey}
          width="80vw"
          height="auto"
          viewBox="-1.04 12.4 91.2 43.76"
          fill="none"
          aria-hidden="true"
          className="max-w-[500px]"
          style={{ display: "block", background: "none" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={signatureTransform}>
            {signaturePaths.map((d, i) => (
              <path
                key={i}
                ref={el => (signatureRefs.current[i] = el)}
                d={d}
                stroke={darkMode ? "#D4C9BE" : "#123458"}
                strokeWidth={1.2 / (signatureTransform ? Number(signatureTransform.match(/scale\(([^)]+)\)/)?.[1] || 1) : 1)}
                fill="none"
                style={{
                  strokeDasharray: signatureLengths[i] || 0,
                  strokeDashoffset: signatureLengths[i] || 0,
                  animation: `draw-signature 2.2s cubic-bezier(0.77,0,0.18,1) ${i * (2.2 / (signaturePaths.length || 1))}s forwards`,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                }}
              />
            ))}
          </g>
        </svg>
        <style>{`
          @keyframes draw-signature {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </motion.div>
    )}
  </AnimatePresence>
    <div className="relative min-h-screen" style={{ backgroundColor: currentTheme.background, color: currentTheme.foreground }}>
      {/* Three.js Canvas */}
      <canvas
        ref={threeCanvasRef}
        className="fixed inset-0 w-full h-full z-0 opacity-40 pointer-events-none"
      />
      <canvas
        id="shooting-stars-canvas"
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
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
                      layoutId="desktopNavIndicator"
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
                onClick={() => {
                  setMenuOpen(!menuOpen)}}
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
                    onClick={() =>{ 
                      scrollToSection(item)}}
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
  <div className="max-w-3xl sm:max-w-5xl mx-auto w-full">
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8 sm:space-y-12"
    >
      {/* Responsive Layout Container */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-8">
        {/* Text Content - Full width on mobile, left side on desktop */}
        <div className="text-center md:text-left md:flex-1">
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4"
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

        {/* Photo - Center on mobile, right side on desktop */}
<motion.div
  variants={fadeInUp}
  className="mx-auto md:mx-0 mt-8 md:mt-0 md:flex-shrink-0 flex flex-col items-center"
>
  <div
    className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 overflow-hidden border-4 shadow-lg flex items-center justify-center"
    style={{ borderColor: currentTheme.primary }}
  >
    <div
      className="cursor-pointer"
      onClick={() => {
        setModalImage('/Me.jpg');
        setModalOpen(true);
      }}
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
                    Hey! I&apos;m Aliqyaan Mahimwala — a 19-year-old Computer Engineering student at Fr. CRCE in Bandra, Mumbai. I&apos;m a full-stack web developer who loves building clean, smooth, and user-friendly web apps that just work.
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
                    </div>
                  </div>
                </motion.div>

                <div
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
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="p-5 rounded-xl border flex items-start gap-4 cursor-pointer hover:scale-105 hover:bg-opacity-90 transition-all duration-300"
                          style={{
                            borderColor: currentTheme.cardBorder,
                            // Adding hover styles via CSS instead of onHover attribute
                            ':hover': {
                              backgroundColor: currentTheme.primary,
                              color: currentTheme.primaryText
                            }
                          }}
                        >
                          <div
                            className="p-3 rounded-lg flex items-center justify-center"
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
              viewport={{ once: true, amount: 0.1 }}
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
            className="pt-24 pb-20 px-3 sm:px-6" // Increased pt-32 for mobile
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
                        {/* Use Next.js Image */}
                        <div
                          className="cursor-pointer"
                          onClick={() => setModalOpen(true) || setModalImage(project.image)}
                        >
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            style={{ objectFit: "cover", objectPosition: "center" }}
                            onError={e => {
                              e.target.style.display = 'none';
                              e.target.parentNode.querySelector('.fallback-gradient').style.display = 'flex';
                            }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index === 0}
                          />
                        </div>
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
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          border: `1px solid ${currentTheme.cardBorder}`
                        }}
                      >
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <div
                              className="cursor-pointer"
                              onClick={() => {
                                setModalImage(exp.image);
                                setModalOpen(true);
                              }}
                            >
                            <Image src={exp.image} alt="Professional Experience" fill style={{ objectFit: "contain" }} />
                          </div>
                        </div>
                      </div>
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
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            border: `1px solid ${currentTheme.cardBorder}`
                          }}
                        >
                          <div className="flex flex-col items-center justify-center w-full h-full">
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                setModalImage(achievement.image);
                                setModalOpen(true);
                              }}
                            >
                              <Image src={achievement.image} alt={achievement.title} fill style={{ objectFit: "contain" }} />
                            </div>
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
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="text-center"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl sm:text-4xl font-bold mb-8"
              >
                Let&apos;s{" "}
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
                I&apos;m always open to discussing new opportunities, collaborations, or just having a chat about technology!
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12"
              >
                <div
                  className="p-6 sm:p-8 rounded-2xl flex flex-col items-center"
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
                  className="p-6 sm:p-8 rounded-2xl flex flex-col items-center"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.cardBorder}`
                  }}
                >
                  <Instagram size={28} style={{ color: currentTheme.primary }} className="mb-4" />
                  <h3 className="font-semibold mb-2">Instagram</h3>
                  <a
                    href="https://instagram.com/aliqyaan_12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline transition-colors"
                    style={{ color: currentTheme.primary }}
                  >
                    @aliqyaan_12
                  </a>
                </div>

                <div
                  className="p-6 sm:p-8 rounded-2xl flex flex-col items-center"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.cardBorder}`
                  }}
                >
                  <Linkedin size={28} style={{ color: currentTheme.primary }} className="mb-4" />
                  <h3 className="font-semibold mb-2">LinkedIn</h3>
                  <a
                    href="https://www.linkedin.com/in/aliqyaan-mahimwala-362568292/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline transition-colors"
                    style={{ color: currentTheme.primary }}
                  >
                    Connect with me
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
                      className="w-full p-4 rounded-xl focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: currentTheme.background,
                        border: `1px solid ${currentTheme.cardBorder}`,
                        color: currentTheme.foreground,
                        focusRingColor: currentTheme.primary
                      }}
                      placeholder="Your name"
                      required
                      autoComplete="name"
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
                      className="w-full p-4 rounded-xl focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: currentTheme.background,
                        border: `1px solid ${currentTheme.cardBorder}`,
                        color: currentTheme.foreground,
                        focusRingColor: currentTheme.primary
                      }}
                      placeholder="Your email address"
                      required
                      autoComplete="email"
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
                      className="w-full p-4 rounded-xl resize-none focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: currentTheme.background,
                        border: `1px solid ${currentTheme.cardBorder}`,
                        color: currentTheme.foreground,
                        focusRingColor: currentTheme.primary
                      }}
                      placeholder="Your message"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                      opacity: isSubmitting ? 0.7 : 1,
                      color: currentTheme.primaryText
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
                    color: darkMode ? currentTheme.lightBgText : currentTheme.darkBgText
                  }}
                >
                  <Mail size={18} className="mr-2" /> Email Me
                </a>

                <a
                  href="https://instagram.com/aliqyaan_12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-6 rounded-full border-2 hover:shadow-lg transform transition-all duration-300 hover:scale-105 inline-flex items-center hover:bg-opacity-90"
                  style={{
                    borderColor: currentTheme.primary,
                    color: currentTheme.primary
                  }}
                >
                  <Instagram size={18} className="mr-2" /> Instagram
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
                {/* Signature centered under photo */}
<div className="pt-2 flex flex-col items-center w-full">
  <svg
    key={signatureKey}
    width="100%"
    height="auto"
    viewBox="-1.04 12.4 91.2 43.76"
    fill="none"
    aria-hidden="true"
    className="max-w-28 sm:max-w-36 md:max-w-40" // smaller than before
    style={{ display: "block", background: "none" }}
    preserveAspectRatio="xMidYMid meet"
  >
    <g transform={signatureTransform}>
      {signaturePaths.map((d, i) => (
        <path
          key={i}
          ref={el => (signatureRefs.current[i] = el)}
          d={d}
          stroke={darkMode ? "#D4C9BE" : "#123458"}
          strokeWidth={0.9 / (signatureTransform ? Number(signatureTransform.match(/scale\(([^)]+)\)/)?.[1] || 1) : 1)} // thinner
          fill="none"
          style={{
            strokeDasharray: signatureLengths[i] || 0,
            strokeDashoffset: signatureLengths[i] || 0,
            animation: `draw-signature 3s cubic-bezier(0.77,0,0.18,1) ${i * (3 / (signaturePaths.length || 1))}s forwards`,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      ))}
    </g>
  </svg>
  <style>{`
    @keyframes draw-signature {
      to { stroke-dashoffset: 0; }
    }
  `}</style>
</div>
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
                href="https://instagram.com/aliqyaan_12"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:bg-opacity-80 transition"
                style={{ backgroundColor: `${currentTheme.primary}15`, color: currentTheme.primary }}
                aria-label="Instagram"
              >
                <Instagram size={18} />
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
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        style={{
          fontSize: '14px'
        }}
      />

      {modalOpen && modalImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setModalOpen(false)}
          style={{ cursor: 'zoom-out' }}
        >
          <div className="relative max-w-3xl w-full flex items-center justify-center">
            <Image
              src={modalImage}
              alt="Expanded project"
              width={900}
              height={600}
              className="rounded-2xl shadow-2xl max-h-[80vh] max-w-full object-contain"
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });