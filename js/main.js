/* ============================================================
   GHION TRAVEL & TOURS — MAIN JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navigation ─────────────────────────────────────────── */
  const nav = document.querySelector('.site-nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  const mobileOverlay = document.querySelector('.nav-mobile-overlay');
  const mobileClose = document.querySelector('.nav-mobile-close');

  if (nav) {
    const isTransparent = nav.classList.contains('site-nav--transparent');

    const updateNav = () => {
      if (!isTransparent) return;
      if (window.scrollY > 60) {
        nav.classList.add('site-nav--scrolled');
        nav.classList.remove('site-nav--transparent');
      } else {
        nav.classList.remove('site-nav--scrolled');
        nav.classList.add('site-nav--transparent');
      }
    };

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  const openMobileMenu = () => {
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    mobileNav?.classList.add('open');
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileNav?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    if (hamburger.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // Set active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ── Scroll Reveal ──────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── Back to Top ────────────────────────────────────────── */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Accordion ──────────────────────────────────────────── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-header').forEach(h => {
        h.classList.remove('open');
        const b = h.nextElementSibling;
        if (b) b.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        header.classList.add('open');
        if (body) body.classList.add('open');
      }
    });
  });

  /* ── Tabs ───────────────────────────────────────────────── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const tabContainer = btn.closest('[data-tabs]') || btn.closest('section') || document;

      tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tabContainer.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = tabContainer.querySelector(`[data-tab-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Tour Filter ────────────────────────────────────────── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('[data-category]').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── Smooth scroll for anchor links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const y = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ── Hero image slideshow (optional) ───────────────────── */
  const heroBg = document.querySelector('.hero-bg[data-slides]');
  if (heroBg) {
    const slides = JSON.parse(heroBg.dataset.slides);
    let idx = 0;
    const rotate = () => {
      idx = (idx + 1) % slides.length;
      heroBg.style.backgroundImage = `url(${slides[idx]})`;
    };
    setInterval(rotate, 7000);
  }

  /* ── Counter animation ──────────────────────────────────── */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ── Reservation query prefill ──────────────────────────── */
  const params = new URLSearchParams(window.location.search);
  const requestedTour = params.get('tour');
  const tourSelect = document.querySelector('#tour');
  if (requestedTour && tourSelect) {
    const matchingOption = Array.from(tourSelect.options).find(option => option.value === requestedTour);
    if (matchingOption) {
      tourSelect.value = requestedTour;
    }
  }

});

/* ── Fade-in animation ─────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);
