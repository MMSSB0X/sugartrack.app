document.addEventListener('DOMContentLoaded', () => {
    // 1. Trigger the "Enter" animation immediately when DOM is ready
    // We use a small timeout to ensure the browser registers the initial state
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 50);
});

// 2. The function to handle navigation
// REPLACE your window.location.href calls with this function
window.transitionToPage = function(href) {
    // Add the exit class to trigger CSS animation
    document.body.classList.remove('page-loaded');
    document.body.classList.add('page-exiting');

    // Wait for animation to finish (300ms matches CSS transition)
    setTimeout(function() {
        window.location.href = href;
    }, 250); 
};