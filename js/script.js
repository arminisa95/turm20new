// Mobile Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('main-nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const isOpen = menu.classList.toggle('active');
    
    // Toggle icon
    if (toggle) toggle.textContent = isOpen ? '✕' : '☰';
    
    // Toggle overlay
    let overlay = document.getElementById('menu-overlay');
    if (isOpen) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'menu-overlay';
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1001;opacity:0;transition:opacity 0.3s ease;';
            overlay.addEventListener('click', toggleMenu);
            document.body.appendChild(overlay);
        }
        requestAnimationFrame(() => overlay.style.opacity = '1');
        document.body.style.overflow = 'hidden';
    } else {
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
        document.body.style.overflow = '';
    }
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            const menu = document.getElementById('main-nav');
            if (menu && menu.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const topBar = document.getElementById('top-bar-menu');
    if (!topBar) return;
    topBar.classList.toggle('scrolled', window.scrollY > 50);
});

// Close mobile menu when clicking outside (backup for overlay)
document.addEventListener('click', (e) => {
    const menu = document.getElementById('main-nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (menu && toggle && menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        toggleMenu();
    }
});
