/* ═══════════════════════════════════════════════════════
   THIOTERRA — WHY.JS
   Expanding cards + BorderGlow edge-proximity effect
   Scroll-in: cards fly in from sides simultaneously
   Scroll-out: scatter animation
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const section = document.querySelector('.why-section');
  const cards   = document.querySelectorAll('.wc');
  if (!section || !cards.length || typeof gsap === 'undefined') return;

  /* ─── SCROLL ENTRY / EXIT ──────────────────────────── */
  function playEntry() {
    gsap.killTweensOf(cards);
    // Start positions: 01 upper-left, 02 from below, 03 upper-right
    gsap.set(cards[0], { x: -(section.offsetWidth * 0.45), y: -60, opacity: 0, scale: 0.85 });
    gsap.set(cards[1], { x: 0, y: 70, scale: 0.6, opacity: 0 });
    gsap.set(cards[2], { x:  section.offsetWidth * 0.45, y: -60, opacity: 0, scale: 0.85 });

    const shared = { duration: 1.0, ease: 'power3.out', delay: 0.2 };
    gsap.to(cards[0], { ...shared, x: 0, y: 0, opacity: 1, scale: 1 });
    gsap.to(cards[1], { ...shared, y: 0, scale: 1, opacity: 1 });
    gsap.to(cards[2], { ...shared, x: 0, y: 0, opacity: 1, scale: 1 });
  }

  function playExit() {
    gsap.killTweensOf(cards);
    // Reset any expanded state instantly
    cards.forEach(c => {
      c.classList.remove('expanded');
      c.style.flex = '1';
      c.style.setProperty('--gop', '0');
      c.style.boxShadow = '';
    });
    // Scatter: centre implodes, outer two scatter
    gsap.to(cards[1], { y: 60, scale: 0.35, opacity: 0, duration: 0.4, ease: 'power2.in' });
    gsap.to(cards[0], { x: -(section.offsetWidth * 0.4), y: -50, opacity: 0, duration: 0.42, ease: 'power2.in', delay: 0.06 });
    gsap.to(cards[2], { x:  section.offsetWidth * 0.4, y: -50, opacity: 0, duration: 0.42, ease: 'power2.in', delay: 0.06 });
  }

  const io = new IntersectionObserver(entries => {
    entries[0].isIntersecting ? playEntry() : playExit();
  }, { threshold: 0.2 });
  io.observe(section);

  // Initial hidden state
  gsap.set(cards, { opacity: 0 });

  /* ─── HOVER EXPAND ─────────────────────────────────── */
  cards.forEach(c => {
    c.addEventListener('mouseenter', () => {
      cards.forEach(x => { x.classList.remove('expanded'); x.style.flex = '0.62'; });
      c.classList.add('expanded');
      c.style.flex = '2.5';
    });

    c.addEventListener('mouseleave', () => {
      c.classList.remove('expanded');
      cards.forEach(x => x.style.flex = '1');
      c.querySelector('.wc-inner').style.transform = '';
      c.style.setProperty('--gop', '0');
      c.style.boxShadow = '';
    });

    /* ─── BORDERGLOW + 3D TILT ─────────────────────────── */
    const gh = c.dataset.gh;
    const gs = c.dataset.gs;
    const gl = c.dataset.gl;

    c.addEventListener('mousemove', e => {
      const r  = c.getBoundingClientRect();
      const cx = r.width  / 2;
      const cy = r.height / 2;
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const dx = mx - cx;
      const dy = my - cy;

      // Edge proximity (0–1)
      const kx   = cx / Math.max(Math.abs(dx), 0.5);
      const ky   = cy / Math.max(Math.abs(dy), 0.5);
      const prox = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

      // Cursor angle (degrees from top, clockwise)
      let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;

      // BorderGlow opacity — only fires near edges
      const gop = Math.max((prox - 0.55) / 0.45, 0).toFixed(3);

      c.style.setProperty('--ca', `${angle.toFixed(1)}deg`);
      c.style.setProperty('--gc', `hsl(${gh}deg ${gs}% ${gl}% / 90%)`);
      c.style.setProperty('--gop', gop);

      // Outer bloom
      const b = parseFloat(gop);
      c.style.boxShadow = b > 0
        ? `0 0 ${(b * 30).toFixed(0)}px hsl(${gh}deg ${gs}% ${gl}% / ${(b * 30).toFixed(0)}%)`
        : '';

      // Subtle 3D tilt on inner content
      const tx = ((mx / r.width)  - 0.5) * 7;
      const ty = ((my / r.height) - 0.5) * -7;
      c.querySelector('.wc-inner').style.transform =
        `perspective(700px) rotateY(${tx}deg) rotateX(${ty}deg)`;
    });
  });

});