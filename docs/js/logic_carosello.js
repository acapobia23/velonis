// Carosello multiistanza: logica per ogni carosello indipendente

document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const originalCards = Array.from(track.querySelectorAll('.carousel-card'));
  const total = originalCards.length;

  // Funzione per calcolare le dimensioni reali
  function calculateDimensions() {
    const carouselWidth = carousel.offsetWidth;
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap || trackStyle.columnGap || '16');
    const paddingLeft = parseFloat(trackStyle.paddingLeft || '0');
    const paddingRight = parseFloat(trackStyle.paddingRight || '0');
    
    // Usa la prima card per calcolare la larghezza (assumendo tutte uguali)
    const cardWidth = originalCards[0].offsetWidth;
    
    return { carouselWidth, gap, paddingLeft, paddingRight, cardWidth };
  }

  // Clona le card per effetto loop e calcola la posizione iniziale
  const firstClone = originalCards[0].cloneNode(true);
  const lastClone = originalCards[total - 1].cloneNode(true);
  track.insertBefore(lastClone, originalCards[0]);
  track.appendChild(firstClone);

  const cards = Array.from(track.querySelectorAll('.carousel-card'));
  let current = 1; // inizia dalla prima card reale
  
  // Calcolo e posizionamento ultra-veloce con CSS Custom Properties
  function setInitialPosition() {
    const dims = calculateDimensions();
    const targetOffset = (dims.cardWidth * current) + (dims.gap * current) - (dims.carouselWidth / 2) + (dims.cardWidth / 2) + dims.paddingLeft;
    
    // Applicazione istantanea - batch di operazioni per performance ottimale
    const offsetValue = `${-targetOffset}px`;
    
    // Solo se la posizione calcolata è diversa da quella CSS di default
    const currentCSSOffset = getComputedStyle(track).getPropertyValue('--carousel-offset').trim();
    if (currentCSSOffset !== offsetValue) {
      track.style.setProperty('--carousel-offset', offsetValue);
    }
    
    // Assicura che non ci siano animazioni durante l'inizializzazione
    track.style.setProperty('--carousel-duration', '0s');
  }

  // Crea gli indicatori a puntini
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  dotsContainer.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    padding: 8px 0;
  `;
  
  const dots = [];
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot';
    dot.style.cssText = `
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ccc;
      cursor: pointer;
      transition: background-color 0.3s ease;
    `;
    dots.push(dot);
    dotsContainer.appendChild(dot);
    
    // Aggiungi click handler per navigare
    dot.addEventListener('click', () => {
      current = i + 1; // +1 perché abbiamo il clone all'inizio
      updateCarousel();
    });
  }
  
  carousel.appendChild(dotsContainer);

  function updateCarousel(animate = true) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === current);
    });
    
    // Aggiorna gli indicatori a puntini
    dots.forEach((dot, i) => {
      const isActive = (current - 1) === i; // -1 perché current tiene conto del clone iniziale
      dot.style.backgroundColor = isActive ? '#20b2aa' : '#ccc'; // turchese per attivo, grigio per inattivo
    });
    
    const dims = calculateDimensions();
    const offset = (dims.cardWidth * current) + (dims.gap * current) - (dims.carouselWidth / 2) + (dims.cardWidth / 2) + dims.paddingLeft;
    
    // Usa CSS Custom Properties per controllo dinamico delle animazioni
    track.style.setProperty('--carousel-offset', `${-offset}px`);
    track.style.setProperty('--carousel-duration', animate ? '0.4s' : '0s');
  }

  function jumpTo(index) {
    current = index;
    updateCarousel(false);
  }

  // Inizializzazione SINCRONA ultra-veloce
  function initializeCarousel() {
    // Controlla se le dimensioni sono disponibili
    if (carousel.offsetWidth > 0 && originalCards[0].offsetWidth > 0) {
      // Calcolo preciso e applicazione immediata
      setInitialPosition();
      
      // Aggiorna stati visivi immediatamente
      dots.forEach((dot, i) => {
        const isActive = (current - 1) === i;
        dot.style.backgroundColor = isActive ? '#20b2aa' : '#ccc';
      });
      cards.forEach((card, i) => {
        card.classList.toggle('active', i === current);
      });
      
      // Mostra il carosello IMMEDIATAMENTE (nessun requestAnimationFrame)
      track.classList.add('carousel-initialized');
    } else {
      // Fallback: riprova una sola volta dopo un micro-delay
      setTimeout(initializeCarousel, 1);
    }
  }

  // Inizializzazione IMMEDIATA - zero ritardi
  initializeCarousel();
  
  window.addEventListener('resize', () => updateCarousel(false));

  // Swipe touch - Ottimizzato per Safari iOS
  let startX = null;
  let startY = null;
  let isDragging = false;
  let swipeTriggered = false;
  
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = false;
    swipeTriggered = false;
  }, { passive: true });
  
  track.addEventListener('touchmove', e => {
    if (startX === null || startY === null || swipeTriggered) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const dx = currentX - startX;
    const dy = currentY - startY;
    
    // Solo se il movimento orizzontale è chiaramente maggiore di quello verticale
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 15) {
      isDragging = true;
    }
  }, { passive: true });
  
  track.addEventListener('touchend', e => {
    // Reset immediato se non abbiamo coordinate valide
    if (startX === null || startY === null) {
      startX = null;
      startY = null;
      isDragging = false;
      swipeTriggered = false;
      return;
    }
    
    // Processa il nuovo swipe SOLO se non è già in corso
    if (!swipeTriggered) {
      // Calcola il movimento finale solo su touchend
      const currentX = e.changedTouches[0].clientX;
      const currentY = e.changedTouches[0].clientY;
      const dx = currentX - startX;
      const dy = currentY - startY;
      
      // Verifica se è un swipe orizzontale valido
      if (isDragging && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        swipeTriggered = true;
        if (dx < 0) current++;
        if (dx > 0) current--;
        updateCarousel();
      }
    }
    
    // Reset SEMPRE alla fine - questo è fondamentale per Safari iOS
    startX = null;
    startY = null;
    isDragging = false;
    swipeTriggered = false;
  }, { passive: true });
  
  // Fallback per resettare le variabili in caso di eventi persi
  track.addEventListener('touchcancel', e => {
    startX = null;
    startY = null;
    isDragging = false;
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      touchTimeout = null;
    }
  });
  track.addEventListener('transitionend', () => {
    if (current === cards.length - 1) jumpTo(1); // clone in fondo → prima reale
    if (current === 0) jumpTo(cards.length - 2); // clone in testa → ultima reale
    
    // Aggiorna i puntini anche dopo il salto per il loop
    dots.forEach((dot, i) => {
      const isActive = (current - 1) === i;
      dot.style.backgroundColor = isActive ? '#20b2aa' : '#ccc';
    });
  });

  // Swipe mouse (desktop)
  let mouseDown = false;
  let mouseStartX = null;
  let mouseDragging = false;
  
  track.addEventListener('mousedown', e => {
    mouseDown = true;
    mouseStartX = e.clientX;
    mouseDragging = false;
  });
  
  track.addEventListener('mousemove', e => {
    if (!mouseDown) return;
    const dx = Math.abs(e.clientX - mouseStartX);
    if (dx > 15) {
      mouseDragging = true;
    }
  });
  
  track.addEventListener('mouseup', e => {
    if (!mouseDown) return;
    
    if (mouseDragging) {
      const dx = e.clientX - mouseStartX;
      if (Math.abs(dx) > 60) {
        if (dx < 0) current++;
        if (dx > 0) current--;
        updateCarousel();
      }
      // Prevent click if there was significant dragging
      e.preventDefault();
      e.stopPropagation();
    }
    
    mouseDown = false;
    mouseDragging = false;
  });
  
  // Prevent context menu on long press
  track.addEventListener('contextmenu', e => {
    if (mouseDragging) {
      e.preventDefault();
    }
  });

  // Handle clicks on carousel cards
  track.addEventListener('click', e => {
    // Allow navigation if user didn't drag
    if (!mouseDragging && !isDragging) {
      const clickedCard = e.target.closest('a.carousel-card');
      if (clickedCard && clickedCard.href) {
        // Let the browser handle the navigation naturally
        return true;
      }
    }
  });
}); 
