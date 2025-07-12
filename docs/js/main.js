// Funzione di esempio per futura logica JS dinamica
function toggleContent(id) {
    const content = document.getElementById(id);
    if (content) {
      content.classList.toggle('d-none');
    }
  }
  
function handleCardClick(card) {
  card.classList.toggle('flipped');
  if (card.classList.contains('flipped')) {
    setTimeout(() => card.classList.remove('flipped'), 10000); // ritorna dopo 5s
  }
}

// banner che scorre

document.addEventListener('DOMContentLoaded', () => {
  const bannerImg = document.getElementById('banner-img');

  const images = [
    'assets/img/headers/wdl-onlylogo.jpg',
    'assets/img/original/ponte-vecchio.jpg',
    'assets/img/original/header-experiences.jpg',
  ];

  let index = 0;

  setInterval(() => {
    index = (index + 1) % images.length;

    // Effetto dissolvenza
    bannerImg.style.opacity = 0;

    setTimeout(() => {
      bannerImg.style.backgroundImage = `url('${images[index]}')`;
      bannerImg.style.opacity = 1;
    }, 500);
  }, 5000); // ← Mancava questo parametro per l'intervallo di 5 secondi
});




