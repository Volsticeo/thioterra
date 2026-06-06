/* ═══════════════════════════════════════════════════════
   THIOTERRA — MASCOT.JS

   Floating mascot that:
   1. Alternates left/right as sections scroll into view
   2. Changes color per section via CSS hue-rotate filter
   3. Has a gentle floating idle animation
   4. Subtle parallax on scroll
   5. Slightly follows cursor (very subtle)
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  if (typeof gsap === 'undefined') return;

  // ─── CREATE MASCOT ELEMENT ───────────────────────────
  const mascot = document.createElement('div');
  mascot.className = 'mascot-float';
  mascot.setAttribute('aria-hidden', 'true');
  mascot.innerHTML = `<img src="assets/images/mascot.svg" alt="" class="mascot-img" />`;
  document.body.appendChild(mascot);

  // ─── SECTION COLOR MAP ───────────────────────────────
  // Each section gets a hue-rotate value and a glow color
  // Base mascot color is #3309EF (blue)
  // hue-rotate shifts it around the color wheel
  const sectionColors = {
    '#hero':         { hue: 0,    glow: 'rgba(51,9,239,0.4)',   label: 'blue'   },
    '#services':     { hue: 30,   glow: 'rgba(100,30,239,0.4)', label: 'violet' },
    '#why':          { hue: 200,  glow: 'rgba(9,150,239,0.4)',  label: 'cyan'   },
    '#work':         { hue: 280,  glow: 'rgba(180,9,239,0.4)',  label: 'purple' },
    '#testimonials': { hue: 320,  glow: 'rgba(239,9,150,0.4)',  label: 'pink'   },
    '#cta':          { hue: 45,   glow: 'rgba(201,168,76,0.5)', label: 'gold'   },
  };

  // ─── POSITION MAP ────────────────────────────────────
  // left: distance from left edge (vw)
  // right: distance from right edge (vw)
  // y: vertical offset from center (vh)
  const sectionPositions = [
    { x: '2vw',  side: 'left',  y: '20vh' },  // hero — left
    { x: '1vw',  side: 'right', y: '30vh' },  // services — right
    { x: '2vw',  side: 'left',  y: '25vh' },  // why — left
    { x: '1vw',  side: 'right', y: '35vh' },  // work — right
    { x: '2vw',  side: 'left',  y: '28vh' },  // testimonials — left
    { x: '1vw',  side: 'right', y: '22vh' },  // cta — right
  ];

  const sections = Object.keys(sectionColors);
  let currentSection = 0;
  let currentHue = 0;

  // ─── INITIAL POSITION — hidden until barrel done ────
  gsap.set(mascot, {
    position: 'fixed',
    left: sectionPositions[0].x,
    top: sectionPositions[0].y,
    zIndex: 99,
    opacity: 0,
    scale: 0.6,
    pointerEvents: 'none',
  });

  // ─── IDLE FLOAT ANIMATION ────────────────────────────
  gsap.to(mascot, {
    y: -18,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  // ─── GENTLE ROTATION ─────────────────────────────────
  gsap.to('.mascot-img', {
    rotation: 8,
    duration: 4.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  // ─── APPEAR AFTER BARREL / HIDE WHEN BACK IN BARREL ─
  let mascotVisible = false;

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom 20%',
    onLeave: () => {
      if (mascotVisible) return;
      mascotVisible = true;
      gsap.to(mascot, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      });
    },
    onEnterBack: () => {
      mascotVisible = false;
      gsap.killTweensOf(mascot);
      gsap.set(mascot, { opacity: 0, scale: 0.6 });
    },
  });

  // ─── SCROLL-DRIVEN SECTION TRANSITIONS ───────────────
  function setHue(hue, glow) {
    gsap.killTweensOf('.mascot-img');
    gsap.to('.mascot-img', {
      filter: `hue-rotate(${hue}deg) drop-shadow(0 0 20px ${glow}) drop-shadow(0 0 40px ${glow})`,
      duration: 0.25,
      ease: 'none',
    });
    currentHue = hue;
  }

  function moveToPosition(pos) {
    const isLeft = pos.side === 'left';
    const targetX = isLeft ? pos.x : `calc(100vw - ${pos.x} - 140px)`;
    gsap.killTweensOf(mascot);
    gsap.to(mascot, {
      left: targetX,
      top: pos.y,
      duration: 0.35,
      ease: 'power2.out',
    });
  }

  // Set up ScrollTrigger for each section
  sections.forEach((selector, i) => {
    const el = document.querySelector(selector);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      end: 'bottom 35%',
      onEnter: () => {
        setHue(sectionColors[selector].hue, sectionColors[selector].glow);
        moveToPosition(sectionPositions[i]);
        currentSection = i;
      },
      onEnterBack: () => {
        setHue(sectionColors[selector].hue, sectionColors[selector].glow);
        moveToPosition(sectionPositions[i]);
        currentSection = i;
      },
    });
  });

  // Set initial color
  setHue(0, 'rgba(51,9,239,0.4)');

  // ─── SUBTLE CURSOR PARALLAX ───────────────────────────
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let mascotX = 0;
  let mascotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Very subtle — only 12px max shift
  gsap.ticker.add(() => {
    const dx = (mouseX - window.innerWidth  / 2) / window.innerWidth  * 12;
    const dy = (mouseY - window.innerHeight / 2) / window.innerHeight * 8;
    mascotX += (dx - mascotX) * 0.06;
    mascotY += (dy - mascotY) * 0.06;
    gsap.set(mascot, { xPercent: mascotX, yPercent: mascotY });
  });

  // ─── HIDE ON SMALL SCREENS ────────────────────────────
  if (window.innerWidth < 768) {
    mascot.style.display = 'none';
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      mascot.style.display = 'none';
    } else {
      mascot.style.display = 'block';
    }
  });

});