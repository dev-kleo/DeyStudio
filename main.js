(function () {
  'use strict';

  // Edit these two values. Leave whatsapp empty to hide the WhatsApp option.
  // whatsapp: digits only, with country code, no plus sign (example: 79991234567).
  var CONTACT = { email: 'hello.deyabhishek@gmail.com', whatsapp: '' };

  var bar = document.querySelector('.bar');

  /* Reveal on scroll */
  var targets = document.querySelectorAll('.rv, .growth');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* Header: solid after the top, hides on scroll down, returns on scroll up */
  var lastY = window.scrollY, ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY, dy = y - lastY;
      bar.classList.toggle('solid', y > 12);
      if (Math.abs(dy) > 6) {
        bar.classList.toggle('hide', dy > 0 && y > 240);
        lastY = y;
      }
      ticking = false;
    });
  }, { passive: true });

  /* Contact dialog */
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
    dlg.showModal();
  }

  document.querySelectorAll('[data-open-contact]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (typeof dlg.showModal !== 'function') return;
      e.preventDefault();
      openDialog(a.getAttribute('data-topic'));
    });
  });

  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.querySelectorAll('.opt').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(function () { dlg.close(); }, 150); });
  });

  window.__dey = 1;
})();
