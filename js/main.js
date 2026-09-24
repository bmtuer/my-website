// ── Day / Night switch ──
// The initial look is set by the inline script in each page's <head>
// (saved choice → OS setting) so there's no flash. This just flips it.
const root = document.documentElement;
const lookSwitch = document.querySelector('.look-switch');

function syncLookSwitch() {
  if (lookSwitch) lookSwitch.setAttribute('aria-checked', root.dataset.look === 'night' ? 'true' : 'false');
}
syncLookSwitch();

if (lookSwitch) {
  lookSwitch.addEventListener('click', () => {
    const next = root.dataset.look === 'night' ? 'day' : 'night';
    const apply = () => { root.dataset.look = next; syncLookSwitch(); };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (document.startViewTransition && !reduceMotion) document.startViewTransition(apply);
    else apply();

    try { localStorage.setItem('bt-look', next); } catch { /* private mode: look just won't persist */ }
  });
}

// ── Dithered photos (Night look) ──
// Each <canvas class="dither" data-src> gets a 1-bit ordered (Bayer 4×4)
// dither of its photo in amber. Drawn once on load; CSS decides whether
// it's visible. data-x / data-y (0–1) set the crop focus like object-position.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

document.querySelectorAll('canvas.dither').forEach(canvas => {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const fx = parseFloat(canvas.dataset.x || '0.5');
  const fy = parseFloat(canvas.dataset.y || '0.5');

  const img = new Image();
  img.onload = () => {
    const scale = Math.max(W / img.width, H / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, (W - dw) * fx, (H - dh) * fy, dw, dh);

    let frame;
    try { frame = ctx.getImageData(0, 0, W, H); } catch { return; } // file:// previews block pixel reads
    const p = frame.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const lum = Math.min(1, Math.pow((0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255, 0.8) * 1.15);
        const on = lum > (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
        p[i] = on ? 232 : 11;
        p[i + 1] = on ? 176 : 12;
        p[i + 2] = on ? 75 : 16;
        p[i + 3] = 255;
      }
    }
    ctx.putImageData(frame, 0, 0);
  };
  img.src = canvas.dataset.src;
});

// ── Contact form — AJAX submit with toast ──
const contactForm = document.querySelector('.note-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(contactForm);
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        contactForm.reset();
        showToast('Sent. I\'ll get back to you soon.');
      } else {
        showToast('That didn\'t go through. Try emailing me directly.', true);
      }
    } catch {
      showToast('That didn\'t go through. Try emailing me directly.', true);
    }
  });
}

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' toast-error' : '');
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 4000);
}

// ── Drag-to-scroll on the work timeline (mouse only; touch scrolls natively) ──
const track = document.querySelector('.track');
if (track) {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener('mousedown', e => {
    if (track.scrollWidth <= track.clientWidth) return;
    isDown = true;
    startX = e.pageX;
    startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('is-dragging');
  });

  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = startScroll - (e.pageX - startX);
  });
}

// ── Scroll-spy: highlight the nav link for the section in view ──
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function markCurrent(id) {
  navLinks.forEach(link => {
    if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

// After a nav click, show the destination right away and ignore the spy
// while the smooth scroll passes through the sections in between.
let spyPausedUntil = 0;
navLinks.forEach(link => link.addEventListener('click', () => {
  markCurrent(link.getAttribute('href').slice(1));
  spyPausedUntil = Date.now() + 1200;
}));
window.addEventListener('scrollend', () => { spyPausedUntil = 0; });

if (sections.length && 'IntersectionObserver' in window) {
  // A section counts as "current" once it crosses a line ~35% down the viewport.
  // (The last section has a min-height in CSS so it always reaches that line.)
  const spy = new IntersectionObserver(entries => {
    if (Date.now() < spyPausedUntil) return;
    entries.forEach(entry => { if (entry.isIntersecting) markCurrent(entry.target.id); });
  }, { rootMargin: '-35% 0px -64% 0px' });
  sections.forEach(section => spy.observe(section));
}

// ── Scramble effect on nav links ──
const chars = 'abcdefghijklmnopqrstuvwxyz';

document.querySelectorAll('.nav-link').forEach(link => {
  const originalText = link.dataset.text;
  let interval = null;
  let iteration = 0;

  link.addEventListener('mouseenter', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(interval);
    iteration = 0;

    interval = setInterval(() => {
      link.textContent = originalText
        .split('')
        .map((char, i) => (i < iteration ? originalText[i] : chars[Math.floor(Math.random() * chars.length)]))
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(interval);
        link.textContent = originalText;
      }

      iteration += 0.4;
    }, 55);
  });

  link.addEventListener('mouseleave', () => {
    clearInterval(interval);
    link.textContent = originalText;
  });
});
