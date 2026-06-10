/* ═══════════════════════════════════════════════════════
   THIOTERRA — SIDE-RAYS.JS
   Vanilla JS port of the SideRays component (React Bits).
   Uses Three.js (already loaded) — same approach as color-bends.js.
   Shader verbatim from original. Two instances: top-right + bottom-left.
═══════════════════════════════════════════════════════ */

(function initSideRays() {

  if (typeof THREE === 'undefined') { console.warn('[SR] THREE not loaded'); return; }

  const section = document.querySelector('.why-section');
  if (!section) return;

  /* ── Helpers ─────────────────────────────────────── */
  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1],16)/255, parseInt(m[2],16)/255, parseInt(m[3],16)/255] : [1,1,1];
  }

  function originToFlip(origin) {
    switch (origin) {
      case 'top-left':     return [1, 0];
      case 'bottom-right': return [0, 1];
      case 'bottom-left':  return [1, 1];
      default:             return [0, 0]; // top-right
    }
  }

  /* ── Shaders — verbatim from SideRays component ── */
  const vert = `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const frag = `
    precision highp float;

    uniform float iTime;
    uniform vec2  iResolution;
    uniform float iSpeed;
    uniform vec3  iRayColor1;
    uniform vec3  iRayColor2;
    uniform float iIntensity;
    uniform float iSpread;
    uniform float iFlipX;
    uniform float iFlipY;
    uniform float iTilt;
    uniform float iSaturation;
    uniform float iBlend;
    uniform float iFalloff;
    uniform float iOpacity;

    float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
      vec2 sourceToCoord = coord - raySource;
      float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
      return clamp(
        (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
        (0.3  + 0.2  * cos(-cosAngle * seedB + iTime * speed)),
        0.0, 1.0) *
        clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
      if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

      vec2 coord  = vec2(fragCoord.x, iResolution.y - fragCoord.y);
      vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

      float tiltRad = iTilt * 3.14159265 / 180.0;
      float cs = cos(tiltRad);
      float sn = sin(tiltRad);
      vec2 rel         = coord - rayPos;
      vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

      float halfSpread = iSpread * 0.275;
      vec2 rayRefDir1  = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
      vec2 rayRefDir2  = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

      vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214,  21.11349, iSpeed);
      vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991,  18.0234,  iSpeed * 0.2);

      vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

      float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
      float brightness      = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
      color.rgb *= brightness;

      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb  = mix(vec3(gray), color.rgb, iSaturation);

      color.a      = max(color.r, max(color.g, color.b)) * iOpacity;
      gl_FragColor = color;
    }
  `;

  /* ── Factory — creates one renderer per container ── */
  function createInstance(wrap, origin) {
    if (!wrap) return null;

    const [flipX, flipY] = originToFlip(origin);
    const c1 = hexToRgb('#7855FF'); // ThioTerra violet
    const c2 = hexToRgb('#3309EF'); // ThioTerra deep blue

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      vertexShader:      vert,
      fragmentShader:    frag,
      uniforms: {
        iTime:       { value: 0 },
        iResolution: { value: new THREE.Vector2(1, 1) },
        iSpeed:      { value: 1.8 },
        iRayColor1:  { value: new THREE.Vector3(...c1) },
        iRayColor2:  { value: new THREE.Vector3(...c2) },
        iIntensity:  { value: 1.0 },
        iSpread:     { value: 2.2 },
        iFlipX:      { value: flipX },
        iFlipY:      { value: flipY },
        iTilt:       { value: 0 },
        iSaturation: { value: 1.3 },
        iBlend:      { value: 0.55 },
        iFalloff:    { value: 1.6 },
        iOpacity:    { value: 0.75 },
      },
      transparent:        true,
      premultipliedAlpha: false,
      depthWrite:         false,
    });

    scene.add(new THREE.Mesh(geometry, material));

    const renderer = new THREE.WebGLRenderer({
      antialias:       false,
      alpha:           true,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    if ('outputColorSpace' in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
    wrap.appendChild(renderer.domElement);

    function handleResize() {
      const w = wrap.clientWidth  || 1;
      const h = wrap.clientHeight || 1;
      renderer.setSize(w, h, false);
      const dpr = renderer.getPixelRatio();
      material.uniforms.iResolution.value.set(w * dpr, h * dpr);
    }

    handleResize();

    if ('ResizeObserver' in window) {
      new ResizeObserver(handleResize).observe(wrap);
    } else {
      window.addEventListener('resize', handleResize, { passive: true });
    }

    const clock = new THREE.Clock();
    let rafId   = null;
    let running = false;

    function tick() {
      material.uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }

    return {
      start() {
        if (running) return;
        running = true;
        clock.start();
        rafId = requestAnimationFrame(tick);
      },
      stop() {
        if (!running) return;
        running = false;
        cancelAnimationFrame(rafId);
        rafId = null;
      },
    };
  }

  /* ── Instantiate both corners ─────────────────────── */
  const tr = createInstance(document.querySelector('.why-siderays-tr'), 'top-right');
  const bl = createInstance(document.querySelector('.why-siderays-bl'), 'bottom-left');

  if (tr) tr.start();
  if (bl) bl.start();

  /* ── Pause both when section leaves viewport ──────── */
  new IntersectionObserver(([entry]) => {
    const fn = entry.isIntersecting ? 'start' : 'stop';
    if (tr) tr[fn]();
    if (bl) bl[fn]();
  }, { threshold: 0.05 }).observe(section);

})();