/* ═══════════════════════════════════════════════════════
   THIOTERRA — NAVBAR.JS
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const navbar    = document.querySelector('.navbar');
  const scrim     = document.querySelector('.nav-scrim');
  const mega      = document.querySelector('.mega-menu');   // direct child of header
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;

  if (!navbar) return;

  // ─── SCROLL → glass pill ──────────────────────────
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── DROPDOWN + SCRIM ─────────────────────────────
  const dropItems = document.querySelectorAll('.nav-item.has-dropdown');

  const openMega = () => {
    navbar.classList.add('dropdown-active');
    scrim?.classList.add('active');
  };

  const closeMega = () => {
    navbar.classList.remove('dropdown-active');
    scrim?.classList.remove('active');
  };

  dropItems.forEach(item => {
    item.addEventListener('mouseenter', openMega);
    item.addEventListener('mouseleave', (e) => {
      // Don't close if moving into the mega menu
      if (mega && mega.contains(e.relatedTarget)) return;
      closeMega();
    });
  });

  // Keep open while hovering mega menu itself
  mega?.addEventListener('mouseenter', openMega);
  mega?.addEventListener('mouseleave', (e) => {
    // Don't close if moving back to a nav item
    const goingToNav = [...dropItems].some(item => item.contains(e.relatedTarget));
    if (goingToNav) return;
    closeMega();
  });

  // Click scrim → close
  scrim?.addEventListener('click', closeMega);

  // ─── HAMBURGER ────────────────────────────────────
  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu?.setAttribute('aria-hidden', !isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
    });
  });

  // ─── ESC KEY ──────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMega();
      if (mobileMenu?.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
        hamburger?.focus();
      }
    }
  });

  // ─── ACCORDION STRIPS (work page) ─────────────────
  const strips = document.querySelectorAll('.accordion-strip');
  strips.forEach(strip => {
    strip.addEventListener('mouseenter', () => {
      strips.forEach(s => s.classList.remove('active'));
      strip.classList.add('active');
    });
    strip.addEventListener('click', () => {
      const links = {
        web:'work/web.html', marketing:'work/marketing.html',
        brand:'work/brand.html', content:'work/content.html'
      };
      if (links[strip.dataset.service]) window.location.href = links[strip.dataset.service];
    });
  });
  const accordion = document.querySelector('.services-accordion');
  accordion?.addEventListener('mouseleave', () => {
    strips.forEach(s => s.classList.remove('active'));
    strips[0]?.classList.add('active');
  });

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
