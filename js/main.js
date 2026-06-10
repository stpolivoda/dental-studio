// Dental Studio - main behavior: nav toggle, header scroll state,
// scroll-reveal, booking modal.

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
