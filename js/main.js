// Dental Studio - main behavior: nav toggle, header scroll state,
// scroll-reveal, booking modal.

import { isValidName, isValidPhone } from './validators.js';

function initNavToggle() {
  const toggle = document.querySelector('.js-nav-toggle');
  const nav = document.getElementById('nav-menu');
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  });

  const closeBtn = nav.querySelector('.js-nav-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
}

initNavToggle();

function initFooterYear() {
  const el = document.querySelector('.js-year');
  if (el) el.textContent = String(new Date().getFullYear());
}

initFooterYear();

// TODO: replace with the clinic's real email address before going live.
// FormSubmit.co requires a one-time confirmation click sent to this address
// the first time the form is submitted from this domain.
const BOOKING_EMAIL = 'doctor@example.com';

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

function setupBookingForm(form) {
  const statusEl = form.querySelector('[data-status]');
  if (!statusEl) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = form.elements.namedItem('name');
    const phoneInput = form.elements.namedItem('phone');
    const serviceInput = form.elements.namedItem('service');
    const messageInput = form.elements.namedItem('message');
    const nameError = form.querySelector('[data-error-for="name"]');
    const phoneError = form.querySelector('[data-error-for="phone"]');

    let valid = true;

    if (!isValidName(nameInput.value)) {
      nameError.textContent = "Введіть, будь ласка, ім'я (мінімум 2 символи).";
      valid = false;
    } else {
      nameError.textContent = '';
    }

    if (!isValidPhone(phoneInput.value)) {
      phoneError.textContent = 'Введіть коректний номер телефону.';
      valid = false;
    } else {
      phoneError.textContent = '';
    }

    if (!valid) return;

    statusEl.dataset.state = '';
    statusEl.textContent = 'Надсилаємо...';

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${BOOKING_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          phone: phoneInput.value.trim(),
          service: serviceInput.value,
          message: messageInput.value.trim(),
          _subject: 'Нова заявка на запис — Dental Studio',
        }),
      });

      if (!response.ok) throw new Error('Request failed');

      statusEl.dataset.state = 'success';
      statusEl.textContent = 'Дякуємо! Ми зв’яжемося з вами найближчим часом.';
      form.reset();
    } catch (error) {
      statusEl.dataset.state = 'error';
      statusEl.textContent = 'Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам.';
    }
  });
}

function initBookingModal() {
  const overlay = document.querySelector('.js-modal-overlay');
  const modal = overlay?.querySelector('.modal');
  const closeBtn = overlay?.querySelector('.js-modal-close');
  const form = overlay?.querySelector('.js-booking-form');
  const statusEl = form?.querySelector('[data-status]');
  const openButtons = document.querySelectorAll('.js-open-modal');

  if (!overlay || !modal || !form || !statusEl) return;

  let lastFocused = null;

  function onKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = getFocusableElements(modal);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function openModal() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
    getFocusableElements(modal)[0]?.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  openButtons.forEach((btn) => btn.addEventListener('click', openModal));
  closeBtn?.addEventListener('click', closeModal);

  let overlayMouseDown = false;
  overlay.addEventListener('mousedown', (event) => {
    overlayMouseDown = event.target === overlay;
  });
  overlay.addEventListener('click', (event) => {
    if (overlayMouseDown && event.target === overlay) closeModal();
    overlayMouseDown = false;
  });

  setupBookingForm(form);
}

initBookingModal();

function initContactForm() {
  const form = document.querySelector('.js-contact-form');
  if (!form) return;
  setupBookingForm(form);
}

initContactForm();

function initHeaderScrollState() {
  const header = document.getElementById('header');
  const sentinel = document.getElementById('scroll-sentinel');
  if (!header || !sentinel) return;

  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle('is-scrolled', !entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(sentinel);
}

function initScrollReveal() {
  const targets = document.querySelectorAll('main > section:not(.hero):not(.cta-banner), .footer');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  targets.forEach((el) => el.classList.add('reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

function initHeroReveal() {
  const targets = document.querySelectorAll('.hero__location, .hero__title, .hero__subtitle, .hero .btn');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      targets.forEach((el) => el.classList.add('is-visible'));
    });
  });
}

