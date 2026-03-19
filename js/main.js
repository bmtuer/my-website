// ── Page transitions ──
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

document.querySelectorAll('a[href]').forEach(link => {
  if (link.hostname !== window.location.hostname) return;
  if (link.href === window.location.href) return;

  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.href;
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = href; }, 350);
  });
});

// ── Contact form — AJAX submit with toast ──
const contactForm = document.querySelector('.contact-form');
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
        showToast('Message sent — I\'ll be in touch soon!');
      } else {
        showToast('Something went wrong. Try emailing me directly.', true);
      }
    } catch {
      showToast('Something went wrong. Try emailing me directly.', true);
    }
  });
}

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' toast-error' : '');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 4000);
}

// Scramble effect on nav links
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

document.querySelectorAll('.nav-link').forEach(link => {
  const originalText = link.dataset.text;
  let interval = null;
  let iteration = 0;

  link.addEventListener('mouseenter', () => {
    clearInterval(interval);
    iteration = 0;

    interval = setInterval(() => {
      link.childNodes[0].nodeValue = originalText
        .split('')
        .map((char, i) => {
          if (i < iteration) return originalText[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(interval);
        link.childNodes[0].nodeValue = originalText;
      }

      iteration += 0.5;
    }, 40);
  });

  link.addEventListener('mouseleave', () => {
    clearInterval(interval);
    link.childNodes[0].nodeValue = originalText;
  });
});

