/* ═══════════════════════════════════════════════════════
   THIOTERRA — HERO.JS
   Uiverse 3D folders — click opens folder, card wraps around.
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const hero  = document.querySelector('.hero-section');
  const nodes = document.querySelectorAll('.folder-node');
  if (!hero || !nodes.length || typeof gsap === 'undefined') return;

  const SLIDES = [
    { img: 'assets/images/1.webp', num: '01 / 05', tagline: 'Two worlds.<br>One collision.' },
    { img: 'assets/images/2.webp', num: '02 / 05', tagline: 'We understand your market.<br>We understand you.' },
    { img: 'assets/images/3.webp', num: '03 / 05', tagline: 'Design that feels.<br>Code that thinks.' },
    { img: 'assets/images/4.webp', num: '04 / 05', tagline: 'Every brand we touch<br>leaves a mark on the universe.' },
    { img: 'assets/images/5.webp', num: '05 / 05', tagline: 'This is the spark.<br>This is ThioTerra.' },
  ];

  // ─── TOOLTIP ──────────────────────────────────────────
  const tip = document.createElement('div');
  tip.id = 'hero-tooltip';
  tip.innerHTML = `
    <div class="tip-img"></div>
    <div class="tip-body">
      <span class="tip-num"></span>
      <p class="tip-tagline"></p>
    </div>`;
  document.body.appendChild(tip);

  const tipImg     = tip.querySelector('.tip-img');
  const tipNum     = tip.querySelector('.tip-num');
  const tipTagline = tip.querySelector('.tip-tagline');

  const TIP_W = 360;
  const TIP_H = 310;

  function getLeftMargin() {
    return Math.max(24, Math.min(window.innerWidth * 0.05, 64));
  }
  function positionTip() {
    tip.style.left = getLeftMargin() + 'px';
    tip.style.top  = (window.innerHeight / 2 - TIP_H / 2) + 'px';
  }
  gsap.set(tip, { opacity: 0, x: 0, scale: 1 });

  // ─── COMPASS POSITIONING ──────────────────────────────
  const ARC = [
    [0.87, 0.18], [0.91, 0.34], [0.94, 0.50], [0.91, 0.66], [0.87, 0.82],
  ];

  function positionCompass() {
    const W = hero.offsetWidth;
    const H = hero.offsetHeight;
    nodes.forEach((node, i) => {
      // Centre the .file (folder visual) on the arc point — tagline hangs below
      const fileH = 82;
      node.style.left = (ARC[i][0] * W - node.offsetWidth / 2) + 'px';
      node.style.top  = (ARC[i][1] * H - fileH / 2) + 'px';
    });
  }

  positionCompass();
  positionTip();
  gsap.set(nodes, { opacity: 0 });

  window.addEventListener('resize', () => {
    positionCompass();
    positionTip();
    if (activeIdx !== null && !isAnimating) forceClose();
  });

  // ─── FOLDER PARTS HELPERS ─────────────────────────────
  function getParts(node) {
    return {
      w1: node.querySelector('.work-1'),
      w2: node.querySelector('.work-2'),
      w3: node.querySelector('.work-3'),
      w4: node.querySelector('.work-4'),
    };
  }

  // ─── ENTRY — folders swing in from right ──────────────
  function playEntry() {
    gsap.killTweensOf(nodes);
    gsap.set(nodes, { opacity: 0, x: 80, y: 0, rotateX: -18, scale: 0.7, transformOrigin: 'left center' });
    gsap.to(nodes, {
      opacity: 1, x: 0, y: 0, rotateX: 0, scale: 1,
      duration: 1.0, ease: 'power4.out',
      stagger: { each: 0.16, ease: 'power1.inOut' },
      delay: 0.3,
    });
  }

  // ─── EXIT — ripple scatter ────────────────────────────
  const EXIT   = [{ x:75,y:-90 },{ x:90,y:-45 },{ x:105,y:0 },{ x:90,y:45 },{ x:75,y:90 }];
  const RIPPLE = [2, 1, 3, 0, 4];

  function playExit() {
    if (activeIdx !== null) forceClose();
    gsap.killTweensOf(nodes);
    RIPPLE.forEach((ni, i) => {
      gsap.to(nodes[ni], {
        x: EXIT[ni].x, y: EXIT[ni].y, opacity: 0, scale: 0.65,
        duration: 0.45, ease: 'power2.in', delay: i * 0.06,
      });
    });
  }

  // ─── INTERSECTION OBSERVER ────────────────────────────
  const io = new IntersectionObserver(entries => {
    entries[0].isIntersecting ? playEntry() : playExit();
  }, { threshold: 0.15 });
  io.observe(hero);

  // ─── STATE ────────────────────────────────────────────
  let activeIdx   = null;
  let isAnimating = false;

  // ─── OPEN — folder flap → card flies out ─────────────
  function openFolder(idx) {
    if (isAnimating) return;
    isAnimating = true;
    activeIdx   = idx;

    const node = nodes[idx];
    const { w1, w2, w3, w4 } = getParts(node);
    const rect = node.querySelector('.file').getBoundingClientRect();
    const d    = SLIDES[idx];

    const tl = gsap.timeline();

    // 1. Folder opens — flap and papers fan out
    tl.to(w1, { rotateX: -46, translateY: 1, duration: 0.38, ease: 'power2.out' })
      .to(w2,  { rotateX: -38, duration: 0.34, ease: 'power2.out' }, '<0.04')
      .to(w3,  { rotateX: -30, duration: 0.30, ease: 'power2.out' }, '<0.04')
      .to(w4,  { rotateX: -20, duration: 0.28, ease: 'power2.out' }, '<0.04')

    // 2. Split-second pause — card materialises inside folder
    .call(() => {
      tipImg.style.backgroundImage = `url('${d.img}')`;
      tipNum.textContent   = d.num;
      tipTagline.innerHTML = d.tagline;
      gsap.set(tip, {
        left:  rect.left + rect.width  / 2 - TIP_W / 2,
        top:   rect.top  + rect.height / 2 - TIP_H / 2,
        x: 0, scale: 0.15, opacity: 0,
      });
    }, null, '+=0.2')
    .to(tip, { scale: 0.7, opacity: 1, duration: 0.16, ease: 'power2.out' }, '>')

    // 3. Card shoots RIGHT — fast
    .to(tip, { x: window.innerWidth + TIP_W, scale: 1, duration: 0.24, ease: 'power3.in' }, '>')

    // 4. Teleport to left off-screen
    .call(() => {
      positionTip();
      gsap.set(tip, { x: -(TIP_W + 80), opacity: 1, scale: 1 });
    })

    // 5. Card glides in from left
    .to(tip, { x: 0, duration: 0.6, ease: 'power3.out', onComplete: () => { isAnimating = false; } }, '>+0.02');
  }

  // ─── CLOSE — card returns, folder shuts ──────────────
  function closeFolder(idx, onDone) {
    if (isAnimating) return;
    isAnimating = true;

    const node = nodes[idx];
    const { w1, w2, w3, w4 } = getParts(node);

    const tl = gsap.timeline({
      onComplete: () => {
        activeIdx   = null;
        isAnimating = false;
        gsap.set(tip, { opacity: 0 });
        if (onDone) onDone();
      }
    });

    // 1. Card exits left — fast
    tl.to(tip, { x: -(TIP_W + 80), duration: 0.24, ease: 'power3.in' })

    // 2. Teleport near folder on right
    .call(() => {
      const r = node.querySelector('.file').getBoundingClientRect();
      gsap.set(tip, {
        left:  r.left + r.width  / 2 - TIP_W / 2,
        top:   r.top  + r.height / 2 - TIP_H / 2,
        x: TIP_W * 0.5, scale: 0.7, opacity: 1,
      });
    })

    // 3. Card shrinks into folder
    .to(tip, { x: 0, scale: 0.1, opacity: 0, duration: 0.3, ease: 'power3.in' }, '>')

    // 4. Folder closes — papers collapse then flap shuts
    .to([w4, w3, w2], { rotateX: 0, duration: 0.28, ease: 'power2.inOut', stagger: 0.04 }, '<0.05')
    .to(w1, { rotateX: 0, translateY: 0, duration: 0.32, ease: 'power2.inOut' }, '<0.08');
  }

  function forceClose() {
    if (activeIdx === null) return;
    const { w1, w2, w3, w4 } = getParts(nodes[activeIdx]);
    gsap.killTweensOf([tip, w1, w2, w3, w4]);
    gsap.set(tip, { opacity: 0 });
    gsap.set([w1, w2, w3, w4], { rotateX: 0, translateY: 0 });
    activeIdx   = null;
    isAnimating = false;
  }

  // ─── CLICK ────────────────────────────────────────────
  nodes.forEach((node, i) => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeIdx === i) {
        closeFolder(i);
      } else if (activeIdx !== null) {
        closeFolder(activeIdx, () => openFolder(i));
      } else {
        openFolder(i);
      }
    });
  });

  // Click anywhere else to close
  document.addEventListener('click', (e) => {
    if (activeIdx === null || isAnimating) return;
    if (e.target.closest('.folder-node') || tip.contains(e.target)) return;
    closeFolder(activeIdx);
  });

  window.addEventListener('resize', positionTip);
});