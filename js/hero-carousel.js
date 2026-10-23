/**
 * CORE RESOLUTION GROUP INC. — Premium Hero Carousel Controller
 * ==============================================================
 * Features:
 * - Edge-to-edge full background image crossfade
 * - Ken Burns subtle zoom effect per slide
 * - Staggered text & CTA reveal
 * - 6.5s autoplay with live CSS progress bar synchronization
 * - Pause on mouse hover & tab visibility hidden (Page Visibility API)
 * - Accessible keyboard navigation (ArrowLeft / ArrowRight)
 * - Mobile touch swipe gestures (left / right)
 * - Transition debounce protecting against rapid clicks
 * - Respects prefers-reduced-motion
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const heroSection = document.getElementById("hero");
    if (!heroSection) return;

    const slides = Array.from(heroSection.querySelectorAll(".hero-carousel__slide"));
    const tabs = Array.from(heroSection.querySelectorAll(".hero-carousel__tab"));
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const counterCurrent = document.getElementById("carousel-counter-current");

    if (!slides.length) return;

    const TOTAL_SLIDES = slides.length;
    const AUTOPLAY_INTERVAL = 6500; // 6.5 seconds
    let currentIndex = 0;
    let autoplayTimer = null;
    let isPaused = false;
    let isTransitioning = false;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /**
     * Switch active slide with transitions and state synchronization
     */
    function goToSlide(targetIndex, direction = "next") {
      if (isTransitioning) return;
      if (targetIndex === currentIndex && slides[currentIndex].classList.contains("hero-carousel__slide--active")) return;

      isTransitioning = true;

      // Handle wraparound
      let nextIndex = targetIndex;
      if (nextIndex < 0) {
        nextIndex = TOTAL_SLIDES - 1;
      } else if (nextIndex >= TOTAL_SLIDES) {
        nextIndex = 0;
      }

      // Update slides
      slides.forEach(function (slide, idx) {
        const isActive = idx === nextIndex;
        if (isActive) {
          slide.classList.add("hero-carousel__slide--active");
          slide.setAttribute("aria-hidden", "false");
        } else {
          slide.classList.remove("hero-carousel__slide--active");
          slide.setAttribute("aria-hidden", "true");
        }
      });

      // Update tabs and reset progress bar animation
      tabs.forEach(function (tab, idx) {
        const isActive = idx === nextIndex;
        tab.classList.toggle("hero-carousel__tab--active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");

        const progressFill = tab.querySelector(".hero-carousel__tab-progress-fill");
        if (progressFill) {
          // Trigger DOM reflow to restart CSS animation from 0%
          progressFill.style.animation = "none";
          void progressFill.offsetHeight; // reflow
          if (isActive && !prefersReducedMotion) {
            progressFill.style.animation = "";
          }
        }
      });

      // Update slide counter (formatted as 2 digits: "01", "02", "03")
      if (counterCurrent) {
        counterCurrent.textContent = String(nextIndex + 1).padStart(2, "0");
      }

      currentIndex = nextIndex;

      // Reset transition lock after animation settles
      setTimeout(function () {
        isTransitioning = false;
      }, 700);
    }

    /**
     * Start/Reset autoplay interval
     */
    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(function () {
        if (!isPaused && document.visibilityState === "visible") {
          goToSlide(currentIndex + 1, "next");
        }
      }, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Previous Button Click
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goToSlide(currentIndex - 1, "prev");
        resetAutoplay();
      });
    }

    // Next Button Click
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goToSlide(currentIndex + 1, "next");
        resetAutoplay();
      });
    }

    // Tab / Indicator Click
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const targetIdx = parseInt(this.getAttribute("data-slide-index"), 10);
        if (!isNaN(targetIdx)) {
          goToSlide(targetIdx, targetIdx > currentIndex ? "next" : "prev");
          resetAutoplay();
        }
      });
    });

    // Pause on Hover (desktop)
    heroSection.addEventListener("mouseenter", function () {
      isPaused = true;
    });

    heroSection.addEventListener("mouseleave", function () {
      isPaused = false;
    });

    // Page Visibility API — Pause when tab hidden, resume when visible
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        isPaused = true;
      } else {
        isPaused = false;
        resetAutoplay();
      }
    });

    // Keyboard Navigation (Arrow Left & Arrow Right)
    document.addEventListener("keydown", function (e) {
      // Ignore if user is currently typing in an input/textarea/select
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      if (["INPUT", "TEXTAREA", "SELECT"].includes(activeTag)) return;

      if (e.key === "ArrowLeft") {
        goToSlide(currentIndex - 1, "prev");
        resetAutoplay();
      } else if (e.key === "ArrowRight") {
        goToSlide(currentIndex + 1, "next");
        resetAutoplay();
      }
    });

    // Mobile Touch Swipe Gesture Support
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    heroSection.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches && e.touches[0]) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      },
      { passive: true }
    );

    heroSection.addEventListener(
      "touchend",
      function (e) {
        if (e.changedTouches && e.changedTouches[0]) {
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;

          const diffX = touchEndX - touchStartX;
          const diffY = touchEndY - touchStartY;

          // Only trigger if horizontal swipe is dominant and above threshold (40px)
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
            if (diffX < 0) {
              // Swiped left -> Next slide
              goToSlide(currentIndex + 1, "next");
            } else {
              // Swiped right -> Previous slide
              goToSlide(currentIndex - 1, "prev");
            }
            resetAutoplay();
          }
        }
      },
      { passive: true }
    );

    // Initial setup
    goToSlide(0);
    startAutoplay();
  });
})();
