document.addEventListener("DOMContentLoaded", () => {
  initGallerySliders();
  initVideoFullscreen();
  initFloatingHome();
});

/* =====================
   HELPERS
===================== */
function openVideoFullscreen(video) {
  if (!video) return;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }

  // iPhone / iOS Safari
  if (typeof video.webkitEnterFullscreen === "function") {
    try {
      video.webkitEnterFullscreen();
      return;
    } catch (error) {
      // continua con gli altri metodi
    }
  }

  // Standard fullscreen
  if (video.requestFullscreen) {
    video.requestFullscreen().catch?.(() => {});
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
}

function bindFullscreenButtons(containerSelector, buttonSelector, videoSelector) {
  const containers = document.querySelectorAll(containerSelector);

  containers.forEach((container) => {
    const button = container.querySelector(buttonSelector);
    const video = container.querySelector(videoSelector);

    if (!button || !video) return;

    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openVideoFullscreen(video);
    });
  });
}

/* =====================
   GALLERY FULL — SLIDER + AUTOPLAY
===================== */
function initGallerySliders() {
  const galleries = document.querySelectorAll("[data-gallery]");
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const track = gallery.querySelector("[data-gallery-track]");
    const prev = gallery.querySelector("[data-gallery-prev]");
    const next = gallery.querySelector("[data-gallery-next]");
    const slides = gallery.querySelectorAll(".gallery-full__slide");

    if (!track || !prev || !next || slides.length <= 1) {
      if (prev) prev.hidden = true;
      if (next) next.hidden = true;
      return;
    }

    let index = 0;
    const total = slides.length;
    let autoplayInterval;

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
      index = index === total - 1 ? 0 : index + 1;
      update();
    }

    function prevSlide() {
      index = index === 0 ? total - 1 : index - 1;
      update();
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    prev.addEventListener("click", () => {
      prevSlide();
      resetAutoplay();
    });

    next.addEventListener("click", () => {
      nextSlide();
      resetAutoplay();
    });

    gallery.addEventListener("mouseenter", stopAutoplay);
    gallery.addEventListener("mouseleave", startAutoplay);

    update();
    startAutoplay();
  });
}

/* =====================
   VIDEO — FULLSCREEN UNIFICATO
===================== */
function initVideoFullscreen() {
  // 1. VIDEO 16:9
  bindFullscreenButtons(
    ".video-16x9__frame",
    ".video-16x9__fullscreen",
    ".video-16x9__media"
  );

  // 2. VIDEO GRID REEL
  const reelButtons = document.querySelectorAll(".video-grid-reel__fullscreen");

  reelButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const item = button.closest(".video-grid-reel__item");
      const video = item?.querySelector(".video-grid-reel__media");

      openVideoFullscreen(video);
    });
  });

  // 3. VIDEO + TESTO
  bindFullscreenButtons(
    ".video-text-module__media",
    ".video-text-module__fullscreen",
    ".video-text-module__video"
  );

  // 4. IMAGE-TEXT MODULE con video
  bindFullscreenButtons(
    ".image-text-module__media",
    ".image-text-module__fullscreen",
    ".image-text-module__video"
  );
}

/* =====================
   FLOATING HOME BUTTON
   compare solo quando inizi a scrollare
===================== */
function initFloatingHome() {
  const floatingHome = document.querySelector(".floating-home");
  if (!floatingHome) return;

  function toggleFloatingHome() {
    if (window.scrollY > 80) {
      floatingHome.classList.add("floating-home--visible");
    } else {
      floatingHome.classList.remove("floating-home--visible");
    }
  }

  toggleFloatingHome();
  window.addEventListener("scroll", toggleFloatingHome, { passive: true });
}
