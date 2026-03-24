// Partner Slider
let currentPartnerSlide = 0;
const partnerSlider = document.querySelector('.partner-slider');
const partnerMembers = document.querySelectorAll('.partner-member');
const totalPartnerSlides = partnerMembers.length;
const visiblePartners = 1;

function slidePartners(direction) {
    currentPartnerSlide = Math.max(0, Math.min(
        currentPartnerSlide + direction,
        totalPartnerSlides - visiblePartners
    ));
    updatePartnerSlider();
}

function updatePartnerSlider() {
    const slideWidth = 416;
    partnerSlider.style.transform = `translateX(${-currentPartnerSlide * slideWidth}px)`;
}

// Foto Show Auto-Slideshow
let currentFotoSlide = 0;
let fotoSlides = [];
let totalFotoSlides = 0;

const fotoshowImages = [
    'img/fotoshow/Screenshot 2026-03-11 at 21-35-12 Instagram.png',
    'img/fotoshow/Screenshot 2026-03-11 at 21-35-33 Instagram.png',
    'img/fotoshow/Screenshot 2026-03-11 at 21-36-23 Instagram.png',
    'img/fotoshow/Screenshot 2026-03-11 at 21-37-02 Instagram.png',
    'img/fotoshow/Screenshot 2026-03-11 at 21-37-10 Instagram.png',
    'img/fotoshow/Screenshot 2026-03-11 at 21-37-16 Instagram.png',
    'img/fotoshow/Screenshot 2026-03-11 at 21-37-33 Instagram.png',
    'img/fotoshow/Screenshot 2026-03-11 at 21-37-42 Instagram.png',
    'img/fotoshow/Screenshot 2026-03-11 at 21-37-54 Instagram.png'
];

function initializeFotoshow() {
    const fotoshowContainer = document.getElementById('fotoshow-container');
    if (!fotoshowContainer) return;

    fotoshowImages.forEach((imagePath, index) => {
        const slide = document.createElement('div');
        slide.className = 'foto-slide';
        if (index === 0) slide.classList.add('active');

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Sommertheater Impression ${index + 1}`;
        img.onerror = function() {
            console.warn(`Bild nicht gefunden: ${imagePath}`);
            slide.style.display = 'none';
        };

        slide.appendChild(img);
        fotoshowContainer.appendChild(slide);
    });

    fotoSlides = document.querySelectorAll('.foto-slide');
    totalFotoSlides = fotoSlides.length;

    if (totalFotoSlides > 0) {
        setInterval(nextFotoSlide, 3000);
    }
}

function showFotoSlide(index) {
    fotoSlides.forEach(slide => slide.classList.remove('active'));
    if (fotoSlides[index] && fotoSlides[index].style.display !== 'none') {
        fotoSlides[index].classList.add('active');
    }
}

function nextFotoSlide() {
    let nextIndex = currentFotoSlide;
    let attempts = 0;
    do {
        nextIndex = (nextIndex + 1) % totalFotoSlides;
        if (++attempts > totalFotoSlides) { nextIndex = 0; break; }
    } while (fotoSlides[nextIndex] && fotoSlides[nextIndex].style.display === 'none');

    currentFotoSlide = nextIndex;
    showFotoSlide(currentFotoSlide);
}

window.addEventListener('resize', () => {
    currentPartnerSlide = 0;
    updatePartnerSlider();
});

initializeFotoshow();
