/* ============================================
   IBRAT MATCHANOV — PORTFOLIO
   JavaScript: Cursor, Animations, Canvas, Typing
   ============================================ */

'use strict';

/* ─── CUSTOM CURSOR ─────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
  requestAnimationFrame(animateCursor);
})();

const hoverables = 'a, button, .project-card, .skill-category, .tool-card, .lang-card, input, textarea';
document.querySelectorAll(hoverables).forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

/* ─── NAV SCROLL ────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── HAMBURGER MENU ────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── TYPING ANIMATION ──────────────────────── */
const phrases = [
  'Python Developer',
  'AI Enthusiast',
  'Automation Engineer',
  'Startup Builder',
  'Backend Developer'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 80);
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 350);
      return;
    }
    setTimeout(typeLoop, 45);
  }
}
setTimeout(typeLoop, 600);

/* ─── HERO CANVAS (PARTICLES) ───────────────── */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -Math.random() * 0.5 - 0.1;
    this.alpha  = 0;
    this.maxAlpha = Math.random() * 0.5 + 0.1;
    this.size   = Math.random() * 2 + 0.5;
    this.fadeIn = true;
    this.life   = 0;
    this.maxLife= Math.random() * 400 + 200;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.fadeIn) {
      this.alpha = Math.min(this.alpha + 0.005, this.maxAlpha);
      if (this.alpha >= this.maxAlpha) this.fadeIn = false;
    }
    if (this.life > this.maxLife) {
      this.alpha = Math.max(0, this.alpha - 0.008);
      if (this.alpha <= 0) this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = Math.random() > 0.5 ? '#4f9cf9' : '#7b5ef8';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 120) * 0.08;
        ctx.strokeStyle = '#4f9cf9';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animateCanvas);
}

resizeCanvas();
initParticles();
animateCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

/* ─── SCROLL REVEAL ─────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── SKILL BAR ANIMATION ───────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.dataset.width;
      setTimeout(() => { fill.style.width = width + '%'; }, 200);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ─── SMOOTH ACTIVE NAV ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── CONTACT FORM ──────────────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    // Simulate async submit
    setTimeout(() => {
      btn.innerHTML = `<span class="btn-text">Message Sent!</span>`;
      formSuccess.classList.add('show');
      form.reset();
      setTimeout(() => {
        btn.innerHTML = `<span class="btn-text">Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
        btn.style.opacity = '1';
      }, 3000);
    }, 1200);
  });
}

/* ─── PARALLAX GLOW ─────────────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const glows = document.querySelectorAll('.hero-glow');
      glows.forEach((g, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        g.style.transform = `translateY(${y * 0.15 * dir}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ─── STAGGER NAV ITEMS ─────────────────────── */
document.querySelectorAll('.nav-link').forEach((el, i) => {
  el.style.animationDelay = `${i * 80}ms`;
});

/* ─── TILT EFFECT ON PROJECT CARDS ─────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transformStyle = '';
  });
});

/* ─── CONSOLE SIGNATURE ─────────────────────── */
console.log(`%c
██╗██████╗ ██████╗  █████╗ ████████╗
██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝
██║██████╔╝██████╔╝███████║   ██║   
██║██╔══██╗██╔══██╗██╔══██║   ██║   
██║██████╔╝██║  ██║██║  ██║   ██║   
╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   

Ibrat Matchanov — Python Developer & AI Enthusiast
Built with ♥ in Tashkent, Uzbekistan
`, 'color: #4f9cf9; font-family: monospace; font-size: 10px;');

document.querySelectorAll(".mobile-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".mobile-menu").classList.remove("open");
  });

   window.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bg-music");

  if (!music) return;

  // убираем muted после взаимодействия
  const startMusic = () => {
    music.muted = false;
    music.play();
  };

  document.addEventListener("click", startMusic, { once: true });
  document.addEventListener("mousemove", startMusic, { once: true });
});
});


