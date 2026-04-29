/* ═══════════════════════════════════════════════════
   SCRIPT.JS — Portfolio Matis Da Silva
   ═══════════════════════════════════════════════════ */

// ─── Particles Background ───────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      const isLight = document.documentElement.classList.contains('light');
      const color = isLight ? `rgba(59, 130, 246, ${this.opacity})` : `rgba(96, 165, 250, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  function init() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const isLight = document.documentElement.classList.contains('light');
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15;
          const color = isLight ? `rgba(59, 130, 246, ${opacity})` : `rgba(96, 165, 250, ${opacity})`;
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animId = requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    animate();
  });
})();


// ─── Theme Toggle ───────────────────────────────────
(function initTheme() {
  const btn = document.getElementById('themeBtn');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;

  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.classList.add('light');
  }

  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
})();


// ─── Mobile Menu ────────────────────────────────────
(function initMobileMenu() {
  const burger = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (!burger || !mobileNav) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    burger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }

  burger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  mobileNav.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) toggleMenu();
    });
  });
})();


// ─── Header Scroll Effect ───────────────────────────
(function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


// ─── Active Nav Link ────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
})();


// ─── Typing Effect ──────────────────────────────────
(function initTyping() {
  const el = document.getElementById('heroName');
  if (!el) return;

  const text = 'Da Silva Matis';
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 80);
    }
  }

  setTimeout(type, 600);
})();


// ─── Counter Animation ─────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        let current = 0;
        const step = target / 40;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          entry.target.textContent = Math.floor(current);
        }, 40);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// ─── Reveal on Scroll ───────────────────────────────
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
})();


// ─── Skill Bars Animation ───────────────────────────
(function initSkillBars() {
  const skillCards = document.querySelectorAll('.skill-bar');
  if (!skillCards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.dataset.width;
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          setTimeout(() => {
            fill.style.width = width + '%';
          }, 300);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillCards.forEach(bar => observer.observe(bar));
})();


// ─── Smooth Scroll for Anchor Links ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Page Transitions ───────────────────────────────
(function initPageTransitions() {
  // Reveal page on load
  window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
  });

  // Handle page leaving
  const pageLinks = document.querySelectorAll('.page-link');
  
  pageLinks.forEach(link => {
    link.addEventListener('click', e => {
      // Don't intercept if opening in new tab or if it's an anchor link
      if (e.ctrlKey || e.metaKey || link.target === '_blank' || link.getAttribute('href').startsWith('#')) {
        return;
      }
      
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        
        // Trigger leaving animation
        document.body.classList.remove('page-loaded');
        document.body.classList.add('page-leaving');
        
        // Navigate after animation completes
        setTimeout(() => {
          window.location.href = href;
        }, 400); // Matches CSS transition duration
      }
    });
  });
})();
