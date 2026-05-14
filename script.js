/* ════════════════════════════════════════════
RAUMHANDWERK.DE — SCRIPT.JS
════════════════════════════════════════════ */

‘use strict’;

/* ── COOKIE BANNER ──────────────────────────── */
(function initCookies() {
const banner = document.getElementById(‘cookieBanner’);
if (!banner) return;
if (localStorage.getItem(‘rh_cookies’)) {
banner.classList.add(‘hide’);
}
})();

function acceptCookies() {
localStorage.setItem(‘rh_cookies’, ‘accepted’);
const b = document.getElementById(‘cookieBanner’);
if (b) {
b.style.transition = ‘opacity .4s, transform .4s’;
b.style.opacity = ‘0’;
b.style.transform = ‘translateY(20px)’;
setTimeout(() => b.classList.add(‘hide’), 420);
}
}

function declineCookies() {
localStorage.setItem(‘rh_cookies’, ‘declined’);
const b = document.getElementById(‘cookieBanner’);
if (b) {
b.style.transition = ‘opacity .4s, transform .4s’;
b.style.opacity = ‘0’;
b.style.transform = ‘translateY(20px)’;
setTimeout(() => b.classList.add(‘hide’), 420);
}
}

/* ── STICKY HEADER ──────────────────────────── */
(function initHeader() {
const header = document.getElementById(‘siteHeader’);
if (!header) return;

function onScroll() {
header.classList.toggle(‘scrolled’, window.scrollY > 60);
}
window.addEventListener(‘scroll’, onScroll, { passive: true });
onScroll();
})();

/* ── MOBILE MENU ────────────────────────────── */
(function initMobileMenu() {
const btn   = document.getElementById(‘hamburger’);
const links = document.getElementById(‘navLinks’);
if (!btn || !links) return;

btn.addEventListener(‘click’, () => {
const isOpen = links.classList.toggle(‘open’);
btn.classList.toggle(‘open’, isOpen);
btn.setAttribute(‘aria-expanded’, String(isOpen));
document.body.style.overflow = isOpen ? ‘hidden’ : ‘’;
});

// Close on link click
links.querySelectorAll(‘a’).forEach(a => {
a.addEventListener(‘click’, () => {
links.classList.remove(‘open’);
btn.classList.remove(‘open’);
btn.setAttribute(‘aria-expanded’, ‘false’);
document.body.style.overflow = ‘’;
});
});

// Close on outside click
document.addEventListener(‘click’, e => {
if (!btn.contains(e.target) && !links.contains(e.target)) {
links.classList.remove(‘open’);
btn.classList.remove(‘open’);
btn.setAttribute(‘aria-expanded’, ‘false’);
document.body.style.overflow = ‘’;
}
});
})();

/* ── SCROLL REVEAL (IntersectionObserver) ───── */
(function initReveal() {
const els = document.querySelectorAll(’.reveal-up, .reveal-left, .reveal-right’);
if (!els.length) return;

const io = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add(‘visible’);
io.unobserve(entry.target);
}
});
}, { threshold: 0.12, rootMargin: ‘0px 0px -40px 0px’ });

els.forEach(el => io.observe(el));
})();

/* ── COUNTER ANIMATION ──────────────────────── */
(function initCounters() {
const counters = document.querySelectorAll(’.counter’);
if (!counters.length) return;

function animateCounter(el) {
const target = parseInt(el.dataset.target, 10);
const duration = 1800;
const start = performance.now();

```
function step(now) {
  const elapsed = now - start;
  const progress = Math.min(elapsed / duration, 1);
  // Ease out cubic
  const ease = 1 - Math.pow(1 - progress, 3);
  el.textContent = Math.round(ease * target);
  if (progress < 1) requestAnimationFrame(step);
}
requestAnimationFrame(step);
```

}

const io = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
animateCounter(entry.target);
io.unobserve(entry.target);
}
});
}, { threshold: 0.5 });

counters.forEach(c => io.observe(c));
})();

