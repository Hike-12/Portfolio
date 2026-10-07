"use client";
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { useEasterEggs } from './EasterEggContext';

// Communication bridge between 3D canvas and 2D particle canvas
let triggerAnnihilationFn = null;

const ThreeBackground = () => {
  const { darkMode, isMounted } = useTheme();
  const { unlockEgg } = useEasterEggs();
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
    let isMouseDown = false;
    let holdTimer = 0;
    
    // Shockwave tracking
    let lastMouseWorldTarget;
    let shockwaveStrength = 0;
    let shockwaveOrigin;
    let shockwaveDir;

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

    const handleMouseDown = () => { 
      isMouseDown = true;
      holdTimer = 0;
    };
    const handleMouseUp = () => { 
      isMouseDown = false;
    };

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleMouseDown, { passive: true });
    window.addEventListener('touchend', handleMouseUp);
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
        const originalPosArray = new Float32Array(particlesCount * 3);
        const velocities = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
          const x = (Math.random() - 0.5) * 10;
          const y = (Math.random() - 0.5) * 10;
          const z = (Math.random() - 0.5) * 10;
          
          posArray[i] = x;
          posArray[i + 1] = y;
          posArray[i + 2] = z;
          
          originalPosArray[i] = x;
          originalPosArray[i + 1] = y;
          originalPosArray[i + 2] = z;
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
        
        lastMouseWorldTarget = new THREE.Vector3();
        shockwaveOrigin = new THREE.Vector3();
        shockwaveDir = new THREE.Vector3();
        
        // Apply initial colors
        updateThreeColorsRef.current(darkModeRef.current);

        camera.position.z = 4;

        let lastScrollY = window.scrollY;
        let scrollMomentum = 0;

        const animate = () => {
          animationId = requestAnimationFrame(animate);

          if (particlesMesh) {
            const currentScrollY = window.scrollY;
            const deltaY = Math.abs(currentScrollY - lastScrollY);
            lastScrollY = currentScrollY;

            // Flywheel momentum: absorb chunky scroll ticks and smoothly decay
            scrollMomentum += deltaY;
            scrollMomentum *= 0.92; // 0.92 gives a buttery smooth slow-down

            // Base speed is 0.0005. Cap max bonus speed at 0.005 (10x speed)
            const rotationSpeed = 0.0005 + Math.min(scrollMomentum * 0.00004, 0.005);

            particlesMesh.rotation.x += rotationSpeed;
            particlesMesh.rotation.y += rotationSpeed * 1.5;

            const mouseEffect = 0.0003;
            particlesMesh.rotation.x += mouseY * mouseEffect;
            particlesMesh.rotation.y += mouseX * mouseEffect;

            // Constellation Logic
            const mouseVec = new THREE.Vector2(mouseX, mouseY);
            raycaster.setFromCamera(mouseVec, camera);
            raycaster.ray.intersectPlane(mousePlane, mouseTarget);
            
            // Convert target to local space of particlesMesh
            particlesMesh.worldToLocal(mouseTarget);

            // Compute mouse velocity for the Kinetic Flare
            const mdx = mouseTarget.x - lastMouseWorldTarget.x;
            const mdy = mouseTarget.y - lastMouseWorldTarget.y;
            const mdz = mouseTarget.z - lastMouseWorldTarget.z;
            const mouseSpeedSq = mdx*mdx + mdy*mdy + mdz*mdz;
            
            // Check for a rapid flick / slash (> 0.05 velocity sq)
            if (mouseSpeedSq > 0.05 && !isMouseDown) { 
               const speed = Math.sqrt(mouseSpeedSq);
               // Trigger the flare and cap max force
               shockwaveStrength = Math.min(speed * 8.0, 12.0); // Make the initial hit much harder
               shockwaveOrigin.copy(mouseTarget);
               shockwaveDir.set(mdx, mdy, mdz).normalize();
            }
            lastMouseWorldTarget.copy(mouseTarget);

            const positions = particlesGeometry.attributes.position.array;
            let needsUpdate = false;

            if (isMouseDown) {
              holdTimer++;
            }

            // Only trigger black hole if they hold for at least 0.5 seconds (30 frames)
            if (isMouseDown && holdTimer > 30) {
              if (holdTimer === 31) unlockEgg('black_hole');
              
              let annihilationTriggered = false;
              
              for (let i = 0; i < 12000; i++) {
                const i3 = i * 3;
                const px = positions[i3];
                const py = positions[i3 + 1];
                const pz = positions[i3 + 2];
                
                const dx = mouseTarget.x - px;
                const dy = mouseTarget.y - py;
                const dz = mouseTarget.z - pz;
                
                const distSq = dx*dx + dy*dy + dz*dz;

                // Antimatter Annihilation Trigger
                // If a particle gets critically close to the singularity, 15% chance per frame to annihilate
                if (distSq < 0.05 && !annihilationTriggered && Math.random() < 0.15) {
                  annihilationTriggered = true;
                  
                  if (triggerAnnihilationFn) {
                    // We already know the 2D cursor position from mouseX and mouseY!
                    const screenX = (mouseX * 0.5 + 0.5) * window.innerWidth;
                    const screenY = (-mouseY * 0.5 + 0.5) * window.innerHeight;
                    
                    triggerAnnihilationFn(screenX, screenY);
                  }
                }

                // Weaker force for a slower, cinematic 2-second suck-in
                const force = Math.min(1.0 / (distSq + 1.0), 0.3);
                
                // Gravity pull
                velocities[i3] += dx * force * 0.015;
                velocities[i3+1] += dy * force * 0.015;
                velocities[i3+2] += dz * force * 0.015;
                
                // Swirl force (cross product)
                velocities[i3] += dy * force * 0.05;
                velocities[i3+1] -= dx * force * 0.05;
                
                // Gentler friction to allow graceful spiraling
                velocities[i3] *= 0.94;
                velocities[i3+1] *= 0.94;
                velocities[i3+2] *= 0.94;
                
                positions[i3] += velocities[i3];
                positions[i3+1] += velocities[i3+1];
                positions[i3+2] += velocities[i3+2];
              }
              needsUpdate = true;
            } else {
              if (shockwaveStrength > 0.01) {
                shockwaveStrength *= 0.85; // Faster decay for the slicing force, so it's a sharp burst
              }

              for (let i = 0; i < 12000; i++) {
                const i3 = i * 3;
                
                const ox = originalPosArray[i3];
                const oy = originalPosArray[i3+1];
                const oz = originalPosArray[i3+2];
                
                const px = positions[i3];
                const py = positions[i3+1];
                const pz = positions[i3+2];

                // 1. Kinetic Flare Force (blasting particles away from mouse flick)
                if (shockwaveStrength > 0.05) {
                  const s_dx = px - shockwaveOrigin.x;
                  const s_dy = py - shockwaveOrigin.y;
                  const s_dz = pz - shockwaveOrigin.z;
                  const s_distSq = s_dx*s_dx + s_dy*s_dy + s_dz*s_dz;
                  
                  if (s_distSq > 0.01 && s_distSq < 4.0) { // Larger interaction bubble
                    const s_dist = Math.sqrt(s_distSq);
                    const normX = s_dx / s_dist;
                    const normY = s_dy / s_dist;
                    const normZ = s_dz / s_dist;
                    
                    // The outward radial blast
                    const blast = (4.0 - s_distSq) * shockwaveStrength * 0.15;
                    
                    // The swirling fluid wake (cross product of radial vector and slice direction)
                    // (cross product: X = y1*z2 - z1*y2, Y = z1*x2 - x1*z2, Z = x1*y2 - y1*x2)
                    const swirlX = (normY * shockwaveDir.z - normZ * shockwaveDir.y);
                    const swirlY = (normZ * shockwaveDir.x - normX * shockwaveDir.z);
                    const swirlZ = (normX * shockwaveDir.y - normY * shockwaveDir.x);
                    
                    const swirlForce = blast * 1.5;

                    velocities[i3] += normX * blast + swirlX * swirlForce;
                    velocities[i3+1] += normY * blast + swirlY * swirlForce;
                    velocities[i3+2] += normZ * blast + swirlZ * swirlForce;
                  }
                }
                
                // 2. Spring Restore Force (pulling particles back to origin smoothly without bouncing)
                const dx = ox - px;
                const dy = oy - py;
                const dz = oz - pz;
                
                if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01 || Math.abs(dz) > 0.01 || 
                    Math.abs(velocities[i3]) > 0.01 || Math.abs(velocities[i3+1]) > 0.01 || shockwaveStrength > 0.05) {
                  
                  // Extremely soft spring so they float back like zero gravity
                  velocities[i3] += dx * 0.003;
                  velocities[i3+1] += dy * 0.003;
                  velocities[i3+2] += dz * 0.003;
                  
                  // High friction so they don't bounce (overdamped fluid feel)
                  velocities[i3] *= 0.82; 
                  velocities[i3+1] *= 0.82;
                  velocities[i3+2] *= 0.82;
                  
                  positions[i3] += velocities[i3];
                  positions[i3+1] += velocities[i3+1];
                  positions[i3+2] += velocities[i3+2];
                  
                  needsUpdate = true;
                } else {
                  positions[i3] = ox;
                  positions[i3+1] = oy;
                  positions[i3+2] = oz;
                  velocities[i3] = 0;
                  velocities[i3+1] = 0;
                  velocities[i3+2] = 0;
                }
              }
            }

            if (needsUpdate) {
              particlesGeometry.attributes.position.needsUpdate = true;
            }

            const activeIndices = [];
            const radiusSq = 1.2 * 1.2;

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
            const connectDistSq = 0.6 * 0.6; 
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
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchend', handleMouseUp);
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
    const flashes = [];
    const maxStars = 8;

    triggerAnnihilationFn = (originX, originY) => {
      // 1. A subtle, glowing ethereal pop
      flashes.push({ 
        x: originX, 
        y: originY, 
        radius: 0, 
        maxRadius: 30 + Math.random() * 20, // Much smaller, organic sizes
        alpha: 0.6 + Math.random() * 0.3 // Not fully opaque
      });
      
      // 2. The two opposing high-speed photon streaks (finer, more delicate)
      const angle = Math.random() * Math.PI * 2;
      const speed = 12 + Math.random() * 6; // Fast but not jarring
      
      stars.push({
        x: originX, y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 40 + Math.random() * 30, life: 0, alpha: 0.8, isPhoton: true
      });
      stars.push({
        x: originX, y: originY,
        vx: Math.cos(angle + Math.PI) * speed,
        vy: Math.sin(angle + Math.PI) * speed,
        len: 40 + Math.random() * 30, life: 0, alpha: 0.8, isPhoton: true
      });
    };

    function spawnStar(originX, originY) {
      const isClick = originX !== undefined;
      // If clicked, shoot in any direction. Otherwise, fall diagonally.
      const angle = isClick ? (Math.random() * Math.PI * 2) : (Math.random() * Math.PI / 4 + Math.PI / 8);
      const speed = Math.random() * 8 + 6;
      
      const x = isClick ? originX : (Math.random() * width * 0.8 + width * 0.1);
      const y = isClick ? originY : (Math.random() * height * 0.2);
      
      stars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: Math.random() * 80 + 80,
        life: 0,
        alpha: 1,
        isPhoton: false
      });
    }

    const handleStarClick = (e) => {
      spawnStar(e.clientX, e.clientY);
      unlockEgg('shooting_star');
    };

    window.addEventListener('click', handleStarClick);

    let lastSpawn = 0;
    let animationId;
    
    function animate(ts) {
      ctx.clearRect(0, 0, width, height);

      if (stars.length < maxStars && ts - lastSpawn > 2000 + Math.random() * 2000) {
        spawnStar();
        lastSpawn = ts;
      }

      // Render flashes (soft radial glows)
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        if (f.radius > 0.1) {
          ctx.save();
          const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
          const color = darkModeRef.current ? '255, 255, 255' : '18, 52, 88'; // #ffffff or #123458
          
          gradient.addColorStop(0, `rgba(${color}, ${f.alpha})`);
          gradient.addColorStop(0.4, `rgba(${color}, ${f.alpha * 0.5})`);
          gradient.addColorStop(1, `rgba(${color}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        f.radius += (f.maxRadius - f.radius) * 0.15; // Smooth easing
        f.alpha -= 0.03;

        if (f.alpha <= 0) {
          flashes.splice(i, 1);
        }
      }

      // Render stars & photons
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = darkModeRef.current ? "#fff" : "#123458";
        ctx.lineWidth = s.isPhoton ? 1.5 : 1.2;
        ctx.lineCap = "round";
        
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * (s.isPhoton ? 2 : 8), s.y - s.vy * (s.isPhoton ? 2 : 8));
        ctx.stroke();
        ctx.restore();

        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;
        s.alpha -= s.isPhoton ? 0.03 : 0.012;

        if (s.life > s.len || s.alpha <= 0) {
          stars.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleStarClick);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      triggerAnnihilationFn = null;
    };
  }, [isMounted, unlockEgg]); // Remove darkMode from dependencies

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
