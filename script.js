// Product images for carousel
const products = [
    'usb-hero.png',
    'usb-lifestyle1.png',
    'usb-lifestyle2.png',
    'usb-ssd.png'
];

let currentProductIndex = 0;

// Change product function
function changeProduct(direction) {
    currentProductIndex += direction;
    
    if (currentProductIndex >= products.length) {
        currentProductIndex = 0;
    } else if (currentProductIndex < 0) {
        currentProductIndex = products.length - 1;
    }
    
    const heroProduct = document.getElementById('hero-product');
    if (heroProduct) {
        heroProduct.style.opacity = '0';
        
        setTimeout(() => {
            heroProduct.src = products[currentProductIndex];
            heroProduct.style.opacity = '1';
        }, 150);
    }
}

// Handle purchase clicks
function handlePurchase() {
    console.log('Purchase initiated');
    // Add purchase animation
    const buttons = document.querySelectorAll('.buy-button');
    buttons.forEach(button => {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    });
}

// Auto-advance carousel every 6 seconds
let autoAdvanceInterval = setInterval(() => {
    changeProduct(1);
}, 6000);

// Pause auto-advance when user interacts
function pauseAutoAdvance() {
    clearInterval(autoAdvanceInterval);
    setTimeout(() => {
        autoAdvanceInterval = setInterval(() => {
            changeProduct(1);
        }, 6000);
    }, 10000); // Resume after 10 seconds of no interaction
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        changeProduct(-1);
        pauseAutoAdvance();
    } else if (e.key === 'ArrowRight') {
        changeProduct(1);
        pauseAutoAdvance();
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > swipeThreshold && diffY < swipeThreshold * 2) {
        if (diffX > 0) {
            // Swiped left, go to next product
            changeProduct(1);
        } else {
            // Swiped right, go to previous product
            changeProduct(-1);
        }
        pauseAutoAdvance();
    }
}

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    const sections = document.querySelectorAll('.features, .gallery, .space, .ssd-section, .connect');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Add click handlers for navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            pauseAutoAdvance();
        });
    });

    // Add click handlers for buy buttons
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handlePurchase();
        });
    });

    // Add hover effects to gallery images
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });

    // Smooth parallax effect for hero section
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.05;
            hero.style.transform = `translateY(${rate}px)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Preload images for smooth transitions
    products.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Add loading state for images
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
        });
    });

    // Add smooth scrolling to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add click animation to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .icon, .footer-icon');
    interactiveElements.forEach(element => {
        element.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});

// Performance optimization: debounced resize handler
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Handle any resize-specific logic here
        console.log('Window resized');
    }, 250);
});

// Add visual feedback for touch interactions on mobile
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
}