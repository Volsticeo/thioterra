// Project Case Study Overlay — Magazine Layout
document.addEventListener('DOMContentLoaded', () => {

  const overlay  = document.getElementById('casestudy-overlay');
  const closeBtn = document.getElementById('casestudy-close');
  const panel    = overlay?.querySelector('.cs-panel');
  const cards    = document.querySelectorAll('.project-card[data-title]');

  if (!overlay || !panel) return;

  let currentGallery = [];
  let currentIndex   = 0;

  function openOverlay(card) {
    if (card.classList.contains('confidential')) return;
    const d = card.dataset;

    // Hero
    overlay.querySelector('.cs-hero').style.backgroundImage = d.hero ? `url('${d.hero}')` : 'none';

    // Title band
    overlay.querySelector('.cs-category').textContent = d.category || '';
    overlay.querySelector('.cs-title').textContent    = d.title    || '';
    overlay.querySelector('.cs-overview').textContent = d.overview || '';
    overlay.querySelector('.cs-client').textContent   = d.client   || '—';
    overlay.querySelector('.cs-industry').textContent = d.industry || '—';
    overlay.querySelector('.cs-timeline').textContent = d.timeline || '—';
    overlay.querySelector('.cs-year').textContent     = d.year     || '—';

    // Tags
    const tagsEl = overlay.querySelector('.cs-tags');
    tagsEl.innerHTML = '';
    if (d.tags) {
      d.tags.split(',').forEach(tag => {
        const span = document.createElement('span');
        span.className = 'cs-tag';
        span.textContent = tag.trim();
        tagsEl.appendChild(span);
      });
    }

    // Content sections
    overlay.querySelector('.cs-challenge').textContent = d.challenge || '';
    overlay.querySelector('.cs-solution').textContent  = d.solution  || '';
    overlay.querySelector('.cs-results').textContent   = d.results   || '';

    // Deliverables
    const delEl = overlay.querySelector('.cs-deliverables');
    delEl.innerHTML = '';
    if (d.deliverables) {
      d.deliverables.split(',').forEach(item => {
        const li = document.createElement('li');
        li.className = 'cs-deliverable-item';
        li.textContent = item.trim();
        delEl.appendChild(li);
      });
    }

    // Gallery
    currentGallery = [];
    const galleryEl      = overlay.querySelector('.cs-gallery');
    const gallerySection = overlay.querySelector('.cs-gallery-section');
    galleryEl.innerHTML  = '';

    if (d.gallery) {
      const imgs = d.gallery.split(',').map(s => s.trim());
      currentGallery = imgs;
      imgs.forEach((src, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'cs-gallery-thumb';
        thumb.style.backgroundImage = `url('${src}')`;
        thumb.addEventListener('click', () => setGalleryMain(i));
        galleryEl.appendChild(thumb);
      });
      gallerySection.style.display = '';
      setGalleryMain(0);
    } else {
      gallerySection.style.display = 'none';
    }

    // Open
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    panel.scrollTop = 0;
    document.body.classList.add('casestudy-open');
    if (window._lenis) window._lenis.stop();
    panel.focus();
  }

  function setGalleryMain(index) {
    currentIndex = index;
    overlay.querySelector('.cs-gallery-main').style.backgroundImage = `url('${currentGallery[index]}')`;
    overlay.querySelectorAll('.cs-gallery-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  function closeOverlay() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('casestudy-open');
    if (window._lenis) window._lenis.start();
  }

  overlay.querySelector('.cs-gallery-prev')?.addEventListener('click', () => {
    if (currentGallery.length > 1)
      setGalleryMain((currentIndex - 1 + currentGallery.length) % currentGallery.length);
  });
  overlay.querySelector('.cs-gallery-next')?.addEventListener('click', () => {
    if (currentGallery.length > 1)
      setGalleryMain((currentIndex + 1) % currentGallery.length);
  });

  panel.addEventListener('wheel',     e => e.stopPropagation(), { passive: true });
  panel.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });

  cards.forEach(card => {
    if (!card.classList.contains('confidential')) {
      card.addEventListener('click', () => openOverlay(card));
      card.style.cursor = 'pointer';
    }
  });

  closeBtn.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });
});