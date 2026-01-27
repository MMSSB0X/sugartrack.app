// // // auth-guard.js - Protects pages from unauthorized access
// // document.addEventListener('DOMContentLoaded', function() {
// //     // Pages that don't require authentication (whitelist)
// //     const publicPages = [
// //         'login.html',
// //         'signup.html',
// //         'forgot-password.html',
// //         'index.html'
// //     ];
    
// //     // Get current page filename
// //     const currentPage = window.location.pathname.split('/').pop();
    
// //     // Check if current page is public
// //     const isPublicPage = publicPages.includes(currentPage);
    
// //     // Listen for auth state changes
// //     auth.onAuthStateChanged((user) => {
// //         if (!user && !isPublicPage) {
// //             // Not logged in and trying to access protected page
// //             console.log('Not authenticated, redirecting to login...');
// //             window.location.href = 'login.html';
// //             return;
// //         }
        
// //         if (user && isPublicPage) {
// //             // Already logged in and trying to access login/signup pages
// //             console.log('Already authenticated, redirecting to dashboard...');
// //             window.location.href = 'dashboard.html';
// //             return;
// //         }
// //     });
// // });




// // auth-guard.js - Enhanced page protection
// document.addEventListener('DOMContentLoaded', function() {
//     // Pages that don't require authentication
//     const publicPages = [
//         'login.html',
//         'signup.html', 
//         'forgot-password.html',
//         'index.html',
//         '' // root page
//     ];
    
//     // Get current page
//     const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
//     // Check if public page
//     const isPublicPage = publicPages.includes(currentPage);
    
//     // Check authentication with timeout
//     const authCheck = auth.onAuthStateChanged((user) => {
//         if (!user && !isPublicPage) {
//             console.log('🔒 Access denied - Redirecting to login');
//             // Store the attempted URL for redirect after login
//             sessionStorage.setItem('redirectUrl', window.location.href);
//             window.location.href = 'login.html';
//             return;
//         }
        
//         if (user && isPublicPage && currentPage !== 'index.html') {
//             console.log('✅ Already logged in - Redirecting to dashboard');
//             window.location.href = 'dashboard.html';
//             return;
//         }
//     });
    
//     // Set timeout for auth check (5 seconds)
//     setTimeout(() => {
//         authCheck(); // Ensure check happens
//     }, 5000);
// });








// auth-guard.js - Protects pages from unauthorized access
document.addEventListener('DOMContentLoaded', function() {
    // Pages that don't require authentication (whitelist)
    const publicPages = [
        'login.html',
        'signup.html',
        'forgot-password.html',
        'index.html'
    ];
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // Check if current page is public
    const isPublicPage = publicPages.includes(currentPage);
    
    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        if (!user && !isPublicPage) {
            // Not logged in and trying to access protected page
            console.log('Not authenticated, redirecting to login...');
            window.location.href = 'login.html';
            return;
        }
    });
});