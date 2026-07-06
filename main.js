// ── Inscrições ─────────────────────────────────────────────────────────────
// Defina true durante o período de inscrições para exibir o banner
const INSCRICOES_ABERTAS = true;

const banner = document.getElementById('inscricao-banner');
if (banner && INSCRICOES_ABERTAS) {
  banner.removeAttribute('hidden');
  const closeBtn = document.getElementById('inscricao-close');
  if (closeBtn) closeBtn.addEventListener('click', () => banner.setAttribute('hidden', ''));
}

// Logo → scroll to top
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
  navLogo.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Nav mobile toggle
const toggle = document.querySelector('.nav-toggle');
const links  = document.querySelector('.nav-links');

if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Scroll-reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const start  = target > 1000 ? target - 30 : 0;
  const dur    = 1200;
  let t0 = null;

  function step(ts) {
    if (!t0) t0 = ts;
    const pct   = Math.min((ts - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (pct < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// Collapsible semester blocks (projetos.html)
document.querySelectorAll('.semester-block').forEach(block => {
  const heading = block.querySelector('.semester-heading');
  if (!heading) return;

  // Wrap content after heading in a collapsible body
  const body = document.createElement('div');
  body.className = 'semester-body';
  while (heading.nextSibling) body.appendChild(heading.nextSibling);
  block.appendChild(body);

  // Replace div with a button for accessibility
  const btn = document.createElement('button');
  btn.className = 'semester-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = heading.innerHTML +
    `<svg class="semester-chevron" aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
       <path d="M5 8l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
     </svg>`;
  heading.replaceWith(btn);

  // Collapsed by default
  block.classList.add('collapsed');
  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', () => {
    const collapsed = block.classList.toggle('collapsed');
    btn.setAttribute('aria-expanded', String(!collapsed));
  });
});

