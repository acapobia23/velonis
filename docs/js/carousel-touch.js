// Touch Direction Detection per Caroselli
// Gestisce lo scroll orizzontale senza interferire con quello verticale

document.addEventListener('DOMContentLoaded', function() {
    // Ritardo per permettere al CSS dinamico di stabilizzarsi su Safari iOS
    setTimeout(() => {
        initializeCarouselTouch();
    }, 100);
});

function initializeCarouselTouch() {
    const carousels = document.querySelectorAll('.carousel-track');
    
    // Rilevamento Safari iOS
    const isSafariIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                       /Safari/.test(navigator.userAgent) && 
                       !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);
    
    // Gestione globale delle animazioni (fix per listener duplicati)
    let globalListenersAdded = false;
    const globalCarouselAnimating = new Set(); // Traccia caroselli multipli
    
    // Aggiungi listener globali solo una volta per evitare duplicati
    if (!globalListenersAdded) {
        document.addEventListener('touchmove', function(e) {
            if (globalCarouselAnimating.size > 0) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
        
        document.addEventListener('wheel', function(e) {
            if (globalCarouselAnimating.size > 0) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
        
        // Safari iOS: Sistema di backup per ripristino scroll
        if (isSafariIOS) {
            let safariScrollBackupTimer = null;
            
            document.addEventListener('touchstart', function(e) {
                // Reset del timer di backup ogni volta che l'utente tocca
                if (safariScrollBackupTimer) {
                    clearTimeout(safariScrollBackupTimer);
                }
                
                // Controlla se il tocco è fuori dalle aree dei caroselli
                const touchedCarousel = e.target.closest('.carousel-track');
                if (!touchedCarousel) {
                    // Tocco fuori dai caroselli: riattiva immediatamente lo scroll verticale
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.style.webkitOverflowScrolling = 'touch';
                    
                    // Trigger evento per "risvegliare" Safari iOS
                    setTimeout(() => {
                        window.dispatchEvent(new Event('scroll', { bubbles: true }));
                    }, 10);
                } else {
                    // Tocco su carosello: controlla se è fuori dall'area delle card
                    const carouselCards = touchedCarousel.querySelectorAll('.carousel-card');
                    let touchedCard = false;
                    
                    carouselCards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const touch = e.touches[0];
                        
                        // Box invisibile leggermente più piccolo della card (5% di margine)
                        const margin = Math.min(rect.width, rect.height) * 0.05;
                        const adjustedRect = {
                            left: rect.left + margin,
                            right: rect.right - margin,
                            top: rect.top + margin,
                            bottom: rect.bottom - margin
                        };
                        
                        if (touch.clientX >= adjustedRect.left && 
                            touch.clientX <= adjustedRect.right &&
                            touch.clientY >= adjustedRect.top && 
                            touch.clientY <= adjustedRect.bottom) {
                            touchedCard = true;
                        }
                    });
                    
                    if (!touchedCard) {
                        // Tocco nel carosello ma fuori dalle card: riattiva scroll verticale
                        document.body.style.overflow = '';
                        document.documentElement.style.overflow = '';
                        document.body.style.webkitOverflowScrolling = 'touch';
                    }
                }
                
                // Backup: ripristina lo scroll dopo 2 secondi di inattività
                safariScrollBackupTimer = setTimeout(() => {
                    if (globalCarouselAnimating.size === 0) {
                        document.body.style.overflow = '';
                        document.documentElement.style.overflow = '';
                        document.body.style.webkitOverflowScrolling = 'touch';
                    }
                }, 2000);
            }, { passive: true });
        }
        
        // Funzione helper per controllare se un punto è dentro l'area rilevante di una card
        function isPointInCardArea(x, y, card) {
            const rect = card.getBoundingClientRect();
            const margin = 8; // 8px di margine per box più piccolo
            
            const adjustedRect = {
                left: rect.left + margin,
                right: rect.right - margin,
                top: rect.top + margin,
                bottom: rect.bottom - margin
            };
            
            return x >= adjustedRect.left && x <= adjustedRect.right &&
                   y >= adjustedRect.top && y <= adjustedRect.bottom;
        }
        
        // Funzione helper per forzare il ripristino dello scroll
        function forceScrollRestore() {
            setTimeout(() => {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                if (isSafariIOS) {
                    document.body.style.webkitOverflowScrolling = 'touch';
                    window.dispatchEvent(new Event('scroll', { bubbles: true }));
                }
            }, 5);
        }
        
        // Listener per touch events
        document.addEventListener('touchstart', function(e) {
            const touchedCarousel = e.target.closest('.carousel-track');
            
            if (touchedCarousel) {
                const carouselCards = touchedCarousel.querySelectorAll('.carousel-card');
                const touch = e.touches[0];
                let isOnCard = false;
                
                carouselCards.forEach(card => {
                    if (isPointInCardArea(touch.clientX, touch.clientY, card)) {
                        isOnCard = true;
                    }
                });
                
                // Se tocca nel carosello ma non su una card, forza il ripristino
                if (!isOnCard) {
                    forceScrollRestore();
                }
            }
        }, { passive: true });
        
        // Listener per mouse events (desktop)
        document.addEventListener('mousedown', function(e) {
            const clickedCarousel = e.target.closest('.carousel-track');
            
            if (clickedCarousel) {
                const carouselCards = clickedCarousel.querySelectorAll('.carousel-card');
                let isOnCard = false;
                
                carouselCards.forEach(card => {
                    if (isPointInCardArea(e.clientX, e.clientY, card)) {
                        isOnCard = true;
                    }
                });
                
                // Se clicca nel carosello ma non su una card, forza il ripristino
                if (!isOnCard) {
                    forceScrollRestore();
                }
            }
        }, { passive: true });
        
        globalListenersAdded = true;
    }

    carousels.forEach(carousel => {
        let startX = null;
        let startY = null;
        let isDragging = false;
        let isHorizontalScroll = false;
        
        // Soglie adattate per Safari iOS
        const THRESHOLD = isSafariIOS ? 15 : 10; // Soglia più alta per Safari iOS
        const MAX_ANGLE_DEGREES = isSafariIOS ? 35 : 45; // Più restrittivo per Safari iOS
        
        // Funzione per calcolare l'angolo del movimento
        function getMovementAngle(deltaX, deltaY) {
            const angleRad = Math.atan2(deltaY, deltaX);
            const angleDeg = Math.abs(angleRad * 180 / Math.PI);
            return Math.min(angleDeg, 180 - angleDeg); // Normalizza tra 0-90°
        }
        
        // Monitora animazioni per questo specifico carosello
        carousel.addEventListener('transitionstart', function() {
            globalCarouselAnimating.add(carousel);
        });
        
        carousel.addEventListener('transitionend', function() {
            globalCarouselAnimating.delete(carousel);
            
            // Safari iOS: Ripristino veloce al termine delle animazioni
            if (isSafariIOS && globalCarouselAnimating.size === 0) {
                // Quando non ci sono più caroselli animanti, ripristina subito lo scroll
                setTimeout(() => {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.style.webkitOverflowScrolling = 'touch';
                    
                    // Trigger scroll event per "risvegliare" Safari iOS
                    window.dispatchEvent(new Event('scroll', { bubbles: true }));
                }, 20);
            }
        });
        
        carousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = false;
            isHorizontalScroll = false;
        }, { passive: true });
        
        // Logica touch differenziata per Safari iOS
        if (isSafariIOS) {
            // Safari iOS: logica semplificata e più permissiva
            carousel.addEventListener('touchmove', function(e) {
                // Se c'è un'animazione in corso, blocca tutto
                if (globalCarouselAnimating.has(carousel)) {
                    e.preventDefault();
                    return;
                }
                
                if (!startX || !startY) return;
                
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);
                
                // Safari iOS: logica più semplice e restrittiva
                if (deltaX > THRESHOLD && deltaX > deltaY * 1.5) {
                    isHorizontalScroll = true;
                    isDragging = true;
                    e.preventDefault(); // Blocca scroll verticale solo se chiaramente orizzontale
                }
            }, { passive: false });
        } else {
            // Altri browser: logica completa esistente
            carousel.addEventListener('touchmove', function(e) {
                // Se c'è un'animazione in corso, blocca tutto
                if (globalCarouselAnimating.has(carousel)) {
                    e.preventDefault();
                    return;
                }
                
                if (!startX || !startY) return;
                
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);
                
                // Calcola l'angolo del movimento
                const movementAngle = getMovementAngle(deltaX, deltaY);
                
                // Determina la direzione usando l'angolo
                if (!isDragging && (deltaX > 5 || deltaY > 5)) {
                    if (movementAngle <= MAX_ANGLE_DEGREES) {
                        // Movimento orizzontale o diagonale (≤45°)
                        isHorizontalScroll = true;
                        isDragging = true;
                    } else if (movementAngle >= (90 - MAX_ANGLE_DEGREES)) {
                        // Movimento molto verticale (≥45°)
                        isHorizontalScroll = false;
                        isDragging = true;
                    }
                }
                
                // Solo se abbiamo superato la soglia principale per confermare
                if (deltaX > THRESHOLD || deltaY > THRESHOLD) {
                    if (!isDragging) {
                        // Fallback con soglia più restrittiva
                        if (deltaX > deltaY * 2) { // Deve essere almeno 2x più orizzontale
                            isHorizontalScroll = true;
                            isDragging = true;
                        } else if (deltaY > deltaX * 2) { // Deve essere almeno 2x più verticale
                            isHorizontalScroll = false;
                            isDragging = true;
                        }
                        // Se non è chiaramente orizzontale o verticale, non fare nulla (zona grigia)
                    }
                    
                    // Se è scroll orizzontale, previeni lo scroll verticale
                    if (isHorizontalScroll) {
                        if (e.cancelable) {
                            e.preventDefault();
                        }
                    }
                } else if (isHorizontalScroll && isDragging) {
                    // Continua a prevenire anche per movimenti piccoli se abbiamo già determinato la direzione
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });
        }
        
        carousel.addEventListener('touchend', function(e) {
            // Safari iOS: Ripristino veloce dello scroll verticale
            if (isSafariIOS && (isDragging || isHorizontalScroll)) {
                // Forza il ripristino dello scroll verticale immediatamente
                setTimeout(() => {
                    // Trigger un evento dummy per "sbloccare" Safari iOS
                    const dummyEvent = new Event('touchstart', { bubbles: true, cancelable: true });
                    document.body.dispatchEvent(dummyEvent);
                }, 10);
            }
            
            // Reset delle variabili
            startX = null;
            startY = null;
            isDragging = false;
            isHorizontalScroll = false;
        }, { passive: true });
        
        carousel.addEventListener('touchcancel', function(e) {
            // Safari iOS: Ripristino forzato anche su touchcancel
            if (isSafariIOS) {
                // Ripristino immediato per Safari iOS
                setTimeout(() => {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    // Re-enable momentum scrolling
                    document.body.style.webkitOverflowScrolling = 'touch';
                }, 5);
            }
            
            // Reset delle variabili anche in caso di cancel
            startX = null;
            startY = null;
            isDragging = false;
            isHorizontalScroll = false;
        }, { passive: true });
        
        // Gestione per eventi pointer (per compatibilità con stylus/mouse)
        let startPointerX = null;
        let startPointerY = null;
        let isPointerDragging = false;
        let isPointerHorizontalScroll = false;
        
        carousel.addEventListener('pointerdown', function(e) {
            if (e.pointerType === 'touch') return; // Gestito già da touchstart
            
            startPointerX = e.clientX;
            startPointerY = e.clientY;
            isPointerDragging = false;
            isPointerHorizontalScroll = false;
        });
        
        carousel.addEventListener('pointermove', function(e) {
            if (e.pointerType === 'touch') return; // Gestito già da touchmove
            if (!startPointerX || !startPointerY) return;
            
            const deltaX = Math.abs(e.clientX - startPointerX);
            const deltaY = Math.abs(e.clientY - startPointerY);
            
            if (deltaX > THRESHOLD || deltaY > THRESHOLD) {
                if (!isPointerDragging) {
                    if (deltaX > deltaY * 2.5) { // Soglia più restrittiva per pointer
                        isPointerHorizontalScroll = true;
                        isPointerDragging = true;
                    } else if (deltaY > deltaX * 2.5) {
                        isPointerHorizontalScroll = false;
                        isPointerDragging = true;
                    }
                }
                
                if (isPointerHorizontalScroll) {
                    e.preventDefault();
                }
            }
        });
        
        carousel.addEventListener('pointerup', function(e) {
            if (e.pointerType === 'touch') return;
            
            startPointerX = null;
            startPointerY = null;
            isPointerDragging = false;
            isPointerHorizontalScroll = false;
        });
    });
}


