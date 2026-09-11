/* === THE SIGNAL — Minimal JS === */

(function() {
    'use strict';

    // Email capture only
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

    // Product cards: let links work naturally, no interception
})();
