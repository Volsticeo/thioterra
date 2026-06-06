// Footer Reveal — exact Ovina implementation
// CTA section pins, footer slides up over it

document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const isContactPage = !!document.querySelector('.contact-section') && !document.querySelector('.cta-section');
  const cta    = isContactPage
    ? document.querySelector('.contact-section')
    : document.querySelector('.cta-section');
  const footer = document.querySelector('.footer');

  if (!cta || !footer) return;

  // On contact page — pin the contact section bottom, footer slides up
  if (isContactPage) {
    ScrollTrigger.create({
      trigger:        cta,
      start:          'bottom bottom',
      end:            () => `+=${footer.offsetHeight}`,
      pin:            true,
      pinSpacing:     false,
      anticipatePin:  1,
      invalidateOnRefresh: true,
    });

    gsap.fromTo(footer,
      { y: 0 },
      {
        y: 0,
        scrollTrigger: {
          trigger:  footer,
          start:    'top bottom',
          end:      'top top',
          scrub:    0.5,
          invalidateOnRefresh: true,
        }
      }
    );
    return;
  }

  // Pin the CTA section
  ScrollTrigger.create({
    trigger:        cta,
    start:          'top top',
    end:            () => `+=${footer.offsetHeight}`,
    pin:            true,
    pinSpacing:     false,
    anticipatePin:  1,
    invalidateOnRefresh: true,
  });

  // Footer slides up over pinned CTA
  gsap.fromTo(footer,
    { y: 0 },
    {
      y: 0,
      scrollTrigger: {
        trigger:  footer,
        start:    'top bottom',
        end:      'top top',
        scrub:    0.5,
        invalidateOnRefresh: true,
      }
    }
  );

  // Refresh on resize
  window.addEventListener('resize', function() {
    ScrollTrigger.refresh();
  });
});