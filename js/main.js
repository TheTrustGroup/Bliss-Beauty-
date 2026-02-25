(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ring = document.getElementById('cursorRing');
  var dot = document.getElementById('cursorDot');
  var mx = 0, my = 0, rx = 0, ry = 0;
  if (ring && dot && !prefersReducedMotion) {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px, ' + my + 'px) translate(-50%, -50%)';
    });
    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = 'translate(' + rx + 'px, ' + ry + 'px) translate(-50%, -50%)';
      requestAnimationFrame(animRing);
    }
    animRing();
    document.querySelectorAll('a, button, .product-card, .blog-card, .gallery-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.style.width = '56px';
        ring.style.height = '56px';
        ring.style.borderColor = 'var(--wine)';
      });
      el.addEventListener('mouseleave', function () {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'var(--rose)';
      });
    });
  } else if (ring && dot) {
    ring.style.display = 'none';
    dot.style.display = 'none';
  }

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
