// // profile.js - Handles profile management for profile.html
// document.addEventListener('DOMContentLoaded', function() {
//     // DOM Elements
//     const currentProfileImage = document.getElementById('currentProfileImage');
//     const profileEditBtn = document.getElementById('profile-edit-btn');
//     const avatarModal = document.getElementById('avatarModal');
//     const avatarGridModal = document.getElementById('avatarGridModal');
//     const saveProfileImageModalBtn = document.getElementById('saveProfileImageModal');
//     const profileUserName = document.getElementById('profile-user-name');
//     const profileUserEmail = document.getElementById('profile-user-email');
//     const profileLogoutBtn = document.getElementById('profile-logout-btn');
//     const closeModalBtns = document.querySelectorAll('.close-modal');
    
//     let selectedAvatar = null;
//     let currentUser = null;

//     // Available avatar options
//     const avatarOptions = [
//         "images/images/userblue.png",
//         "images/images/userred.png",
//         "images/images/usergreen.png",
//         "images/images/useryellow.png",
//         "images/images/male.png",
//         "images/images/female.png",
//         "images/images/h1.jpg",
//         "images/images/h2.jpg",
//         "images/images/h3.jpg",
//         "images/images/h6.jpg",
//         "images/images/h4.jpg",
//         "images/images/h5.jpg",
//         "images/images/h7.jpg",
//         "images/images/coolcats/0.png",
//         "images/images/coolcats/1.png",
//         "images/images/coolcats/2.png",
//         "images/images/coolcats/3.png",
//         "images/images/coolcats/4.png",
//         "images/images/coolcats/5.png",
//         "images/images/coolcats/6.png",
//         "images/images/coolcats/7.png",
//         "images/images/coolcats/8.png",
//         "images/images/coolcats/9.png",
//         "images/images/coolcats/10.png",
//         "images/images/coolcats/11.png",
//         "images/images/coolcats/12.png",
//         "images/images/coolcats/13.png",
//         "images/images/coolcats/15.png",
//         "images/images/coolcats/16.png",
//         "images/images/coolcats/17.png",
//         "images/images/coolcats/18.png",
//         "images/images/coolcats/19.png",
//         "images/images/coolcats/20.png",
//         "images/images/coolcats/21.png",
//         "images/images/coolcats/22.png",
//         "images/images/coolcats/23.png",
//         "images/images/coolcats/24.png",
//         "images/images/coolcats/25.png",
//         "images/images/coolcats/26.png",
//         "images/images/coolcats/27.png",
//         "images/images/coolcats/28.png",
//         "images/images/coolcats/29.png",
//         "images/images/coolcats/30.png",
//         "images/images/coolcats/31.png",
//         "images/images/coolcats/32.png",
//         "images/images/coolcats/33.png",
//         "images/images/coolcats/34.png",
//         "images/images/coolcats/35.png",
//         "images/images/coolcats/36.png",
//         "images/images/coolcats/37.png",
//         "images/images/coolcats/38.png",
//         "images/images/coolcats/39.png",
//         "images/images/coolcats/40.png",
//         "images/images/coolcats/41.png",
//         "images/images/coolcats/42.png",
//         "images/images/coolcats/43.png",
//         "images/images/coolcats/44.png",
//         "images/images/coolcats/45.png",
//         "images/images/coolcats/46.png",
//         "images/images/coolcats/47.png",
//         "images/images/coolcats/48.png",
//         "images/images/coolcats/49.png",
//         "images/images/coolcats/50.png",
//         "images/images/coolcats/51.png",
//         "images/images/coolcats/52.png",
//         "images/images/coolcats/53.png",
//         "images/images/coolcats/54.png",
//         "images/images/coolcats/55.png",
//         "images/images/coolcats/56.png",
//         "images/images/coolcats/57.png"
//     ];

//     // Check auth state
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             currentUser = user;
//             loadUserProfile();
//         } else {
//             window.location.href = 'login.html';
//         }
//     });

