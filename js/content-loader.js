// Loads content from PHP backend and injects dynamic content into the page
// For World4You hosting with MySQL backend

(function () {
    // UPDATE THIS to your actual domain
    const API_BASE = 'https://www.sommertheaterlinz.at/api';

    fetch(`${API_BASE}/content.php?v=${Date.now()}`, { cache: 'no-cache' })
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                console.warn('Content API error:', data.error);
                return;
            }
            if (document.querySelector('.terminslider')) {
                renderTermine(data.termine);
            }
            if (document.querySelector('.program-cards')) {
                renderPrograms(data.programs);
            }
            if (document.querySelector('.video-hero') || document.querySelector('.video-grid')) {
                renderVideos(data.videos);
            }
        })
        .catch(err => {
            console.warn('Could not load dynamic content:', err);
            // Fallback: keep static content if fetch fails
        });

    function renderTermine(termine) {
        const slider = document.querySelector('.terminslider');
        if (!slider || !termine) return;

        slider.innerHTML = termine.map(t => `
            <div class="terminwrap">
                <div class="termin${t.soldOut ? ' sold-out' : ''}">
                    ${t.soldOut
                        ? `<span class="sold-out-label">
                                <h4>${t.day}</h4>
                                <h3>${t.date}</h3>
                                <p class="event-title">${t.title}</p>
                                <p>Ausverkauft</p>
                           </span>`
                        : `<a href="${t.ticketUrl}" target="_blank">
                                <h4>${t.day}</h4>
                                <h3>${t.date}</h3>
                                <p class="event-title">${t.title}</p>
                                <p>Ticket sichern</p>
                           </a>`
                    }
                </div>
            </div>
        `).join('');
    }

    function renderPrograms(programs) {
        const cards = document.querySelector('.program-cards');
        if (!cards || !programs) return;

        cards.innerHTML = programs.map(p => `
            <a href="${p.url}" class="program-card">
                <h3>${p.title}</h3>
                <p>${p.subtitle}</p>
            </a>
        `).join('');
    }

    function renderVideos(videos) {
        if (!videos) return;

        // Render Hero Video
        const heroSection = document.querySelector('.video-hero');
        if (heroSection && videos.hero) {
            const h = videos.hero;
            const videoEl = heroSection.querySelector('.hero-video source');
            const titleEl = heroSection.querySelector('.video-hero-content h1');
            const subtitleEl = heroSection.querySelector('.video-hero-content p');

            if (videoEl) videoEl.src = h.url;
            if (titleEl) titleEl.textContent = h.title || 'Turm 20';
            if (subtitleEl) subtitleEl.textContent = h.subtitle || 'Theater & Kulturverein · Linz';

            // Reload video with new source
            const video = heroSection.querySelector('.hero-video');
            if (video) video.load();
        }

        // Render Video Grid
        const grid = document.querySelector('.video-grid');
        if (grid && videos.grid) {
            grid.innerHTML = videos.grid.map(v => `
                <div class="video-item">
                    <video controls preload="metadata">
                        <source src="${v.url}" type="video/mp4">
                    </video>
                    <p>${v.title}</p>
                </div>
            `).join('');
        }
    }
})();
