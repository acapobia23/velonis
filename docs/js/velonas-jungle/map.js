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

/* ============================================================
 Velona’s Jungle Interactive Map — FINAL VERSION
 Mode: Premium UX (Smooth zoom, Bounce Selection, Dark Mode)
============================================================ */

let map, routingControl = null;
let activeRing = null;
let lastSelectedMarker = null;
let layers = {};
let basePoint = null;
let ignoreClose = false;

// DOM references
const card = document.getElementById("map-card");
const themeToggle = document.getElementById("theme-toggle");

/* ------------------ INIT ------------------ */
document.addEventListener("DOMContentLoaded", initMap);
initTheme();

/* ------------------ MAP INIT ------------------ */
async function initMap() {
  map = L.map("map", { zoomControl: false }).setView([43.7769, 11.2387], 14);

  // Light Mode Default Tile
  const lightTiles = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    { maxZoom: 19 }
  ).addTo(map);

  // Dark Mode Tile (loaded only if needed)
  const darkTiles = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    { maxZoom: 19 }
  );

  map.tileLayers = { light: lightTiles, dark: darkTiles };

  // Enable zoom buttons
  L.control.zoom({ position: "topright" }).addTo(map);

  // Load GeoJSON index
  const res = await fetch("https://acapobia23.github.io/map-tips/index.json");
  const indexData = await res.json();

  // Base point (Velona’s Jungle)
  const baseRes = await fetch(
    "https://acapobia23.github.io/map-tips/data/velona's-jungle.geojson"
  );
  const baseData = await baseRes.json();

  basePoint = L.geoJSON(baseData, {
    pointToLayer: (feature, latlng) =>
      L.marker(latlng, {
        icon: L.icon({
          iconUrl:
            "https://acapobia23.github.io/map-tips/asset/icons/base.png",
          iconSize: [42, 42],
        }),
      }).bindPopup(`<strong>Velona’s Jungle</strong><br>Your starting point.`),
  }).addTo(map);

  // Load all category layers (start hidden)
  for (const layer of indexData.layers) {
    await loadCategoryLayer(layer);
  }

  setupFilters();
  setupMapCloseLogic();
  applyThemeMode();
}

/* ------------------ LOAD CATEGORY ------------------ */
async function loadCategoryLayer(layerInfo) {
  const url = `https://acapobia23.github.io/map-tips/data/${layerInfo.file}`;
  const res = await fetch(url);
  const data = await res.json();

  const geoLayer = L.geoJSON(data, {
    pointToLayer: (feature, latlng) => {
      const props = feature.properties ?? {};
      const iconUrl = getIcon(layerInfo.category);
      const marker = L.marker(latlng, {
        icon: L.icon({ iconUrl, iconSize: [38, 38] }),
      });

      marker.place = {
        name: props.name ?? "Unnamed",
        description: props?.description?.value ?? props.description ?? "",
        category: layerInfo.category,
        iconUrl,
        latlng,
      };

      marker.on("click", () => onMarkerSelect(marker));

      return marker;
    },
  });

  layers[layerInfo.category] = geoLayer;
}

/* ------------------ MARKER SELECT ------------------ */
function onMarkerSelect(marker) {
  ignoreClose = true;
  setTimeout(() => (ignoreClose = false), 250);

  // Bounce Animation
  if (lastSelectedMarker) lastSelectedMarker._icon.classList.remove("bounce");
  marker._icon.classList.add("bounce");
  lastSelectedMarker = marker;

  // Route
  showRoute(marker.place.latlng);

  // Highlight ring
  showRing(marker.place.latlng);

  // Fly smoothly
  map.flyTo(marker.place.latlng, Math.max(map.getZoom(), 17), {
    animate: true,
    duration: 0.75,
  });

  // Show card
  showCard(marker.place);
}

