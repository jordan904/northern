/* ========================================
   Northern Heat Pumps — Scripts
   ======================================== */

(function () {
  'use strict';

  // --- Navbar scroll ---
  var navbar = document.getElementById('navbar');
  var lastScrollY = 0;
  var ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (lastScrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Initial check
  onScroll();

  // --- Mobile nav toggle ---
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));

    // Swap icon
    if (isOpen) {
      navToggle.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    } else {
      navToggle.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    }
  });

  // Close nav on link click
  var navAnchors = navLinks.querySelectorAll('a');
  navAnchors.forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    }
  });

  // --- Scroll-triggered fade-in (IntersectionObserver) with stagger ---
  if ('IntersectionObserver' in window) {
    var fadeEls = document.querySelectorAll('.fade-in');
    var staggerIndex = 0;
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        var visibleEntries = entries.filter(function (entry) {
          return entry.isIntersecting;
        });
        visibleEntries.forEach(function (entry, index) {
          var delay = Math.min(index * 150, 600);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          fadeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  // --- Contact form ---
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot check
    var honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value) {
      return;
    }

    // Clear previous errors
    var errorEls = form.querySelectorAll('.form-error');
    errorEls.forEach(function (el) { el.textContent = ''; });
    var invalidInputs = form.querySelectorAll('[aria-invalid]');
    invalidInputs.forEach(function (el) { el.removeAttribute('aria-invalid'); });

    var valid = true;

    // Name
    var nameInput = form.querySelector('#name');
    if (!nameInput.value.trim()) {
      showError(nameInput, 'nameError', 'Please enter your name.');
      valid = false;
    }

    // Email
    var emailInput = form.querySelector('#email');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      showError(emailInput, 'emailError', 'Please enter a valid email address.');
      valid = false;
    }

    // Service
    var serviceInput = form.querySelector('#service');
    if (!serviceInput.value) {
      showError(serviceInput, 'serviceError', 'Please select a service.');
      valid = false;
    }

    if (!valid) return;

    // Submit to Formspree
    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (response) {
      if (response.ok) {
        form.style.display = 'none';
        formSuccess.hidden = false;
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        alert('Something went wrong. Please try again.');
      }
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      alert('Something went wrong. Please try again.');
    });
  });

  function showError(input, errorId, message) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
    var errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  }
})();
