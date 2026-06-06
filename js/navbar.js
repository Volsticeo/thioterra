/* ═══════════════════════════════════════════════════════
   THIOTERRA — NAVBAR.JS
   Hamburger toggle, mobile menu, dropdown accessibility
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body       = document.body;

  if (!hamburger || !mobileMenu) return;

  // ─── HAMBURGER TOGGLE ─────────────────────────────
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    // Prevent body scroll when menu is open
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ─── CLOSE ON LINK CLICK ──────────────────────────
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
    });
  });

  // ─── CLOSE ON ESC ─────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
      hamburger.focus();
    }
  });

  // ─── ACCORDION STRIPS ─────────────────────────────
  const strips = document.querySelectorAll('.accordion-strip');

  strips.forEach(strip => {
    strip.addEventListener('mouseenter', () => {
      strips.forEach(s => s.classList.remove('active'));
      strip.classList.add('active');
    });

    strip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        strips.forEach(s => s.classList.remove('active'));
        strip.classList.add('active');
      }
    });

    // Click anywhere on strip navigates to work page
    strip.addEventListener('click', (e) => {
      const service = strip.dataset.service;
      const links = {
        web:       'work/web.html',
        marketing: 'work/marketing.html',
        brand:     'work/brand.html',
        content:   'work/content.html',
      };
      if (links[service]) window.location.href = links[service];
    });
  });

  // Keep first strip active when mouse leaves accordion
  const accordion = document.querySelector('.services-accordion');
  if (accordion) {
    accordion.addEventListener('mouseleave', () => {
      strips.forEach(s => s.classList.remove('active'));
      if (strips[0]) strips[0].classList.add('active');
    });
  }

  // ─── SCROLL — glass treatment ─────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load in case page is already scrolled
  }

});