function initPhotoZoom() {
  const images = document.querySelectorAll('.about__photo img, .hero__bg img');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (images.length === 0) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    images.forEach((img) => img.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  images.forEach((img) => observer.observe(img));
}

function initCtaPhotoReveal() {
  const section = document.querySelector('.cta-banner');
  const photos = document.querySelectorAll('.cta-banner__photo');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (!section || photos.length === 0 || reduceMotion || isMobile) return;

  let ticking = false;

  function update() {
    const viewportHeight = window.innerHeight;
    const rect = section.getBoundingClientRect();
    const pinnedDistance = rect.height - viewportHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / pinnedDistance));
    const travel = viewportHeight * 0.4;
    const offset = travel * (0.5 - progress);

    photos.forEach((photo) => {
      photo.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

function initFaqAccordion() {
  const details = document.querySelectorAll('.faq__details');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (details.length === 0) return;

  function animate(answer, opening) {
    if (reduceMotion) return Promise.resolve();
    const frames = opening
      ? [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'translateY(0)' }]
      : [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-4px)' }];
    return answer.animate(frames, {
      duration: opening ? 300 : 180,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both',
    }).finished;
  }

  function closeDetail(detail) {
    const answer = detail.querySelector('.faq__a');
    if (!answer || reduceMotion) { detail.open = false; return Promise.resolve(); }
    return animate(answer, false).then(() => { detail.open = false; }, () => { detail.open = false; });
  }

  details.forEach((detail) => {
    detail.querySelector('.faq__q').addEventListener('click', (e) => {
      e.preventDefault();
      if (detail.open) {
        closeDetail(detail);
      } else {
        const closing = [];
        details.forEach((other) => { if (other !== detail && other.open) closing.push(closeDetail(other)); });
        Promise.all(closing).then(() => {
          detail.open = true;
          const answer = detail.querySelector('.faq__a');
          if (answer) animate(answer, true);
        });
      }
    });
  });
}

function initSvcHeroParallax() {
  const sidePhotos = document.querySelectorAll('.js-svc-side');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (sidePhotos.length === 0 || reduceMotion || isMobile) return;

  let ticking = false;

  function update() {
    const offset = window.scrollY * 0.12;
    sidePhotos.forEach((photo) => {
      photo.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

function initProcessHighlight() {
  const steps = document.querySelectorAll('.process__step');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (steps.length === 0 || reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        steps.forEach((step) => step.classList.remove('is-active'));
        entry.target.classList.add('is-active');
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  steps.forEach((step) => observer.observe(step));
}

function initTestimonialsCarousel() {
  const carousel = document.querySelector('.js-testimonials-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.testimonials__track');
  const slides = Array.from(carousel.querySelectorAll('.testimonial'));
  const dotsContainer = carousel.parentElement?.querySelector('.js-testimonials-dots');
  const prevBtn = carousel.querySelector('.js-testimonials-prev');
  const nextBtn = carousel.querySelector('.js-testimonials-next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 30; // pixels per second
  const EASE_RATE = 4; // how quickly currentSpeed eases toward targetSpeed

  if (slides.length <= 1) return;

  let offset = 0;
  let direction = 1;
  let currentSpeed = SPEED;
  let targetSpeed = SPEED;
  let lastTime = null;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'testimonials__dot';
    dot.setAttribute('aria-label', `Перейти до відгуку ${index + 1}`);
    dot.addEventListener('click', () => goToIndex(index));
    dotsContainer?.appendChild(dot);
    return dot;
  });

  function getStep() {
    return slides[1].offsetLeft - slides[0].offsetLeft;
  }

  function getMaxOffset() {
    return Math.max(0, track.scrollWidth - carousel.clientWidth);
  }

  function render() {
    track.style.transform = `translateX(-${offset}px)`;
    const maxOffset = getMaxOffset();
    const progress = maxOffset > 0 ? offset / maxOffset : 0;
    const activeIndex = Math.round(progress * (slides.length - 1));
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
      dot.setAttribute('aria-current', String(index === activeIndex));
    });
  }

  function goToIndex(index) {
    offset = Math.min(Math.max(getStep() * index, 0), getMaxOffset());
    render();
  }

  function tick(time) {
    if (lastTime !== null) {
      const delta = (time - lastTime) / 1000;
      const maxOffset = getMaxOffset();
      const easeAmount = Math.min(1, delta * EASE_RATE);
      currentSpeed += (targetSpeed - currentSpeed) * easeAmount;
      offset += direction * currentSpeed * delta;
      if (offset >= maxOffset) {
        offset = maxOffset;
        direction = -1;
      } else if (offset <= 0) {
        offset = 0;
        direction = 1;
      }
      render();
    }
    lastTime = time;
    requestAnimationFrame(tick);
  }

  prevBtn?.addEventListener('click', () => {
    offset = Math.max(offset - getStep(), 0);
    direction = -1;
    render();
  });

  nextBtn?.addEventListener('click', () => {
    offset = Math.min(offset + getStep(), getMaxOffset());
    direction = 1;
    render();
  });

  carousel.addEventListener('mouseenter', () => { targetSpeed = 0; });
  carousel.addEventListener('mouseleave', () => { targetSpeed = SPEED; });
  carousel.addEventListener('focusin', () => { targetSpeed = 0; });
  carousel.addEventListener('focusout', () => { targetSpeed = SPEED; });

  window.addEventListener('resize', () => {
    offset = Math.min(offset, getMaxOffset());
    render();
  });

  render();

  if (!reduceMotion) {
    requestAnimationFrame(tick);
  }
}

initHeaderScrollState();
initScrollReveal();
initHeroReveal();
initPhotoZoom();
initCtaPhotoReveal();
initFaqAccordion();
initSvcHeroParallax();
initProcessHighlight();
initTestimonialsCarousel();
