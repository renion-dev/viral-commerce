/* === THE SIGNAL — Minimal JS === */

(function() {
    'use strict';

    // Track product clicks
    document.querySelectorAll('.product').forEach(product => {
        product.addEventListener('click', (e) => {
            if (!e.target.closest('.product-cta')) {
                const url = product.dataset.url;
                if (url) window.open(url, '_blank', 'nofollow');
            }
        });
    });

    // Track affiliate link clicks
    document.querySelectorAll('.product-cta').forEach(cta => {
        cta.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
})();
