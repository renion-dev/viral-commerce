/* === THE SIGNAL by RenionLab — Minimal JS === */

(function() {
    'use strict';

    const STATE_KEY = 'renionlab_signal';

    function loadState() {
        try {
            const s = JSON.parse(localStorage.getItem(STATE_KEY));
            if (s) return { ...getDefaultState(), ...s };
        } catch (e) {}
        return getDefaultState();
    }

    function getDefaultState() {
        return { total: 0, unique: 0, streak: 0, bestStreak: 0, lastVisit: null, shared: 0, collected: [], achievements: [] };
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

    function init() {
        updateStreak();
        state.total++;
        checkAchievements();

        // Email capture
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

        // Track affiliate clicks
        document.querySelectorAll('.product-cta').forEach(cta => {
            cta.addEventListener('click', () => {
                state.shared++;
                saveState();
                checkAchievements();
            });
        });
    }

    init();
})();
