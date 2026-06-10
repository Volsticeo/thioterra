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
  gsap.from('.tst-row-wrap', {
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
    gsap.from('#cta .cta-button', { scrollTrigger: { trigger: ctaSection, start: 'top 60%' }, opacity: 0, scale: 0.9, duration: 0.6, delay: 0.2, ease: 'back.out(1.4)', clearProps: 'all' });
  }


});
/* ── Testimonials data + renderer ───────────────────── */
const TST_DATA = [
  {
    quote:   'Working with ThioTerra felt less like hiring an agency and more like gaining a partner who actually cared about where we were going.',
    name:    'Client Name',
    company: 'Company',
    photo:   'assets/images/cl1.webp',
  },
  {
    quote:   'The results spoke before we even launched. The strategy was sharp, the execution sharper.',
    name:    'Client Name',
    company: 'Company',
    photo:   'assets/images/cl2.webp',
  },
  {
    quote:   'Our brand finally looks like what we always imagined it could be.',
    name:    'Client Name',
    company: 'Company',
    photo:   'assets/images/cl3.webp',
  },
  {
    quote:   "ThioTerra took our vague idea and turned it into something we're genuinely proud to put in front of our customers.",
    name:    'Client Name',
    company: 'Company',
    photo:   'assets/images/cl4.webp',
  },
  {
    quote:   'Every deliverable felt intentional. You can tell these people actually think before they design.',
    name:    'Client Name',
    company: 'Company',
    photo:   'assets/images/cl5.webp',
  },
];

(function initTestimonials() {
  const quoteEl  = document.getElementById('tst-quote');
  const rowEl    = document.getElementById('tst-row');
  const prevBtn  = document.getElementById('tst-prev');
  const nextBtn  = document.getElementById('tst-next');
  if (!quoteEl || !rowEl) return;

  // ── Build cards ──────────────────────────────────────
  TST_DATA.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className   = 'tst-card' + (i === 0 ? ' active' : '');
    btn.dataset.idx = i;
    btn.setAttribute('aria-label', `View testimonial from ${t.name}`);
    btn.innerHTML = `
      <div class="tst-card-label">
        <span class="tst-label-name">${t.name}</span>
        <span class="tst-label-co">${t.company}</span>
      </div>
      <img class="tst-photo" src="${t.photo}" alt="${t.name}" loading="lazy"
           onerror="this.style.background='rgba(255,255,255,0.06)';this.style.border='1px solid rgba(255,255,255,0.10)';this.removeAttribute('src')">
    `;
    rowEl.appendChild(btn);
  });

  // ── Switch logic ─────────────────────────────────────
  let current = 0;
  let timer;

  function switchTo(idx) {
    if (idx === current) return;
    current = idx;

    // fade quote out → update → fade in
    quoteEl.classList.add('switching');
    setTimeout(() => {
      quoteEl.textContent = TST_DATA[idx].quote;
          quoteEl.classList.remove('switching');
      }, 340);

    // update active card
    rowEl.querySelectorAll('.tst-card').forEach((c, i) => {
      c.classList.toggle('active', i === idx);
      // also update label text in case name differs from initial render
      const ln = c.querySelector('.tst-label-name');
      const lc = c.querySelector('.tst-label-co');
      if (ln) ln.textContent = TST_DATA[i].name;
      if (lc) lc.textContent = TST_DATA[i].company;
    });
  }

  // seed first quote without animation
  quoteEl.textContent = TST_DATA[0].quote;

  // card click
  rowEl.addEventListener('click', e => {
    const card = e.target.closest('.tst-card');
    if (!card) return;
    clearInterval(timer);
    switchTo(parseInt(card.dataset.idx));
    timer = setInterval(() => switchTo((current + 1) % TST_DATA.length), 6000);
  });

  // arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', () => {
    clearInterval(timer);
    switchTo((current - 1 + TST_DATA.length) % TST_DATA.length);
    timer = setInterval(() => switchTo((current + 1) % TST_DATA.length), 6000);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    clearInterval(timer);
    switchTo((current + 1) % TST_DATA.length);
    timer = setInterval(() => switchTo((current + 1) % TST_DATA.length), 6000);
  });

  timer = setInterval(() => switchTo((current + 1) % TST_DATA.length), 6000);
})();