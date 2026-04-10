/* ============================================================
   PERSON DO THING — buy page
   only thing this script does: cycle the testimonial carousel
   on the /buy page. no game logic, no shared state with the
   demo. vanilla js, no build.
   ============================================================ */

const CYCLE_MS = 7000;

function initQuoteCarousel() {
  const carousel = document.getElementById("buy-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".buy-quote-slide"));
  const dots   = Array.from(document.querySelectorAll(".buy-quote-dot"));
  if (slides.length < 2) return;

  let current = 0;
  let interval = null;

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === current));
    dots.forEach((d, idx) => {
      if (idx === current) d.setAttribute("aria-current", "true");
      else                 d.removeAttribute("aria-current");
    });
  }

  function next() { show(current + 1); }

  function startCycle() {
    if (interval) clearInterval(interval);
    interval = setInterval(next, CYCLE_MS);
  }

  function stopCycle() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      show(idx);
      startCycle(); // reset the timer so the user's chosen slide stays visible for a full cycle
    });
  });

  // pause when the user is hovering or focused inside the carousel —
  // gives them time to read without slides flipping out from under them
  carousel.addEventListener("mouseenter", stopCycle);
  carousel.addEventListener("mouseleave", startCycle);
  carousel.addEventListener("focusin",  stopCycle);
  carousel.addEventListener("focusout", startCycle);

  // also pause when the tab is hidden so we don't waste timers
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopCycle();
    else                 startCycle();
  });

  show(0);
  startCycle();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initQuoteCarousel);
} else {
  initQuoteCarousel();
}
