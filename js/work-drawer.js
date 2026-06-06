// Work Case Study Drawer
document.addEventListener('DOMContentLoaded', () => {
  const drawer   = document.getElementById('work-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');
  const cards    = document.querySelectorAll('.work-card[data-title]');

  if (!drawer) return;

  function openDrawer(card) {
    const d = card.dataset;

    // Populate content
    document.getElementById('drawer-hero').style.backgroundImage = `url('${d.hero}')`;
    document.getElementById('drawer-category').textContent  = d.category  || '';
    document.getElementById('drawer-title').textContent     = d.title     || '';
    document.getElementById('drawer-challenge').textContent = d.challenge || '';
    document.getElementById('drawer-solution').textContent  = d.solution  || '';
    document.getElementById('drawer-results').textContent   = d.results   || '';

    // Tags
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

    // Open
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    if (window._lenis) window._lenis.stop();

    // Scroll panel to top
    drawer.querySelector('.work-drawer-panel').scrollTop = 0;
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    if (window._lenis) window._lenis.start();
  }

  // Open on card click
  cards.forEach(card => {
    card.addEventListener('click', () => openDrawer(card));
    card.style.cursor = 'pointer';
  });

  // Close on backdrop or button
  backdrop.addEventListener('click', closeDrawer);
  closeBtn.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });
});