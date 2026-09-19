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

// Drag-to-scroll on the work timeline (desktop row layout only —
// overflow-x is only active there; harmless no-op elsewhere since
// scrollWidth won't exceed clientWidth on the tablet/phone vertical stack)
const timelineTrack = document.querySelector('.timeline-track');
if (timelineTrack) {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  timelineTrack.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX;
    startScroll = timelineTrack.scrollLeft;
  });

  window.addEventListener('mouseup', () => { isDown = false; });

  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    timelineTrack.scrollLeft = startScroll - (e.pageX - startX);
  });

  // Edge fades + scroll buttons hinting there's more to scroll to — sized/
  // positioned to match the track exactly (avoids hardcoding
  // .timeline-header's height, which changes across breakpoints), shown/
  // hidden based on scroll position.
  const fadeLeft = document.querySelector('.timeline-fade-left');
  const fadeRight = document.querySelector('.timeline-fade-right');
  const btnLeft = document.querySelector('.timeline-scroll-btn-left');
  const btnRight = document.querySelector('.timeline-scroll-btn-right');

  if (fadeLeft && fadeRight && btnLeft && btnRight) {
    const positionEdgeHints = () => {
      const top = timelineTrack.offsetTop + 'px';
      const height = timelineTrack.offsetHeight + 'px';
      const centerY = timelineTrack.offsetTop + timelineTrack.offsetHeight / 2 + 'px';
      fadeLeft.style.top = top;
      fadeLeft.style.height = height;
      fadeRight.style.top = top;
      fadeRight.style.height = height;
      btnLeft.style.top = centerY;
      btnRight.style.top = centerY;
    };

    const updateEdgeHints = () => {
      const hasOverflow = timelineTrack.scrollWidth > timelineTrack.clientWidth;
      const atStart = timelineTrack.scrollLeft <= 0;
      const atEnd = timelineTrack.scrollLeft + timelineTrack.clientWidth >= timelineTrack.scrollWidth - 1;
      const showLeft = hasOverflow && !atStart;
      const showRight = hasOverflow && !atEnd;
      fadeLeft.classList.toggle('is-visible', showLeft);
      fadeRight.classList.toggle('is-visible', showRight);
      btnLeft.classList.toggle('is-visible', showLeft);
      btnRight.classList.toggle('is-visible', showRight);
    };

    const scrollByOneCard = direction => {
      const card = timelineTrack.querySelector('.timeline-item');
      const step = card ? card.getBoundingClientRect().width : 260;
      timelineTrack.scrollBy({ left: step * direction, behavior: 'smooth' });
    };

    btnLeft.addEventListener('click', () => scrollByOneCard(-1));
    btnRight.addEventListener('click', () => scrollByOneCard(1));

    positionEdgeHints();
    updateEdgeHints();
    timelineTrack.addEventListener('scroll', updateEdgeHints);
    window.addEventListener('resize', () => {
      positionEdgeHints();
      updateEdgeHints();
    });
  }
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

      iteration += 0.4;
    }, 55);
  });

  link.addEventListener('mouseleave', () => {
    clearInterval(interval);
    link.childNodes[0].nodeValue = originalText;
  });
});

