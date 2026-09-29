// Spatial 3D E-Commerce Showcase Engine
import * as THREE from 'three';
import './style.css';
import { createHeadsetModel } from './spatialModel.js';
import { createAcousticStudio } from './spatialStudio.js';
import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  const priceDisplay = document.getElementById('product-price');
  const btnExploded = document.getElementById('btn-exploded');
  const btnSoundTest = document.getElementById('btn-sound-test');
  const btnAddToCart = document.getElementById('btn-add-to-cart');

  // -------------------------------------------------------------------
  // THREE.JS SCENE SETUP
  // -------------------------------------------------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0c0806');
  scene.fog = new THREE.FogExp2('#0c0806', 0.024);

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.1, 7.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // -------------------------------------------------------------------
  // PROCEDURAL STUDIO HDR ENVIRONMENT MAP (PMREM)
  // Generates photorealistic reflections for titanium, aluminum & leather
  // -------------------------------------------------------------------
  function generateStudioEnvironment() {
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext('2d');

    // Base dark warm gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, '#1c140f');
    bgGrad.addColorStop(0.5, '#0e0a07');
    bgGrad.addColorStop(1, '#050302');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 256);

    // Overhead Key Softbox
    const softbox1 = ctx.createRadialGradient(256, 35, 5, 256, 35, 120);
    softbox1.addColorStop(0, 'rgba(255, 245, 230, 0.95)');
    softbox1.addColorStop(0.5, 'rgba(245, 180, 100, 0.45)');
    softbox1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = softbox1;
    ctx.fillRect(100, 0, 312, 140);

    // Left Rim Strip Softbox
    const softbox2 = ctx.createLinearGradient(35, 0, 110, 0);
    softbox2.addColorStop(0, 'rgba(0, 0, 0, 0)');
    softbox2.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)');
    softbox2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = softbox2;
    ctx.fillRect(35, 40, 75, 180);

    // Right Fill Softbox (Warm amber)
    const softbox3 = ctx.createLinearGradient(400, 0, 475, 0);
    softbox3.addColorStop(0, 'rgba(0, 0, 0, 0)');
    softbox3.addColorStop(0.5, 'rgba(245, 158, 11, 0.65)');
    softbox3.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = softbox3;
    ctx.fillRect(400, 40, 75, 180);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    pmremGenerator.dispose();
    envTexture.dispose();

    return envMap;
  }

  scene.environment = generateStudioEnvironment();

  // -------------------------------------------------------------------
  // PRECISION ACOUSTIC STUDIO & ARCHITECTURAL BACKGROUND
  // -------------------------------------------------------------------
  const studio = createAcousticStudio(scene);

  // -------------------------------------------------------------------
  // 3D MODEL INITIALIZATION
  // -------------------------------------------------------------------
  const { rootGroup, materials, animatedParts, setExplodedProgress } = createHeadsetModel();
  rootGroup.position.set(0, -0.15, 0);
  scene.add(rootGroup);

  // -------------------------------------------------------------------
  // STUDIO LIGHTING RIG
  // -------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff1e0, 3.4);
  keyLight.position.set(4.5, 6, 4.5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xd4b79f, 1.6);
  fillLight.position.set(-4.5, 2.5, 3.5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xf59e0b, 3.2);
  rimLight.position.set(0, 4, -4.5);
  scene.add(rimLight);

  const underLight = new THREE.PointLight(0xd97706, 1.4, 8);
  underLight.position.set(0, -1.8, 0);
  scene.add(underLight);

  const lightingPresets = {
    dark: {
      ambient: 0x2a1e16, ambientInt: 0.7,
      key: 0xffedd5, keyInt: 3.4,
      fill: 0xb89479, fillInt: 1.4,
      rim: 0xf59e0b, rimInt: 3.2,
      bg: '#0c0806'
    },
    sunset: {
      ambient: 0x452312, ambientInt: 0.9,
      key: 0xf59e0b, keyInt: 4.2,
      fill: 0xd97706, fillInt: 2.0,
      rim: 0xfde68a, rimInt: 3.8,
      bg: '#140b07'
    },
    cyber: {
      ambient: 0x081c24, ambientInt: 0.8,
      key: 0x06b6d4, keyInt: 3.8,
      fill: 0xa855f7, fillInt: 2.4,
      rim: 0xec4899, rimInt: 4.0,
      bg: '#070710'
    },
    studio: {
      ambient: 0xffffff, ambientInt: 1.3,
      key: 0xffffff, keyInt: 2.8,
      fill: 0xdddddd, fillInt: 1.6,
      rim: 0xffffff, rimInt: 2.0,
      bg: '#121214'
    }
  };

  function applyLightingPreset(name) {
    const p = lightingPresets[name] || lightingPresets.dark;
    ambientLight.color.setHex(p.ambient);
    ambientLight.intensity = p.ambientInt;
    keyLight.color.setHex(p.key);
    keyLight.intensity = p.keyInt;
    fillLight.color.setHex(p.fill);
    fillLight.intensity = p.fillInt;
    rimLight.color.setHex(p.rim);
    rimLight.intensity = p.rimInt;
    scene.background = new THREE.Color(p.bg);
    scene.fog.color = new THREE.Color(p.bg);
    studio.applyStudioLighting(name);
  }

  // -------------------------------------------------------------------
  // CAMERA ORBIT CONTROLLER (SMOOTH INERTIA & TOUCH)
  // -------------------------------------------------------------------
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };
  let spherical = { radius: 7.2, theta: 0.15, phi: Math.PI / 2.05 };
  let targetSpherical = { ...spherical };
  let isAutoRotate = true;
  let targetLookAt = new THREE.Vector3(0, -0.15, 0);
  let currentLookAt = new THREE.Vector3(0, -0.15, 0);

  // Parallax normalized mouse coordinates (-1 to 1)
  let normMouseX = 0;
  let normMouseY = 0;

  function updateCamera() {
    spherical.radius += (targetSpherical.radius - spherical.radius) * 0.08;
    spherical.theta += (targetSpherical.theta - spherical.theta) * 0.08;
    spherical.phi += (targetSpherical.phi - spherical.phi) * 0.08;

    spherical.phi = Math.max(0.12, Math.min(Math.PI - 0.22, spherical.phi));
    spherical.radius = Math.max(3.8, Math.min(9.8, spherical.radius));

    camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
    camera.position.y = spherical.radius * Math.cos(spherical.phi);
    camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);

    currentLookAt.lerp(targetLookAt, 0.08);
    camera.lookAt(currentLookAt);
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    isAutoRotate = false;
    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    normMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    normMouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    if (!isDragging) return;
    const deltaX = e.clientX - prevMousePos.x;
    const deltaY = e.clientY - prevMousePos.y;
    prevMousePos = { x: e.clientX, y: e.clientY };

    targetSpherical.theta -= deltaX * 0.007;
    targetSpherical.phi -= deltaY * 0.007;
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      isAutoRotate = false;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePos.x;
    const deltaY = e.touches[0].clientY - prevMousePos.y;
    prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    targetSpherical.theta -= deltaX * 0.008;
    targetSpherical.phi -= deltaY * 0.008;
  }, { passive: true });

  // Wheel Zoom
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetSpherical.radius += e.deltaY * 0.004;
    targetSpherical.radius = Math.max(4.0, Math.min(9.2, targetSpherical.radius));
  }, { passive: false });

  // -------------------------------------------------------------------
  // PBR MATERIAL & SMOOTH COLOR INTERPOLATION CONTROLLER
  // -------------------------------------------------------------------
  const colorPresets = {
    mocha: {
      name: 'Mocha & Bronze (Signature)',
      price: 389,
      headband: '#38281e',
      canopy: '#19110b',
      chassis: '#261a13',
      chamfer: '#e0a96d',
      cushion: '#150d09',
      halo: '#f59e0b',
      driver: '#eab308'
    },
    obsidian: {
      name: 'Midnight Obsidian & Gold',
      price: 429,
      headband: '#18181b',
      canopy: '#09090b',
      chassis: '#121214',
      chamfer: '#fbbf24',
      cushion: '#09090b',
      halo: '#fde68a',
      driver: '#f59e0b'
    },
    silver: {
      name: 'Nordic Silver & Frost White',
      price: 369,
      headband: '#9ca3af',
      canopy: '#e5e7eb',
      chassis: '#d1d5db',
      chamfer: '#e2e8f0',
      cushion: '#f3f4f6',
      halo: '#38bdf8',
      driver: '#38bdf8'
    },
    crimson: {
      name: 'Cyber Crimson & Stealth',
      price: 419,
      headband: '#1f1418',
      canopy: '#0f080b',
      chassis: '#4c0519',
      chamfer: '#fbbf24',
      cushion: '#270811',
      halo: '#ef4444',
      driver: '#f43f5e'
    }
  };

  // Target Colors for Smooth Real-Time Cross-Fading
  const targetColors = {
    headband: new THREE.Color('#38281e'),
    canopy: new THREE.Color('#19110b'),
    chassis: new THREE.Color('#261a13'),
    chamfer: new THREE.Color('#e0a96d'),
    cushion: new THREE.Color('#150d09'),
    halo: new THREE.Color('#f59e0b'),
    driver: new THREE.Color('#eab308')
  };

  function applyPreset(presetKey) {
    const p = colorPresets[presetKey] || colorPresets.mocha;
    priceDisplay.textContent = `$${p.price}`;

    targetColors.headband.set(p.headband);
    targetColors.canopy.set(p.canopy);
    targetColors.chassis.set(p.chassis);
    targetColors.chamfer.set(p.chamfer);
    targetColors.cushion.set(p.cushion);
    targetColors.halo.set(p.halo);
    targetColors.driver.set(p.driver);
  }

  // -------------------------------------------------------------------
  // KINEMATIC EXPLODED VIEW
  // -------------------------------------------------------------------
  let isExploded = false;
  let explodedProgress = 0;
  let targetExplodedProgress = 0;

  function toggleExploded() {
    isExploded = !isExploded;
    targetExplodedProgress = isExploded ? 1.0 : 0.0;
    btnExploded.classList.toggle('bg-amber-500', isExploded);
    btnExploded.classList.toggle('text-stone-950', isExploded);
    btnExploded.classList.toggle('font-bold', isExploded);
    btnExploded.textContent = isExploded ? 'Assemble 🔄' : 'Exploded View 💥';

    if (isExploded) {
      isAutoRotate = false;
    }
  }

  btnExploded.addEventListener('click', toggleExploded);

  // -------------------------------------------------------------------
  // WEB AUDIO SYNTHESIZER & REAL-TIME AUDIO REACTIVITY
  // -------------------------------------------------------------------
  let audioCtx = null;
  let isPlayingAudio = false;
  let audioInterval = null;
  let audioAnalyser = null;
  let audioDataArray = null;

  function toggleAudioTest() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      audioAnalyser = audioCtx.createAnalyser();
      audioAnalyser.fftSize = 64;
      audioDataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlayingAudio = !isPlayingAudio;
    btnSoundTest.classList.toggle('bg-emerald-500', isPlayingAudio);
    btnSoundTest.classList.toggle('text-stone-950', isPlayingAudio);
    btnSoundTest.classList.toggle('font-bold', isPlayingAudio);
    btnSoundTest.textContent = isPlayingAudio ? 'Playing Sound 🔊' : 'Sound Test 🎵';

    if (isPlayingAudio) {
      startSynthBeat();
    } else {
      stopSynthBeat();
    }
  }

  function startSynthBeat() {
    let step = 0;
    audioInterval = setInterval(() => {
      if (!isPlayingAudio || !audioCtx) return;
      const now = audioCtx.currentTime;

      // Punchy Bass Kick
      if (step % 2 === 0) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(28, now + 0.22);
        gain.gain.setValueAtTime(0.85, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(audioAnalyser);
        audioAnalyser.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }

      // Crisp Hi-Hat
      const hiOsc = audioCtx.createOscillator();
      const hiGain = audioCtx.createGain();
      hiOsc.type = 'highpass';
      hiOsc.frequency.setValueAtTime(8000, now);
      hiGain.gain.setValueAtTime(0.09, now);
      hiGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      hiOsc.connect(hiGain);
      hiGain.connect(audioCtx.destination);
      hiOsc.start(now);
      hiOsc.stop(now + 0.07);

      // Warm Ambient Chord
      if (step === 0) {
        [220, 277.18, 329.63, 415.30].forEach(freq => {
          const chordOsc = audioCtx.createOscillator();
          const chordGain = audioCtx.createGain();
          chordOsc.type = 'sine';
          chordOsc.frequency.setValueAtTime(freq, now);
          chordGain.gain.setValueAtTime(0.12, now);
          chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          chordOsc.connect(chordGain);
          chordGain.connect(audioCtx.destination);
          chordOsc.start(now);
          chordOsc.stop(now + 0.85);
        });
      }

      step = (step + 1) % 4;
    }, 280);
  }

  function stopSynthBeat() {
    if (audioInterval) clearInterval(audioInterval);
  }

  btnSoundTest.addEventListener('click', toggleAudioTest);

  // Add to Cart
  btnAddToCart.addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    confetti({
      particleCount: 55,
      spread: 75,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#f59e0b', '#d97706', '#b45309', '#fde68a', '#ffffff']
    });

    const origText = btnAddToCart.querySelector('span').textContent;
    btnAddToCart.querySelector('span').textContent = 'Added! ✓';
    btnAddToCart.classList.add('from-emerald-500', 'to-teal-600');
    setTimeout(() => {
      btnAddToCart.querySelector('span').textContent = origText;
      btnAddToCart.classList.remove('from-emerald-500', 'to-teal-600');
    }, 2500);
  });

  // -------------------------------------------------------------------
  // UI EVENT BINDINGS
  // -------------------------------------------------------------------
  // Presets
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('ring-2', 'ring-amber-400'));
      const target = e.currentTarget;
      target.classList.add('ring-2', 'ring-amber-400');
      applyPreset(target.getAttribute('data-preset'));
    });
  });

  // Lighting Presets
  document.querySelectorAll('.light-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.light-preset-btn').forEach(b => {
        b.classList.remove('bg-amber-500', 'text-stone-950', 'font-bold');
        b.classList.add('bg-[#1c130d]', 'text-stone-300');
      });
      const target = e.currentTarget;
      target.classList.remove('bg-[#1c130d]', 'text-stone-300');
      target.classList.add('bg-amber-500', 'text-stone-950', 'font-bold');
      applyLightingPreset(target.getAttribute('data-light'));
    });
  });

  // -------------------------------------------------------------------
  // ANIMATION LOOP WITH DYNAMIC SOUND REACTIVITY & ANTIGRAVITY MOTION
  // -------------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    if (isAutoRotate) {
      targetSpherical.theta += delta * 0.35;
    }

    // Kinematic Exploded View Smooth Lerp
    explodedProgress += (targetExplodedProgress - explodedProgress) * 0.08;
    setExplodedProgress(explodedProgress);

    // Smooth Material Color Interpolation
    materials.headband.color.lerp(targetColors.headband, 0.08);
    materials.canopy.color.lerp(targetColors.canopy, 0.08);
    materials.chassis.color.lerp(targetColors.chassis, 0.08);
    materials.chamfer.color.lerp(targetColors.chamfer, 0.08);
    materials.cushion.color.lerp(targetColors.cushion, 0.08);
    materials.ledHalo.color.lerp(targetColors.halo, 0.08);
    materials.ledHalo.emissive.lerp(targetColors.halo, 0.08);
    materials.driver.color.lerp(targetColors.driver, 0.08);
    if (materials.knurl) {
      materials.knurl.color.lerp(targetColors.chamfer, 0.08);
    }

    // Antigravity Floating Bobbing & Multi-Axis Sway
    rootGroup.position.y = -0.15 + Math.sin(elapsedTime * 1.6) * 0.08;
    rootGroup.rotation.z = Math.sin(elapsedTime * 1.1) * 0.025;
    rootGroup.rotation.x = Math.cos(elapsedTime * 0.8) * 0.02;

    // Interactive Parallax Steering (gently follows mouse when not dragging)
    if (!isDragging) {
      const targetRotY = (normMouseX * 0.22);
      const targetRotX = (-normMouseY * 0.14);
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.05;
    }

    // Real-Time Audio Reactivity
    let bassEnergy = 0;
    let avgFreq = 0;

    if (isPlayingAudio && audioAnalyser) {
      audioAnalyser.getByteFrequencyData(audioDataArray);
      for (let i = 0; i < audioDataArray.length; i++) {
        avgFreq += audioDataArray[i];
      }
      avgFreq /= audioDataArray.length;

      // Low frequency bass energy for transducer diaphragm excursions
      bassEnergy = ((audioDataArray[0] + audioDataArray[1] + audioDataArray[2]) / 3) / 255;
      const beatIntensity = (avgFreq / 255) * 2.8;

      // Pulsing LED Halo
      materials.ledHalo.emissiveIntensity = 1.6 + beatIntensity * 3.5;

      // Physical Diaphragm Bass Thump Excursion (Visual Vibration)
      if (animatedParts.leftDiaphragm && animatedParts.rightDiaphragm) {
        const excursion = 1.0 + bassEnergy * 0.32;
        animatedParts.leftDiaphragm.scale.set(excursion, excursion, 1 + bassEnergy * 0.45);
        animatedParts.rightDiaphragm.scale.set(excursion, excursion, 1 + bassEnergy * 0.45);
      }

      // Subtle physical kick oscillation on earcups
      if (animatedParts.leftEarcupGroup && animatedParts.rightEarcupGroup) {
        animatedParts.leftEarcupGroup.position.x = -bassEnergy * 0.035;
        animatedParts.rightEarcupGroup.position.x = bassEnergy * 0.035;
      }

      // Rotary Digital Crown Spin while playing
      if (animatedParts.digitalCrown) {
        animatedParts.digitalCrown.rotation.x += delta * (2.2 + bassEnergy * 5.0);
      }
    } else {
      // Idle reset
      materials.ledHalo.emissiveIntensity = 1.8 + Math.sin(elapsedTime * 2.2) * 0.4;
      if (animatedParts.leftDiaphragm && animatedParts.rightDiaphragm) {
        animatedParts.leftDiaphragm.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        animatedParts.rightDiaphragm.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
      if (animatedParts.leftEarcupGroup && animatedParts.rightEarcupGroup) {
        animatedParts.leftEarcupGroup.position.x *= 0.9;
        animatedParts.rightEarcupGroup.position.x *= 0.9;
      }
    }

    // Dynamic Studio Background & Waves Update
    studio.updateStudio(delta, elapsedTime, isPlayingAudio, bassEnergy, avgFreq);

    updateCamera();
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
});

