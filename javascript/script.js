const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  mainNav?.classList.toggle('open', !expanded);
});

const dialog = document.querySelector('#signin-dialog');
document.querySelectorAll('[data-signin]').forEach(button => button.addEventListener('click', () => dialog?.showModal()));
document.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const search = document.querySelector('#resource-search');
search?.addEventListener('submit', event => {
  event.preventDefault();
  const query = document.querySelector('#search-input')?.value.trim();
  if (!query) return document.querySelector('#search-input')?.focus();
  const target = document.querySelector('#faculties');
  target?.scrollIntoView({ behavior: 'smooth' });
  const toast = document.querySelector('#toast');
  if (toast) {
    toast.textContent = `Search for “${query}” will be available when the resource library is connected.`;
    toast.classList.add('show');
    window.clearTimeout(window.studentDeskToast);
    window.studentDeskToast = window.setTimeout(() => toast.classList.remove('show'), 3200);
  }
});
