// // // profile-loader.js - Simple reusable profile loader
// // function loadUserProfile() {
// //     return new Promise((resolve, reject) => {
// //         const user = auth.currentUser;
// //         if (!user) {
// //             reject('No user logged in');
// //             return;
// //         }

// //         db.collection('users').doc(user.uid).get()
// //             .then((doc) => {
// //                 if (doc.exists) {
// //                     const userData = doc.data();
// //                     resolve({
// //                         firstName: userData.firstName || '',
// //                         lastName: userData.lastName || '',
// //                         email: user.email || userData.email || '',
// //                         profileImage: userData.profileImageUrl || 'images/images/userblue.png',
// //                         fullName: [userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'User'
// //                     });
// //                 } else {
// //                     reject('User data not found');
// //                 }
// //             })
// //             .catch((error) => {
// //                 reject(error);
// //             });
// //     });
// // }

// // // Auto-load profile data when DOM is ready
// // document.addEventListener('DOMContentLoaded', function() {
// //     // Check if user is authenticated
// //     auth.onAuthStateChanged((user) => {
// //         if (!user) {
// //             window.location.href = 'login.html';
// //             return;
// //         }
        
// //         // Load profile data for elements with these IDs
// //         loadUserProfile()
// //             .then((userData) => {
// //                 // Update profile image
// //                 const profileImage = document.getElementById('profile-img-settings');
// //                 if (profileImage) profileImage.src = userData.profileImage;
                
// //                 const currentProfileImage = document.getElementById('currentProfileImage');
// //                 if (currentProfileImage) currentProfileImage.src = userData.profileImage;

// //                 // Update user name
// //                 const userNameElements = document.querySelectorAll('[data-profile="name"], #settings-user-name');
// //                 userNameElements.forEach(element => {
// //                     element.textContent = userData.fullName;
// //                 });

// //                 // Update email
// //                 const emailElements = document.querySelectorAll('[data-profile="email"], #settings-user-email');
// //                 emailElements.forEach(element => {
// //                     element.textContent = userData.email;
// //                 });

// //                 // Update first name in input fields
// //                 const firstNameInputs = document.querySelectorAll('[data-profile-input="firstName"], #firstName');
// //                 firstNameInputs.forEach(input => {
// //                     input.value = userData.firstName;
// //                 });

// //                 // Update last name in input fields  
// //                 const lastNameInputs = document.querySelectorAll('[data-profile-input="lastName"], #lastName');
// //                 lastNameInputs.forEach(element => {
// //                     if (element.tagName === 'INPUT') {
// //                         element.value = userData.lastName;
// //                     } else {
// //                         element.textContent = userData.lastName;
// //                     }
// //                 });

// //                 // Update any elements with data-profile attributes
// //                 const firstNameElements = document.querySelectorAll('[data-profile="firstName"]');
// //                 firstNameElements.forEach(element => {
// //                     element.textContent = userData.firstName;
// //                 });

// //                 const lastNameElements = document.querySelectorAll('[data-profile="lastName"]');
// //                 lastNameElements.forEach(element => {
// //                     element.textContent = userData.lastName;
// //                 });
// //             })
// //             .catch((error) => {
// //                 console.error('Error loading profile:', error);
// //             });
// //     });
// // });




// // profile-loader.js - Simplified reusable profile loader
// function loadUserProfile() {
//     return new Promise((resolve, reject) => {
//         const user = auth.currentUser;
//         if (!user) {
//             reject('No user logged in');
//             return;
//         }

//         db.collection('users').doc(user.uid).get()
//             .then((doc) => {
//                 if (doc.exists) {
//                     const userData = doc.data();
//                     const profileData = {
//                         firstName: userData.firstName || '',
//                         lastName: userData.lastName || '',
//                         email: user.email || userData.email || '',
//                         profileImage: userData.profileImage || 'images/images/userblue.png',
//                         fullName: [userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'User'
//                     };
//                     resolve(profileData);
//                 } else {
//                     reject('User data not found');
//                 }
//             })
//             .catch((error) => {
//                 reject(error);
//             });
//     });
// }

// // Auto-load profile data when DOM is ready
// document.addEventListener('DOMContentLoaded', function() {
//     // Check if user is authenticated
//     auth.onAuthStateChanged((user) => {
//         if (!user) {
//             window.location.href = 'login.html';
//             return;
//         }
        
//         // Load and display profile data
//         loadUserProfile()
//             .then((userData) => {
//                 updateProfileElements(userData);
//             })
//             .catch((error) => {
//                 console.error('Error loading profile:', error);
//             });
//     });
// });

// // Function to update all profile elements on the page
// function updateProfileElements(userData) {
//     // Update all elements with data-profile attributes
//     document.querySelectorAll('[data-profile]').forEach(element => {
//         const profileField = element.getAttribute('data-profile');
        
