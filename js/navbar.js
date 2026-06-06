/* ═══════════════════════════════════════════════════════
   THIOTERRA — NAVBAR.JS
   Scroll → glass pill | Dropdown → scrim + mega menu
   Hamburger toggle | Mobile menu
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const navbar   = document.querySelector('.navbar');
  const scrim    = document.querySelector('.nav-scrim');
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;

  if (!navbar) return;

  // ─── SCROLL → glass pill ──────────────────────────
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── DROPDOWN + SCRIM ─────────────────────────────
  const dropItems = document.querySelectorAll('.nav-item.has-dropdown');

  dropItems.forEach(item => {
    const mega = item.querySelector('.mega-menu');

    const openDrop = () => {
      dropItems.forEach(other => { if (other !== item) other.classList.remove('dropdown-open'); });
      item.classList.add('dropdown-open');
      scrim?.classList.add('active');
    };

    const closeDrop = (e) => {
      // Stay open if mouse is moving TO the mega menu
      if (mega && e.relatedTarget && mega.contains(e.relatedTarget)) return;
      item.classList.remove('dropdown-open');
      if (!document.querySelector('.nav-item.dropdown-open')) {
        scrim?.classList.remove('active');
      }
    };

    item.addEventListener('mouseenter', openDrop);
    item.addEventListener('mouseleave', closeDrop);

    // Keep open while hovering mega menu itself
    if (mega) {
      mega.addEventListener('mouseenter', openDrop);
      mega.addEventListener('mouseleave', (e) => {
        // Close only if not moving back to the nav item
        if (item.contains(e.relatedTarget)) return;
        item.classList.remove('dropdown-open');
        if (!document.querySelector('.nav-item.dropdown-open')) {
          scrim?.classList.remove('active');
        }
      });
    }
  });

  // Click scrim → close everything
  scrim?.addEventListener('click', () => {
    dropItems.forEach(item => item.classList.remove('dropdown-open'));
    scrim.classList.remove('active');
  });

  // ─── HAMBURGER TOGGLE ─────────────────────────────
  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu?.setAttribute('aria-hidden', !isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
    });
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      // Close dropdowns
      dropItems.forEach(item => item.classList.remove('dropdown-open'));
      scrim?.classList.remove('active');
      // Close mobile
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
        web: 'work/web.html', marketing: 'work/marketing.html',
        brand: 'work/brand.html', content: 'work/content.html',
      };
      if (links[strip.dataset.service]) window.location.href = links[strip.dataset.service];
    });
  });

  const accordion = document.querySelector('.services-accordion');
  if (accordion) {
    accordion.addEventListener('mouseleave', () => {
      strips.forEach(s => s.classList.remove('active'));
      if (strips[0]) strips[0].classList.add('active');
    });
  }

});