/* ── GALLERY FILTER ─────────────────────────── */
(function initGalleryFilter() {
const filterBtns = document.querySelectorAll(’.gf-btn’);
const galleryItems = document.querySelectorAll(’.g-item’);
if (!filterBtns.length || !galleryItems.length) return;

filterBtns.forEach(btn => {
btn.addEventListener(‘click’, () => {
filterBtns.forEach(b => b.classList.remove(‘active’));
btn.classList.add(‘active’);

```
  const filter = btn.dataset.filter;

  galleryItems.forEach((item, i) => {
    const cat = item.dataset.cat;
    const show = filter === 'all' || cat === filter;

    if (show) {
      item.classList.remove('hide');
      item.style.animation = '';
      item.style.opacity = '0';
      item.style.transform = 'scale(.95)';
      setTimeout(() => {
        item.style.transition = `opacity .4s ease ${i * 0.05}s, transform .4s ease ${i * 0.05}s`;
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      }, 20);
    } else {
      item.classList.add('hide');
    }
  });
});
```

});
})();

/* ── LIGHTBOX ───────────────────────────────── */
(function initLightbox() {
const lightbox  = document.getElementById(‘lightbox’);
const lbImg     = document.getElementById(‘lbImg’);
const lbCaption = document.getElementById(‘lbCaption’);
const lbClose   = document.getElementById(‘lbClose’);
const lbPrev    = document.getElementById(‘lbPrev’);
const lbNext    = document.getElementById(‘lbNext’);
if (!lightbox) return;

let items = [];
let currentIndex = 0;

function getVisibleItems() {
return Array.from(document.querySelectorAll(’.g-item:not(.hide)’));
}

function openLightbox(index) {
const visible = getVisibleItems();
if (!visible.length) return;
currentIndex = index;
const item = visible[currentIndex];
const img  = item.querySelector(‘img’);
const span = item.querySelector(’.g-overlay span’);
lbImg.src          = img ? img.src.replace(/w=\d+/, ‘w=1200’) : ‘’;
lbImg.alt          = img ? img.alt : ‘’;
lbCaption.textContent = span ? span.textContent : ‘’;
lightbox.classList.add(‘open’);
document.body.style.overflow = ‘hidden’;
lbImg.style.opacity = ‘0’;
lbImg.style.transform = ‘scale(.97)’;
lbImg.onload = () => {
lbImg.style.transition = ‘opacity .35s ease, transform .35s ease’;
lbImg.style.opacity = ‘1’;
lbImg.style.transform = ‘scale(1)’;
};
}

function closeLightbox() {
lightbox.classList.remove(‘open’);
document.body.style.overflow = ‘’;
lbImg.src = ‘’;
}

function navigateLightbox(dir) {
const visible = getVisibleItems();
if (!visible.length) return;
currentIndex = (currentIndex + dir + visible.length) % visible.length;
lbImg.style.transition = ‘none’;
lbImg.style.opacity = ‘0’;
lbImg.style.transform = `translateX(${dir > 0 ? '30px' : '-30px'})`;
setTimeout(() => openLightbox(currentIndex), 80);
}

// Open on expand button click
document.getElementById(‘galleryGrid’)?.addEventListener(‘click’, e => {
const btn  = e.target.closest(’.g-expand’);
const item = e.target.closest(’.g-item’);
if (!btn || !item) return;
const visible = getVisibleItems();
const idx = visible.indexOf(item);
if (idx !== -1) openLightbox(idx);
});

// Also open on image click
document.getElementById(‘galleryGrid’)?.addEventListener(‘click’, e => {
const img  = e.target.closest(‘img’);
const item = e.target.closest(’.g-item’);
if (!img || !item) return;
const visible = getVisibleItems();
const idx = visible.indexOf(item);
if (idx !== -1) openLightbox(idx);
});

lbClose.addEventListener(‘click’, closeLightbox);
lbPrev.addEventListener(‘click’,  () => navigateLightbox(-1));
lbNext.addEventListener(‘click’,  () => navigateLightbox(1));

lightbox.addEventListener(‘click’, e => {
if (e.target === lightbox) closeLightbox();
});

document.addEventListener(‘keydown’, e => {
if (!lightbox.classList.contains(‘open’)) return;
if (e.key === ‘Escape’)      closeLightbox();
if (e.key === ‘ArrowRight’)  navigateLightbox(1);
if (e.key === ‘ArrowLeft’)   navigateLightbox(-1);
});
})();

/* ── CONTACT FORM ───────────────────────────── */
(function initContactForm() {
const form   = document.getElementById(‘contactForm’);
const formOk = document.getElementById(‘formOk’);
if (!form) return;

form.addEventListener(‘submit’, async e => {
e.preventDefault();

```
if (!form.checkValidity()) {
  form.reportValidity();
  return;
}

const submitBtn = form.querySelector('button[type="submit"]');
const origText  = submitBtn.innerHTML;
submitBtn.disabled   = true;
submitBtn.innerHTML  = '<span>Wird gesendet …</span>';
submitBtn.style.opacity = '.7';

// Simulate async send (replace with actual fetch/API call)
await new Promise(r => setTimeout(r, 1400));

submitBtn.disabled   = false;
submitBtn.innerHTML  = origText;
submitBtn.style.opacity = '1';

form.reset();
if (formOk) {
  formOk.classList.add('show');
  formOk.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => formOk.classList.remove('show'), 8000);
}
```

});
})();

/* ── SMOOTH ANCHOR SCROLL ───────────────────── */
(function initSmoothScroll() {
document.querySelectorAll(‘a[href^=”#”]’).forEach(link => {
link.addEventListener(‘click’, e => {
const target = document.querySelector(link.getAttribute(‘href’));
if (!target) return;
e.preventDefault();
const headerH = document.getElementById(‘siteHeader’)?.offsetHeight || 80;
const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
window.scrollTo({ top, behavior: ‘smooth’ });
});
});
})();

/* ── ACTIVE NAV HIGHLIGHT ON SCROLL ─────────── */
(function initActiveNav() {
const sections = document.querySelectorAll(‘section[id]’);
const navLinks = document.querySelectorAll(’.nav-links a[href^=”#”]’);
if (!sections.length || !navLinks.length) return;

const io = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
navLinks.forEach(a => {
a.style.color = ‘’;
a.classList.remove(‘nav-active’);
});
const id = entry.target.getAttribute(‘id’);
const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
if (activeLink) activeLink.classList.add(‘nav-active’);
}
});
}, { rootMargin: ‘-50% 0px -50% 0px’ });

sections.forEach(s => io.observe(s));
})();

/* ── PARALLAX HERO ───────────────────────────── */
(function initParallax() {
const heroBg = document.querySelector(’.hero-bg-img’);
if (!heroBg || window.matchMedia(’(prefers-reduced-motion: reduce)’).matches) return;

function onScroll() {
const scrollY = window.scrollY;
if (scrollY < window.innerHeight) {
heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`;
}
}
window.addEventListener(‘scroll’, onScroll, { passive: true });
})();

/* ── GALLERY ITEM HOVER 3D TILT (subtle) ─────── */
(function initCardTilt() {
const cards = document.querySelectorAll(’.svc-card, .price-card, .testi-card’);
if (window.matchMedia(’(hover: none)’).matches) return; // skip on touch

cards.forEach(card => {
card.addEventListener(‘mousemove’, e => {
const rect = card.getBoundingClientRect();
const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
});
card.addEventListener(‘mouseleave’, () => {
card.style.transform = ‘’;
});
});
})();

/* ── PAGE LOAD ANIMATION ─────────────────────── */
(function initPageLoad() {
document.body.style.opacity = ‘0’;
window.addEventListener(‘load’, () => {
document.body.style.transition = ‘opacity .5s ease’;
document.body.style.opacity    = ‘1’;
});
})();
