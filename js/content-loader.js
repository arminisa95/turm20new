// Loads data/content.json and injects dynamic content into the page

(function () {
    fetch('data/content.json?v=' + Date.now(), { cache: 'no-cache' })
        .then(r => r.json())
        .then(data => {
            renderTermine(data.termine);
            renderPrograms(data.programs);
        })
        .catch(() => {
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
})();
