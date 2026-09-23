(() => {
  const header = document.querySelector('.signal-header');
  const menu = document.querySelector('.signal-menu');
  const nav = document.querySelector('#site-navigation');
  if (header && menu && nav) {
    header.dataset.enhanced = 'true';
    const close = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) { close(); menu.focus(); }
    });
    matchMedia('(max-width: 1050px)').addEventListener('change', close);
  }
  const params = new URLSearchParams(location.search);
  const service = document.querySelector('select[name="service"]');
  if (service && [...service.options].some(option => option.value === params.get('service'))) service.value = params.get('service');
  const status = document.querySelector('#inquiry-status');
  if (status && params.get('submitted') === 'true') status.hidden = false;
  // Old bookmarked inquiry fragments retain a path to the paid engagement.
  const legacyInquiry = () => {
    if (['/', '/index.html'].includes(location.pathname) && ['#free-audit', '#contact'].includes(location.hash)) {
      location.replace('/contact.html?service=Business%20Signal%20Diagnostic#inquiry');
    }
  };
  legacyInquiry();
  window.addEventListener('hashchange', legacyInquiry);
})();
