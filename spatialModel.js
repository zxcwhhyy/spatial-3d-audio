import * as THREE from 'three';

/**
 * Spatial-X1: Master Reference Industrial Design Headset Model
 * Features:
 * - Precision-machined CNC anodized aluminum earcups with brushed face & diamond chamfers
 * - Twin titanium headband arches with segmented ergonomic cranial cushion
 * - Telescoping brushed stainless steel sliders with laser-etched millimeter graduation marks
 * - Audiophile braided cloth acoustic wire loops connecting headband to earcups
 * - Countersunk Torx fastener screws on gimbals and hinge blocks
 * - Tactile physical controls: Knurled rotary digital crown, ANC rocker switch, USB-C & 3.5mm ports
 * - Perforated acoustic scrim fabric with typographic "L" and "R" markers
 * - 40mm Beryllium transducer assembly with Neodymium magnet motor, copper voice coil & damping vents
 * - Exposed animated parts (diaphragms, earcups, rotary dial) for real-time sound reactivity
 */

// 1. Procedural Leather Grain Bump Map
function createLeatherTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const idx = (y * 256 + x) * 4;
      const n1 = Math.sin(x * 0.4) * Math.cos(y * 0.4);
      const n2 = Math.sin(x * 0.8 + 1.2) * Math.cos(y * 0.8 + 1.8);
      const val = 128 + Math.floor((n1 * 0.6 + n2 * 0.4) * 45 + (Math.random() - 0.5) * 18);
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// 2. Procedural Knurled Grip Texture (for Digital Crown)
function createKnurlTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#ffffff';
  for (let x = 0; x < 128; x += 6) {
    ctx.fillRect(x, 0, 3, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 1);
  return texture;
}

