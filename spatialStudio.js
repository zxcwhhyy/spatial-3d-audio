import * as THREE from 'three';

/**
 * Spatial-X1: Precision Acoustic Studio & Architectural Stage
 * Features:
 * - Multi-tiered precision turntable stage with 360° azimuth graduation marks & acoustic calibration tracks
 * - Curved acoustic sound diffuser slat wall (architectural vertical louvers with Schroeder depth variation)
 * - Cylindrical studio cyclorama backdrop with warm horizon backlight gradient
 * - Sound-reactive floor acoustic wavefront ripples (pulsing in sync with audio kick frequencies)
 * - Atmospheric floating studio dust motes (illuminated volumetric micro-particles drifting in key light)
 * - Cohesive integration with Studio Lighting Presets (Dark, Sunset, Cyber, Studio)
 */

// 1. Procedural 360° Turntable Calibration Disk Texture
function createTurntableCalibrationTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Dark slate/graphite base
  const bgGrad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
  bgGrad.addColorStop(0, '#1c1510');
  bgGrad.addColorStop(0.7, '#130d09');
  bgGrad.addColorStop(1, '#0b0705');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Concentric brushed metal tracks
  ctx.strokeStyle = 'rgba(224, 169, 109, 0.12)';
  ctx.lineWidth = 1.5;
  for (let r = 80; r < 500; r += 28) {
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Major Acoustic Calibration Rings
  [210, 320, 420, 480].forEach(r => {
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 360° Azimuth Compass Degree Ticks and Labels
  ctx.font = 'bold 16px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(224, 169, 109, 0.85)';
  ctx.strokeStyle = 'rgba(224, 169, 109, 0.7)';

  for (let deg = 0; deg < 360; deg += 5) {
    const rad = (deg * Math.PI) / 180;
    const isMajor = deg % 30 === 0;
    const isMedium = deg % 15 === 0;

    const tickLen = isMajor ? 28 : (isMedium ? 18 : 10);
    const rOuter = 490;
    const rInner = rOuter - tickLen;

    const x1 = 512 + Math.cos(rad) * rInner;
    const y1 = 512 + Math.sin(rad) * rInner;
    const x2 = 512 + Math.cos(rad) * rOuter;
    const y2 = 512 + Math.sin(rad) * rOuter;

    ctx.lineWidth = isMajor ? 3 : (isMedium ? 2 : 1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Degree numbers on major marks
    if (isMajor) {
      const textRadius = 445;
      const tx = 512 + Math.cos(rad) * textRadius;
      const ty = 512 + Math.sin(rad) * textRadius;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(rad + Math.PI / 2);
      ctx.fillText(`${deg}°`, 0, 0);
      ctx.restore();
    }
  }

  // Circular Laser-Etched Text Ring
  const ringText = '• SPATIAL-X1 // ANECHOIC REFERENCE STAGE • ISO-3745 CERTIFIED • 360° ROTATIONAL AZIMUTH • 5Hz - 48kHz LAB •';
  const ringRadius = 265;
  const chars = ringText.split('');
  const totalAngle = Math.PI * 2;
  const angleStep = totalAngle / chars.length;

  ctx.font = '600 15px "Fira Code", monospace';
  ctx.fillStyle = 'rgba(245, 158, 11, 0.55)';

  for (let i = 0; i < chars.length; i++) {
    const ang = i * angleStep - Math.PI / 2;
    ctx.save();
    ctx.translate(512 + Math.cos(ang) * ringRadius, 512 + Math.sin(ang) * ringRadius);
    ctx.rotate(ang + Math.PI / 2);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  }

  // Center alignment crosshairs
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(512 - 70, 512);
  ctx.lineTo(512 + 70, 512);
  ctx.moveTo(512, 512 - 70);
  ctx.lineTo(512, 512 + 70);
  ctx.stroke();

  // Center gold hub circle
  const hubGrad = ctx.createRadialGradient(512, 512, 5, 512, 512, 40);
  hubGrad.addColorStop(0, '#f59e0b');
  hubGrad.addColorStop(0.7, '#b45309');
  hubGrad.addColorStop(1, '#1c1510');
  ctx.fillStyle = hubGrad;
  ctx.beginPath();
  ctx.arc(512, 512, 35, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 2. Procedural Cyclorama Backdrop Gradient Texture
function createCycloramaBackdropTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Vertical atmospheric horizon gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0a0604');       // Dark ceiling
  grad.addColorStop(0.45, '#120b08');    // Mid shadow
  grad.addColorStop(0.75, '#26160d');    // Warm horizon glow
  grad.addColorStop(0.92, '#1a0e08');    // Stage floor transition
  grad.addColorStop(1, '#0c0806');       // Base
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft horizontal ambient haze
  const haze = ctx.createRadialGradient(256, 380, 20, 256, 380, 260);
  haze.addColorStop(0, 'rgba(217, 119, 6, 0.25)');
  haze.addColorStop(0.6, 'rgba(180, 83, 9, 0.12)');
  haze.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 200, 512, 312);

  return new THREE.CanvasTexture(canvas);
}

// 3. Circular Soft Glow Sprite Texture for Dust Motes
function createDustParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 240, 210, 1.0)');
  grad.addColorStop(0.35, 'rgba(245, 158, 11, 0.7)');
  grad.addColorStop(0.7, 'rgba(180, 83, 9, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

export function createAcousticStudio(scene) {
  const studioGroup = new THREE.Group();
  studioGroup.name = 'Spatial_AcousticStudio';
  scene.add(studioGroup);

  // -------------------------------------------------------------------
  // 1. MULTI-TIERED PRECISION TURNTABLE STAGE
  // -------------------------------------------------------------------
  const stageGroup = new THREE.Group();
  stageGroup.position.y = -2.48;
  studioGroup.add(stageGroup);

  // Stage Materials
  const baseStageMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#19120e'),
    metalness: 0.86,
    roughness: 0.32,
    envMapIntensity: 2.2
  });

  const chamferTrimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e0a96d'),
    metalness: 0.98,
    roughness: 0.12,
    envMapIntensity: 3.0
  });

  const underGlowMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f59e0b'),
    emissive: new THREE.Color('#d97706'),
    emissiveIntensity: 2.4,
    metalness: 0.1,
    roughness: 0.3
  });

  // Bottom Heavy Sub-Base Plinth
  const subBaseGeo = new THREE.CylinderGeometry(2.95, 3.12, 0.16, 64);
  const subBaseMesh = new THREE.Mesh(subBaseGeo, baseStageMat);
  subBaseMesh.position.y = -0.08;
  stageGroup.add(subBaseMesh);

  // Top Precision Rotary Turntable
  const turntableGeo = new THREE.CylinderGeometry(2.80, 2.80, 0.12, 64);
  const turntableMesh = new THREE.Mesh(turntableGeo, baseStageMat);
  turntableMesh.position.y = 0.06;
  stageGroup.add(turntableMesh);

  // Polished Diamond-Cut Perimeter Bevel Ring
  const trimRingGeo = new THREE.TorusGeometry(2.80, 0.024, 16, 64);
  trimRingGeo.rotateX(Math.PI * 0.5);
  const trimRingMesh = new THREE.Mesh(trimRingGeo, chamferTrimMat);
  trimRingMesh.position.y = 0.12;
  stageGroup.add(trimRingMesh);

  // Calibration Disk with 360° Compass & Lab Markings
  const calibrationTexture = createTurntableCalibrationTexture();
  const discMat = new THREE.MeshStandardMaterial({
    map: calibrationTexture,
    metalness: 0.75,
    roughness: 0.35,
    envMapIntensity: 1.8
  });

  const discGeo = new THREE.CircleGeometry(2.78, 64);
  discGeo.rotateX(-Math.PI * 0.5);
  const discMesh = new THREE.Mesh(discGeo, discMat);
  discMesh.position.y = 0.122;
  stageGroup.add(discMesh);

  // Under-Turntable Glowing Halo Ribbon
  const underHaloGeo = new THREE.TorusGeometry(2.92, 0.025, 12, 64);
  underHaloGeo.rotateX(Math.PI * 0.5);
  const underHaloMesh = new THREE.Mesh(underHaloGeo, underGlowMat);
  underHaloMesh.position.y = -0.01;
  stageGroup.add(underHaloMesh);

  // -------------------------------------------------------------------
  // 2. CURVED ACOUSTIC SLAT WALL SOUND DIFFUSER (Architectural Louvers)
  // -------------------------------------------------------------------
  const slatWallGroup = new THREE.Group();
  studioGroup.add(slatWallGroup);

  const slatMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#221711'),
    metalness: 0.22,
    roughness: 0.74,
    envMapIntensity: 1.4
  });

  // Moved further back with grander architectural radius and height
  const slatCount = 56;
  const slatRadius = 14.5;
  const slatStartAngle = -Math.PI * 0.42; // ~ -75 deg
  const slatEndAngle = Math.PI * 0.42;   // ~ +75 deg
  const slatAngleStep = (slatEndAngle - slatStartAngle) / (slatCount - 1);

  for (let i = 0; i < slatCount; i++) {
    const angle = slatStartAngle + i * slatAngleStep;
    // Authentic Schroeder acoustic diffuser depth variation
    const depthOffset = Math.sin(i * 1.35) * 0.22;
    const r = slatRadius + depthOffset;

    const x = Math.sin(angle) * r;
    const z = -Math.cos(angle) * r;

    // Slat pillar geometry (taller and deeper for spacious perspective)
    const slatGeo = new THREE.BoxGeometry(0.18, 10.2, 0.11);
    const slatMesh = new THREE.Mesh(slatGeo, slatMat);
    slatMesh.position.set(x, 1.8, z);
    slatMesh.rotation.y = angle;
    slatWallGroup.add(slatMesh);
  }

  // Cylindrical Cyclorama Studio Backdrop behind slats
  const backdropTexture = createCycloramaBackdropTexture();
  const cycloramaMat = new THREE.MeshBasicMaterial({
    map: backdropTexture,
    side: THREE.BackSide,
    depthWrite: false
  });

  const cycloramaGeo = new THREE.CylinderGeometry(16.5, 16.5, 13.0, 48, 1, true, -Math.PI * 0.48, Math.PI * 0.96);
  const cycloramaMesh = new THREE.Mesh(cycloramaGeo, cycloramaMat);
  cycloramaMesh.position.set(0, 2.2, 0);
  studioGroup.add(cycloramaMesh);

  // Soft Architectural Slat Uplights positioned with new rear depth
  const slatUplightLeft = new THREE.PointLight(0xd97706, 2.8, 24);
  slatUplightLeft.position.set(-7.5, -1.8, -10.5);
  studioGroup.add(slatUplightLeft);

  const slatUplightRight = new THREE.PointLight(0xd97706, 2.8, 24);
  slatUplightRight.position.set(7.5, -1.8, -10.5);
  studioGroup.add(slatUplightRight);

  // -------------------------------------------------------------------
  // 3. SOUND-REACTIVE FLOOR ACOUSTIC WAVEFRONT RIPPLES
  // -------------------------------------------------------------------
  const ripplesGroup = new THREE.Group();
  ripplesGroup.position.y = -2.47;
  studioGroup.add(ripplesGroup);

  const rippleMat = new THREE.MeshBasicMaterial({
    color: 0xd97706,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const rippleConfigs = [
    { baseR: 3.05, width: 0.035, phase: 0 },
    { baseR: 3.75, width: 0.040, phase: Math.PI * 0.65 },
    { baseR: 4.55, width: 0.045, phase: Math.PI * 1.30 }
  ];

  const rippleMeshes = rippleConfigs.map(cfg => {
    const geo = new THREE.RingGeometry(cfg.baseR, cfg.baseR + cfg.width, 64);
    geo.rotateX(-Math.PI * 0.5);
    const mesh = new THREE.Mesh(geo, rippleMat.clone());
    ripplesGroup.add(mesh);
    return { mesh, cfg };
  });

  // -------------------------------------------------------------------
  // 4. FLOATING STUDIO VOLUMETRIC DUST MOTES (Particles)
  // -------------------------------------------------------------------
  const particleCount = 140;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSpeeds = new Float32Array(particleCount);
  const particlePhases = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 11;      // x
    particlePositions[i * 3 + 1] = -2.2 + Math.random() * 5.8;     // y
    particlePositions[i * 3 + 2] = -4.5 + Math.random() * 9.5;     // z

    particleSpeeds[i] = 0.08 + Math.random() * 0.16;
    particlePhases[i] = Math.random() * Math.PI * 2;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleTexture = createDustParticleTexture();
  const particleMat = new THREE.PointsMaterial({
    size: 0.09,
    map: particleTexture,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particlePoints = new THREE.Points(particleGeo, particleMat);
  studioGroup.add(particlePoints);

  // -------------------------------------------------------------------
  // PRESET LIGHTING COLOR TRANSITION CONTROLLER
  // -------------------------------------------------------------------
  const studioPresetColors = {
    dark: {
      uplight: 0xd97706,
      underGlow: 0xd97706,
      ripple: 0xd97706,
      trim: 0xe0a96d,
      particles: 0xf59e0b
    },
    sunset: {
      uplight: 0xf97316,
      underGlow: 0xf59e0b,
      ripple: 0xf97316,
      trim: 0xfde68a,
      particles: 0xfde68a
    },
    cyber: {
      uplight: 0xc026d3,
      underGlow: 0x06b6d4,
      ripple: 0x06b6d4,
      trim: 0x38bdf8,
      particles: 0x06b6d4
    },
    studio: {
      uplight: 0x60a5fa,
      underGlow: 0xe2e8f0,
      ripple: 0x93c5fd,
      trim: 0xffffff,
      particles: 0xffffff
    }
  };

  function applyStudioLighting(presetName) {
    const col = studioPresetColors[presetName] || studioPresetColors.dark;

    slatUplightLeft.color.setHex(col.uplight);
    slatUplightRight.color.setHex(col.uplight);
    underGlowMat.emissive.setHex(col.underGlow);
    underGlowMat.color.setHex(col.underGlow);
    chamferTrimMat.color.setHex(col.trim);
    particleMat.color.setHex(col.particles);

    rippleMeshes.forEach(({ mesh }) => {
      mesh.material.color.setHex(col.ripple);
    });
  }

  // -------------------------------------------------------------------
  // ANIMATION UPDATE ROUTINE
  // -------------------------------------------------------------------
  function updateStudio(delta, elapsedTime, isPlayingAudio, bassEnergy, avgFreq) {
    // 1. Slow high-end turntable graduation rotation
    discMesh.rotation.y += delta * 0.035;

    // 2. Sound-Reactive Floor Wavefront Ripples
    const beatMultiplier = isPlayingAudio ? (1.0 + bassEnergy * 2.8) : 1.0;

    rippleMeshes.forEach(({ mesh, cfg }, idx) => {
      const cycle = (elapsedTime * 0.9 * beatMultiplier + cfg.phase) % (Math.PI * 2);
      const waveNorm = (Math.sin(cycle) + 1) * 0.5; // 0 to 1

      const scale = 1.0 + waveNorm * (isPlayingAudio ? 0.28 : 0.12);
      mesh.scale.set(scale, scale, scale);

      const baseOpacity = isPlayingAudio ? 0.45 : 0.22;
      mesh.material.opacity = (1.0 - waveNorm * 0.6) * baseOpacity;
    });

    // 3. Under-Turntable Glow Pulse
    if (isPlayingAudio) {
      underGlowMat.emissiveIntensity = 2.0 + bassEnergy * 3.8;
      slatUplightLeft.intensity = 2.2 + bassEnergy * 2.5;
      slatUplightRight.intensity = 2.2 + bassEnergy * 2.5;
    } else {
      underGlowMat.emissiveIntensity = 2.0 + Math.sin(elapsedTime * 2.0) * 0.4;
      slatUplightLeft.intensity = 2.0;
      slatUplightRight.intensity = 2.0;
    }

    // 4. Floating Studio Dust Motes Drift
    const posAttr = particleGeo.attributes.position;
    const posArr = posAttr.array;

    for (let i = 0; i < particleCount; i++) {
      // Upward convection draft
      posArr[i * 3 + 1] += particleSpeeds[i] * delta * (isPlayingAudio ? 1.4 : 1.0);
      if (posArr[i * 3 + 1] > 3.8) {
        posArr[i * 3 + 1] = -2.2;
      }

      // Gentle harmonic sway
      posArr[i * 3 + 0] += Math.sin(elapsedTime * 0.8 + particlePhases[i]) * 0.0015;
    }
    posAttr.needsUpdate = true;
  }

  return {
    studioGroup,
    updateStudio,
    applyStudioLighting
  };
}
