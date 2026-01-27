// auth.js - Handles login, signup, and auth state.
// Firebase is initialized in firebase-config.js and available globally.

document.addEventListener('DOMContentLoaded', function () {
  // Login form
  const loginForm = document.getElementById('login-form'); // Changed ID to match login.html
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const errorMessage = document.getElementById('error-message');

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Redirect to new dashboard
          window.location.href = 'dashboard.html';
        })
        .catch((error) => {
          let message;
          switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              message = 'Invalid email or password.';
              break;
            case 'auth/invalid-email':
              message = 'Please enter a valid email address.';
              break;
            case 'auth/too-many-requests':
              message = 'Too many failed attempts. Please try again later.';
              break;
            default:
              message = 'An error occurred. Please try again.';
          }
          if (errorMessage) errorMessage.textContent = message;
        });
    });
  }

  // Signup form
  const signupForm = document.getElementById('signup-form'); // Changed ID to match signup.html
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorMessage = document.getElementById('error-message');

      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
        if (errorMessage) errorMessage.textContent = 'Passwords do not match.';
        return;
      }

      if (password.length < 6) {
        if (errorMessage) errorMessage.textContent = 'Password must be at least 6 characters long.';
        return;
      }

      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Add user data to Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
          firstName: firstName,
          lastName: lastName,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          profileImageUrl: 'images/user.png' // Default profile image
        });

        // Redirect to dashboard
        window.location.href = 'dashboard.html';

      } catch (error) {
        let message;
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = 'This email is already registered.';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            message = 'Password is too weak.';
            break;
          default:
            message = 'An error occurred during signup: ' + error.message;
        }
        if (errorMessage) errorMessage.textContent = message;
      }
    });
  }

  // Auth state observer
  auth.onAuthStateChanged((user) => {
    const onAuthPage = window.location.pathname.includes('login.html') ||
                       window.location.pathname.includes('signup.html');
    
    if (user) {
      // User is signed in
      if (onAuthPage) {
        // If on login/signup page, redirect to dashboard
        window.location.href = 'dashboard.html';
      }
      // If on dashboard, dashboard.js will handle loading data
    } else {
      // User is signed out
      if (!onAuthPage) {
        // If not on login/signup page, redirect to login
        window.location.href = 'login.html';
      }
    }
  });
});

// Logout function
function logoutUser() {
  auth.signOut().then(() => {
    window.location.href = 'login.html';
  }).catch((error) => {
    console.error("Logout error:", error);
  });
}