/* ════════════════════════════════════════════════════════════
   IRONLEASE — GLOBAL JS
   Theme, RTL/LTR, Scroll, Shared Utilities
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════ THEME MANAGER ══════════════ */
  const ThemeManager = {
    key: 'ironlease-theme',
    html: document.documentElement,

    init() {
      const saved = localStorage.getItem(this.key) || 'dark';
      this.apply(saved);
      this.bindToggle();
    },

    apply(theme) {
      this.html.setAttribute('data-theme', theme);
      localStorage.setItem(this.key, theme);
    },

    toggle() {
      const current = this.html.getAttribute('data-theme');
      this.apply(current === 'dark' ? 'light' : 'dark');
    },

    bindToggle() {
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.addEventListener('click', () => this.toggle());
    }
  };

  /* ══════════════ RTL/LTR MANAGER ══════════════ */
  const DirManager = {
    key: 'ironlease-dir',
    html: document.documentElement,

    init() {
      const saved = localStorage.getItem(this.key) || 'ltr';
      this.apply(saved);
      this.bindToggle();
    },

    apply(dir) {
      this.html.setAttribute('dir', dir);
      localStorage.setItem(this.key, dir);
      // Show only the ACTIVE mode in the label
      const label = document.getElementById('dir-label');
      if (label) label.textContent = dir.toUpperCase();
    },

    toggle() {
      const current = this.html.getAttribute('dir') || 'ltr';
      this.apply(current === 'ltr' ? 'rtl' : 'ltr');
    },

    bindToggle() {
      const btn = document.getElementById('dir-toggle');
      if (btn) btn.addEventListener('click', () => this.toggle());
    }
  };

  /* ══════════════ MOBILE NAV ══════════════ */
  const MobileNav = {
    hamburger: null,
    nav: null,
    overlay: null,
    closeBtn: null,

    init() {
      this.hamburger = document.getElementById('hamburger');
      this.nav = document.getElementById('mobile-nav');
      this.overlay = document.getElementById('mobile-overlay');
      this.closeBtn = document.getElementById('mobile-nav-close');

      if (!this.hamburger) return;

      this.hamburger.addEventListener('click', () => this.open());
      this.closeBtn?.addEventListener('click', () => this.close());
      this.overlay?.addEventListener('click', () => this.close());

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    },

    open() {
      this.hamburger.classList.add('open');
      this.hamburger.setAttribute('aria-expanded', 'true');
      this.nav?.classList.add('open');
      this.overlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.hamburger?.classList.remove('open');
      this.hamburger?.setAttribute('aria-expanded', 'false');
      this.nav?.classList.remove('open');
      this.overlay?.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  /* ══════════════ SCROLL HEADER ══════════════ */
  const ScrollHeader = {
    header: null,
    threshold: 20,

    init() {
      this.header = document.getElementById('site-header');
      if (!this.header) return;

      window.addEventListener('scroll', () => this.update(), { passive: true });
      this.update();
    },

    update() {
      if (!this.header) return;
      if (window.scrollY > this.threshold) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }
  };

  /* ══════════════ ANIMATE ON SCROLL ══════════════ */
  const AnimateOnScroll = {
    init() {
      if (!('IntersectionObserver' in window)) return;

      const els = document.querySelectorAll('.cat-card, .equip-card, .testi-card, .why-feature, .process-step');
      els.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      els.forEach(el => observer.observe(el));
    }
  };

  /* ══════════════ ACTIVE NAV ══════════════ */
  const ActiveNav = {
    init() {
      const current = window.location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(current)) {
          link.classList.add('active');
        }
      });
    }
  };

  /* ══════════════ SMOOTH ANCHOR SCROLL ══════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ══════════════ INIT ══════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    DirManager.init();
    MobileNav.init();
    ScrollHeader.init();
    AnimateOnScroll.init();
    ActiveNav.init();
    initSmoothScroll();
  });

})();
