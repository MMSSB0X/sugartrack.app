// /*
//  * --- SugarTrack Theme Only JavaScript ---
//  */

// // 1. THEME LOGIC
// // ---------------------------------
// function applyTheme(theme) {
//     const body = document.body;
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
//     let actualTheme = theme;
    
//     if (theme === 'system') {
//         actualTheme = prefersDark.matches ? 'dark' : 'light';
//     }
    
//     body.dataset.theme = actualTheme;
//     localStorage.setItem('theme', theme); // Save the user's choice (light/dark/system)
//     updateThemeButtons(theme); // Update theme buttons if they exist
// }

// function updateThemeButtons(selectedTheme) {
//     const buttons = document.querySelectorAll('.theme-btn');
//     if (buttons.length) {
//         buttons.forEach(btn => {
//             if (btn.dataset.theme === selectedTheme) {
//                 btn.classList.add('active');
//             } else {
//                 btn.classList.remove('active');
//             }
//         });
//     }
// }

// function setInitialTheme() {
//     // Set system as default if no theme is saved
//     const savedTheme = localStorage.getItem('theme') || 'system';
//     applyTheme(savedTheme);
    
//     // Listen for system theme changes
//     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
//         if (localStorage.getItem('theme') === 'system') {
//             applyTheme('system');
//         }
//     });
// }

// // 2. SETTINGS PAGE INITIALIZATION
// // ---------------------------------
// function initSettingsPage() {
//     // Back button
//     const backBtn = document.getElementById('settings-back-btn');
//     if (backBtn) {
//         backBtn.addEventListener('click', () => {
//             window.location.href = 'dashboard.html';
//         });
//     }

//     // Theme Button Listeners
//     document.querySelectorAll('.theme-btn').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             e.preventDefault();
//             const selectedTheme = e.currentTarget.dataset.theme;
//             applyTheme(selectedTheme);
//         });
//     });
    
//     // Set initial active button based on current theme
//     const currentTheme = localStorage.getItem('theme') || 'system';
//     updateThemeButtons(currentTheme);
// }

// // 3. APP INITIALIZATION
// // ---------------------------------
// document.addEventListener('DOMContentLoaded', () => {
//     setInitialTheme();
    
//     // Initialize settings page if we're on it
//     if (document.getElementById('page-settings-marker')) {
//         initSettingsPage();
//     }
// });




/*
 * --- SugarTrack Theme System ---
 * Zero-flash version
 */

// Apply theme immediately (this runs as soon as the script loads)
(function() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    const htmlEl = document.documentElement;
    
    let actualTheme = savedTheme;
    if (savedTheme === 'system') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    htmlEl.dataset.theme = actualTheme;
    htmlEl.classList.add('theme-loaded');
})();

// Theme switching functionality
function applyTheme(theme) {
    const htmlEl = document.documentElement;
    
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlEl.dataset.theme = prefersDark ? 'dark' : 'light';
    } else {
        htmlEl.dataset.theme = theme;
    }
    
    localStorage.setItem('theme', theme);
    updateThemeButtons(theme);
}

// Update theme buttons active state
function updateThemeButtons(selectedTheme) {
    const buttons = document.querySelectorAll('.theme-btn');
    if (buttons.length) {
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === selectedTheme);
        });
    }
}

// Set up theme switching after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // Theme button listeners
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedTheme = e.currentTarget.dataset.theme;
            applyTheme(selectedTheme);
        });
    });
    
    // Set initial active button state
    updateThemeButtons(savedTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'system') {
            applyTheme('system');
        }
    });
});