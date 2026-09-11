/* === THE SIGNAL — Dynamic Renderer === */

(function() {
    'use strict';

    function escape(s) {
        const d = document.createElement('div');
        d.textContent = s || '';
        return d.innerHTML;
    }

    function renderProducts(products) {
        const grid = document.getElementById('products-grid');
        if (!grid) return;
        
        grid.innerHTML = products.map((p, i) => {
            const badge = i === 0 ? '<span class="product-tag tag-hot">BESTSELLER</span>' : 
                         p.badge ? `<span class="product-tag tag-${p.badgeClass || 'new'}">${escape(p.badge)}</span>` : '';
            
            const image = p.image ? `<img src="${escape(p.image)}" alt="${escape(p.name)}" loading="lazy">` :
                          `<div class="product-icon"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2"/></svg></div>`;
            
            return `
                <article class="product" data-url="${escape(p.affiliate?.url || '')}">
                    <div class="product-visual">
                        <div class="product-image">${image}</div>
                        ${badge}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${escape(p.name)}</h3>
                        <p class="product-desc">${escape(p.description || '')}</p>
                        <div class="product-proof">
                            ${p.social_proof ? `<span class="proof-item">${escape(p.social_proof)}</span>` : ''}
                            ${p.rating ? `<span class="proof-item">★ ${p.rating}</span>` : ''}
                        </div>
                        <div class="product-meta">
                            <span class="product-price">${escape(p.price_range || '')}</span>
                            <a href="${escape(p.affiliate?.url || '')}" class="product-cta" target="_blank" rel="noopener noreferrer">Shop on Amazon</a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
        
        // Track clicks
        grid.querySelectorAll('.product').forEach(product => {
            product.addEventListener('click', (e) => {
                if (!e.target.closest('.product-cta')) {
                    const url = product.dataset.url;
                    if (url) window.open(url, '_blank', 'noopener,noreferrer');
                }
            });
        });
    }

    function renderStories(stories) {
        const list = document.getElementById('stories-list');
        if (!list) return;
        
        list.innerHTML = stories.map(s => `
            <article class="story">
                <h3>${escape(s.title)}</h3>
                <p>${escape(s.hook || '')}</p>
            </article>
        `).join('');
    }

    async function loadWorld() {
        try {
            const res = await fetch('data/world-state.json');
            if (!res.ok) throw new Error('fetch failed');
            const world = await res.json();
            
            document.title = `${world.world.name} — The Signal`;
            document.querySelector('.hero-title').innerHTML = world.world.name.replace(' ', '<br>');
            document.querySelector('.hero-subtitle').textContent = world.world.tagline || '';
            document.querySelector('.metric-value').textContent = world.world.trend_score || '—';
            
            if (world.products) renderProducts(world.products);
            if (world.stories) renderStories(world.stories);
        } catch (e) {
            console.error('Failed to load world state:', e);
        }
    }

    // Email capture
    const emailBtn = document.querySelector('.email-btn');
    const emailInput = document.querySelector('.email-input');
    if (emailBtn && emailInput) {
        emailBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (email && email.includes('@')) {
                try { localStorage.setItem('renionlab_email', email); } catch(e) {}
                alert('Subscribed! You\'ll get trend alerts first.');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email');
            }
        });
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') emailBtn.click();
        });
    }

    // Init
    loadWorld();
})();
