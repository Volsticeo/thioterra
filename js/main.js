/* ═══════════════════════════════════════════════════════
   THIOTERRA — MAIN.JS
   Star field canvas, custom cursor, Lenis smooth scroll,
   scroll progress bar, utility inits
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── LENIS SMOOTH SCROLL ──────────────────────────
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  });
  window._lenis = lenis; // expose for other scripts (work-drawer, etc.)

  // Correct way to sync Lenis with GSAP — only use ticker, not both
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // Sync ScrollTrigger with Lenis scroll position
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }


  // ─── CUSTOM CURSOR ────────────────────────────────
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  // Only on devices with hover (not touch)
  if (window.matchMedia('(hover: hover)').matches && dot && ring) {
    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    // Ring follows with lag
    function animateCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand ring on hoverable elements
    const hoverEls = document.querySelectorAll('a, button, .slice, .work-card, .why-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });
  }

  // ─── SCROLL PROGRESS BAR ─────────────────────────
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    lenis.on('scroll', ({ progress }) => {
      progressBar.style.height = (progress * 100) + '%';
    });
  }

  // ─── NAVBAR SCROLL STATE ──────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    lenis.on('scroll', ({ scroll }) => {
      navbar.classList.toggle('scrolled', scroll > 40);
    });
  }

  // ─── FOOTER YEAR ──────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── TESTIMONIALS ─────────────────────────────────
  const testimonials = document.querySelectorAll('.testimonial');
  const dots         = document.querySelectorAll('.testimonials-dots .dot');
  let currentTestimonial = 0;
  let testimonialTimer;

  function showTestimonial(index) {
    testimonials.forEach((t, i) => t.classList.toggle('active', i === index));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
      d.setAttribute('aria-selected', i === index);
    });
    currentTestimonial = index;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(testimonialTimer);
      showTestimonial(i);
      startTestimonialTimer();
    });
  });

  function startTestimonialTimer() {
    testimonialTimer = setInterval(() => {
      showTestimonial((currentTestimonial + 1) % testimonials.length);
    }, 5000);
  }

  if (testimonials.length) startTestimonialTimer();

  // ─── REVEAL ON SCROLL (INTERSECTION OBSERVER) ─────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

});