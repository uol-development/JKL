/* ============================================================
   JK Lifestyle — interactions
   1) Mobile navigation toggle (accessible)
   2) Testimonial carousel (autoplay + manual + a11y)
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) MOBILE MENU ---------- */
  function initMenu() {
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;
    var icon = toggle.querySelector('i');
    var MOBILE = 980;

    function isMobile() { return window.innerWidth <= MOBILE; }

    function setOpen(open) {
      menu.classList.toggle('open', open);
      document.body.classList.toggle('menu-locked', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (icon) icon.className = open ? 'fas fa-xmark' : 'fas fa-bars';
    }

    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('open'));
    });

    // Close when a link inside the menu is tapped
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    // Close on Escape (return focus to the toggle)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset state when resized back to desktop
    window.addEventListener('resize', function () {
      if (!isMobile() && menu.classList.contains('open')) setOpen(false);
    });
  }

  /* ---------- 2) TESTIMONIAL CAROUSEL ---------- */
  function initCarousel() {
    var track = document.getElementById('testiTrack');
    var dotsWrap = document.getElementById('testiDots');
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);
    if (slides.length <= 1) return;

    var index = 0;
    var timer = null;
    var AUTOPLAY_MS = 6000;

    // Build dots
    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'testi__dot';
      b.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    function render() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (s, i) {
        s.setAttribute('aria-hidden', String(i !== index));
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === index);
      });
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      render();
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    var isHovered = false, isFocused = false;
    function start() {
      if (reduceMotion) return;
      if (timer) return; // already running — avoid stacking intervals
      timer = window.setInterval(next, AUTOPLAY_MS);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    // Only (re)start autoplay when neither hover nor focus is holding it paused
    function maybeStart() { if (!isHovered && !isFocused) start(); }
    function restart() { stop(); maybeStart(); }

    // Prev / next buttons
    document.querySelectorAll('.testi__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        parseInt(btn.getAttribute('data-dir'), 10) > 0 ? next() : prev();
        restart();
      });
    });

    // Pause on hover / focus — tracked independently so one releasing
    // doesn't resume autoplay while the other is still holding it paused
    var card = track.closest('.testi__card');
    if (card) {
      card.addEventListener('mouseenter', function () { isHovered = true; stop(); });
      card.addEventListener('mouseleave', function () { isHovered = false; maybeStart(); });
      card.addEventListener('focusin', function () { isFocused = true; stop(); });
      card.addEventListener('focusout', function () { isFocused = false; maybeStart(); });
    }

    render();
    start();
  }

  /* ---------- 3) EXPERTS SCROLLER (About page) ---------- */
  function initScroller() {
    var scroller = document.querySelector('[data-scroller]');
    if (!scroller) return;
    var prev = document.querySelector('.experts__arrow--prev');
    var next = document.querySelector('.experts__arrow--next');

    function step() {
      var card = scroller.querySelector('.doctor');
      var gap = 20;
      return card ? card.getBoundingClientRect().width + gap : scroller.clientWidth * 0.5;
    }
    if (prev) prev.addEventListener('click', function () { scroller.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { scroller.scrollBy({ left: step(), behavior: 'smooth' }); });

    function sync() {
      var maxScroll = scroller.scrollWidth - scroller.clientWidth - 2;
      if (prev) prev.disabled = scroller.scrollLeft <= 2;
      if (next) next.disabled = scroller.scrollLeft >= maxScroll;
    }
    scroller.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    sync();
  }

  /* ---------- 4) HIDE DECORATIVE ICONS FROM SCREEN READERS ---------- */
  function initIcons() {
    // Each of these icons sits next to visible text that conveys the same
    // meaning, so they're decorative and shouldn't be announced.
    var sel = [
      '.stat__icon', '.feature__icon', '.eco__icon', '.step__circle',
      '.mvv__icon', '.pillar__icon', '.proof__item > span', '.why__step > span',
      '.impact__item > span', '.testi__quote', '.gauge__svg',
      // blog page decorative icons
      '.cat-pill i', '.post-meta i', '.read-more i', '.badge i',
      '.page-btn i', '.blog-search button i', '.help__icon i'
    ].join(',');
    document.querySelectorAll(sel).forEach(function (el) {
      el.setAttribute('aria-hidden', 'true');
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initMenu();
    initCarousel();
    initScroller();
    initIcons();
  });
})();
