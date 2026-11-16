document.documentElement.classList.add('has-js');

const header = document.getElementById('siteHeader');
const menuButton = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

const updateHeader = () => {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
};

const closeMenu = () => {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
  header?.classList.remove('menu-active');
};

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
    mobileMenu.hidden = !willOpen;
    document.body.classList.toggle('menu-open', willOpen);
    header?.classList.toggle('menu-active', willOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeMenu();
  });
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number.parseInt(entry.target.dataset.delay || '0', 10);
      window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const copyButton = document.getElementById('copyEmail');
const toast = document.getElementById('copyStatus');
let toastTimer;

const showToast = (message) => {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2600);
};

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('Copy command unavailable');
};

copyButton?.addEventListener('click', async () => {
  try {
    await copyText(copyButton.dataset.email || '');
    copyButton.textContent = 'Copied';
    showToast('Email address copied to clipboard.');
    window.setTimeout(() => { copyButton.textContent = 'Copy email'; }, 2200);
  } catch {
    showToast('Copy unavailable. Please select the email address above.');
  }
});
