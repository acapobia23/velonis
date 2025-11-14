document.addEventListener("DOMContentLoaded", () => {
  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    const imageFiles = ["01.jpg", "02.webp"]; // file name of pic
    const basePath = "../../assets/img/boxes/velonas-jungle/"; // path pic
    const images = imageFiles.map((f) => basePath + f);

    // cambiare alt name linea 14
    galleryContainer.innerHTML = `
      <div class="gallery">
        <button class="gallery-btn prev">&#10094;</button>
        <div class="gallery-track-container">
          <div class="gallery-track">
            ${images
              .map(
                (src) =>
                  `<div class="gallery-slide"><img src="${src}" alt="Velona's Jungle" /></div>`
              )
              .join("")}
          </div>
        </div>
        <button class="gallery-btn next">&#10095;</button>
      </div>
    `;

    const track = galleryContainer.querySelector(".gallery-track");
    const slides = galleryContainer.querySelectorAll(".gallery-slide");
    const prevBtn = galleryContainer.querySelector(".gallery-btn.prev");
    const nextBtn = galleryContainer.querySelector(".gallery-btn.next");
    let idx = 0;

    const updateGallery = () => {
      const w = slides[0].clientWidth;
      track.style.transform = `translateX(-${idx * w}px)`;
    };
    nextBtn.addEventListener("click", () => {
      idx = (idx + 1) % slides.length;
      updateGallery();
    });
    prevBtn.addEventListener("click", () => {
      idx = (idx - 1 + slides.length) % slides.length;
      updateGallery();
    });
    window.addEventListener("resize", updateGallery);
    updateGallery();

    // touch support
    let startX = 0;
    track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
    track.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      if (endX < startX - 30) nextBtn.click();
      if (endX > startX + 30) prevBtn.click();
    });
  }

  // === HEADER LOGO ===
  const header = document.querySelector(".menu-header");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.pageYOffset;
    if (y > lastY && y > header.offsetHeight) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }
    lastY = y;
  });

  // === DROPDOWN SECTIONS (Our Walking Tips / Favorite Spots) ===
  const buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach((btn, index) => {
    const content = document.getElementById(`content${index + 1}`);
    const arrow = btn.querySelector("img");

    btn.addEventListener("click", () => {
      const isVisible = content.style.display === "block";

      // Chiudi tutte le altre sezioni
      document
        .querySelectorAll(".toggle-content")
        .forEach((div) => (div.style.display = "none"));
      document.querySelectorAll(".toggle-btn img").forEach((img) => {
        img.classList.remove("arrow-up");
        img.classList.add("arrow-down");
      });

      // Mostra o nascondi la sezione selezionata
      content.style.display = isVisible ? "none" : "block";

      // Ruota la freccia
      if (!isVisible) {
        arrow.classList.remove("arrow-down");
        arrow.classList.add("arrow-up");

        // 🔥 Se è la sezione della mappa, forza l’aggiornamento Leaflet
        if (content.id === "content2" && typeof map !== "undefined") {
          setTimeout(() => {
            map.invalidateSize();
          }, 250);
        }
      }
    });
  });
});