//         switch(profileField) {
//             case 'image':
//                 if (element.tagName === 'IMG') {
//                     element.src = userData.profileImage;
//                 }
//                 break;
//             case 'email':
//                 element.textContent = userData.email;
//                 break;
//             case 'fullName':
//                 element.textContent = userData.fullName;
//                 break;
//             case 'firstName':
//                 if (element.tagName === 'INPUT') {
//                     element.value = userData.firstName;
//                 } else {
//                     element.textContent = userData.firstName;
//                 }
//                 break;
//             case 'lastName':
//                 if (element.tagName === 'INPUT') {
//                     element.value = userData.lastName;
//                 } else {
//                     element.textContent = userData.lastName;
//                 }
//                 break;
//             case 'name':
//                 element.textContent = userData.fullName;
//                 break;
//         }
//     });

//     // Also update elements with specific IDs for backward compatibility
//     const profileImage = document.getElementById('profile-img-settings');
//     if (profileImage) profileImage.src = userData.profileImage;
    
//     const currentProfileImage = document.getElementById('currentProfileImage');
//     if (currentProfileImage) currentProfileImage.src = userData.profileImage;

//     const userNameElements = document.querySelectorAll('#settings-user-name');
//     userNameElements.forEach(element => {
//         element.textContent = userData.fullName;
//     });

//     const emailElements = document.querySelectorAll('#settings-user-email');
//     emailElements.forEach(element => {
//         element.textContent = userData.email;
//     });
// }
























// profile-loader.js - Fixed version for your Firebase data structure
function loadUserProfile() {
    return new Promise((resolve, reject) => {
        const user = auth.currentUser;
        if (!user) {
            reject('No user logged in');
            return;
        }

        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    // FIXED: Handle the profileImage field properly and clean the path
                    let profileImagePath = userData.profileImage || 'images/user.png';
                    profileImagePath = profileImagePath.replace(/"/g, '').trim();
                    
                    const profileData = {
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        email: user.email || userData.email || '',
                        profileImage: profileImagePath,
                        fullName: [userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'User'
                    };
                    resolve(profileData);
                } else {
                    // Create user document if it doesn't exist
                    const defaultUserData = {
                        firstName: '',
                        lastName: '',
                        email: user.email,
                        profileImage: 'images/user.png',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    db.collection('users').doc(user.uid).set(defaultUserData)
                        .then(() => {
                            resolve({
                                firstName: '',
                                lastName: '',
                                email: user.email,
                                profileImage: 'images/user.png',
                                fullName: 'User'
                            });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Auto-load profile data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        // Load and display profile data
        loadUserProfile()
            .then((userData) => {
                updateProfileElements(userData);
            })
            .catch((error) => {
                console.error('Error loading profile:', error);
                // Show default data on error
                updateProfileElements({
                    firstName: '',
                    lastName: '',
                    email: user.email,
                    profileImage: 'images/user.png',
                    fullName: 'User'
                });
            });
    });
});

// Function to update all profile elements on the page
function updateProfileElements(userData) {
    console.log('Updating profile elements with:', userData);
    
    // Update all elements with data-profile attributes
    document.querySelectorAll('[data-profile]').forEach(element => {
        const profileField = element.getAttribute('data-profile');
        
        switch(profileField) {
            case 'image':
                if (element.tagName === 'IMG') {
                    element.src = userData.profileImage;
                    console.log('Updated profile image:', userData.profileImage);
                }
                break;
            case 'email':
                element.textContent = userData.email;
                break;
            case 'fullName':
                element.textContent = userData.fullName;
                break;
            case 'firstName':
                if (element.tagName === 'INPUT') {
                    element.value = userData.firstName;
                } else {
                    element.textContent = userData.firstName;
                }
                break;
            case 'lastName':
                if (element.tagName === 'INPUT') {
                    element.value = userData.lastName;
                } else {
                    element.textContent = userData.lastName;
                }
                break;
            case 'name':
                element.textContent = userData.fullName;
                break;
        }
    });

    // Also update elements with specific IDs for backward compatibility
    const profileImage = document.getElementById('profile-img-settings');
    if (profileImage) {
        profileImage.src = userData.profileImage;
        console.log('Updated profile-img-settings:', userData.profileImage);
    }
    
    const currentProfileImage = document.getElementById('currentProfileImage');
    if (currentProfileImage) {
        currentProfileImage.src = userData.profileImage;
        console.log('Updated currentProfileImage:', userData.profileImage);
    }

    const userNameElements = document.querySelectorAll('#settings-user-name');
    userNameElements.forEach(element => {
        element.textContent = userData.fullName;
    });

    const emailElements = document.querySelectorAll('#settings-user-email');
    emailElements.forEach(element => {
        element.textContent = userData.email;
    });
    
    // Update input fields with specific IDs
    const firstNameInput = document.getElementById('firstName');
    if (firstNameInput) firstNameInput.value = userData.firstName;
    
    const lastNameInput = document.getElementById('lastName');
    if (lastNameInput) lastNameInput.value = userData.lastName;
    
    const userEmailInput = document.getElementById('userEmail');
    if (userEmailInput) userEmailInput.value = userData.email;
}

// Make functions available globally for other scripts
window.profileLoader = {
    loadUserProfile: loadUserProfile,
    updateProfileElements: updateProfileElements
};