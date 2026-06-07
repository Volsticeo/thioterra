/* ═══════════════════════════════════════════════════════
   THIOTERRA — ABOUT.JS
   Story section: pin left column while right side scrolls
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // Wait for GSAP + ScrollTrigger to be ready
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const storySection = document.querySelector('.story-section');
  const storyLeft    = document.querySelector('.story-left');
  const storyRight   = document.querySelector('.story-right');

  if (!storySection || !storyLeft || !storyRight) return;

  // ── Remove CSS sticky so GSAP takes full control ───
  storyLeft.style.position = 'relative';
  storyLeft.style.top      = 'auto';

  // ── Pin left column while right side scrolls ───────
  // start: when section top hits the navbar bottom
  // end:   when section bottom hits the viewport bottom
  ScrollTrigger.create({
    trigger  : storySection,
    start    : 'top top+=80',
    end      : 'bottom bottom',
    pin      : storyLeft,
    pinSpacing: false,
    anticipatePin: 1,
  });

  // ── Subtle fade-in for right paragraphs on scroll ──
  const paras = document.querySelectorAll('.story-para');
  paras.forEach((p, i) => {
    gsap.fromTo(p,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: p,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

});