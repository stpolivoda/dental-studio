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
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });

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

initBookingModal();
