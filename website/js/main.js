/* === THE SIGNAL — Minimal JS === */

(function() {
    'use strict';

    // Email capture
    const emailBtn = document.querySelector('.email-btn');
    const emailInput = document.querySelector('.email-input');
    if (emailBtn && emailInput) {
        emailBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (email && email.includes('@')) {
                try {
                    localStorage.setItem('renionlab_email', email);
                } catch(e) {}
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

    // Track product card clicks
    document.querySelectorAll('.product').forEach(product => {
        product.addEventListener('click', (e) => {
            if (!e.target.closest('.product-cta')) {
                const cta = product.querySelector('.product-cta');
                if (cta) cta.click();
            }
        });
    });
})();
