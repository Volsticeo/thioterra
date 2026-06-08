// Work Case Study Drawer
document.addEventListener('DOMContentLoaded', () => {
  const drawer      = document.getElementById('work-drawer');
  const backdrop    = document.getElementById('drawer-backdrop');
  const closeBtn    = document.getElementById('drawer-close');
  const drawerPanel = document.querySelector('.work-drawer-panel');
  const cards       = document.querySelectorAll('.work-card[data-title]');

  if (!drawer || !drawerPanel) return;

  // Manual wheel scroll on panel — bypasses Lenis's preventDefault
  drawerPanel.addEventListener('wheel', (e) => {
    e.stopPropagation();
    drawerPanel.scrollTop += e.deltaY;
    e.preventDefault();
  }, { passive: false });

  function openDrawer(card) {
    const d = card.dataset;

    // Populate content
    document.getElementById('drawer-hero').style.backgroundImage = `url('${d.hero}')`;
    document.getElementById('drawer-category').textContent  = d.category  || '';
    document.getElementById('drawer-title').textContent     = d.title     || '';
    document.getElementById('drawer-challenge').textContent = d.challenge || '';
    document.getElementById('drawer-solution').textContent  = d.solution  || '';
    document.getElementById('drawer-results').textContent   = d.results   || '';

    const tagsEl = document.getElementById('drawer-tags');
    tagsEl.innerHTML = '';
    if (d.tags) {
      d.tags.split(',').forEach(tag => {
        const span = document.createElement('span');
        span.className = 'drawer-tag';
        span.textContent = tag.trim();
        tagsEl.appendChild(span);
      });
    }

    // Stop Lenis + lock html overflow — no layout shift, no scroll jump
    if (window._lenis) window._lenis.stop();
    document.documentElement.classList.add('drawer-open');

    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerPanel.scrollTop = 0;
    closeBtn?.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');

    // Unlock and restart Lenis
    document.documentElement.classList.remove('drawer-open');
    if (window._lenis) window._lenis.start();
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openDrawer(card));
    card.style.cursor = 'pointer';
  });

  backdrop.addEventListener('click', closeDrawer);
  closeBtn.addEventListener('click',  closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });
});