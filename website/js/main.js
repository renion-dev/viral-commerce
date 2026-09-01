/* === RENIONLAB — True WOW Engine === */

(function() {
    'use strict';

    const CONFIG = { maxProducts: 12, particleCount: 200 };
    const STATE_KEY = 'renionlab_signal_v1';

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

    let cinemaCtx, cinemaCanvas, particles = [], worldState;

    function initCinema() {
        cinemaCanvas = document.getElementById('cinema');
        cinemaCtx = cinemaCanvas.getContext('2d');
        resizeCinema();
        addEventListener('resize', resizeCinema);
        createParticles();
        animateCinema();
    }

    function resizeCinema() { cinemaCanvas.width = innerWidth; cinemaCanvas.height = innerHeight; }

    function createParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push({
                x: Math.random() * innerWidth, y: Math.random() * innerHeight,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: -Math.random() * 0.6 - 0.2,
                opacity: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.6 ? '#ff6b35' : (Math.random() > 0.5 ? '#00d4ff' : '#7b2ff7')
            });
        }
    }

    function animateCinema() {
        cinemaCtx.clearRect(0, 0, cinemaCanvas.width, cinemaCanvas.height);

        const grad = cinemaCtx.createRadialGradient(
            cinemaCanvas.width / 2, cinemaCanvas.height / 2, 0,
            cinemaCanvas.width / 2, cinemaCanvas.height / 2, cinemaCanvas.width * 0.5
        );
        grad.addColorStop(0, 'rgba(255,107,53,0.05)');
        grad.addColorStop(0.4, 'rgba(123,47,247,0.03)');
        grad.addColorStop(1, 'transparent');
        cinemaCtx.fillStyle = grad;
        cinemaCtx.fillRect(0, 0, cinemaCanvas.width, cinemaCanvas.height);

        particles.forEach(p => {
            p.x += p.speedX; p.y += p.speedY;
            if (p.y < -10) { p.y = cinemaCanvas.height + 10; p.x = Math.random() * cinemaCanvas.width; }
            if (p.x < -10) p.x = cinemaCanvas.width + 10;
            if (p.x > cinemaCanvas.width + 10) p.x = -10;

            cinemaCtx.globalAlpha = p.opacity;
            cinemaCtx.fillStyle = p.color;
            cinemaCtx.beginPath();
            cinemaCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            cinemaCtx.fill();

            cinemaCtx.globalAlpha = p.opacity * 0.15;
            cinemaCtx.beginPath();
            cinemaCtx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            cinemaCtx.fill();
        });

        cinemaCtx.globalAlpha = 0.015;
        cinemaCtx.fillStyle = '#000';
        for (let y = 0; y < cinemaCanvas.height; y += 3) cinemaCtx.fillRect(0, y, cinemaCanvas.width, 1);

        cinemaCtx.globalAlpha = 1;
        const vignette = cinemaCtx.createRadialGradient(
            cinemaCanvas.width / 2, cinemaCanvas.height / 2, cinemaCanvas.width * 0.25,
            cinemaCanvas.width / 2, cinemaCanvas.height / 2, cinemaCanvas.width * 0.75
        );
        vignette.addColorStop(0, 'transparent');
        vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
        cinemaCtx.fillStyle = vignette;
        cinemaCtx.fillRect(0, 0, cinemaCanvas.width, cinemaCanvas.height);

        requestAnimationFrame(animateCinema);
    }

    // Three.js with WOW effects
    let scene, camera, renderer, productMeshes = [], centralObject, signalRings;
    let orbitParticles = [], energyBeams = [], shockwaves = [];
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();

    function initThree() {
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x060814, 0.012);

        camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setClearColor(0x060814, 0);

        const container = document.createElement('div');
        container.id = 'three-container';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;';
        container.appendChild(renderer.domElement);
        document.getElementById('app').insertBefore(container, document.getElementById('ui'));

        // Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.25));
        const l1 = new THREE.PointLight(0xff6b35, 3, 60);
        l1.position.set(5, 5, 8);
        scene.add(l1);
        const l2 = new THREE.PointLight(0x00d4ff, 2, 60);
        l2.position.set(-5, -3, 6);
        scene.add(l2);
        const l3 = new THREE.DirectionalLight(0xffffff, 0.2);
        l3.position.set(0, 1, 1);
        scene.add(l3);

        // Central object with pulsing glow
        const coreGeo = new THREE.IcosahedronGeometry(1.5, 2);
        const coreMat = new THREE.MeshPhongMaterial({
            color: 0xff6b35, emissive: 0xff6b35,
            emissiveIntensity: 0.6, transparent: true, opacity: 0.9, flatShading: true
        });
        centralObject = new THREE.Mesh(coreGeo, coreMat);
        centralObject.userData = { type: 'central' };
        scene.add(centralObject);

        // Multiple glow layers for central object
        for (let i = 0; i < 3; i++) {
            const glowGeo = new THREE.SphereGeometry(2.0 + i * 0.5, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0xff6b35,
                transparent: true,
                opacity: 0.12 - i * 0.03,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            });
            const glowMesh = new THREE.Mesh(glowGeo, glowMat);
            glowMesh.userData = { glowIdx: i };
            scene.add(glowMesh);
        }

        // Orbiting particles around center
        for (let i = 0; i < 50; i++) {
            const pGeo = new THREE.SphereGeometry(0.03, 4, 4);
            const pMat = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0xff6b35 : 0x00d4ff,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            const pMesh = new THREE.Mesh(pGeo, pMat);
            const angle = Math.random() * Math.PI * 2;
            const radius = 2.5 + Math.random() * 2;
            const speed = 0.005 + Math.random() * 0.01;
            pMesh.userData = { angle, radius, speed, yOffset: (Math.random() - 0.5) * 2 };
            scene.add(pMesh);
            orbitParticles.push(pMesh);
        }

        // Signal rings
        signalRings = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const ringGeo = new THREE.TorusGeometry(2.2 + i * 0.7, 0.015, 8, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: i === 0 ? 0xff6b35 : 0x00d4ff,
                transparent: true, opacity: 0.3 - i * 0.08
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2 + i * 0.4;
            ring.rotation.y = i * 0.6;
            signalRings.add(ring);
        }
        scene.add(signalRings);

        // Products with glow and energy beams
        const products = (worldState.products || []).slice(0, CONFIG.maxProducts);
        const count = products.length;
        const radius = Math.max(3.5, count * 0.7);

        products.forEach((p, i) => {
            const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
            const yOff = Math.sin(angle * 1.5) * 0.6;
            const group = new THREE.Group();
            group.position.set(Math.cos(angle) * radius, yOff, Math.sin(angle) * radius * 0.25);

            const geo = getGeometry(p.visual);
            const col = parseInt((p.color || '#ff6b35').replace('#', '0x'));
            const mat = new THREE.MeshPhongMaterial({
                color: col, emissive: col,
                emissiveIntensity: 0.35, transparent: true, opacity: 0.9, flatShading: true
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.userData = { type: 'product', product: p, idx: i, baseY: yOff };
            group.add(mesh);

            // Glow for each product
            const pGlowGeo = new THREE.SphereGeometry(0.5, 16, 16);
            const pGlowMat = new THREE.MeshBasicMaterial({
                color: col,
                transparent: true,
                opacity: 0.12,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            });
            const pGlow = new THREE.Mesh(pGlowGeo, pGlowMat);
            group.add(pGlow);

            scene.add(group);
            productMeshes.push(mesh);

            // Energy beam from center to product
            const beamGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(-Math.cos(angle) * radius * 0.8, -yOff * 0.5, 0)
            ]);
            const beamMat = new THREE.LineBasicMaterial({
                color: col,
                transparent: true,
                opacity: 0.08,
                blending: THREE.AdditiveBlending
            });
            const beam = new THREE.Line(beamGeo, beamMat);
            group.add(beam);
        });

        // Grid
        const grid = new THREE.GridHelper(35, 35, 0x12162e, 0x0d1020);
        grid.position.y = -6;
        grid.material.transparent = true;
        grid.material.opacity = 0.12;
        scene.add(grid);

        // Interaction
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('click', onClick);
        renderer.domElement.addEventListener('wheel', onWheel);

        addEventListener('resize', onResize);
        animateThree();
    }

    function getGeometry(type) {
        switch (type) {
            case 'tetra': return new THREE.TetrahedronGeometry(0.42);
            case 'octa': return new THREE.OctahedronGeometry(0.42);
            case 'dodeca': return new THREE.DodecahedronGeometry(0.42);
            case 'cylinder': return new THREE.CylinderGeometry(0.28, 0.28, 0.55, 8);
            case 'torus': return new THREE.TorusGeometry(0.35, 0.12, 8, 16);
            case 'sphere': return new THREE.SphereGeometry(0.42, 8, 6);
            case 'cone': return new THREE.ConeGeometry(0.38, 0.5, 6);
            case 'strip': return new THREE.BoxGeometry(0.6, 0.18, 0.08);
            default: return new THREE.BoxGeometry(0.45, 0.45, 0.45);
        }
    }

    function onMouseMove(e) {
        mouse.x = (e.clientX / innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(productMeshes);
        const cvs = renderer.domElement;

        if (hits.length > 0) {
            const o = hits[0].object;
            o.material.emissiveIntensity = 1.0;
            o.scale.set(1.2, 1.2, 1.2);
            cvs.style.cursor = 'pointer';
        }
        productMeshes.forEach(m => {
            if (!hits.length || hits[0].object !== m) {
                m.material.emissiveIntensity = 0.35;
                m.scale.set(1, 1, 1);
            }
        });
        if (!hits.length) cvs.style.cursor = 'default';
    }

    function onClick(e) {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(productMeshes);
        if (hits.length > 0 && hits[0].object.userData.type === 'product') {
            const p = hits[0].object.userData.product;
            openAffiliate(p);
            createShockwave(hits[0].object.position.clone());
        }
    }

    function createShockwave(position) {
        const geo = new THREE.RingGeometry(0.1, 0.3, 32);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.position.copy(position);
        ring.lookAt(camera.position);
        scene.add(ring);
        shockwaves.push({ mesh: ring, scale: 1, opacity: 0.8 });
    }

    function onWheel(e) {
        camera.position.z = Math.max(6, Math.min(22, camera.position.z + e.deltaY * 0.01));
    }

    function onResize() {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    }

    function animateThree() {
        requestAnimationFrame(animateThree);
        const t = Date.now() * 0.001;

        // Central object pulse
        if (centralObject) {
            centralObject.rotation.y += 0.004;
            centralObject.rotation.x += 0.002;
            const pulse = 1 + Math.sin(t * 2.5) * 0.06;
            centralObject.scale.set(pulse, pulse, pulse);
        }

        // Glow layers pulse
        scene.children.forEach(child => {
            if (child.userData && child.userData.glowIdx !== undefined) {
                const baseScale = 1 + child.userData.glowIdx * 0.25;
                const pulse = baseScale + Math.sin(t * 3 + child.userData.glowIdx) * 0.1;
                child.scale.set(pulse, pulse, pulse);
            }
        });

        // Orbiting particles
        orbitParticles.forEach(p => {
            p.userData.angle += p.userData.speed;
            p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
            p.position.z = Math.sin(p.userData.angle) * p.userData.radius;
            p.position.y = p.userData.yOffset + Math.sin(t * 2 + p.userData.angle) * 0.3;
        });

        // Signal rings
        if (signalRings) {
            signalRings.rotation.y += 0.003;
            signalRings.rotation.z += 0.001;
        }

        // Products
        productMeshes.forEach((m, i) => {
            m.rotation.x += 0.005;
            m.rotation.y += 0.006;
            if (m.userData.baseY !== undefined) {
                m.position.y = m.userData.baseY + Math.sin(t * 1.5 + i * 1.2) * 0.25;
            }
        });

        // Shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.scale += 0.15;
            sw.opacity -= 0.02;
            sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
            sw.mesh.material.opacity = sw.opacity;
            if (sw.opacity <= 0) {
                scene.remove(sw.mesh);
                shockwaves.splice(i, 1);
            }
        }

        // Cinematic camera
        camera.position.x = Math.sin(t * 0.08) * 0.4;
        camera.position.y = Math.cos(t * 0.12) * 0.25;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    function openAffiliate(product) {
        if (product.affiliate && product.affiliate.search) {
            window.open(`https://www.amazon.com/s?k=${encodeURIComponent(product.affiliate.search)}`, '_blank');
        }
    }

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
            </section>

            <aside id="products">
                <h3 class="section-label">TRENDING PRODUCTS</h3>
                <div id="products-list">
                    ${products.slice(0, CONFIG.maxProducts).map((p) => `
                        <div class="product-card" data-id="${escape(p.id)}" style="--card-accent:${p.color||'#ff6b35'}">
                            <div class="product-name">${escape(p.name)}</div>
                            <div class="product-desc">${escape(p.description||'')}</div>
                            <div class="product-meta">
                                <span class="product-price">${escape(p.price_range||'')}</span>
                                <span class="product-cta">Shop →</span>
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
                <div id="share-preview"></div>
                <button id="share-btn">Download Card</button>
                <p class="share-hint">Share → drive traffic → earn affiliate</p>
            </div>
        `;

        ui.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                switchView(link.dataset.view);
            });
        });

        ui.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const p = products.find(x => x.id === card.dataset.id);
                if (p) { viewProduct(p); openAffiliate(p); }
            });
        });

        ui.querySelectorAll('.story-item').forEach(item => {
            item.addEventListener('click', () => {
                const s = stories.find(x => x.id === item.dataset.id);
                if (s) {
                    document.querySelector('.hero-title').textContent = s.title;
                    document.querySelector('.hero-tagline').textContent = s.hook;
                    document.getElementById('products').style.display = 'none';
                    setTimeout(() => {
                        document.getElementById('products').style.display = '';
                        document.querySelector('.hero-title').textContent = w.name || '';
                        document.querySelector('.hero-tagline').textContent = w.tagline || '';
                    }, 4000);
                }
            });
        });

        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) shareBtn.addEventListener('click', () => { if (products.length > 0) generateShareCard(products[0]); });

        const achievementsBtn = document.getElementById('achievements-btn');
        if (achievementsBtn) achievementsBtn.addEventListener('click', showAchievements);
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
        grad.addColorStop(0, '#060814');
        grad.addColorStop(1, '#0c1020');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 630);

        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(0, 0, 1200, 3);

        ctx.fillStyle = '#ff6b35';
        ctx.font = '500 22px Inter, system-ui';
        ctx.fillText('◈ RENIONLAB', 60, 80);

        ctx.fillStyle = '#f7f8f8';
        ctx.font = '510 44px Inter, system-ui';
        ctx.fillText(product.name, 60, 280);

        ctx.fillStyle = '#8a8f98';
        ctx.font = '400 20px Inter, system-ui';
        const desc = (product.description || '').length > 80 ? (product.description || '').slice(0, 80) + '...' : (product.description || '');
        ctx.fillText(desc, 60, 340);

        ctx.fillStyle = '#ff6b35';
        ctx.font = '590 28px JetBrains Mono, monospace';
        ctx.fillText(product.price_range || '', 60, 450);

        ctx.fillStyle = '#00d4ff';
        ctx.font = '510 16px Inter, system-ui';
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

    async function loadWorld() {
        try {
            const res = await fetch('data/world-state.json?v=' + Date.now());
            if (!res.ok) throw new Error('fetch failed');
            return await res.json();
        } catch (e) {
            return { world: { name: 'The Signal', tagline: 'Loading...', trend_score: 0 }, products: [], stories: [] };
        }
    }

    async function init() {
        worldState = await loadWorld();
        renderUI();
        initCinema();
        initThree();

        if (!state.lastVisit) showToast('👁️', 'Welcome', 'You entered The Signal');

        updateStreak();
        saveState();
        checkAchievements();
    }

    init();
})();
