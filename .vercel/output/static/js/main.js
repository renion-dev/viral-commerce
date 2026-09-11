// === THE SIGNAL — Three.js Living World ===

(function() {
    'use strict';

    // === Configuration ===
    const CONFIG = {
        camera: { fov: 60, near: 0.1, far: 1000, position: [0, 0, 8] },
        colors: {
            primary: 0x0a0e27,
            secondary: 0x1a1f4e,
            accent: 0x00d4ff,
            purple: 0x7b2ff7,
            white: 0xffffff
        },
        animation: {
            rotationSpeed: 0.002,
            floatAmplitude: 0.3,
            floatSpeed: 1.5
        }
    };

    // === State ===
    let scene, camera, renderer, worldState;
    let interactiveObjects = [];
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    let hoveredObject = null;
    let isLoaded = false;

    // === DOM Elements ===
    const canvas = document.getElementById('scene');
    const loader = document.getElementById('loader');
    const ui = document.getElementById('ui');
    const productsContainer = document.getElementById('products');
    const storiesContainer = document.getElementById('stories');
    const worldName = document.getElementById('world-name');
    const worldTagline = document.getElementById('world-tagline');
    const trendScore = document.querySelector('.score-value');

    // === Initialization ===
    async function init() {
        try {
            // Load world state
            worldState = await loadWorldState();

            // Setup Three.js
            setupScene();
            setupLights();
            createWorld();
            setupInteraction();

            // Update UI
            updateUI();

            // Hide loader, show UI
            setTimeout(() => {
                loader.classList.add('fade-out');
                ui.classList.remove('hidden');
                isLoaded = true;
            }, 1500);

            // Start animation loop
            animate();

        } catch (error) {
            console.error('Failed to initialize:', error);
            loader.innerHTML = '<p class="loader-text">Failed to load world</p>';
        }
    }

    // === Load World State ===
    async function loadWorldState() {
        try {
            const response = await fetch('data/world-state.json');
            if (!response.ok) throw new Error('Failed to fetch world state');
            return await response.json();
        } catch (error) {
            console.warn('Using default world state');
            return getDefaultWorldState();
        }
    }

    function getDefaultWorldState() {
        return {
            world: {
                name: 'The Signal',
                tagline: 'Discover what is emerging',
                trend_score: 85,
                theme: { accent: '#00d4ff', purple: '#7b2ff7' }
            },
            products: [],
            stories: []
        };
    }

    // === Scene Setup ===
    function setupScene() {
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(CONFIG.colors.primary, 5, 25);

        camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            window.innerWidth / window.innerHeight,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        camera.position.set(...CONFIG.camera.position);

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(CONFIG.colors.primary);

        window.addEventListener('resize', onWindowResize);
    }

    // === Lighting ===
    function setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(CONFIG.colors.accent, 1, 50);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(CONFIG.colors.purple, 0.8, 50);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);
    }

    // === Create World ===
    function createWorld() {
        // Central world object - glowing icosahedron
        const centralGeometry = new THREE.IcosahedronGeometry(1.5, 1);
        const centralMaterial = new THREE.MeshPhongMaterial({
            color: CONFIG.colors.accent,
            emissive: CONFIG.colors.accent,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9,
            flatShading: true
        });
        const centralObject = new THREE.Mesh(centralGeometry, centralMaterial);
        centralObject.userData = { type: 'central', name: worldState.world.name };
        scene.add(centralObject);
        interactiveObjects.push(centralObject);

        // Orbiting product objects
        if (worldState.products) {
            worldState.products.forEach((product, index) => {
                const angle = (index / worldState.products.length) * Math.PI * 2;
                const radius = 3.5;

                const orbitGroup = new THREE.Group();
                orbitGroup.position.set(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius * 0.5,
                    Math.sin(angle) * radius * 0.3
                );

                // Product geometry based on visual type
                const geometry = getProductGeometry(product.visual);
                const material = new THREE.MeshPhongMaterial({
                    color: getProductColor(index),
                    emissive: getProductColor(index),
                    emissiveIntensity: 0.2,
                    transparent: true,
                    opacity: 0.85,
                    flatShading: true
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.userData = {
                    type: 'product',
                    product: product,
                    originalScale: mesh.scale.clone(),
                    orbitRadius: radius,
                    orbitAngle: angle,
                    orbitSpeed: 0.001 + Math.random() * 0.001
                };

                orbitGroup.add(mesh);
                scene.add(orbitGroup);
                interactiveObjects.push(mesh);
            });
        }

        // Particle field background
        createParticles();

        // Grid floor
        const gridHelper = new THREE.GridHelper(30, 30, CONFIG.colors.accent, CONFIG.colors.secondary);
        gridHelper.position.y = -4;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.15;
        scene.add(gridHelper);
    }

    function getProductGeometry(visualType) {
        switch (visualType) {
            case 'geometric-strip':
                return new THREE.TetrahedronGeometry(0.5);
            case 'glow-wand':
                return new THREE.OctahedronGeometry(0.5);
            case 'orb-mask':
                return new THREE.DodecahedronGeometry(0.5);
            default:
                return new THREE.BoxGeometry(0.6, 0.6, 0.6);
        }
    }

    function getProductColor(index) {
        const colors = [CONFIG.colors.accent, CONFIG.colors.purple, 0xff6b6b, 0x4ecdc4, 0xffe66d];
        return colors[index % colors.length];
    }

    function createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 40;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: CONFIG.colors.accent,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
    }

    // === Interaction ===
    function setupInteraction() {
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('click', onClick);
        window.addEventListener('resize', onWindowResize);
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (hoveredObject !== object) {
                if (hoveredObject) {
                    hoveredObject.material.emissiveIntensity = 0.2;
                    document.body.style.cursor = 'default';
                }
                hoveredObject = object;
                object.material.emissiveIntensity = 0.6;
                document.body.style.cursor = 'pointer';
            }
        } else {
            if (hoveredObject) {
                hoveredObject.material.emissiveIntensity = 0.2;
                hoveredObject = null;
                document.body.style.cursor = 'default';
            }
        }
    }

    function onClick(event) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.type === 'product') {
                selectProduct(object.userData.product);
            }
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // === UI Updates ===
    function updateUI() {
        if (worldState.world) {
            worldName.textContent = worldState.world.name || 'The Signal';
            worldTagline.textContent = worldState.world.tagline || 'Discover what is emerging';
            trendScore.textContent = worldState.world.trend_score || '—';
        }

        // Render product cards
        if (worldState.products && productsContainer) {
            productsContainer.innerHTML = worldState.products.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-name">${product.name}</div>
                    <div class="product-desc">${product.description}</div>
                    <div class="product-meta">
                        <span class="product-price">${product.price_range}</span>
                        <span class="product-cta">Explore →</span>
                    </div>
                </div>
            `).join('');
        }

        // Render stories
        if (worldState.stories && storiesContainer) {
            storiesContainer.innerHTML = worldState.stories.map(story => `
                <div class="story-item" data-story-id="${story.id}">
                    <div class="story-title">${story.title}</div>
                    <div class="story-hook">${story.hook}</div>
                </div>
            `).join('');
        }
    }

    function selectProduct(product) {
        // Animate selection - pulse effect
        console.log('Selected product:', product.name);

        // Show affiliate link simulation
        if (product.affiliate) {
            const searchQuery = encodeURIComponent(product.affiliate.search);
            const url = `https://www.amazon.com/s?k=${searchQuery}`;
            // In production, would use actual affiliate link
            window.open(url, '_blank');
        }
    }

    // === Animation Loop ===
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Animate interactive objects
        interactiveObjects.forEach((object, index) => {
            // Base rotation
            object.rotation.x += CONFIG.animation.rotationSpeed;
            object.rotation.y += CONFIG.animation.rotationSpeed * 1.5;

            // Float animation
            if (object.userData.type === 'product') {
                object.position.y = Math.sin(time * CONFIG.animation.floatSpeed + index) * CONFIG.animation.floatAmplitude * 0.3;
            }

            // Central object pulse
            if (object.userData.type === 'central') {
                const scale = 1 + Math.sin(time * 2) * 0.05;
                object.scale.set(scale, scale, scale);
            }
        });

        // Camera subtle movement
        camera.position.x = Math.sin(time * 0.2) * 0.5;
        camera.position.y = Math.cos(time * 0.3) * 0.3;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    // === Start ===
    init();

})();
