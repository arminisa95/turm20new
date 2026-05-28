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
            // Program cards are now static - do not overwrite with API data
            // if (document.querySelector('.program-cards')) {
            //     renderPrograms(data.programs);
            // }
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

        const groups = {};
        const groupOrder = [];
        termine.forEach(t => {
            if (!groups[t.title]) {
                groups[t.title] = [];
                groupOrder.push(t.title);
            }
            groups[t.title].push(t);
        });

        const terminCard = t => `
            <div class="terminwrap">
                <div class="termin${t.soldOut ? ' sold-out' : ''}">
                    ${t.soldOut
                        ? `<span class="sold-out-label">
                                <h4>${t.day}</h4>
                                <h3>${t.date}</h3>
                                ${t.time ? `<p class="event-time">${t.time}</p>` : ''}
                                <p>Ausverkauft</p>
                           </span>`
                        : `<a href="${t.ticketUrl}" target="_blank">
                                <h4>${t.day}</h4>
                                <h3>${t.date}</h3>
                                ${t.time ? `<p class="event-time">${t.time}</p>` : ''}
                                <p>Ticket sichern</p>
                           </a>`
                    }
                </div>
            </div>`;

        const sortOrder = ['Romeo & Julia', 'Rotkäppchen am Turm', 'Secret Sounds - Turm 20', 'Facetas Flamencas'];
        groupOrder.sort((a, b) => {
            const ia = sortOrder.indexOf(a);
            const ib = sortOrder.indexOf(b);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });

        slider.innerHTML = groupOrder.map(title => `
            <div class="termin-gruppe">
                <h3 class="termin-monat">${title}</h3>
                <div class="termin-gruppe-cards">
                    ${groups[title].map(terminCard).join('')}
                </div>
            </div>
        `).join('');

        // Generiere Google Event Structured Data
        generateGoogleEventsSchema(termine);
    }

    function generateGoogleEventsSchema(termine) {
        if (!termine || termine.length === 0) return;

        // Alten Schema-Script-Tag entfernen falls vorhanden
        const existingScript = document.getElementById('google-events-schema');
        if (existingScript) existingScript.remove();

        // Mapping fuer Programmbilder auf der Website fuer ein schoenes Vorschaubild bei Google
        const imageMap = {
            'Romeo & Julia': 'https://www.sommertheaterlinz.at/img/programm/romeo/Screenshot%202026-05-27%20at%2019-21-26%20(9)%20Instagram.png',
            'Rotkäppchen am Turm': 'https://www.sommertheaterlinz.at/img/programm/rotkaeppchen/image.png',
            'Secret Sounds': 'https://www.sommertheaterlinz.at/img/programm/secretsounds/2024-06_SofarSounds-Turm20-9065.jpg',
            'Facetas Flamencas': 'https://www.sommertheaterlinz.at/img/programm/flamenco/image.jpg'
        };

        const schemas = termine.map(t => {
            const datePart = t.rawDate || '2026-07-01'; // Fallback falls kein rawDate
            let timePart = t.time ? t.time.trim() : '19:30';
            timePart = timePart.replace('.', ':'); // Fallback fuer 19.30 -> 19:30
            if (!timePart.includes(':')) timePart += ':00'; // Fallback falls nur "19"
            
            const startISO = `${datePart}T${timePart}:00+02:00`;
            const cleanTitle = t.title.replace(' - Turm 20', '');

            return {
                "@context": "https://schema.org",
                "@type": "TheaterEvent",
                "name": cleanTitle,
                "startDate": startISO,
                "location": {
                    "@type": "Place",
                    "name": "Sommertheater am Turm 20",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Kreuzweg 42",
                        "addressLocality": "Linz",
                        "postalCode": "4040",
                        "addressCountry": "AT"
                    }
                },
                "image": imageMap[cleanTitle] || 'https://www.sommertheaterlinz.at/img/logo/Zeichenflaeche-1-300x300.png',
                "description": `Aufführung von "${cleanTitle}" im malerischen Sommertheater am Turm 20 in Linz.`,
                "offers": {
                    "@type": "Offer",
                    "url": t.ticketUrl || "https://www.sommertheaterlinz.at/#termine",
                    "priceCurrency": "EUR",
                    "availability": t.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
                }
            };
        });

        const script = document.createElement('script');
        script.id = 'google-events-schema';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemas);
        document.head.appendChild(script);
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