// // Also update the default image path in loadUserProfile function:
// function loadUserProfile() {
//     if (!currentUser) return;
    
//     db.collection('users').doc(currentUser.uid).get()
//         .then((doc) => {
//             if (doc.exists) {
//                 const userData = doc.data();
                
//                 // Update profile image - use absolute path
//                 if (currentProfileImage) {
//                     // Check if the image exists, if not use default
//                     const img = new Image();
//                     img.onload = function() {
//                         currentProfileImage.src = userData.profileImageUrl;
//                     };
//                     img.onerror = function() {
//                         // If image doesn't exist, use default
//                         currentProfileImage.src = 'images/userblue.png';
//                     };
//                     img.src = userData.profileImageUrl;
//                 }
                
//                 // ... rest of your code
//             }
//         })
//         .catch((error) => {
//             console.error('Error loading user profile:', error);
//             showNotification('Error loading profile data. Please try again.', 'error');
//         });
// }

//     // Modal functionality
//     if (profileEditBtn) {
//         profileEditBtn.addEventListener('click', openAvatarModal);
//     }

//     function openAvatarModal() {
//         if (avatarModal) {
//             avatarModal.classList.add('active');
//             document.body.style.overflow = 'hidden';
//             loadAvatarOptionsModal();
//         }
//     }

//     function closeModal() {
//         if (avatarModal) {
//             avatarModal.classList.remove('active');
//             document.body.style.overflow = '';
//         }
//     }

//     closeModalBtns.forEach(btn => {
//         btn.addEventListener('click', closeModal);
//     });

//     // Close when clicking outside modal
//     if (avatarModal) {
//         avatarModal.addEventListener('click', (e) => {
//             if (e.target === avatarModal) {
//                 closeModal();
//             }
//         });
//     }

//     // Load avatar options
//     function loadAvatarOptionsModal() {
//         if (!avatarGridModal) return;
        
//         avatarGridModal.innerHTML = '';
        
//         avatarOptions.forEach((avatarPath, index) => {
//             const avatarOption = document.createElement('img');
//             avatarOption.src = avatarPath;
//             avatarOption.alt = 'Avatar option';
//             avatarOption.classList.add('avatar-option');
//             avatarOption.style.animationDelay = `${(index * 0.1)}s`;
            
//             // Check if this is the current profile image
//             if (currentProfileImage && currentProfileImage.src.includes(avatarPath)) {
//                 avatarOption.classList.add('selected');
//                 selectedAvatar = avatarPath;
//             }
            
//             avatarOption.addEventListener('click', () => {
//                 document.querySelectorAll('#avatarGridModal .avatar-option').forEach(option => {
//                     option.classList.remove('selected');
//                 });
                
//                 avatarOption.classList.add('selected');
//                 selectedAvatar = avatarPath;
                
//                 // Preview the selected avatar
//                 if (currentProfileImage) {
//                     currentProfileImage.src = avatarPath;
//                 }
//             });
            
//             avatarGridModal.appendChild(avatarOption);
//         });
//     }

//     // Save profile image from modal
//     if (saveProfileImageModalBtn) {
//         saveProfileImageModalBtn.addEventListener('click', () => {
//             if (!selectedAvatar) {
//                 showNotification('Please select an avatar first.', 'error');
//                 return;
//             }
            
//             saveProfileImageModalBtn.disabled = true;
//             saveProfileImageModalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            
//             db.collection('users').doc(currentUser.uid).update({
//                 profileImageUrl: selectedAvatar,
//                 lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
//             })
//             .then(() => {
//                 showNotification('Profile image updated successfully!');
//                 closeModal();
//             })
//             .catch((error) => {
//                 console.error('Error updating profile image:', error);
//                 showNotification('Error updating profile image. Please try again.', 'error');
//             })
//             .finally(() => {
//                 saveProfileImageModalBtn.disabled = false;
//                 saveProfileImageModalBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
//             });
//         });
//     }

