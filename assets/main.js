// Interacciones del sitio: tema, idioma, animaciones de entrada, terminal, métricas y copiar correo.
(() => {
  const root = document.documentElement;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } },
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // tema claro/oscuro
  const themeBtn = document.getElementById('theme');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    store.set('sb-theme', next);
  });

  // recordar el idioma elegido (evita la redirección automática)
  document.querySelectorAll('[data-lang]').forEach((a) => a.addEventListener('click', () => store.set('sb-lang', a.dataset.lang)));

  // año del pie de página según la fecha actual
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // barra superior con borde al hacer scroll
  const bar = document.querySelector('.topbar');
  const onScroll = () => bar && bar.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // terminal: las líneas aparecen una a una
  document.querySelectorAll('.terminal .ln').forEach((l, i) => l.style.setProperty('--d', i));

  // animaciones al entrar en pantalla
  const show = (el) => {
    el.classList.add('in');
    if (el.classList.contains('terminal')) el.classList.add('typed');
  };
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduced) items.forEach(show);
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }

  // enlace activo en el menú
  const links = [...document.querySelectorAll('.nav-links a')];
  const secs = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && secs.length) {
    const nav = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach((s) => nav.observe(s));
  }

  // copiar correo
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const label = b.textContent;
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) { return; }
    b.textContent = b.dataset.done; b.classList.add('done');
    setTimeout(() => { b.textContent = label; b.classList.remove('done'); }, 1800);
  }));
})();
