/* ═══════════════════════════════════════════════════════
   THIOTERRA — COLOR-BENDS.JS
   Vanilla JS port of the ColorBends component (React Bits).
   Uses Three.js exactly as the original — no raw WebGL.
   Requires three.js to be loaded before this script.
═══════════════════════════════════════════════════════ */

window.addEventListener('load', function initColorBends() {

  const wrap    = document.querySelector('.tst-colorbends');
  const section = document.querySelector('.testimonials-section');
  if (!wrap || !section) { console.error('[CB] Container not found'); return; }
  if (typeof THREE === 'undefined') { console.error('[CB] THREE not loaded'); return; }

  /* ── Config — ThioTerra palette, atmospheric ── */
  const CFG = {
    colors:         ['#5B2FD4', '#2810B8', '#7855FF', '#3D6FD9', '#1A0A5C'],
    rotation:       90,
    autoRotate:     0,
    speed:          0.05,
    transparent:    true,
    scale:          1,
    frequency:      0.8,
    warpStrength:   1.0,
    mouseInfluence: 0.3,
    parallax:       0.1,
    noise:          0.02,
    iterations:     3,
    intensity:      1.5,
    bandWidth:      5,
  };

  const MAX_COLORS = 8;

  /* ── Shaders (verbatim from component) ──────── */
  const vert = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const frag = `
    #define MAX_COLORS ${MAX_COLORS}
    uniform vec2  uCanvas;
    uniform float uTime;
    uniform float uSpeed;
    uniform vec2  uRot;
    uniform int   uColorCount;
    uniform vec3  uColors[MAX_COLORS];
    uniform int   uTransparent;
    uniform float uScale;
    uniform float uFrequency;
    uniform float uWarpStrength;
    uniform vec2  uPointer;
    uniform float uMouseInfluence;
    uniform float uParallax;
    uniform float uNoise;
    uniform int   uIterations;
    uniform float uIntensity;
    uniform float uBandWidth;
    varying vec2 vUv;

    void main() {
      float t = uTime * uSpeed;
      vec2 p  = vUv * 2.0 - 1.0;
      p += uPointer * uParallax * 0.1;
      vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
      vec2 q  = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
      q /= max(uScale, 0.0001);
      q /= 0.5 + 0.2 * dot(q, q);
      q += 0.2 * cos(t) - 7.56;
      vec2 toward = (uPointer - rp);
      q += toward * uMouseInfluence * 0.2;

      for (int j = 0; j < 5; j++) {
        if (j >= uIterations - 1) break;
        vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
        q += (rr - q) * 0.15;
      }

      vec3  col = vec3(0.0);
      float a   = 1.0;

      if (uColorCount > 0) {
        vec2  s      = q;
        vec3  sumCol = vec3(0.0);
        float cover  = 0.0;
        for (int i = 0; i < MAX_COLORS; ++i) {
          if (i >= uColorCount) break;
          s -= 0.01;
          vec2  r   = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
          float m0  = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
          float kB  = clamp(uWarpStrength, 0.0, 1.0);
          float kM  = pow(kB, 0.3);
          float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
          vec2  disp   = (r - s) * kB;
          vec2  warped = s + disp * gain;
          float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
          float m  = mix(m0, m1, kM);
          float w  = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
          sumCol += uColors[i] * w;
          cover   = max(cover, w);
        }
        col = clamp(sumCol, 0.0, 1.0);
        a   = uTransparent > 0 ? cover : 1.0;
      } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
          s -= 0.01;
          vec2  r   = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
          float m0  = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
          float kB  = clamp(uWarpStrength, 0.0, 1.0);
          float kM  = pow(kB, 0.3);
          float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
          vec2  disp   = (r - s) * kB;
          vec2  warped = s + disp * gain;
          float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
          float m  = mix(m0, m1, kM);
          col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
      }

      col *= uIntensity;

      if (uNoise > 0.0001) {
        float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
        col += (n - 0.5) * uNoise;
        col  = clamp(col, 0.0, 1.0);
      }

      vec3 rgb = (uTransparent > 0) ? col * a : col;
      gl_FragColor = vec4(rgb, a);
    }
  `;

  /* ── Three.js setup (identical to React component) ── */
  const scene    = new THREE.Scene();
  const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);

  // Colour array uniform — pre-fill with black, then set from config
  const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));

  function hexToVec3(hex) {
    const h = hex.replace('#', '');
    return new THREE.Vector3(
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255
    );
  }

  const parsedColors = CFG.colors.slice(0, MAX_COLORS).map(hexToVec3);
  parsedColors.forEach((v, i) => uColorsArray[i].copy(v));

  const initRad = (CFG.rotation % 360) * Math.PI / 180;

  const material = new THREE.ShaderMaterial({
    vertexShader:   vert,
    fragmentShader: frag,
    uniforms: {
      uCanvas:         { value: new THREE.Vector2(1, 1) },
      uTime:           { value: 0 },
      uSpeed:          { value: CFG.speed },
      uRot:            { value: new THREE.Vector2(Math.cos(initRad), Math.sin(initRad)) },
      uColorCount:     { value: parsedColors.length },
      uColors:         { value: uColorsArray },
      uTransparent:    { value: CFG.transparent ? 1 : 0 },
      uScale:          { value: CFG.scale },
      uFrequency:      { value: CFG.frequency },
      uWarpStrength:   { value: CFG.warpStrength },
      uPointer:        { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: CFG.mouseInfluence },
      uParallax:       { value: CFG.parallax },
      uNoise:          { value: CFG.noise },
      uIterations:     { value: CFG.iterations },
      uIntensity:      { value: CFG.intensity },
      uBandWidth:      { value: CFG.bandWidth },
    },
    premultipliedAlpha: true,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({
    antialias:           false,
    powerPreference:     'high-performance',
    alpha:               true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, CFG.transparent ? 0 : 1);

  // Handle both old (r128) and new Three.js output colour space API
  if ('outputColorSpace' in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  } else {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }

  renderer.domElement.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
  wrap.appendChild(renderer.domElement);

  // Mirror canvas — 2D copy of the WebGL canvas, flipped horizontally
  const mirrorCanvas = document.createElement('canvas');
  mirrorCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;transform:scaleX(-1);pointer-events:none;';
  wrap.appendChild(mirrorCanvas);
  const mCtx = mirrorCanvas.getContext('2d');

  /* ── Resize ──────────────────────────────────── */
  function handleResize() {
    const w = wrap.clientWidth  || 1;
    const h = wrap.clientHeight || 1;
    renderer.setSize(w, h, false);
    material.uniforms.uCanvas.value.set(w, h);
    mirrorCanvas.width  = renderer.domElement.width;
    mirrorCanvas.height = renderer.domElement.height;
  }

  // ResizeObserver fires after layout with real dimensions.
  // Fallback: rAF ensures we get dims even without ResizeObserver.
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      handleResize();
    });
    ro.observe(wrap);
  } else {
    window.addEventListener('resize', handleResize, { passive: true });
    // Fallback: wait one frame for layout to settle
    requestAnimationFrame(handleResize);
  }

  /* ── Pointer tracking ────────────────────────── */
  const pointerTarget  = new THREE.Vector2(0, 0);
  const pointerCurrent = new THREE.Vector2(0, 0);

  section.addEventListener('pointermove', e => {
    const rect = wrap.getBoundingClientRect();
    pointerTarget.set(
       ((e.clientX - rect.left) / (rect.width  || 1)) * 2 - 1,
      -(((e.clientY - rect.top)  / (rect.height || 1)) * 2 - 1)
    );
  }, { passive: true });

  /* ── Render loop ─────────────────────────────── */
  const clock = new THREE.Clock();
  let rafId   = null;
  let running = false;

  function tick() {
    const dt      = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsed;

    const rotDeg = (CFG.rotation % 360) + CFG.autoRotate * elapsed;
    const rotRad = rotDeg * Math.PI / 180;
    material.uniforms.uRot.value.set(Math.cos(rotRad), Math.sin(rotRad));

    pointerCurrent.lerp(pointerTarget, Math.min(1, dt * 8));
    material.uniforms.uPointer.value.copy(pointerCurrent);

    renderer.render(scene, camera);

    // Draw horizontally flipped copy for the right-side wave
    if (mirrorCanvas.width > 0) {
      mCtx.clearRect(0, 0, mirrorCanvas.width, mirrorCanvas.height);
      mCtx.drawImage(renderer.domElement, 0, 0);
    }

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    handleResize(); // ensure dims are correct at start
    clock.start();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* ── Start immediately, IO pauses when offscreen ── */
  start();

  new IntersectionObserver(
    ([entry]) => entry.isIntersecting ? start() : stop(),
    { threshold: 0.05 }
  ).observe(section);

});