(function () {
  'use strict';

  // Edit these two values. Leave whatsapp empty to hide the WhatsApp option.
  // whatsapp: digits only, with country code, no plus sign (example: 79991234567).
  var CONTACT = { email: 'hello.deyabhishek@gmail.com', whatsapp: '' };

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = document.querySelector('.bar');
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };

  /* ---------- Text splitting ---------- */

  // Headlines: each word rolls up from behind a mask.
  document.querySelectorAll('[data-roll]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span class="wi" style="--n:' + i + '">' + w + '</span></span>';
    }).join(' ');
  });

  // Statement: words fill in as you scroll.
  var fills = [];
  document.querySelectorAll('[data-fill]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="fw">' + w + '</span>'; }).join(' ');
    fills.push({ el: el, words: el.querySelectorAll('.fw') });
  });

  // Footer wordmark: letters rise one by one.
  document.querySelectorAll('[data-letters]').forEach(function (el) {
    el.innerHTML = el.textContent.split('').map(function (c, i) {
      return '<span class="l" style="--n:' + i + '">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
    }).join('');
  });

  /* ---------- Smooth scrolling ---------- */

  var lenis = null;
  if (!RM && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ autoRaf: true, anchors: true, lerp: 0.11 });
  }

  /* ---------- Entrances ---------- */

  function startEntrances() {
    var targets = document.querySelectorAll('.rv, .growth, [data-roll], [data-letters]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Loader ---------- */

  var loader = document.querySelector('.loader');
  if (loader && !RM) {
    setTimeout(function () {
      loader.classList.add('done');
      setTimeout(startEntrances, 350);
      setTimeout(function () { loader.hidden = true; }, 1200);
    }, 550);
  } else {
    if (loader) loader.hidden = true;
    startEntrances();
  }

  /* ---------- Hero blocks: a new piece keeps landing ---------- */

  var growth = document.querySelector('.growth');
  if (growth && !RM && growth.animate) {
    var tops = growth.querySelectorAll('.b.t');
    var last = -1;
    setInterval(function () {
      if (document.hidden || window.scrollY > window.innerHeight) return;
      var i;
      do { i = Math.floor(Math.random() * tops.length); } while (i === last);
      last = i;
      tops[i].animate(
        [{ transform: 'translateY(' + (getComputedStyle(growth).getPropertyValue('--fall').trim() || '-70vh') + ')', opacity: 0 }, { opacity: 1, offset: 0.15 }, { transform: 'none', opacity: 1 }],
        { duration: 950, easing: 'cubic-bezier(.3,0,.15,1)' }
      );
    }, 2400);
  }

  /* ---------- Scroll-linked motion ---------- */

  var navSections = document.querySelectorAll('[data-nav]');
  var stepsList = document.querySelector('.steps');
  var steps = stepsList ? stepsList.querySelectorAll('li') : [];
  var lastY = window.scrollY, ticking = false;

  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight, dy = y - lastY;

    // Header: solid after the top, hides going down, returns going up.
    bar.classList.toggle('solid', y > 12);
    if (Math.abs(dy) > 6) {
      bar.classList.toggle('hide', dy > 0 && y > 240);
      lastY = y;
    }

    // Header takes the colour of the section under it.
    var theme = '';
    navSections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= 36 && r.bottom > 36) theme = s.getAttribute('data-nav');
    });
    if (theme) bar.setAttribute('data-theme', theme); else bar.removeAttribute('data-theme');

    if (RM) return;

    // Hero blocks drift up a little slower than the page.
    if (growth && y < vh * 1.2) growth.style.transform = 'translate3d(0,' + (y * -0.07).toFixed(1) + 'px,0)';

    // Statement words fill.
    fills.forEach(function (f) {
      var r = f.el.getBoundingClientRect();
      var p = clamp((vh * 0.88 - r.top) / (vh * 0.5));
      var n = Math.round(p * f.words.length);
      f.words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    });

    // Process line fills step by step.
    if (steps.length) {
      var row = steps[0].offsetTop === steps[steps.length - 1].offsetTop;
      var lr = stepsList.getBoundingClientRect();
      var p = clamp((vh * 0.82 - lr.top) / (vh * 0.55));
      steps.forEach(function (li, i) {
        var sp;
        if (row) sp = clamp(p * steps.length - i);
        else { var r = li.getBoundingClientRect(); sp = clamp((vh * 0.85 - r.top) / (vh * 0.25)); }
        li.style.setProperty('--sp', sp.toFixed(3));
        li.classList.toggle('on', sp > 0.05);
      });
    }
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  window.addEventListener('resize', frame);
  frame();

  /* ---------- Contact dialog ---------- */

  var dlg = document.getElementById('contact-dialog');
  var mail = document.getElementById('opt-mail');
  var wa = document.getElementById('opt-wa');

  function message(topic) {
    return "Hi, I'd like to grow my business" + (topic ? " and I'm interested in " + topic : '') + '.\n\nA bit about my business: ';
  }

  function openDialog(topic) {
    var text = message(topic);
    mail.href = 'mailto:' + CONTACT.email + '?subject=' + encodeURIComponent('Grow my business') + '&body=' + encodeURIComponent(text);
    if (CONTACT.whatsapp) {
      wa.hidden = false;
      wa.href = 'https://wa.me/' + CONTACT.whatsapp + '?text=' + encodeURIComponent(text.trim());
    }
    if (lenis) lenis.stop();
    dlg.showModal();
  }

  document.querySelectorAll('[data-open-contact]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (typeof dlg.showModal !== 'function') return;
      e.preventDefault();
      e.stopPropagation();
      openDialog(a.getAttribute('data-topic'));
    });
  });

  dlg.addEventListener('close', function () { if (lenis) lenis.start(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.querySelectorAll('.opt').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(function () { dlg.close(); }, 150); });
  });

  window.__dey = 1;
})();
