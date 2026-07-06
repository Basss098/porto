/* ============================================================
   main.js — Bagas Rudianto Portfolio
   Handles:
     - Custom cursor (desktop only)
     - Scroll progress bar
     - Starfield canvas background
     - Floating particles
     - Scroll reveal (IntersectionObserver)
     - 3D tilt effect on skill cards (desktop only)
     - Typing effect on hero eyebrow
     - Active nav link highlight
     - Hamburger menu (mobile)
   ============================================================ */

/* ── DETECT TOUCH / MOBILE ── */
const isTouchDevice = () =>
  window.matchMedia('(pointer: coarse)').matches ||
  'ontouchstart' in window;



/* ── SCROLL PROGRESS BAR ── */
(function initProgressBar() {
  const bar = document.getElementById('progress');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();


/* ── STARFIELD CANVAS ── */
(function initStarfield() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 160 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    r:     Math.random() * 0.9 + 0.1,
    speed: Math.random() * 0.3 + 0.05,
    blink: Math.random() * Math.PI * 2,
    alpha: Math.random(),
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    stars.forEach((star) => {
      star.blink += 0.008;
      const alpha = (Math.sin(star.blink) * 0.4 + 0.6) * star.alpha;

      ctx.beginPath();
      ctx.arc(star.x % W, star.y % H, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      star.y -= star.speed;
      if (star.y < 0) {
        star.y = H;
        star.x = Math.random() * W;
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
})();


/* ── FLOATING PARTICLES ── */
(function initParticles() {
  function spawn() {
    const p     = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 3 + 1;
    const dur  = Math.random() * 15 + 10;
    const del  = Math.random() * 5;

    p.style.cssText = [
      `width: ${size}px`,
      `height: ${size}px`,
      `left: ${Math.random() * 100}vw`,
      `animation-duration: ${dur}s`,
      `animation-delay: ${del}s`,
    ].join('; ');

    document.body.appendChild(p);
    setTimeout(() => p.remove(), (dur + del) * 1000);
  }

  setInterval(spawn, 600);
})();


/* ── SCROLL REVEAL (IntersectionObserver) ── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.08 }
  );

  elements.forEach((el) => observer.observe(el));
})();


/* ── 3D TILT ON SKILL CARDS (desktop only) ── */
(function initTilt() {
  if (isTouchDevice()) return;

  document.querySelectorAll('.skill-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ── TYPING EFFECT (Hero Eyebrow) ── */
(function initTyping() {
  const el = document.querySelector('.hero-eyebrow');
  if (!el) return;

  const text = el.textContent;
  el.textContent = '';
  let index = 0;

  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent = text.slice(0, ++index);
      if (index >= text.length) clearInterval(interval);
    }, 40);
  }, 400);
})();


/* ── ACTIVE NAV LINK ON SCROLL ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  });
})();


/* ── HAMBURGER MENU (mobile) ── */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.querySelector('.nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.classList.toggle('active', isOpen);
  });

  // Close on link tap
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();
