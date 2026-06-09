/* ═══════════════════════════════════════════════════════
   THIOTERRA — ANIMATIONS.JS
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ─── SVG LIQUID FILTER ─────────────────────────── */
  const svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgFilter.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none');
  svgFilter.innerHTML = `<defs>
    <filter id="liquid-morph" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence id="turb" type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="2" result="noise"/>
      <feDisplacementMap id="disp" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
      <feGaussianBlur id="mblur" in="displaced" stdDeviation="0"/>
    </filter>
  </defs>`;
  document.body.appendChild(svgFilter);

  const turb  = document.getElementById('turb');
  const disp  = document.getElementById('disp');
  const mblur = document.getElementById('mblur');

  function setFilter(scale, blur, freq) {
    if (turb)  turb.setAttribute('baseFrequency', String(freq || 0.015));
    if (disp)  disp.setAttribute('scale', String(scale || 0));
    if (mblur) mblur.setAttribute('stdDeviation', String(blur || 0));
  }

  /* ─── EYEBROWS ──────────────────────────────────── */
  gsap.utils.toArray('.section-eyebrow').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      opacity: 0, x: -20, duration: 0.6, ease: 'power2.out', clearProps: 'all',
    });
  });

  /* ─── ACCORDION ENTRY ───────────────────────────── */
  gsap.from('.accordion-strip', {
    scrollTrigger: { trigger: '.services-accordion', start: 'top 95%' },
    opacity: 0, y: 15, stagger: 0.08, duration: 0.5, ease: 'power2.out', clearProps: 'all',
  });

  /* ─── WHY SECTION ENTRY ─────────────────────────── */
  gsap.from('.why-header', {
    scrollTrigger: { trigger: '.why-section', start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', clearProps: 'all',
  });

  gsap.from('.why-card', {
    scrollTrigger: { trigger: '.why-grid', start: 'top 85%' },
    opacity: 0, y: 40, stagger: 0.15, duration: 0.7, ease: 'power3.out', clearProps: 'all',
  });

  /* ─── WHY → WORK MORPH ──────────────────────────── */
  const whyCards   = document.querySelectorAll('.why-card');
  const whyGrid    = document.querySelector('.why-grid');
  const whySection = document.querySelector('.why-section');
  const workSection = document.querySelector('.work-section');

  if (whySection && workSection && whyCards.length) {
    let entered = false;
    ScrollTrigger.create({ trigger: '.why-grid', start: 'top 85%', once: true, onEnter: () => { entered = true; } });

    ScrollTrigger.create({
      trigger: whySection, start: 'bottom 70%', end: 'bottom 5%', scrub: 1.2,
      onUpdate: (self) => {
        if (!entered) return;
        const p = self.progress;
        if (p > 0.3) { whyGrid.style.filter = 'url(#liquid-morph)'; setFilter((p - 0.3) * 60, p > 0.5 ? (p - 0.5) * 10 : 0, 0.015 + p * 0.02); }
        else { whyGrid.style.filter = 'none'; setFilter(0, 0); }
        whyCards.forEach((card, i) => {
          const dir = i === 0 ? -1 : i === 2 ? 1 : 0;
          card.style.transform = `translateX(${dir * p * 60}px) scale(${1 - p * 0.3})`;
          card.style.opacity = String(Math.max(0, 1 - p * 1.2));
        });
      },
      onLeave: () => { whyGrid && (whyGrid.style.filter = 'none'); setFilter(0, 0); },
      onLeaveBack: () => {
        whyGrid && (whyGrid.style.filter = 'none'); setFilter(0, 0);
        whyCards.forEach(card => { card.style.transform = ''; card.style.opacity = ''; });
      },
    });
  }

  /* ─── WORK SECTION ENTRY ────────────────────────── */
  gsap.from('.work-header', {
    scrollTrigger: { trigger: '.work-section', start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', clearProps: 'all',
  });

  gsap.from('.work-card', {
    scrollTrigger: { trigger: '.work-grid', start: 'top 85%' },
    opacity: 0, y: 40, stagger: 0.12, duration: 0.7, ease: 'power3.out', clearProps: 'all',
  });
  /* ─── WORK → TESTIMONIALS MORPH ─────────────────── */
  const workCards  = document.querySelectorAll('.work-card');
  const workGrid   = document.querySelector('.work-grid');
  const starfield  = document.getElementById('starfield');

  if (workSection && workCards.length) {
    let workEntered = false;
    ScrollTrigger.create({ trigger: '.work-grid', start: 'top 85%', once: true, onEnter: () => { workEntered = true; } });

    ScrollTrigger.create({
      trigger: workSection, start: 'bottom 75%', end: 'bottom 5%', scrub: 1.5,
      onUpdate: (self) => {
        if (!workEntered) return;
        const p = self.progress;
        if (p > 0.2) { workGrid && (workGrid.style.filter = 'url(#liquid-morph)'); setFilter((p - 0.2) * 50, p > 0.5 ? (p - 0.5) * 8 : 0, 0.015 + p * 0.02); }
        else { workGrid && (workGrid.style.filter = 'none'); setFilter(0, 0); }
        workCards.forEach((card, i) => {
          const cp = Math.max(0, p - i * 0.06);
          card.style.transform = `translateY(${-cp * 80}px) scale(${1 - cp * 0.5})`;
          card.style.opacity = String(Math.max(0, 1 - cp * 1.4));
        });
        if (starfield) starfield.style.opacity = String(Math.min(1.5, 1 + p * 0.5));
      },
      onLeave: () => { workGrid && (workGrid.style.filter = 'none'); setFilter(0, 0); if (starfield) starfield.style.opacity = '1'; },
      onLeaveBack: () => {
        workGrid && (workGrid.style.filter = 'none'); setFilter(0, 0); if (starfield) starfield.style.opacity = '1';
        workCards.forEach(card => { card.style.transform = ''; card.style.opacity = ''; });
      },
    });
  }

  /* ─── TESTIMONIALS ENTRY ────────────────────────── */
  gsap.from('.tst-featured', {
    scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%' },
    opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', clearProps: 'all',
  });
  gsap.from('.tst-marquee-outer', {
    scrollTrigger: { trigger: '.testimonials-section', start: 'top 70%' },
    opacity: 0, y: 20, duration: 0.7, delay: 0.2, ease: 'power2.out', clearProps: 'all',
  });

  /* ─── CTA TRANSITION LINE + ENTRY ───────────────── */
  const ctaSection = document.querySelector('.cta-section');
  if (ctaSection) {
    let line = document.querySelector('.cta-transition-line');
    if (!line) {
      line = document.createElement('div');
      line.className = 'cta-transition-line';
      ctaSection.insertAdjacentElement('beforebegin', line);
    }
    ScrollTrigger.create({
      trigger: ctaSection, start: 'top 90%', end: 'top 40%', scrub: 1,
      onUpdate: (self) => { line.style.width = `${self.progress * 100}%`; line.style.opacity = String(self.progress); },
    });
    gsap.from('.cta-heading', { scrollTrigger: { trigger: ctaSection, start: 'top 70%' }, opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.cta-subtext',  { scrollTrigger: { trigger: ctaSection, start: 'top 65%' }, opacity: 0, y: 30, duration: 0.7, delay: 0.1, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.cta-button',   { scrollTrigger: { trigger: ctaSection, start: 'top 60%' }, opacity: 0, scale: 0.9, duration: 0.6, delay: 0.2, ease: 'back.out(1.4)', clearProps: 'all' });
  }


});
/* ── Testimonials quote switcher ─────────────────────── */
(function initTestimonials() {
  const quoteEl  = document.getElementById('tst-quote');
  const nameEl   = document.getElementById('tst-name');
  const coEl     = document.getElementById('tst-company');
  const marquee  = document.getElementById('tst-marquee');
  const attrEl   = document.querySelector('.tst-attr');
  if (!quoteEl || !marquee) return;

  const data = [
    { quote: 'Working with ThioTerra felt less like hiring an agency and more like gaining a partner who actually cared about where we were going.', name: 'Client Name', company: 'Company' },
    { quote: 'The results spoke before we even launched. The strategy was sharp, the execution was sharper.',                                       name: 'Client Name', company: 'Company' },
    { quote: 'Our brand finally looks like what we always imagined it could be.',                                                                   name: 'Client Name', company: 'Company' },
  ];

  let current = 0;
  let timer;

  function switchTo(idx) {
    current = idx;
    quoteEl.classList.add('switching');
    if (attrEl) attrEl.classList.add('switching');
    setTimeout(() => {
      quoteEl.textContent  = data[idx].quote;
      nameEl.textContent   = data[idx].name;
      coEl.textContent     = data[idx].company;
      quoteEl.classList.remove('switching');
      if (attrEl) attrEl.classList.remove('switching');
    }, 380);
    marquee.querySelectorAll('.tst-card').forEach(c => {
      c.classList.toggle('active', parseInt(c.dataset.idx) === idx);
    });
  }

  marquee.addEventListener('click', e => {
    const card = e.target.closest('.tst-card');
    if (!card) return;
    clearInterval(timer);
    switchTo(parseInt(card.dataset.idx));
    timer = setInterval(() => switchTo((current + 1) % data.length), 5000);
  });

  timer = setInterval(() => switchTo((current + 1) % data.length), 5000);
})();