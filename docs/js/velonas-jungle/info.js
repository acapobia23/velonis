document.addEventListener("DOMContentLoaded", () => {
  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    const imageFiles = ["01.jpg","02.webp"]; //file name of pic
    const basePath = "../../assets/img/boxes/velonas-jungle/"; //path pic
    const images = imageFiles.map(f => basePath + f);
//cambiare alt name linea 14
    galleryContainer.innerHTML = `
      <div class="gallery">
        <button class="gallery-btn prev">&#10094;</button>
        <div class="gallery-track-container">
          <div class="gallery-track">
            ${images.map(src => `<div class="gallery-slide"><img src="${src}" alt="Velona's Jungle" /></div>`).join('')}
          </div>
        </div>
        <button class="gallery-btn next">&#10095;</button>
      </div>
    `;

    const track = galleryContainer.querySelector('.gallery-track');
    const slides = galleryContainer.querySelectorAll('.gallery-slide');
    const prevBtn = galleryContainer.querySelector('.gallery-btn.prev');
    const nextBtn = galleryContainer.querySelector('.gallery-btn.next');
    let idx = 0;

    const updateGallery = () => {
      const w = slides[0].clientWidth;
      track.style.transform = `translateX(-${idx * w}px)`;
    };
    nextBtn.addEventListener('click', () => { idx = (idx+1)%slides.length; updateGallery(); });
    prevBtn.addEventListener('click', () => { idx = (idx-1+slides.length)%slides.length; updateGallery(); });
    window.addEventListener('resize', updateGallery);
    updateGallery();

    // touch
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (endX < startX - 30) nextBtn.click();
      if (endX > startX + 30) prevBtn.click();
    });
  }

  // === HEADER LOGO ===
  const header = document.querySelector('.menu-header');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    if (y > lastY && y > header.offsetHeight) {
      // scrolling down past header height → hide
      header.style.transform = 'translateY(-100%)';
    } else {
      // scrolling up or near top → show
      header.style.transform = 'translateY(0)';
    }
    lastY = y;
  });
});

/*MAPPA*/


/* =========================================
   Velona’s Jungle Tips — Interactive Map
   ========================================= */

document.addEventListener("DOMContentLoaded", initMap);

let map;
let layers = {};
let basePoint = null;
let routingControl = null;

/* === INIT MAP === */
async function initMap() {
  map = L.map("map").setView([43.7769, 11.2387], 14);

  // Base layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  // Index of layers
  const indexUrl = "https://acapobia23.github.io/map-tips/index.json";
  const res = await fetch(indexUrl);
  const indexData = await res.json();

  // === Base point: Velona’s Jungle ===
  const baseRes = await fetch("https://acapobia23.github.io/map-tips/data/velona's-jungle.geojson");
  const baseData = await baseRes.json();
  basePoint = L.geoJSON(baseData, {
    pointToLayer: (feature, latlng) =>
      L.marker(latlng, {
        icon: L.icon({
          iconUrl: "https://acapobia23.github.io/map-tips/asset/icons/base.png",
          iconSize: [40, 40],
        }),
      }).bindPopup("<strong>Velona’s Jungle</strong><br>Your starting point!"),
  }).addTo(map);

  // === Load layers ===
  for (const layerInfo of indexData.layers) {
    const url = `https://acapobia23.github.io/map-tips/data/${layerInfo.file}`;
    const res = await fetch(url);
    const data = await res.json();

    const geoLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const props = feature.properties || {};
        const iconUrl = getIconByCategory(layerInfo.category);
        const marker = L.marker(latlng, {
          icon: L.icon({
            iconUrl,
            iconSize: [38, 38],
          }),
        });

        let desc = "";
        if (props.description?.value) desc = props.description.value;
        else if (props.description) desc = props.description;

        marker.bindPopup(
          `<strong>${props.name || "Unnamed"}</strong><br>${desc}<br><br>
          <a href="https://www.google.com/maps/dir/?api=1&origin=Velona's Jungle, Florence&destination=${latlng.lat},${latlng.lng}" target="_blank">
            Open in Google Maps
          </a>`
        );

        marker.on("click", () => showRoute(latlng));

        return marker;
      },
    });

    layers[layerInfo.category] = geoLayer;
  }

  // === Activate button logic ===
  setupFilters();
}

/* === BUTTON LOGIC (rock-solid toggle) === */
function setupFilters() {
  document.querySelectorAll(".map-controls .bott-grid-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Sicurezza: risali sempre al contenitore del bottone
      const button = e.target.closest(".bott-grid-item");
      if (!button) return;

      const layerName = button.dataset.layer;
      const layer = layers[layerName];
      if (!layer) return;

      const isOnMap = map.hasLayer(layer);

      if (isOnMap) {
        map.removeLayer(layer);
        button.classList.remove("active");
      } else {
        layer.addTo(map);
        button.classList.add("active");
      }
    });
  });
}



/* === SHOW ROUTE === */
function showRoute(latlng) {
  if (!basePoint) return;

  const baseCoords = basePoint.getLayers()[0].getLatLng();

  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [baseCoords, latlng],
    routeWhileDragging: false,
    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    createMarker: () => null,
  }).addTo(map);
}

/* === ICONS BY CATEGORY === */
function getIconByCategory(category) {
  const base = "https://acapobia23.github.io/map-tips/asset/icons/";
  switch (category) {
    case "breakfast":
      return base + "breakfast.png";
    case "boutique":
      return base + "boutique.png";
    case "restaurant-bar":
      return base + "restaurant.png";
    case "veggie":
      return base + "veggie.png";
    default:
      return base + "base.png";
  }
}
