(function () {
  'use strict';

  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  window.openMenu = function () {
    var menu = document.getElementById('mobileMenu');
    if (menu) {
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };
  window.closeMenu = function () {
    var menu = document.getElementById('mobileMenu');
    if (menu) {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.handleFormSubmit = function (e) {
    e.preventDefault();
    var first = document.getElementById('firstName');
    var last = document.getElementById('lastName');
    var msg = document.getElementById('message');
    var phone = document.getElementById('phone');
    if (!first || !last || !msg) return;
    var text = encodeURIComponent(
      'Hi Bliss Beauty Plus! My name is ' + first.value + ' ' + last.value + '. ' + msg.value +
      (phone && phone.value ? ' Contact: ' + phone.value : '')
    );
    window.open('https://wa.me/233552394434?text=' + text, '_blank');
    var success = document.getElementById('formSuccess');
    if (success) success.style.display = 'block';
    e.target.reset();
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.body.style.opacity = '0';
    requestAnimationFrame(function () {
      document.body.style.transition = 'opacity 0.6s ease';
      document.body.style.opacity = '1';
    });
  });
})();
