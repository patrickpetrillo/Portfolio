
document.addEventListener("DOMContentLoaded", () => {
  initGallerySliders();
  initVideoFullscreen();
});

/* =====================
   HELPERS
===================== */
function openVideoFullscreen(video) {
  if (!video) return;

  // fullscreen cross-browser
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }

  // play sicuro
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
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

    // BOTTONI
    prev.addEventListener("click", () => {
      prevSlide();
      resetAutoplay();
    });

    next.addEventListener("click", () => {
      nextSlide();
      resetAutoplay();
    });

    // AUTOPLAY
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000); // 5 sec
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // PAUSA SU HOVER (UX migliore)
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
  const frames = document.querySelectorAll(".video-16x9__frame");

  frames.forEach((frame) => {
    const video = frame.querySelector(".video-16x9__media");
    const btn = frame.querySelector(".video-16x9__fullscreen");
    if (!video || !btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openVideoFullscreen(video);
    });
  });

  // 2. VIDEO GRID REEL
  const reels = document.querySelectorAll(".video-grid-reel");

  reels.forEach((module) => {
    const buttons = module.querySelectorAll(".video-grid-reel__fullscreen");

    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();

        const item = button.closest(".video-grid-reel__item");
        const video = item?.querySelector(".video-grid-reel__media");

        openVideoFullscreen(video);
      });
    });
  });

  // 3. VIDEO + TESTO
  const textModules = document.querySelectorAll(".video-text-module__media");

  textModules.forEach((module) => {
    const button = module.querySelector(".video-text-module__fullscreen");
    const video = module.querySelector(".video-text-module__video");

    if (!button || !video) return;

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      openVideoFullscreen(video);
    });
  });
}