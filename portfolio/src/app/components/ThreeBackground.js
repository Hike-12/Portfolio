"use client";
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { useEasterEggs } from './EasterEggContext';

// Track Shift key for Gravity Inversion (White Hole)
let isShiftDown = false;
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => { if (e.key === 'Shift') isShiftDown = true; });
  window.addEventListener('keyup', (e) => { if (e.key === 'Shift') isShiftDown = false; });
}

const ThreeBackground = () => {
  const { darkMode, isMounted } = useTheme();
  const { unlockEgg, unlockedEggs } = useEasterEggs();
  const threeCanvasRef = useRef(null);

  // Track dark mode across renders without triggering useEffect cleanup for animations
  const darkModeRef = useRef(darkMode);
  useLayoutEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

  const unlockEggRef = useRef(unlockEgg);
  useLayoutEffect(() => {
    unlockEggRef.current = unlockEgg;
  }, [unlockEgg]);

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

    // Stillness Gravitational Well (passive accretion well when cursor is motionless)
    let prevMouseX = 0;
    let prevMouseY = 0;
    let stillnessTimer = 0;
    let stillnessStrength = 0;
    let stillnessOrigin;
    let dispersalStrength = 0;
    let dispersalOrigin;

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
        
        stillnessOrigin = new THREE.Vector3();
        dispersalOrigin = new THREE.Vector3();
        
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
            
            // Screen space stillness tracking
            const screenDeltaX = mouseX - prevMouseX;
            const screenDeltaY = mouseY - prevMouseY;
            const screenSpeedSq = screenDeltaX * screenDeltaX + screenDeltaY * screenDeltaY;
            prevMouseX = mouseX;
            prevMouseY = mouseY;

            const isMouseMotionless = screenSpeedSq < 0.00002 && !isMouseDown;

            if (isMouseMotionless) {
              stillnessTimer++;
              stillnessOrigin.copy(mouseTarget);
              
              if (stillnessTimer > 150) { // After 2.5s of static cursor (150 frames at 60fps)
                // Collapse everything in over ~2 seconds (120 frames)
                const collapseProgress = Math.min(Math.max((stillnessTimer - 150) / 120, 0), 1.0);
                // Accelerating gravitational pull
                const targetStrength = Math.pow(collapseProgress, 1.6);
                stillnessStrength += (targetStrength - stillnessStrength) * 0.12;
              }
            } else {
              if (stillnessTimer > 150 && stillnessStrength > 0.02) {
                // Singularity ruptures & bursts outward when user moves
                dispersalOrigin.copy(stillnessOrigin);
                dispersalStrength = Math.min(1.8 + stillnessStrength * 3.5, 5.5);
              }
              stillnessTimer = 0;
              stillnessStrength *= 0.75;
            }

            // Check for a rapid flick / slash (Increased threshold so it's much less sensitive)
            if (mouseSpeedSq > 0.4 && !isMouseDown) { 
               const speed = Math.sqrt(mouseSpeedSq);
               // Trigger the vacuum wake with a softer multiplier
               shockwaveStrength = Math.min(speed * 4.0, 6.0); 
               shockwaveOrigin.copy(mouseTarget);
               shockwaveDir.set(mdx, mdy, mdz).normalize();
            }
            lastMouseWorldTarget.copy(mouseTarget);

            const positions = particlesGeometry.attributes.position.array;
            let needsUpdate = false;

            if (isMouseDown) {
              holdTimer++;
            }

            // Only trigger black hole/white hole if they hold for at least 0.5 seconds (30 frames)
            if (isMouseDown && holdTimer > 30) {
              if (holdTimer === 31) unlockEgg('black_hole');
              
              for (let i = 0; i < 12000; i++) {
                const i3 = i * 3;
                const px = positions[i3];
                const py = positions[i3 + 1];
                const pz = positions[i3 + 2];
                
                const dx = mouseTarget.x - px;
                const dy = mouseTarget.y - py;
                const dz = mouseTarget.z - pz;
                
                const distSq = dx*dx + dy*dy + dz*dz;

                if (isShiftDown) {
                  // === THE WHITE HOLE (Zero-Gravity Fluid / Bioluminescence) ===
                  const force = Math.min(1.0 / (distSq + 0.5), 0.5); 
                  
                  // 1. Gentle Anti-Gravity (softly pushes particles away from the core)
                  velocities[i3] -= dx * force * 0.004;
                  velocities[i3+1] -= dy * force * 0.004;
                  velocities[i3+2] -= dz * force * 0.004;

                  // 2. Trigonometric Vector Flow Field (Creates beautiful, organic fluid turbulence)
                  // This makes the particles dance and weave like magical embers instead of moving in straight lines
                  const time = holdTimer * 0.05;
                  const noiseX = Math.sin(py * 1.2 + time) * Math.cos(pz * 1.2);
                  const noiseY = Math.cos(pz * 1.2 + time) * Math.sin(px * 1.2);
                  const noiseZ = Math.sin(px * 1.2 + time) * Math.cos(py * 1.2);
                  
                  velocities[i3] += noiseX * 0.015;
                  velocities[i3+1] += noiseY * 0.015;
                  velocities[i3+2] += noiseZ * 0.015;

                  // 3. Ethereal Friction (Float effortlessly)
                  velocities[i3] *= 0.98;
                  velocities[i3+1] *= 0.98;
                  velocities[i3+2] *= 0.98;
                  
                  // 4. Time Dilation (Update positions at 40% speed for cinematic slow motion)
                  positions[i3] += velocities[i3] * 0.4;
                  positions[i3+1] += velocities[i3+1] * 0.4;
                  positions[i3+2] += velocities[i3+2] * 0.4;
                } else {
                  // === THE BLACK HOLE (Event Horizon) ===
                  // Weaker force for a slower, cinematic 2-second suck-in
                  const force = Math.min(1.0 / (distSq + 1.0), 0.3);
                  
                  // Gravity pull
                  velocities[i3] += dx * force * 0.015;
                  velocities[i3+1] += dy * force * 0.015;
                  velocities[i3+2] += dz * force * 0.015;
                  
                  // Swirl force (cross product)
                  velocities[i3] += dy * force * 0.05;
                  velocities[i3+1] -= dx * force * 0.05;
                  
                  // Apply shockwave
                  if (shockwaveStrength > 0.05) {
                    const s_dx = px - shockwaveOrigin.x;
                    const s_dy = py - shockwaveOrigin.y;
                    const s_dz = pz - shockwaveOrigin.z;
                    const s_distSq = s_dx*s_dx + s_dy*s_dy + s_dz*s_dz;
                    
                    if (s_distSq > 0.01 && s_distSq < 1.0) { // Small tight pop radius
                      const blast = (1.0 - s_distSq) * shockwaveStrength * 0.2;
                      velocities[i3] += (s_dx / Math.sqrt(s_distSq)) * blast;
                      velocities[i3+1] += (s_dy / Math.sqrt(s_distSq)) * blast;
                      velocities[i3+2] += (s_dz / Math.sqrt(s_distSq)) * blast;
                    }
                  }
                  
                  // Viscous friction to allow graceful spiraling
                  velocities[i3] *= 0.94;
                  velocities[i3+1] *= 0.94;
                  velocities[i3+2] *= 0.94;
                  
                  positions[i3] += velocities[i3];
                  positions[i3+1] += velocities[i3+1];
                  positions[i3+2] += velocities[i3+2];
                }
              }
              
              if (shockwaveStrength > 0.01) {
                shockwaveStrength *= 0.85; // Decay the micro-shockwave
              }
              needsUpdate = true;
            } else {
              if (shockwaveStrength > 0.01) {
                shockwaveStrength *= 0.85; // Faster decay for the slicing force, so it's a sharp burst
              }
              if (dispersalStrength > 0.01) {
                dispersalStrength *= 0.88; // Smooth dispersal decay
              }

              for (let i = 0; i < 12000; i++) {
                const i3 = i * 3;
                
                const ox = originalPosArray[i3];
                const oy = originalPosArray[i3+1];
                const oz = originalPosArray[i3+2];
                
                const px = positions[i3];
                const py = positions[i3+1];
                const pz = positions[i3+2];

                // 1. Kinetic Vacuum Wake (pulling particles INWARD from mouse flick)
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
                    
                    // The inward vacuum pull
                    const vacuum = (4.0 - s_distSq) * shockwaveStrength * 0.15;
                    
                    // The swirling fluid wake (cross product of radial vector and slice direction)
                    const swirlX = (normY * shockwaveDir.z - normZ * shockwaveDir.y);
                    const swirlY = (normZ * shockwaveDir.x - normX * shockwaveDir.z);
                    const swirlZ = (normX * shockwaveDir.y - normY * shockwaveDir.x);
                    
                    const swirlForce = vacuum * 1.5;

                    // Apply INWARD force (-normX) and swirl
                    velocities[i3] += -normX * vacuum + swirlX * swirlForce;
                    velocities[i3+1] += -normY * vacuum + swirlY * swirlForce;
                    velocities[i3+2] += -normZ * vacuum + swirlZ * swirlForce;
                  }
                }

                // 2. Stillness Singularity (Accretion Collapse: begins after 2.5s stillness, pulls everything in & holds at point)
                if (stillnessStrength > 0.01) {
                  const w_dx = stillnessOrigin.x - px;
                  const w_dy = stillnessOrigin.y - py;
                  const w_dz = stillnessOrigin.z - pz;
                  const w_distSq = w_dx * w_dx + w_dy * w_dy + w_dz * w_dz;
                  
                  // Radius expands from 2.5 to 20.0 units (engulfing the entire universe)
                  const currentRadius = 2.5 + stillnessStrength * 17.5;
                  const currentRadiusSq = currentRadius * currentRadius;
                  
                  if (w_distSq < currentRadiusSq && w_distSq > 0.0001) {
                    const w_dist = Math.sqrt(w_distSq);
                    const normX = w_dx / w_dist;
                    const normY = w_dy / w_dist;
                    const normZ = w_dz / w_dist;
                    
                    // Inward pull acceleration
                    const proximity = Math.pow(Math.max(1.0 - (w_dist / currentRadius), 0), 0.5);
                    const pullSpeed = (0.025 + stillnessStrength * 0.32) * (0.3 + proximity * 0.7);
                    
                    // Cosmic spiral as particles fall inward
                    const swirlFactor = pullSpeed * (0.8 + (1.0 - stillnessStrength) * 0.4);
                    const swirlX = -normY * swirlFactor;
                    const swirlY = normX * swirlFactor;
                    
                    velocities[i3] += normX * pullSpeed + swirlX;
                    velocities[i3+1] += normY * pullSpeed + swirlY;
                    velocities[i3+2] += normZ * pullSpeed;
                    
                    // EVENT HORIZON LOCK: Held tightly captive at that exact point!
                    if (w_dist < 0.35) {
                      // Direct core suction
                      velocities[i3] += normX * 0.035;
                      velocities[i3+1] += normY * 0.035;
                      velocities[i3+2] += normZ * 0.035;
                      
                      // Heavy core braking so they are held captive at the singularity point
                      const coreBrake = 0.55 + w_dist * 0.7;
                      velocities[i3] *= coreBrake;
                      velocities[i3+1] *= coreBrake;
                      velocities[i3+2] *= coreBrake;
                    }
                  }
                }

                // 3. Dispersal Recoil (when mouse moves after stillness)
                if (dispersalStrength > 0.02) {
                  const d_dx = px - dispersalOrigin.x;
                  const d_dy = py - dispersalOrigin.y;
                  const d_dz = pz - dispersalOrigin.z;
                  const d_distSq = d_dx * d_dx + d_dy * d_dy + d_dz * d_dz;
                  
                  // Dispersal radius reaches all particles that were pulled in
                  const dispRadius = 4.0 + dispersalStrength * 3.0;
                  const dispRadiusSq = dispRadius * dispRadius;
                  
                  if (d_distSq < dispRadiusSq && d_distSq > 0.001) {
                    const d_dist = Math.sqrt(d_distSq);
                    const push = (1.0 - d_dist / dispRadius) * dispersalStrength * 0.09;
                    
                    velocities[i3] += (d_dx / d_dist) * push;
                    velocities[i3+1] += (d_dy / d_dist) * push;
                    velocities[i3+2] += (d_dz / d_dist) * push;
                  }
                }
                
                // 4. Spring Restore Force (pulling particles back to origin smoothly without bouncing)
                const dx = ox - px;
                const dy = oy - py;
                const dz = oz - pz;
                
                if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01 || Math.abs(dz) > 0.01 || 
                    Math.abs(velocities[i3]) > 0.01 || Math.abs(velocities[i3+1]) > 0.01 || 
                    shockwaveStrength > 0.05 || stillnessStrength > 0.01 || dispersalStrength > 0.02) {
                  
                  // Suppress home spring during active stillness collapse so particles stay trapped at the point!
                  const springK = (stillnessStrength > 0.05) ? 0.0001 : 0.003;
                  velocities[i3] += dx * springK;
                  velocities[i3+1] += dy * springK;
                  velocities[i3+2] += dz * springK;
                  
                  // Damping: lower friction when active to allow spiraling, high friction when restoring
                  const friction = (stillnessStrength > 0.05) ? 0.92 : 0.82;
                  velocities[i3] *= friction;
                  velocities[i3+1] *= friction;
                  velocities[i3+2] *= friction;
                  
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
    const maxStars = 8;

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
        isPhoton: false,
        thickness: Math.random() * 0.8 + 0.8,
        tailMultiplier: Math.random() * 4 + 6
      });
    }

    window.triggerMassiveMeteorShower = () => {
      // Spawn 400 meteors all at once
      for (let i = 0; i < 400; i++) {
        // Uniform diagonal angle so they fall as a beautiful cohesive curtain
        const angle = (Math.random() * 0.2) + Math.PI / 4 + Math.PI / 8;
        // Even slower drift for increased majestic duration
        const speed = Math.random() * 1.8 + 1.2; 
        
        // Spread them wider and much higher up (up to 1.8x screen height) 
        // so the shower continues pouring in for a longer time
        const x = (Math.random() * width * 1.5) - width * 0.25;
        const y = -(Math.random() * height * 1.8) - 50; 
        
        stars.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          // Massive length so they live long enough to cross the screen
          len: Math.random() * 500 + 400,
          life: 0,
          alpha: 1,
          isPhoton: false,
          isSlowMeteor: true,
          // Varied sizes (thickness) for depth
          thickness: Math.random() * 1.8 + 0.4,
          // Varied physical tail lengths
          tailMultiplier: Math.random() * 20 + 8
        });
      }
    };

    const handleStarClick = (e) => {
      // Don't spawn star if clicking on buttons or links or inside forms/widgets
      if (e.target && (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('.fixed'))) {
        return;
      }
      spawnStar(e.clientX, e.clientY);
      if (unlockEggRef.current) {
        unlockEggRef.current('shooting_star');
      }
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

      // Render stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = darkModeRef.current ? "#fff" : "#123458";
        
        // Use the individual star's thickness if available, otherwise fallback
        ctx.lineWidth = s.thickness ? s.thickness : (s.isPhoton ? 1.5 : 1.2);
        ctx.lineCap = "round";
        
        const tailMult = s.tailMultiplier ? s.tailMultiplier : (s.isPhoton ? 2 : 8);
        
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * tailMult, s.y - s.vy * tailMult);
        ctx.stroke();
        ctx.restore();

        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;
        
        if (s.isPhoton) {
          s.alpha -= 0.03;
        } else if (s.isSlowMeteor) {
          s.alpha -= 0.001; // Fade out extremely slowly (lasts ~1000 frames)
        } else {
          s.alpha -= 0.012; // Normal shooting star fade
        }

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
    };
  }, [isMounted]); // Stable dependencies: only runs once on mount

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
