"use client";
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

const ThreeBackground = () => {
  const { darkMode, isMounted } = useTheme();
  const threeCanvasRef = useRef(null);

  // Track dark mode across renders without triggering useEffect cleanup for animations
  const darkModeRef = useRef(darkMode);
  useLayoutEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

  const updateThreeColorsRef = useRef(null);

  // Trigger color changes smoothly without rebuilding WebGL Context
  useLayoutEffect(() => {
    if (updateThreeColorsRef.current) {
      updateThreeColorsRef.current(darkMode);
    }
  }, [darkMode]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!isMounted || !threeCanvasRef.current || typeof window === 'undefined') return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationId;
    let scene, camera, renderer, particlesMesh, particlesGeometry, particlesMaterial;
    let lineMaterial, lineGeometry, lineMesh;
    let raycaster, mousePlane, mouseTarget;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event) => {
      if (event.touches && event.touches.length > 0) {
        mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    import('three').then((THREE) => {
      try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({
          canvas: threeCanvasRef.current,
          alpha: true,
          antialias: true,
          precision: 'highp',
          preserveDrawingBuffer: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 12000;
        const posArray = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
          posArray[i] = (Math.random() - 0.5) * 10;
          posArray[i + 1] = (Math.random() - 0.5) * 10;
          posArray[i + 2] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        updateThreeColorsRef.current = (isDark) => {
          const colorOptions = isDark ?
            ['#D4C9BE', '#789DBC', '#564256'] :
            ['#123458', '#789DBC', '#D4C9BE'];

          for (let i = 0; i < particlesCount * 3; i += 3) {
            const color = new THREE.Color(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
          }
          if (particlesGeometry && particlesGeometry.attributes.color) {
            particlesGeometry.attributes.color.needsUpdate = true;
          }
          if (lineMaterial) {
            // Use the dark blue for light mode, beige for dark mode
            lineMaterial.color.set(isDark ? '#d4c9be' : '#123458');
            // Scale opacity based on pixel density so it doesn't vanish on Retina displays
            const pixelRatio = window.devicePixelRatio ? Math.min(window.devicePixelRatio, 2) : 1;
            lineMaterial.opacity = 0.125 * pixelRatio;
          }
          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };

        particlesMaterial = new THREE.PointsMaterial({
          size: 0.02,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true
        });

        particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Constellation lines setup
        const initialPixelRatio = window.devicePixelRatio ? Math.min(window.devicePixelRatio, 2) : 1;
        lineMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.125 * initialPixelRatio,
          depthWrite: false
        });
        lineGeometry = new THREE.BufferGeometry();
        const maxLines = 1500;
        const linePositions = new Float32Array(maxLines * 6);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setDrawRange(0, 0);
        lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
        particlesMesh.add(lineMesh); // Share local space with particles

        raycaster = new THREE.Raycaster();
        mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        mouseTarget = new THREE.Vector3();
        
        // Apply initial colors
        updateThreeColorsRef.current(darkModeRef.current);

        camera.position.z = 4;

        const animate = () => {
          animationId = requestAnimationFrame(animate);

          if (particlesMesh) {
            const rotationSpeed = 0.0005;
            particlesMesh.rotation.x += rotationSpeed;
            particlesMesh.rotation.y += rotationSpeed;

            const mouseEffect = 0.0003;
            particlesMesh.rotation.x += mouseY * mouseEffect;
            particlesMesh.rotation.y += mouseX * mouseEffect;

            // Constellation Logic
            const mouseVec = new THREE.Vector2(mouseX, mouseY);
            raycaster.setFromCamera(mouseVec, camera);
            raycaster.ray.intersectPlane(mousePlane, mouseTarget);
            
            // Convert target to local space of particlesMesh
            particlesMesh.worldToLocal(mouseTarget);

            const positions = particlesGeometry.attributes.position.array;
            const activeIndices = [];
            const radiusSq = 1.2 * 1.2; // 1.2 units radius around mouse

            // 1. Find particles near mouse
            for (let i = 0; i < 12000; i++) {
              const px = positions[i * 3];
              const py = positions[i * 3 + 1];
              const pz = positions[i * 3 + 2];
              
              const dx = px - mouseTarget.x;
              const dy = py - mouseTarget.y;
              const dz = pz - mouseTarget.z;
              
              if (dx * dx + dy * dy + dz * dz < radiusSq) {
                activeIndices.push(i);
                if (activeIndices.length > 120) break; // performance limit
              }
            }

            // 2. Connect close particles
            let vertexCount = 0;
            const connectDistSq = 0.6 * 0.6; // Connect if closer than 0.6 units
            const linePositions = lineGeometry.attributes.position.array;

            for (let i = 0; i < activeIndices.length; i++) {
              const idxA = activeIndices[i];
              const ax = positions[idxA * 3];
              const ay = positions[idxA * 3 + 1];
              const az = positions[idxA * 3 + 2];
              
              for (let j = i + 1; j < activeIndices.length; j++) {
                const idxB = activeIndices[j];
                const bx = positions[idxB * 3];
                const by = positions[idxB * 3 + 1];
                const bz = positions[idxB * 3 + 2];
                
                const dx = ax - bx;
                const dy = ay - by;
                const dz = az - bz;
                
                if (dx*dx + dy*dy + dz*dz < connectDistSq) {
                  linePositions[vertexCount++] = ax;
                  linePositions[vertexCount++] = ay;
                  linePositions[vertexCount++] = az;
                  
                  linePositions[vertexCount++] = bx;
                  linePositions[vertexCount++] = by;
                  linePositions[vertexCount++] = bz;
                  
                  if (vertexCount >= 1500 * 6) break;
                }
              }
              if (vertexCount >= 1500 * 6) break;
            }

            lineGeometry.setDrawRange(0, vertexCount / 3);
            lineGeometry.attributes.position.needsUpdate = true;
          }

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };

        animate();

      } catch (error) {
        console.warn('Three.js initialization failed:', error);
      }
    }).catch(error => {
      console.warn('Failed to load Three.js:', error);
    });

    // Valid synchronous cleanup function returned by useEffect
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      if (particlesGeometry) particlesGeometry.dispose();
      if (particlesMaterial) particlesMaterial.dispose();
      if (lineGeometry) lineGeometry.dispose();
      if (lineMaterial) lineMaterial.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [isMounted]); // Remove darkMode from dependencies

  // Shooting stars effect
  useEffect(() => {
    if (!isMounted) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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

    const stars = [];
    const maxStars = 8;

    function spawnStar() {
      const angle = Math.random() * Math.PI / 4 + Math.PI / 8;
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
    let animationId;
    
    function animate(ts) {
      ctx.clearRect(0, 0, width, height);

      if (stars.length < maxStars && ts - lastSpawn > 2000 + Math.random() * 2000) {
        spawnStar();
        lastSpawn = ts;
      }

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = darkModeRef.current ? "#fff" : "#123458";
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

      animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMounted]); // Remove darkMode from dependencies

  return (
    <>
      <canvas
        ref={threeCanvasRef}
        className="fixed inset-0 w-full h-full z-0 opacity-40 pointer-events-none"
      />
      <canvas
        id="shooting-stars-canvas"
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      />
    </>
  );
};

export default ThreeBackground;