/* ------------------ ROUTE ------------------ */
function showRoute(latlng) {
  if (!basePoint) return;

  const basePos = basePoint.getLayers()[0].getLatLng();

  if (routingControl) map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: [basePos, latlng],
    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: false,
    lineOptions: {
      styles: [
        { color: "#3BD2C9", weight: 5, opacity: 0.9 },
        { color: "#ffffff", weight: 2, opacity: 0.9 },
      ],
    },
    createMarker: () => null,
  }).addTo(map);
}

/* ------------------ RING HIGHLIGHT ------------------ */
function showRing(latlng) {
  if (activeRing) map.removeLayer(activeRing);

  activeRing = L.circleMarker(latlng, {
    radius: 26,
    color: "#3BD2C9",
    weight: 3,
    fillOpacity: 0,
  }).addTo(map);
}

/* ------------------ CARD UI ------------------ */
function showCard(place) {
  card.innerHTML = `
    <div class="map-card-inner">
      <div class="map-card-header">
        <img src="${place.iconUrl}" class="map-card-icon" />
        <div>
          <span class="map-card-category">${formatCategory(place.category)}</span>
          <h3 class="map-card-title">${place.name}</h3>
        </div>
      </div>
      <p class="map-card-desc">${place.description}</p>
      <a class="map-card-btn" target="_blank" href="https://www.google.com/maps/dir/?api=1&origin=Velona's Jungle,Florence&destination=${encodeURIComponent(
        place.name + ", Florence"
      )}">
        Open in Google Maps
      </a>
    </div>
  `;

  card.classList.add("visible");
}

/* ------------------ CLOSE ON TAP ------------------ */
function setupMapCloseLogic() {
  map.on("click", () => {
    if (ignoreClose) return;
    hideCard();
  });
}

function hideCard() {
  card.classList.remove("visible");
  if (routingControl) map.removeControl(routingControl);
  if (activeRing) map.removeLayer(activeRing);
  if (lastSelectedMarker)
    lastSelectedMarker._icon.classList.remove("bounce");
}

/* ------------------ FILTERS ------------------ */
function setupFilters() {
  document.querySelectorAll(".map-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const layerName = btn.dataset.layer;
      const layer = layers[layerName];

      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        btn.classList.remove("active");
      } else {
        map.addLayer(layer);
        btn.classList.add("active");
      }

      adjustView();
    });
  });
}

/* ------------------ AUTO VIEW ------------------ */
function adjustView() {
  const activeLayers = Object.values(layers).filter((l) => map.hasLayer(l));
  if (!activeLayers.length) {
    map.flyTo([43.7769, 11.2387], 14);
    return;
  }

  const bounds = L.latLngBounds([]);
  activeLayers.forEach((layer) => {
    layer.eachLayer((m) => bounds.extend(m.getLatLng()));
  });

  map.flyToBounds(bounds, { padding: [50, 50], animate: true });
}

/* ------------------ ICONS ------------------ */
function getIcon(type) {
  const base = "https://acapobia23.github.io/map-tips/asset/icons/";
  return (
    {
      breakfast: base + "breakfast.png",
      boutique: base + "boutique.png",
      "restaurant-bar": base + "restaurant.png",
      veggie: base + "veggie.png",
    }[type] ?? base + "base.png"
  );
}

function formatCategory(c) {
  return (
    {
      breakfast: "Breakfast & Cafés",
      boutique: "Boutiques",
      "restaurant-bar": "Restaurants & Bars",
      veggie: "Veggie Friendly",
    }[c] ?? c
  );
}

/* ------------------ THEME MODE ------------------ */
function initTheme() {
  if (localStorage.getItem("theme") === "dark")
    document.body.classList.add("dark-mode");
}

function applyThemeMode() {
  const mode = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";

  map.tileLayers.light.remove();
  map.tileLayers.dark.remove();

  if (mode === "dark") map.tileLayers.dark.addTo(map);
  else map.tileLayers.light.addTo(map);
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
  applyThemeMode();
});