//     // Logout functionality
//     if (profileLogoutBtn) {
//         profileLogoutBtn.addEventListener('click', () => {
//             auth.signOut()
//                 .then(() => {
//                     window.location.href = 'login.html';
//                 })
//                 .catch((error) => {
//                     console.error('Logout error:', error);
//                     showNotification('Error logging out. Please try again.', 'error');
//                 });
//         });
//     }

//     // Notification function
//     function showNotification(message, type = 'success') {
//         // Remove existing notifications
//         const existingNotifications = document.querySelectorAll('.notification');
//         existingNotifications.forEach(notification => notification.remove());
        
//         // Create notification element
//         const notification = document.createElement('div');
//         notification.className = `notification ${type}`;
//         notification.innerHTML = `
//             <div class="notification-content">
//                 <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
//                 <span>${message}</span>
//             </div>
//         `;
        
//         // Add styles
//         notification.style.cssText = `
//             position: fixed;
//             top: 20px;
//             right: 20px;
//             background: ${type === 'success' ? 'var(--in-range-color)' : 'var(--out-of-range-color)'};
//             color: white;
//             padding: 1rem 1.5rem;
//             border-radius: 0.75rem;
//             box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//             z-index: 10000;
//             max-width: 300px;
//             animation: slideIn 0.3s ease;
//         `;
        
//         document.body.appendChild(notification);
        
//         // Remove after 3 seconds
//         setTimeout(() => {
//             notification.style.animation = 'slideOut 0.3s ease';
//             setTimeout(() => {
//                 if (notification.parentNode) {
//                     notification.parentNode.removeChild(notification);
//                 }
//             }, 300);
//         }, 3000);
//     }

//     // Add CSS for animations if not already present
//     if (!document.querySelector('#notification-styles')) {
//         const style = document.createElement('style');
//         style.id = 'notification-styles';
//         style.textContent = `
//             @keyframes slideIn {
//                 from { transform: translateX(100%); opacity: 0; }
//                 to { transform: translateX(0); opacity: 1; }
//             }
//             @keyframes slideOut {
//                 from { transform: translateX(0); opacity: 1; }
//                 to { transform: translateX(100%); opacity: 0; }
//             }
//             .notification-content {
//                 display: flex;
//                 align-items: center;
//                 gap: 0.5rem;
//             }
//             .notification-content i {
//                 font-size: 1.1rem;
//             }
//         `;
//         document.head.appendChild(style);
//     }
// });
























