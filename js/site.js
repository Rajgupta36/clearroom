// Clearroom site motion. Subtle on purpose: short fades and small moves, run once.
// Uses Motion (js/motion.js, motion.dev). With Reduce Motion on, nothing animates.
(() => {
  window.__siteReady = true;
  const root = document.documentElement;
  const top = document.querySelector('.top');
  const onScroll = () => top && top.classList.toggle('scrolled', window.scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const M = window.Motion;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!M || reduce) { root.classList.remove('motion'); return; }
  const { animate, inView, scroll, stagger } = M;
  const ease = [0.22, 1, 0.36, 1];

  // Hero: text rises in line by line, then the phone settles in and floats gently.
  const heroText = document.querySelector('[data-hero-text]');
  if (heroText) {
    animate([...heroText.children], { opacity: [0, 1], y: [14, 0] }, { duration: 0.8, delay: stagger(0.07), ease });
  }
  const stage = document.querySelector('[data-hero-phone]');
  if (stage) {
    const phone = stage.querySelector('.phone');
    animate(stage, { opacity: [0, 1], y: [36, 0], scale: [0.97, 1] }, { duration: 1.1, delay: 0.25, ease });
    animate(phone, { y: [0, -8, 0] }, { duration: 7, delay: 1.4, repeat: Infinity, ease: 'easeInOut' });
  }

  // Sections fade up once as they come into view.
  inView('[data-reveal]', (el) => {
    animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.9, ease });
  }, { margin: '0px 0px -12% 0px' });

  inView('[data-stagger]', (el) => {
    animate([...el.children], { opacity: [0, 1], y: [18, 0] }, { duration: 0.8, delay: stagger(0.07), ease });
  }, { margin: '0px 0px -12% 0px' });

  // Numbers count up to their real value.
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    el.textContent = '0';
    inView(el, () => {
      animate(0, to, { duration: 1.2, delay: 0.2, ease, onUpdate: (v) => { el.textContent = Math.round(v); } });
    });
  });

  // Feature phones drift a little slower than the page (wide screens only).
  if (matchMedia('(min-width: 861px)').matches) {
    document.querySelectorAll('.feature .phone, .band .phone').forEach((phone) => {
      scroll(animate(phone, { y: [30, -30] }, { ease: 'linear' }), {
        target: phone.closest('.feature, .band'),
        offset: ['start end', 'end start'],
      });
    });
  }

  // FAQ answers ease in when opened.
  document.querySelectorAll('.faq details').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      const body = [...d.children].filter((c) => c.tagName !== 'SUMMARY');
      animate(body, { opacity: [0, 1], y: [-4, 0] }, { duration: 0.35, ease });
    });
  });
})();
