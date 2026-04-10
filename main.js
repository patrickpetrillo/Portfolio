document.addEventListener("DOMContentLoaded", () => {
  initGallerySliders();
  initVideoFullscreen();
});

/* =====================
   HELPERS
===================== */
function openVideoFullscreen(video) {
  if (!video) return;

  // prova a far partire il video
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
  const frames = document.querySelectorAll(".video-16x9__frame");

  frames.forEach((frame) => {
    const video = frame.querySelector(".video-16x9__media");
    const btn = frame.querySelector(".video-16x9__fullscreen");

    if (!video || !btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
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
        e.preventDefault();
        e.stopPropagation();

        const item = button.closest(".video-grid-reel__item");
        const video = item ? item.querySelector(".video-grid-reel__media") : null;

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
      e.preventDefault();
      e.stopPropagation();
      openVideoFullscreen(video);
    });
  });
}




// =====================
// FLOATING HOME BUTTON
// compare solo quando inizi a scrollare
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const floatingHome = document.querySelector(".floating-home");

  if (!floatingHome) return;

  const toggleFloatingHome = () => {
    if (window.scrollY > 80) {
      floatingHome.classList.add("floating-home--visible");
    } else {
      floatingHome.classList.remove("floating-home--visible");
    }
  };

  // controllo iniziale
  toggleFloatingHome();

  // controllo durante lo scroll
  window.addEventListener("scroll", toggleFloatingHome, { passive: true });
});
