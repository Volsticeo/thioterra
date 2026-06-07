/* ═══════════════════════════════════════════════════════
   THIOTERRA — NAVBAR.JS
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const navbar     = document.querySelector('.navbar');
  const scrim      = document.querySelector('.nav-scrim');
  const mega       = document.querySelector('.mega-menu');
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body       = document.body;

  if (!navbar) return;

  // ─── SCROLL → glass pill ──────────────────────────
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── DROPDOWN + SCRIM ─────────────────────────────
  let closeTimer = null;

  const openMega = () => {
    clearTimeout(closeTimer);
    navbar.classList.add('dropdown-active');
    scrim?.classList.add('active');
  };

  const scheduledClose = () => {
    // Small delay so mouse can travel from pill → dropdown gap without closing
    closeTimer = setTimeout(() => {
      navbar.classList.remove('dropdown-active');
      scrim?.classList.remove('active');
    }, 120);
  };

  // Hover on the Work nav-item
  document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    item.addEventListener('mouseenter', openMega);
    item.addEventListener('mouseleave', scheduledClose);
  });

  // Hover on the mega menu itself — cancel any pending close
  mega?.addEventListener('mouseenter', openMega);
  mega?.addEventListener('mouseleave', scheduledClose);

  // Click scrim → close immediately
  scrim?.addEventListener('click', () => {
    clearTimeout(closeTimer);
    navbar.classList.remove('dropdown-active');
    scrim.classList.remove('active');
  });

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

  // ─── ESC ──────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      clearTimeout(closeTimer);
      navbar.classList.remove('dropdown-active');
      scrim?.classList.remove('active');
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

});