// 3. Procedural Perforated Acoustic Scrim with Crisp "L" / "R" Typography
function createSpeakerGrilleTexture(label = 'L') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep acoustic cloth background
  ctx.fillStyle = '#120d09';
  ctx.fillRect(0, 0, 512, 512);

  // Micro-woven mesh pattern
  ctx.fillStyle = '#1c140e';
  for (let y = 0; y < 512; y += 4) {
    for (let x = 0; x < 512; x += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  // Concentric perforated speaker acoustic apertures
  ctx.fillStyle = '#050302';
  for (let r = 35; r < 230; r += 18) {
    const count = Math.floor((2 * Math.PI * r) / 16);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = 256 + Math.cos(angle) * r;
      const y = 256 + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Copper voice coil circular ring accent
  const coilGrad = ctx.createRadialGradient(256, 256, 60, 256, 256, 110);
  coilGrad.addColorStop(0, 'rgba(245, 158, 11, 0.55)');
  coilGrad.addColorStop(0.5, 'rgba(180, 83, 9, 0.35)');
  coilGrad.addColorStop(1, 'rgba(18, 13, 9, 0)');
  ctx.fillStyle = coilGrad;
  ctx.beginPath();
  ctx.arc(256, 256, 110, 0, Math.PI * 2);
  ctx.fill();

  // Bold luxury audiophile channel indicator letter (L or R)
  ctx.font = 'bold 150px "Inter", "Helvetica Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(245, 158, 11, 0.42)';
  ctx.fillText(label, 256, 256);

  ctx.font = '600 22px "Fira Code", monospace';
  ctx.fillStyle = 'rgba(224, 169, 109, 0.45)';
  ctx.fillText('40mm BERYLLIUM // 32Ω', 256, 365);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 4. Laser-Etched Telescoping Slider Graduation Marks Texture
function createSliderRulerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Brushed steel background
  ctx.fillStyle = '#d4d4d8';
  ctx.fillRect(0, 0, 128, 512);

  // Subtle vertical brushed grain
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.1)';
    const x = Math.random() * 128;
    ctx.fillRect(x, 0, 1, 512);
  }

  // Laser-etched tick marks and graduation numbers
  ctx.fillStyle = '#27272a';
  ctx.font = 'bold 20px "Fira Code", monospace';
  ctx.textAlign = 'right';

  for (let i = 1; i <= 8; i++) {
    const y = 70 + i * 44;
    // Major tick
    ctx.fillRect(15, y, 40, 3);
    // Number
    ctx.fillText(i.toString(), 110, y + 6);
    // Minor tick
    if (i < 8) {
      ctx.fillRect(15, y + 22, 22, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 5. Laser-Etched Transducer Specification Ring Texture
function createDriverChassisTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#18120d';
  ctx.fillRect(0, 0, 512, 512);

  // Circular brushed rings
  ctx.strokeStyle = 'rgba(224, 169, 109, 0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 230, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(256, 256, 218, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#e0a96d';
  ctx.font = 'bold 20px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = 'SPATIAL-X1 • 40mm BERYLLIUM • 1.5T FLUX • 5Hz-48kHz • 32Ω •';
  const radius = 224;
  const chars = text.split('');
  const totalAngle = Math.PI * 2;
  const angleStep = totalAngle / chars.length;

  for (let i = 0; i < chars.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    ctx.save();
    ctx.translate(256 + Math.cos(angle) * radius, 256 + Math.sin(angle) * radius);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 2D Stadium / Rounded Rectangle Shape
function createStadiumShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

// Precision Miniature Torx Fastener Screw Generator
function createTorxScrew(chamferMat, darkMat) {
  const screwGroup = new THREE.Group();

  // Screw Head Chamfer Disc
  const headGeo = new THREE.CylinderGeometry(0.042, 0.038, 0.025, 24);
  headGeo.rotateX(Math.PI * 0.5);
  const headMesh = new THREE.Mesh(headGeo, chamferMat);
  screwGroup.add(headMesh);

  // Countersunk 6-lobe Torx recess socket
  const recessGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.028, 6);
  recessGeo.rotateX(Math.PI * 0.5);
  const recessMesh = new THREE.Mesh(recessGeo, darkMat);
  recessMesh.position.z = 0.002;
  screwGroup.add(recessMesh);

  return screwGroup;
}

export function createHeadsetModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'SpatialHeadset_Root';

  // Kinematic groups
  const headbandGroup = new THREE.Group();
  const leftEarcupGroup = new THREE.Group();
  const rightEarcupGroup = new THREE.Group();
  const leftDriverGroup = new THREE.Group();
  const rightDriverGroup = new THREE.Group();
  const leftCushionGroup = new THREE.Group();
  const rightCushionGroup = new THREE.Group();

  rootGroup.add(headbandGroup);
  rootGroup.add(leftEarcupGroup);
  rootGroup.add(rightEarcupGroup);
  rootGroup.add(leftDriverGroup);
  rootGroup.add(rightDriverGroup);
  rootGroup.add(leftCushionGroup);
  rootGroup.add(rightCushionGroup);

  // Load procedural textures
  const leatherBumpMap = createLeatherTexture();
  const knurlBumpMap = createKnurlTexture();
  const sliderRulerMap = createSliderRulerTexture();
  const driverSpecMap = createDriverChassisTexture();
  const leftGrilleMap = createSpeakerGrilleTexture('L');
  const rightGrilleMap = createSpeakerGrilleTexture('R');

  // -----------------------------------------------------------------
  // PBR MATERIALS DEFINITIONS
  // -----------------------------------------------------------------
  const headbandMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#38281e'),
    metalness: 0.94,
    roughness: 0.20,
    envMapIntensity: 2.4
  });

  const canopyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#19110b'),
    metalness: 0.08,
    roughness: 0.78,
    bumpMap: leatherBumpMap,
    bumpScale: 0.045
  });

  const earcupChassisMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#261a13'),
    metalness: 0.88,
    roughness: 0.24,
    envMapIntensity: 2.6
  });

  const chamferMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e0a96d'),
    metalness: 0.98,
    roughness: 0.10,
    envMapIntensity: 3.2
  });

  const sliderMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e2e8f0'),
    map: sliderRulerMap,
    metalness: 0.95,
    roughness: 0.18,
    envMapIntensity: 2.5
  });

  const cableMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1b130e'),
    metalness: 0.35,
    roughness: 0.65,
    bumpMap: leatherBumpMap,
    bumpScale: 0.08
  });

  const ledHaloMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f59e0b'),
    emissive: new THREE.Color('#f59e0b'),
    emissiveIntensity: 2.0,
    metalness: 0.15,
    roughness: 0.2
  });

  const cushionMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#150d09'),
    metalness: 0.06,
    roughness: 0.72,
    bumpMap: leatherBumpMap,
    bumpScale: 0.05
  });

  const weltMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e0a96d'),
    metalness: 0.5,
    roughness: 0.4
  });

  const driverMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#eab308'),
    metalness: 0.96,
    roughness: 0.16,
    envMapIntensity: 2.8
  });

  const driverSpecMat = new THREE.MeshStandardMaterial({
    map: driverSpecMap,
    metalness: 0.85,
    roughness: 0.25
  });

  const copperMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b45309'),
    metalness: 0.98,
    roughness: 0.22
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0c0a09'),
    metalness: 0.8,
    roughness: 0.5
  });

  const leftGrilleMat = new THREE.MeshStandardMaterial({
    map: leftGrilleMap,
    metalness: 0.25,
    roughness: 0.75
  });

  const rightGrilleMat = new THREE.MeshStandardMaterial({
    map: rightGrilleMap,
    metalness: 0.25,
    roughness: 0.75
  });

  const knurlMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e0a96d'),
    metalness: 0.96,
    roughness: 0.15,
    bumpMap: knurlBumpMap,
    bumpScale: 0.06,
    envMapIntensity: 2.8
  });

  // -----------------------------------------------------------------
  // 1. DUAL TITANIUM ARCH HEADBAND & SEGMENTED CANOPY
  // -----------------------------------------------------------------
  // Twin parallel titanium rods for aerospace lightweight rigidity
  const archOffsets = [-0.14, 0.14];
  archOffsets.forEach(zOffset => {
    const headbandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.84, 0.45, zOffset),
      new THREE.Vector3(-1.64, 1.48, zOffset),
      new THREE.Vector3(-0.95, 2.38, zOffset),
      new THREE.Vector3(0, 2.58, zOffset),
      new THREE.Vector3(0.95, 2.38, zOffset),
      new THREE.Vector3(1.64, 1.48, zOffset),
      new THREE.Vector3(1.84, 0.45, zOffset)
    ]);
    const archGeo = new THREE.TubeGeometry(headbandCurve, 64, 0.048, 20, false);
    const archMesh = new THREE.Mesh(archGeo, headbandMat);
    headbandGroup.add(archMesh);
  });

  // Center cross braces connecting twin arch tubes
  [-1.2, -0.6, 0, 0.6, 1.2].forEach(x => {
    const y = 2.58 - (x * x) * 0.26;
    const braceGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.30, 16);
    braceGeo.rotateX(Math.PI * 0.5);
    const braceMesh = new THREE.Mesh(braceGeo, chamferMat);
    braceMesh.position.set(x, y, 0);
    headbandGroup.add(braceMesh);
  });

  // Ergonomic 3-segment contoured leather cranial cushion
  const segmentAngles = [-0.45, 0, 0.45];
  segmentAngles.forEach((ang) => {
    const segCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.45, 0, 0),
      new THREE.Vector3(0, 0.03, 0),
      new THREE.Vector3(0.45, 0, 0)
    ]);
    const segGeo = new THREE.TubeGeometry(segCurve, 20, 0.12, 16, false);
    segGeo.scale(1, 0.45, 1.5);

    const segMesh = new THREE.Mesh(segGeo, canopyMat);
    const posX = Math.sin(ang) * 1.5;
    const posY = Math.cos(ang) * 1.5 + 0.98;
    segMesh.position.set(posX, posY, 0);
    segMesh.rotation.z = -ang;
    headbandGroup.add(segMesh);
  });

  // Telescoping Slider Blocks with Laser-Etched Graduation Marks
  const sliderGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.72, 24);

  const leftSlider = new THREE.Mesh(sliderGeo, sliderMat);
  leftSlider.position.set(-1.85, 0.18, 0);
  leftSlider.rotation.z = 0.22;
  headbandGroup.add(leftSlider);

  const rightSlider = new THREE.Mesh(sliderGeo, sliderMat);
  rightSlider.position.set(1.85, 0.18, 0);
  rightSlider.rotation.z = -0.22;
  headbandGroup.add(rightSlider);

  // Aluminum slider clamp collars with Torx screws
  [-1, 1].forEach(sign => {
    const clampGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.14, 24);
    const clampMesh = new THREE.Mesh(clampGeo, chamferMat);
    clampMesh.position.set(sign * 1.84, 0.46, 0);
    clampMesh.rotation.z = sign * 0.22;
    headbandGroup.add(clampMesh);

    // Mini Torx screw on clamp
    const clampScrew = createTorxScrew(chamferMat, darkMat);
    clampScrew.position.set(sign * 1.84, 0.46, 0.08);
    headbandGroup.add(clampScrew);
  });

  // -----------------------------------------------------------------
  // 2. AUDIOPHILE BRAIDED ACOUSTIC WIRE LOOPS (Headband -> Earcups)
  // -----------------------------------------------------------------
  function createBraidedWire(isLeft) {
    const sign = isLeft ? -1 : 1;
    const wireCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sign * 1.82, 0.40, 0.16),
      new THREE.Vector3(sign * 2.12, 0.20, 0.24),
      new THREE.Vector3(sign * 2.18, -0.15, 0.22),
      new THREE.Vector3(sign * 1.95, -0.32, 0.18)
    ]);
    const wireGeo = new THREE.TubeGeometry(wireCurve, 32, 0.022, 12, false);
    return new THREE.Mesh(wireGeo, cableMat);
  }

  leftEarcupGroup.add(createBraidedWire(true));
  rightEarcupGroup.add(createBraidedWire(false));

  // -----------------------------------------------------------------
  // 3. PRECISION MACHINED GIMBALS WITH FASTENER SCREWS
  // -----------------------------------------------------------------
  function createHingeAndGimbal(isLeft) {
    const sign = isLeft ? -1 : 1;
    const gimbalGroup = new THREE.Group();

    // Top rotating sleeve collar
    const collarGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.18, 24);
    const collar = new THREE.Mesh(collarGeo, chamferMat);
    collar.position.set(sign * 1.88, -0.05, 0);
    collar.rotation.z = sign * 0.22;
    gimbalGroup.add(collar);

    // Wishbone curved arm wrapping to the outer pivot
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sign * 1.88, -0.05, 0),
      new THREE.Vector3(sign * 2.10, -0.26, 0),
      new THREE.Vector3(sign * 2.12, -0.55, 0)
    ]);
    const armGeo = new THREE.TubeGeometry(armCurve, 28, 0.046, 16, false);
    const armMesh = new THREE.Mesh(armGeo, chamferMat);
    gimbalGroup.add(armMesh);

    // Center circular pivot disc
    const discGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 32);
    discGeo.rotateZ(Math.PI * 0.5);
    const pivotDisc = new THREE.Mesh(discGeo, chamferMat);
    pivotDisc.position.set(sign * 2.10, -0.55, 0);
    gimbalGroup.add(pivotDisc);

    // 4 Countersunk Torx Screws arranged symmetrically on pivot disc
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2;
      const screw = createTorxScrew(headbandMat, darkMat);
      screw.position.set(
        sign * 2.14,
        -0.55 + Math.sin(ang) * 0.18,
        Math.cos(ang) * 0.18
      );
      screw.rotation.y = sign * Math.PI * 0.5;
      gimbalGroup.add(screw);
    }

    return gimbalGroup;
  }

  leftEarcupGroup.add(createHingeAndGimbal(true));
  rightEarcupGroup.add(createHingeAndGimbal(false));

  // -----------------------------------------------------------------
  // 4. ERGONOMIC STADIUM EARCUPS & POLISHED ACCENTS
  // -----------------------------------------------------------------
  const earcupWidth = 1.34;
  const earcupHeight = 1.80;
  const earcupCornerRadius = 0.58;

  const stadiumShape = createStadiumShape(earcupWidth, earcupHeight, earcupCornerRadius);

  const earcupExtrudeSettings = {
    depth: 0.44,
    bevelEnabled: true,
    bevelSegments: 16,
    steps: 1,
    bevelSize: 0.18,
    bevelThickness: 0.18
  };

  const earcupGeo = new THREE.ExtrudeGeometry(stadiumShape, earcupExtrudeSettings);
  earcupGeo.center();
  earcupGeo.rotateY(Math.PI * 0.5);

  // Left Cup
  const leftCup = new THREE.Mesh(earcupGeo, earcupChassisMat);
  leftCup.position.set(-1.84, -0.55, 0);
  leftCup.rotation.y = 0.12;
  leftCup.rotation.z = 0.06;
  leftEarcupGroup.add(leftCup);

  // Right Cup
  const rightCup = new THREE.Mesh(earcupGeo, earcupChassisMat);
  rightCup.position.set(1.84, -0.55, 0);
  rightCup.rotation.y = -0.12;
  rightCup.rotation.z = -0.06;
  rightEarcupGroup.add(rightCup);

  // Polished Diamond-Cut Accent Rim
  const bezelGeo = new THREE.TorusGeometry(0.76, 0.026, 16, 48);
  bezelGeo.scale(1, 1.28, 1);
  bezelGeo.rotateY(Math.PI * 0.5);

  const leftBezel = new THREE.Mesh(bezelGeo, chamferMat);
  leftBezel.position.set(-2.09, -0.55, 0);
  leftBezel.rotation.y = 0.12;
  leftBezel.rotation.z = 0.06;
  leftEarcupGroup.add(leftBezel);

  const rightBezel = new THREE.Mesh(bezelGeo, chamferMat);
  rightBezel.position.set(2.09, -0.55, 0);
  rightBezel.rotation.y = -0.12;
  rightBezel.rotation.z = -0.06;
  rightEarcupGroup.add(rightBezel);

  // Glowing LED Halo Ring
  const haloGeo = new THREE.TorusGeometry(0.54, 0.022, 16, 48);
  haloGeo.scale(1, 1.26, 1);
  haloGeo.rotateY(Math.PI * 0.5);

  const leftHalo = new THREE.Mesh(haloGeo, ledHaloMat);
  leftHalo.position.set(-2.10, -0.55, 0);
  leftHalo.rotation.y = 0.12;
  leftHalo.rotation.z = 0.06;
  leftEarcupGroup.add(leftHalo);

  const rightHalo = new THREE.Mesh(haloGeo, ledHaloMat);
  rightHalo.position.set(2.10, -0.55, 0);
  rightHalo.rotation.y = -0.12;
  rightHalo.rotation.z = -0.06;
  rightEarcupGroup.add(rightHalo);

  // -----------------------------------------------------------------
  // 5. TACTILE HARDWARE CONTROLS & I/O INTERFACES
  // -----------------------------------------------------------------
  // Digital Crown Rotary Dial (Right Earcup Top Rear)
  const crownGroup = new THREE.Group();
  const crownGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.15, 28);
  crownGeo.rotateZ(Math.PI * 0.5);
  const crownMesh = new THREE.Mesh(crownGeo, knurlMat);
  crownGroup.add(crownMesh);

  // Polished cap rim
  const crownCapGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.02, 24);
  crownCapGeo.rotateZ(Math.PI * 0.5);
  const crownCapMesh = new THREE.Mesh(crownCapGeo, chamferMat);
  crownCapMesh.position.x = 0.08;
  crownGroup.add(crownCapMesh);

  crownGroup.position.set(1.94, 0.22, -0.34);
  rightEarcupGroup.add(crownGroup);

  // ANC / Transparency Rocker Switch (Left Earcup)
  const ancSwitchGeo = new THREE.BoxGeometry(0.06, 0.18, 0.08);
  const ancSwitch = new THREE.Mesh(ancSwitchGeo, chamferMat);
  ancSwitch.position.set(-1.94, 0.22, -0.34);
  leftEarcupGroup.add(ancSwitch);

  // ANC Indicator Green/Amber Micro LED
  const ancLedGeo = new THREE.SphereGeometry(0.016, 12, 12);
  const ancLedMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const ancLed = new THREE.Mesh(ancLedGeo, ancLedMat);
  ancLed.position.set(-1.98, 0.35, -0.34);
  leftEarcupGroup.add(ancLed);

  // USB-C Fast Charge Port (Right Earcup Bottom Rim)
  const usbcGeo = new THREE.BoxGeometry(0.05, 0.06, 0.14);
  const usbcMesh = new THREE.Mesh(usbcGeo, darkMat);
  usbcMesh.position.set(1.88, -1.35, 0);
  rightEarcupGroup.add(usbcMesh);

  const usbcPinGeo = new THREE.BoxGeometry(0.02, 0.02, 0.08);
  const usbcPinMesh = new THREE.Mesh(usbcPinGeo, chamferMat);
  usbcPinMesh.position.set(1.88, -1.35, 0);
  rightEarcupGroup.add(usbcPinMesh);

  // 3.5mm Gold-Plated Audio Jack (Left Earcup Bottom Rim)
  const jackGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.06, 20);
  const jackMesh = new THREE.Mesh(jackGeo, chamferMat);
  jackMesh.position.set(-1.88, -1.35, 0);
  leftEarcupGroup.add(jackMesh);

  const jackHoleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.07, 16);
  const jackHoleMesh = new THREE.Mesh(jackHoleGeo, darkMat);
  jackHoleMesh.position.set(-1.88, -1.35, 0);
  leftEarcupGroup.add(jackHoleMesh);

  // Quad Beamforming ANC Microphones
  [-0.32, 0.32].forEach(z => {
    [-1, 1].forEach(sign => {
      const micGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.08, 16);
      micGeo.rotateX(Math.PI * 0.5);
      const micMesh = new THREE.Mesh(micGeo, chamferMat);
      micMesh.position.set(sign * 1.88, 0.22, z);
      if (sign < 0) {
        leftEarcupGroup.add(micMesh);
      } else {
        rightEarcupGroup.add(micMesh);
      }
    });
  });

  // -----------------------------------------------------------------
  // 6. 40mm BERYLLIUM ACOUSTIC TRANSDUCERS (Animated Excursion)
  // -----------------------------------------------------------------
  let leftDiaphragm, rightDiaphragm;

  function createDriverAssembly(isLeft) {
    const sign = isLeft ? -1 : 1;
    const driverAssembly = new THREE.Group();

    // 1. High-Flux Neodymium Magnet Backplate with Cooling Vents
    const magnetGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 32);
    magnetGeo.rotateZ(Math.PI * 0.5);
    const magnetMesh = new THREE.Mesh(magnetGeo, chamferMat);
    driverAssembly.add(magnetMesh);

    // Rear acoustic venting holes
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const ventGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.09, 12);
      ventGeo.rotateZ(Math.PI * 0.5);
      const ventMesh = new THREE.Mesh(ventGeo, darkMat);
      ventMesh.position.set(0, Math.sin(ang) * 0.28, Math.cos(ang) * 0.28);
      driverAssembly.add(ventMesh);
    }

    // 2. Pure Copper Voice Coil Ring
    const coilGeo = new THREE.TorusGeometry(0.35, 0.032, 16, 32);
    coilGeo.rotateY(Math.PI * 0.5);
    const coilMesh = new THREE.Mesh(coilGeo, copperMat);
    coilMesh.position.x = sign * 0.04;
    driverAssembly.add(coilMesh);

    // 3. Ultra-Rigid Beryllium Diaphragm Dome (Sound-reactive)
    const diaphragmGeo = new THREE.CylinderGeometry(0.54, 0.54, 0.04, 36);
    diaphragmGeo.rotateZ(Math.PI * 0.5);
    const diaphragm = new THREE.Mesh(diaphragmGeo, driverMat);
    diaphragm.position.x = sign * 0.08;
    driverAssembly.add(diaphragm);

    if (isLeft) {
      leftDiaphragm = diaphragm;
    } else {
      rightDiaphragm = diaphragm;
    }

    // 4. Laser-Etched Transducer Retention Ring Chassis
    const specRingGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.03, 36);
    specRingGeo.rotateZ(Math.PI * 0.5);
    const specRingMesh = new THREE.Mesh(specRingGeo, driverSpecMat);
    specRingMesh.position.x = sign * 0.09;
    driverAssembly.add(specRingMesh);

    // 5. Perforated Scrim Fabric with Typographic "L" or "R"
    const scrimGeo = new THREE.CircleGeometry(0.68, 36);
    scrimGeo.rotateY(sign * Math.PI * 0.5);
    const scrim = new THREE.Mesh(scrimGeo, isLeft ? leftGrilleMat : rightGrilleMat);
    scrim.position.set(sign * 0.11, 0, 0);
    driverAssembly.add(scrim);

    driverAssembly.position.set(sign * 1.66, -0.55, 0);
    driverAssembly.rotation.y = sign * -0.12;
    driverAssembly.rotation.z = sign * -0.06;

    return driverAssembly;
  }

  leftDriverGroup.add(createDriverAssembly(true));
  rightDriverGroup.add(createDriverAssembly(false));

  // -----------------------------------------------------------------
  // 7. ERGONOMIC MEMORY FOAM CUSHIONS WITH STITCHING WEAVE
  // -----------------------------------------------------------------
  const cushionExtrudeSettings = {
    depth: 0.34,
    bevelEnabled: true,
    bevelSegments: 16,
    steps: 1,
    bevelSize: 0.16,
    bevelThickness: 0.16
  };

  const cushionGeo = new THREE.ExtrudeGeometry(stadiumShape, cushionExtrudeSettings);
  cushionGeo.center();
  cushionGeo.rotateY(Math.PI * 0.5);

  const leftCushion = new THREE.Mesh(cushionGeo, cushionMat);
  leftCushion.position.set(-1.42, -0.55, 0);
  leftCushion.rotation.y = 0.12;
  leftCushion.rotation.z = 0.06;
  leftCushionGroup.add(leftCushion);

  const rightCushion = new THREE.Mesh(cushionGeo, cushionMat);
  rightCushion.position.set(1.42, -0.55, 0);
  rightCushion.rotation.y = -0.12;
  rightCushion.rotation.z = -0.06;
  rightCushionGroup.add(rightCushion);

  // Perimeter Stitching Welt Ring
  const weltGeo = new THREE.TorusGeometry(0.75, 0.018, 12, 48);
  weltGeo.scale(1, 1.28, 1);
  weltGeo.rotateY(Math.PI * 0.5);

  const leftWelt = new THREE.Mesh(weltGeo, weltMat);
  leftWelt.position.set(-1.60, -0.55, 0);
  leftWelt.rotation.y = 0.12;
  leftWelt.rotation.z = 0.06;
  leftCushionGroup.add(leftWelt);

  const rightWelt = new THREE.Mesh(weltGeo, weltMat);
  rightWelt.position.set(1.60, -0.55, 0);
  rightWelt.rotation.y = -0.12;
  rightWelt.rotation.z = -0.06;
  rightCushionGroup.add(rightWelt);

  // -----------------------------------------------------------------
  // 8. KINEMATIC EXPLODED VIEW COORDINATES
  // -----------------------------------------------------------------
  const explodedGroups = [
    { group: headbandGroup, base: new THREE.Vector3(0, 0, 0), offset: new THREE.Vector3(0, 0.85, 0) },
    { group: leftEarcupGroup, base: new THREE.Vector3(0, 0, 0), offset: new THREE.Vector3(-0.75, 0, 0) },
    { group: rightEarcupGroup, base: new THREE.Vector3(0, 0, 0), offset: new THREE.Vector3(0.75, 0, 0) },
    { group: leftDriverGroup, base: new THREE.Vector3(0, 0, 0), offset: new THREE.Vector3(-1.65, 0, 0) },
    { group: rightDriverGroup, base: new THREE.Vector3(0, 0, 0), offset: new THREE.Vector3(1.65, 0, 0) },
    { group: leftCushionGroup, base: new THREE.Vector3(0, 0, 0), offset: new THREE.Vector3(-2.55, 0, 0) },
    { group: rightCushionGroup, base: new THREE.Vector3(0, 0, 0), offset: new THREE.Vector3(2.55, 0, 0) }
  ];

  function setExplodedProgress(t) {
    explodedGroups.forEach(({ group, base, offset }) => {
      group.position.lerpVectors(base, offset, t);
    });
  }

  return {
    rootGroup,
    materials: {
      headband: headbandMat,
      canopy: canopyMat,
      chassis: earcupChassisMat,
      chamfer: chamferMat,
      ledHalo: ledHaloMat,
      cushion: cushionMat,
      driver: driverMat,
      cable: cableMat,
      knurl: knurlMat
    },
    animatedParts: {
      leftDiaphragm,
      rightDiaphragm,
      digitalCrown: crownGroup,
      leftEarcupGroup,
      rightEarcupGroup
    },
    setExplodedProgress
  };
}
