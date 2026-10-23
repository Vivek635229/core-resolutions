/**
 * CORE RESOLUTION GROUP INC. — Main Application Script
 * =====================================================
 * Handles:
 * - Header scroll behavior
 * - Mobile navigation
 * - Scroll progress bar
 * - Intersection Observer scroll animations
 * - FAQ accordion
 * - Back-to-top button
 * - Smooth scroll for anchor links
 */

(function () {
  "use strict";

  /* ── Header Scroll Behavior ──────────────────────────── */
  const header = document.querySelector(".header");
  const scrollProgress = document.querySelector(".scroll-progress");

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Sticky header background
    if (header) {
      header.classList.toggle("header--scrolled", scrollY > 50);
    }

    // Scroll progress bar
    if (scrollProgress) {
      scrollProgress.style.width = scrollPercent + "%";
    }

    // Back-to-top visibility
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      backToTop.classList.toggle("back-to-top--visible", scrollY > 600);
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Initial call

  /* ── Mobile Navigation ───────────────────────────────── */
  const hamburger = document.getElementById("nav-hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileOverlay = document.getElementById("mobile-nav-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav__link");

  function openMobileNav() {
    if (!mobileNav || !mobileOverlay || !hamburger) return;
    mobileNav.classList.add("mobile-nav--open");
    mobileOverlay.classList.add("mobile-nav__overlay--visible");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    // Focus first link
    const firstLink = mobileNav.querySelector(".mobile-nav__link");
    if (firstLink) firstLink.focus();
  }

  function closeMobileNav() {
    if (!mobileNav || !mobileOverlay || !hamburger) return;
    mobileNav.classList.remove("mobile-nav--open");
    mobileOverlay.classList.remove("mobile-nav__overlay--visible");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    hamburger.focus();
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      isOpen ? closeMobileNav() : openMobileNav();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMobileNav);
  }

  const mobileCloseBtn = document.getElementById("mobile-nav-close");
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener("click", closeMobileNav);
  }

  // Close mobile nav on link click
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("mobile-nav--open")) {
      closeMobileNav();
    }
  });

  /* ── Smooth Scroll for Anchor Links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  /* ── Intersection Observer — Scroll Reveals ──────────── */
  const revealClasses = ["reveal", "reveal-left", "reveal-right", "reveal-scale"];

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.1,
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          revealClasses.forEach(function (cls) {
            if (el.classList.contains(cls)) {
              el.classList.add(cls + "--visible");
            }
          });
          observer.unobserve(el); // Disconnect once revealed
        }
      });
    }, observerOptions);

    // Observe all elements with reveal classes
    revealClasses.forEach(function (cls) {
      document.querySelectorAll("." + cls).forEach(function (el) {
        revealObserver.observe(el);
      });
    });
  } else {
    // If reduced motion, make everything visible immediately
    revealClasses.forEach(function (cls) {
      document.querySelectorAll("." + cls).forEach(function (el) {
        el.classList.add(cls + "--visible");
      });
    });
  }

  /* ── FAQ Accordion ───────────────────────────────────── */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    const button = item.querySelector(".faq-item__button");
    if (!button) return;

    button.addEventListener("click", function () {
      const isOpen = item.getAttribute("data-open") === "true";

      // Close all other items
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.setAttribute("data-open", "false");
          const otherBtn = other.querySelector(".faq-item__button");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current
      item.setAttribute("data-open", isOpen ? "false" : "true");
      button.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });

    // Keyboard support
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        button.click();
      }
    });
  });

  /* ── Back to Top ─────────────────────────────────────── */
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── Active Nav Link Highlighting ────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".header__nav-link");

  function highlightActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove("header__nav-link--active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("header__nav-link--active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightActiveNav, { passive: true });



})();