// profile.js - Fixed version with proper image URL handling
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const currentProfileImage = document.getElementById('currentProfileImage');
    const profileEditBtn = document.getElementById('profile-edit-btn');
    const avatarModal = document.getElementById('avatarModal');
    const avatarGridModal = document.getElementById('avatarGridModal');
    const saveProfileImageModalBtn = document.getElementById('saveProfileImageModal');
    const profileUserName = document.getElementById('profile-user-name');
    const profileUserEmail = document.getElementById('profile-user-email');
    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    let selectedAvatar = null;
    let currentUser = null;

    // Available avatar options - using relative paths
    const avatarOptions = [
        "images/images/userblue.png",
        "images/images/userred.png",
        "images/images/usergreen.png",
        "images/images/useryellow.png",
        "images/images/male.png",
        "images/images/female.png",
        "images/images/h1.jpg",
        "images/images/h2.jpg",
        "images/images/h3.jpg",
        "images/images/h6.jpg",
        "images/images/h4.jpg",
        "images/images/h5.jpg",
        "images/images/h7.jpg",
        "images/images/coolcats/0.png",
        "images/images/coolcats/1.png",
        "images/images/coolcats/2.png",
        "images/images/coolcats/3.png",
        "images/images/coolcats/4.png",
        "images/images/coolcats/5.png",
        "images/images/coolcats/6.png",
        "images/images/coolcats/7.png",
        "images/images/coolcats/8.png",
        "images/images/coolcats/9.png",
        "images/images/coolcats/10.png",
        "images/images/coolcats/11.png",
        "images/images/coolcats/12.png",
        "images/images/coolcats/13.png",
        "images/images/coolcats/15.png",
        "images/images/coolcats/16.png",
        "images/images/coolcats/17.png",
        "images/images/coolcats/18.png",
        "images/images/coolcats/19.png",
        "images/images/coolcats/20.png",
        "images/images/coolcats/21.png",
        "images/images/coolcats/22.png",
        "images/images/coolcats/23.png",
        "images/images/coolcats/24.png",
        "images/images/coolcats/25.png",
        "images/images/coolcats/26.png",
        "images/images/coolcats/27.png",
        "images/images/coolcats/28.png",
        "images/images/coolcats/29.png",
        "images/images/coolcats/30.png",
        "images/images/coolcats/31.png",
        "images/images/coolcats/32.png",
        "images/images/coolcats/33.png",
        "images/images/coolcats/34.png",
        "images/images/coolcats/35.png",
        "images/images/coolcats/36.png",
        "images/images/coolcats/37.png",
        "images/images/coolcats/38.png",
        "images/images/coolcats/39.png",
        "images/images/coolcats/40.png",
        "images/images/coolcats/41.png",
        "images/images/coolcats/42.png",
        "images/images/coolcats/43.png",
        "images/images/coolcats/44.png",
        "images/images/coolcats/45.png",
        "images/images/coolcats/46.png",
        "images/images/coolcats/47.png",
        "images/images/coolcats/48.png",
        "images/images/coolcats/49.png",
        "images/images/coolcats/50.png",
        "images/images/coolcats/51.png",
        "images/images/coolcats/52.png",
        "images/images/coolcats/53.png",
        "images/images/coolcats/54.png",
        "images/images/coolcats/55.png",
        "images/images/coolcats/56.png",
        "images/images/coolcats/57.png"
    ];

    // Initialize the profile
    initProfile();

    function initProfile() {
        // Check auth state
        auth.onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                loadUserProfile();
                setupEventListeners();
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    function setupEventListeners() {
        // Modal functionality
        if (profileEditBtn) {
            profileEditBtn.addEventListener('click', openAvatarModal);
        }

        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        // Close when clicking outside modal
        if (avatarModal) {
            avatarModal.addEventListener('click', (e) => {
                if (e.target === avatarModal) {
                    closeModal();
                }
            });
        }

        // Save profile image from modal
        if (saveProfileImageModalBtn) {
            saveProfileImageModalBtn.addEventListener('click', saveProfileImage);
        }

        // Logout functionality
        if (profileLogoutBtn) {
            profileLogoutBtn.addEventListener('click', logoutUser);
        }

        // Close with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    // Load user profile data from Firebase
    function loadUserProfile() {
        if (!currentUser) return;
        
        console.log('Loading profile for user:', currentUser.uid);
        
        db.collection('users').doc(currentUser.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('User data loaded:', userData);
                    
                    // Update profile image - FIXED: Handle the saved path properly
                    if (currentProfileImage) {
                        let profileImagePath = userData.profileImage || userData.profileImageUrl || 'images/user.png';
                        
                        // If the path is saved with quotes or has issues, clean it up
                        profileImagePath = profileImagePath.replace(/"/g, '').trim();
                        
                        console.log('Setting profile image to:', profileImagePath);
                        currentProfileImage.src = profileImagePath;
                        
                        // Also set selectedAvatar for the modal
                        selectedAvatar = profileImagePath;
                    }
                    
                    // Update user name
                    if (profileUserName) {
                        const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
                        profileUserName.textContent = fullName || 'User';
                    }
                    
                    // Update email
                    if (profileUserEmail) {
                        profileUserEmail.textContent = currentUser.email || userData.email || 'No email';
                    }

                } else {
                    console.log("No user document found, creating one...");
                    // Create user document if it doesn't exist
                    createUserDocument();
                }
            })
            .catch((error) => {
                console.error('Error loading user profile:', error);
                showNotification('Error loading profile data. Please try again.', 'error');
            });
    }

    // Create user document if it doesn't exist
    function createUserDocument() {
        if (!currentUser) return;

        const userData = {
            firstName: '',
            lastName: '',
            email: currentUser.email,
            profileImage: 'images/user.png', // Use consistent field name
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection('users').doc(currentUser.uid).set(userData)
            .then(() => {
                console.log('New user document created');
                // Update UI with default data
                if (currentProfileImage) {
                    currentProfileImage.src = 'images/user.png';
                }
                if (profileUserName) {
                    profileUserName.textContent = 'User';
                }
                if (profileUserEmail) {
                    profileUserEmail.textContent = currentUser.email || 'No email';
                }
            })
            .catch((error) => {
                console.error('Error creating user document:', error);
                showNotification('Error creating profile. Please try again.', 'error');
            });
    }

    // Modal functionality
    function openAvatarModal() {
        if (avatarModal) {
            avatarModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            loadAvatarOptionsModal();
        }
    }

    function closeModal() {
        if (avatarModal) {
            avatarModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Load avatar options in modal
    function loadAvatarOptionsModal() {
        if (!avatarGridModal) return;
        
        avatarGridModal.innerHTML = '';
        
        avatarOptions.forEach((avatarPath, index) => {
            const avatarOption = document.createElement('img');
            avatarOption.src = avatarPath;
            avatarOption.alt = 'Avatar option';
            avatarOption.classList.add('avatar-option');
            avatarOption.style.animationDelay = `${(index * 0.1)}s`;
            
            // Check if this is the current profile image
            // Clean both paths for comparison
            const currentPath = selectedAvatar ? selectedAvatar.replace(/"/g, '').trim() : '';
            const optionPath = avatarPath.replace(/"/g, '').trim();
            
            if (currentPath && currentPath.includes(optionPath)) {
                avatarOption.classList.add('selected');
            }
            
            avatarOption.addEventListener('click', () => {
                document.querySelectorAll('#avatarGridModal .avatar-option').forEach(option => {
                    option.classList.remove('selected');
                });
                
                avatarOption.classList.add('selected');
                selectedAvatar = avatarPath;
                
                // Preview the selected avatar
                if (currentProfileImage) {
                    currentProfileImage.src = avatarPath;
                }
            });
            
            avatarGridModal.appendChild(avatarOption);
        });
    }

    // Save profile image to Firebase - FIXED: Ensure clean path is saved
    function saveProfileImage() {
        if (!selectedAvatar) {
            showNotification('Please select an avatar first.', 'error');
            return;
        }
        
        if (!currentUser) {
            showNotification('User not authenticated.', 'error');
            return;
        }

        saveProfileImageModalBtn.disabled = true;
        saveProfileImageModalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        // Clean the path before saving to Firebase
        const cleanAvatarPath = selectedAvatar.replace(/"/g, '').trim();
        
        console.log('Saving profile image to Firebase:', cleanAvatarPath);
        
        const updateData = {
            profileImage: cleanAvatarPath,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection('users').doc(currentUser.uid).update(updateData)
            .then(() => {
                console.log('Profile image saved successfully to Firebase');
                showNotification('Profile image updated successfully!');
                closeModal();
                
                // Update the selectedAvatar with the clean path
                selectedAvatar = cleanAvatarPath;
            })
            .catch((error) => {
                console.error('Error updating profile image:', error);
                showNotification('Error updating profile image. Please try again.', 'error');
            })
            .finally(() => {
                saveProfileImageModalBtn.disabled = false;
                saveProfileImageModalBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            });
    }

    // Logout functionality
    function logoutUser() {
        if (!confirm('Are you sure you want to log out?')) {
            return;
        }

        auth.signOut()
            .then(() => {
                console.log('User logged out successfully');
                window.location.href = 'login.html';
            })
            .catch((error) => {
                console.error('Logout error:', error);
                showNotification('Error logging out. Please try again.', 'error');
            });
    }

    // Notification function
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add CSS for animations if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-content i {
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(style);
    }
});