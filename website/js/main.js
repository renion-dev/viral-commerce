/* === THE SIGNAL by RenionLab — Production Engine === */

(function() {
    'use strict';

    const CONFIG = { maxProducts: 12 };
    const STATE_KEY = 'renionlab_signal_prod';

    // ═══════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════
    
    function loadState() {
        try {
            const s = JSON.parse(localStorage.getItem(STATE_KEY));
            if (s) return { ...getDefaultState(), ...s };
        } catch (e) {}
        return getDefaultState();
    }

    function getDefaultState() {
        return { total: 0, unique: 0, streak: 0, bestStreak: 0, lastVisit: null, shared: 0, collected: [], achievements: [], history: [] };
    }

    function saveState() { try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) {} }

    let state = loadState();

    const ACHIEVEMENTS = [
        { id: 'first_look', name: 'First Look', desc: 'Entered The Signal', icon: '👁️', check: s => s.total >= 1 },
        { id: 'collector', name: 'Collector', desc: 'Viewed 5 products', icon: '📦', check: s => s.unique >= 5 },
        { id: 'obsessed', name: 'Obsessed', desc: '10 total views', icon: '🔥', check: s => s.total >= 10 },
        { id: 'streak_3', name: 'Dedicated', desc: '3-day streak', icon: '⚡', check: s => s.streak >= 3 },
        { id: 'streak_7', name: 'Addicted', desc: '7-day streak', icon: '💀', check: s => s.streak >= 7 },
        { id: 'sharer', name: 'Viral', desc: 'Shared once', icon: '📢', check: s => s.shared >= 1 },
        { id: 'explorer', name: 'Explorer', desc: 'Viewed 10 products', icon: '🚀', check: s => s.unique >= 10 },
        { id: 'completionist', name: 'Completionist', desc: 'All achievements', icon: '👑', check: s => s.achievements.length >= 7 }
    ];

    function checkAchievements() {
        ACHIEVEMENTS.forEach(a => {
            if (!state.achievements.includes(a.id) && a.check(state)) {
                state.achievements.push(a.id);
                showToast(a.icon, a.name, a.desc);
            }
        });
        saveState();
    }

    function showToast(icon, title, desc) {
        const toast = document.getElementById('toast');
        toast.innerHTML = `<span class="toast-icon">${icon}</span><div><div class="toast-title">${title}</div><div class="toast-desc">${desc}</div></div>`;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function updateStreak() {
        const today = new Date().toDateString();
        if (state.lastVisit !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            state.streak = state.lastVisit === yesterday ? state.streak + 1 : 1;
            state.bestStreak = Math.max(state.bestStreak, state.streak);
            state.lastVisit = today;
            saveState();
        }
    }

    // ═══════════════════════════════════════════
    // REAL IMAGES (Picsum — free, no API key)
    // ═══════════════════════════════════════════
    
    function getImageUrl(id, width, height) {
        // Picsum with seed = consistent image per product
        return `https://picsum.photos/seed/${id}/${width}/${height}`;
    }

    function getBadgeHTML(p, i) {
        if (i === 0) return '<span class="product-badge badge-hot">🔥 Bestseller</span>';
        if (p.social_proof && p.social_proof.includes('400%')) return '<span class="product-badge badge-trending">📈 +400%</span>';
        if (i < 3) return '<span class="product-badge badge-new">✨ Trending</span>';
        return '';
    }

    // ═══════════════════════════════════════════
    // DATA LOADING
    // ═══════════════════════════════════════════
    
    let worldState;

    async function loadWorld() {
        try {
            const res = await fetch('data/world-state.json?v=' + Date.now());
            if (!res.ok) throw new Error('fetch failed');
            return await res.json();
        } catch (e) {
            return {
                world: { name: 'The Signal', tagline: 'Discover what is emerging', trend_score: 0 },
                products: [],
                stories: []
            };
        }
    }

    // ═══════════════════════════════════════════
    // UI RENDERING
    // ═══════════════════════════════════════════
    
    function escape(s) {
        const d = document.createElement('div');
        d.textContent = s || '';
        return d.innerHTML;
    }

    function renderUI() {
        const ui = document.getElementById('ui');
        const w = worldState.world || worldState.brand || {};
        const products = worldState.products || [];
        const stories = worldState.stories || [];

        updateStreak();

        ui.innerHTML = `
            <header id="header">
                <div class="brand">
                    <span class="brand-icon">◈</span>
                    <span class="brand-name">RENIONLAB</span>
                    <span class="brand-tag">/ SIGNAL</span>
                </div>
                <nav id="nav">
                    <a href="#" class="nav-link active" data-view="world">WORLD</a>
                    <a href="#" class="nav-link" data-view="discover">DISCOVER</a>
                    <a href="#" class="nav-link" data-view="share">SHARE</a>
                </nav>
            </header>

            <div id="stats-bar">
                <div class="stat-item">
                    <span class="stat-icon">🔥</span>
                    <span class="stat-value">${state.streak}</span>
                    <span class="stat-label">STREAK</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-icon">📦</span>
                    <span class="stat-value">${state.unique}</span>
                    <span class="stat-label">UNIQUE</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-value">${state.total}</span>
                    <span class="stat-label">VIEWS</span>
                </div>
                <div class="progress-wrap">
                    <div class="progress-fill" style="width:${Math.min((state.achievements.length / ACHIEVEMENTS.length) * 100, 100)}%"></div>
                </div>
                <button id="achievements-btn" class="btn-ghost">🏆 ${state.achievements.length}/${ACHIEVEMENTS.length}</button>
            </div>

            <section id="hero">
                <div class="hero-badge"><span class="badge-dot"></span><span class="badge-text">LIVE SIGNAL</span></div>
                <h1 class="hero-title">${escape(w.name || w.world_name || 'The Signal')}</h1>
                <p class="hero-tagline">${escape(w.tagline || w.world_tagline || '')}</p>
                <div class="hero-stats">
                    <div class="stat"><span class="stat-value">${w.trend_score || '—'}</span><span class="stat-label">SIGNAL</span></div>
                    <div class="stat"><span class="stat-value">${products.length}</span><span class="stat-label">PRODUCTS</span></div>
                    <div class="stat"><span class="stat-value">${stories.length}</span><span class="stat-label">STORIES</span></div>
                </div>
                <div id="email-capture">
                    <input type="email" id="email-input" placeholder="Get trend alerts →" />
                    <button id="email-btn">Subscribe</button>
                </div>
            </section>

            <aside id="products">
                <h3 class="section-label">TRENDING PRODUCTS</h3>
                <div id="products-grid">
                    ${products.slice(0, CONFIG.maxProducts).map((p, i) => `
                        <div class="product-card" data-id="${escape(p.id)}">
                            ${getBadgeHTML(p, i)}
                            <div class="product-image">
                                <img src="${getImageUrl(p.id, 400, 300)}" alt="${escape(p.name)}" loading="lazy" />
                            </div>
                            <div class="product-info">
                                <div class="product-name">${escape(p.name)}</div>
                                <div class="product-desc">${escape(p.description||'')}</div>
                                <div class="product-proof">
                                    ${p.social_proof ? `<span class="proof-text">${escape(p.social_proof)}</span>` : ''}
                                    ${p.rating ? `<span class="proof-rating">★ ${p.rating}</span>` : ''}
                                </div>
                                <div class="product-meta">
                                    <span class="product-price">${escape(p.price_range||'')}</span>
                                    <button class="product-cta" data-id="${escape(p.id)}">Shop Now</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </aside>

            <section id="stories">
                <h3 class="section-label">SIGNAL STORIES</h3>
                <div id="stories-list">
                    ${stories.map(s => `
                        <div class="story-item" data-id="${escape(s.id)}">
                            <div class="story-title">${escape(s.title)}</div>
                            <div class="story-hook">${escape(s.hook||'')}</div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <div id="share-panel">
                <h3 class="section-label">SHARE CARD</h3>
                <div id="share-preview">
                    <div class="share-placeholder">Loading...</div>
                </div>
                <button id="share-btn">Download Card</button>
                <p class="share-hint">Share → drive traffic → earn affiliate</p>
            </div>
        `;

        attachEvents();
        
        if (products.length > 0) {
            setTimeout(() => generateShareCard(products[0]), 100);
        }
    }

    // ═══════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════
    
    function attachEvents() {
        const ui = document.getElementById('ui');

        ui.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                switchView(link.dataset.view);
            });
        });

        const products = worldState.products || [];
        
        ui.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const p = products.find(x => x.id === card.dataset.id);
                if (p) { viewProduct(p); openAffiliate(p); }
            });
        });

        ui.querySelectorAll('.product-cta').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const p = products.find(x => x.id === btn.dataset.id);
                if (p) { viewProduct(p); openAffiliate(p); }
            });
        });

        const stories = worldState.stories || [];
        const w = worldState.world || worldState.brand || {};
        ui.querySelectorAll('.story-item').forEach(item => {
            item.addEventListener('click', () => {
                const s = stories.find(x => x.id === item.dataset.id);
                if (s) {
                    document.querySelector('.hero-title').textContent = s.title;
                    document.querySelector('.hero-tagline').textContent = s.hook;
                    document.getElementById('products').style.display = 'none';
                    setTimeout(() => {
                        document.getElementById('products').style.display = '';
                        document.querySelector('.hero-title').textContent = w.name || w.world_name || '';
                        document.querySelector('.hero-tagline').textContent = w.tagline || w.world_tagline || '';
                    }, 4000);
                }
            });
        });

        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) shareBtn.addEventListener('click', () => { if (products.length > 0) generateShareCard(products[0]); });

        const achievementsBtn = document.getElementById('achievements-btn');
        if (achievementsBtn) achievementsBtn.addEventListener('click', showAchievements);

        const emailBtn = document.getElementById('email-btn');
        const emailInput = document.getElementById('email-input');
        if (emailBtn && emailInput) {
            emailBtn.addEventListener('click', () => {
                const email = emailInput.value.trim();
                if (email && email.includes('@')) {
                    state.email = email;
                    saveState();
                    showToast('📧', 'Subscribed!', 'You\'ll get trend alerts first');
                    emailInput.value = '';
                } else {
                    showToast('⚠️', 'Invalid email', 'Please enter a valid email');
                }
            });
            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') emailBtn.click();
            });
        }
    }

    function viewProduct(p) {
        state.total++;
        if (!state.collected.includes(p.id)) { state.collected.push(p.id); state.unique++; }
        state.history.push({ id: p.id, name: p.name, ts: Date.now() });
        if (state.history.length > 100) state.history.shift();
        saveState();
        checkAchievements();
    }

    function switchView(view) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const nav = document.querySelector(`[data-view="${view}"]`);
        if (nav) nav.classList.add('active');

        const productsEl = document.getElementById('products');
        const storiesEl = document.getElementById('stories');
        const heroEl = document.getElementById('hero');
        const sharePanel = document.getElementById('share-panel');

        if (!productsEl || !storiesEl || !heroEl) return;

        if (view === 'world') {
            productsEl.style.display = ''; storiesEl.style.display = ''; heroEl.style.display = '';
            if (sharePanel) sharePanel.style.display = '';
        } else if (view === 'discover') {
            productsEl.style.display = ''; storiesEl.style.display = 'none'; heroEl.style.display = 'none';
            if (sharePanel) sharePanel.style.display = 'none';
        } else if (view === 'share') {
            productsEl.style.display = 'none'; storiesEl.style.display = 'none'; heroEl.style.display = '';
            if (sharePanel) sharePanel.style.display = '';
        }
    }

    function generateShareCard(product) {
        const cvs = document.createElement('canvas');
        cvs.width = 1200; cvs.height = 630;
        const ctx = cvs.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 1200, 630);
        grad.addColorStop(0, '#080b1a');
        grad.addColorStop(1, '#0f1020');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 630);

        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(0, 0, 1200, 4);

        ctx.fillStyle = '#ff6b35';
        ctx.font = '500 24px Inter, system-ui';
        ctx.fillText('◈ RENIONLAB', 60, 80);

        ctx.fillStyle = '#f7f8f8';
        ctx.font = '510 48px Inter, system-ui';
        ctx.fillText(product.name, 60, 280);

        ctx.fillStyle = '#8a8f98';
        ctx.font = '400 22px Inter, system-ui';
        const desc = (product.description || '').length > 80 ? (product.description || '').slice(0, 80) + '...' : (product.description || '');
        ctx.fillText(desc, 60, 340);

        ctx.fillStyle = '#ff6b35';
        ctx.font = '590 32px JetBrains Mono, monospace';
        ctx.fillText(product.price_range || '', 60, 450);

        ctx.fillStyle = '#00d4ff';
        ctx.font = '510 18px Inter, system-ui';
        ctx.fillText('Discover at The Signal →', 60, 540);

        const url = cvs.toDataURL('image/png');
        const preview = document.getElementById('share-preview');
        if (preview) preview.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
        const btn = document.getElementById('share-btn');
        if (btn) {
            btn.onclick = () => {
                state.shared++; saveState(); checkAchievements();
                const a = document.createElement('a');
                a.download = `renionlab-${product.id}.png`;
                a.href = url; a.click();
            };
        }
    }

    function showAchievements() {
        const overlay = document.getElementById('modal-overlay');
        const modal = document.getElementById('modal');
        modal.innerHTML = `<h2 class="modal-title">Achievements</h2><div class="modal-grid">
            ${ACHIEVEMENTS.map(a => {
                const unlocked = state.achievements.includes(a.id);
                return `<div class="achievement ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${a.icon}</div>
                    <div class="achievement-name">${a.name}</div>
                    <div class="achievement-desc">${a.desc}</div>
                </div>`;
            }).join('')}
        </div>`;
        overlay.classList.remove('hidden');
        overlay.onclick = () => overlay.classList.add('hidden');
    }

    function openAffiliate(product) {
        if (product.affiliate && product.affiliate.search) {
            window.open(`https://www.amazon.com/s?k=${encodeURIComponent(product.affiliate.search)}`, '_blank');
        }
    }

    async function init() {
        worldState = await loadWorld();
        renderUI();

        if (!state.lastVisit) showToast('👁️', 'Welcome', 'You entered The Signal');

        updateStreak();
        saveState();
        checkAchievements();
    }

    init();
})();
