// script.js - Cleaned dashboard functionality without charts
let allReadings = [];
let currentUser = null;

// CONFIG - Easy to change number of readings to display
const RECENT_READINGS_COUNT = 3;

// Helper function to format time
function formatTime12Hour(time) {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let hours12 = parseInt(hours, 10);

    if (hours12 >= 12) {
        period = 'PM';
        if (hours12 > 12) {
            hours12 -= 12;
        }
    } else if (hours12 === 0) {
        hours12 = 12;
    }
    return `${hours12}:${minutes} ${period}`;
}

// Updated status functions with proper color coding
function getStatusClass(glucose) {
    if (glucose < 70) return 'out-of-range';      // Red for low
    if (glucose >= 70 && glucose <= 130) return 'in-range';    // Green for in range
    if (glucose > 130 && glucose <= 180) return 'mid-range';   // Orange for mid range
    return 'out-of-range';                         // Red for high
}

function getStatusText(glucose) {
    if (glucose < 70) return 'Low';
    if (glucose >= 70 && glucose <= 130) return 'In Range';
    if (glucose > 130 && glucose <= 180) return 'High';
    return 'Very High';
}

function getStatusColor(glucose) {
    if (glucose < 70) return '#ef4444';      // Red
    if (glucose >= 70 && glucose <= 130) return '#10b981';  // Green
    if (glucose > 130 && glucose <= 180) return '#f59e0b';  // Orange
    return '#dc2626';                        // Dark Red
}

// 1. AUTH STATE CHECK
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        loadDashboardData(user);
        setupEventListeners();
    } else {
        window.location.href = 'login.html';
    }
});

// 2. SETUP EVENT LISTENERS
function setupEventListeners() {
    const exportBtn = document.getElementById('export-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const navExpand = document.getElementById('nav-expand');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportDashboardAsPDF);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
    
    if (navExpand) {
        navExpand.addEventListener('click', openAddReadingModal);
    }
    
    // Close modal events
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAddReadingModal);
    });
    
    // Close modal when clicking outside
    document.getElementById('addReadingModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAddReadingModal();
        }
    });

    // Profile image click handler
    const profileImgHeader = document.getElementById('profile-img-header');
    const profileImageUploadHeader = document.getElementById('profile-image-upload-header');
    
    if (profileImgHeader && profileImageUploadHeader) {
        profileImgHeader.addEventListener('click', () => profileImageUploadHeader.click());
        profileImageUploadHeader.addEventListener('change', handleProfileImageUpload);
    }
}

// 3. LOAD DASHBOARD DATA
function loadDashboardData(user) {
    // Load user info
    const userDocRef = db.collection('users').doc(user.uid);
    userDocRef.get().then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            const welcomeMessage = document.getElementById('welcome-message');
            const profileImgHeader = document.getElementById('profile-img-header');
            
            if (welcomeMessage) {
                welcomeMessage.textContent = ` ${userData.firstName || ' User'}`;
                // welcomeMessage.textContent = `Welcome! ${userData.firstName || 'User'}`;
            }
            if (profileImgHeader && userData.profileImage) {
                profileImgHeader.src = userData.profileImage;
            }
        }
    }).catch((error) => {
        console.log("Error getting user document:", error);
    });

    // Load readings (real-time)
    db.collection('readings')
        .where('userId', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .onSnapshot((querySnapshot) => {
            allReadings = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                allReadings.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
                });
            });
            
            updateDashboardUI(allReadings);
        }, (error) => {
            console.error("Error getting readings: ", error);
        });
}

// 4. UPDATE UI ELEMENTS
function updateDashboardUI(readings) {
    updateLatestReading(readings);
    updateMetrics(readings);
    updateRecentReadingsList(readings);
}

function updateLatestReading(readings) {
    const latestValue = document.getElementById('latest-reading-value');
    const latestStatus = document.getElementById('latest-reading-status');
    const latestTime = document.getElementById('latest-reading-time');

    if (readings.length > 0) {
        const latest = readings[0];
        const glucose = latest.glucose;
        
        latestValue.textContent = glucose || '--';
        
        const statusClass = getStatusClass(glucose);
        const statusColor = getStatusColor(glucose);
        latestStatus.className = `status ${statusClass}`;
        latestStatus.innerHTML = `<i class="fas fa-circle" style="color: ${statusColor}"></i> ${getStatusText(glucose)}`;

        const readingDate = new Date(latest.timestamp);
        latestTime.textContent = readingDate.toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } else {
        latestValue.textContent = '--';
        latestStatus.className = 'status';
        latestStatus.innerHTML = '<i class="fas fa-circle"></i> --';
        latestTime.textContent = 'No readings yet';
    }
}

function updateMetrics(readings) {
    const weeklyAvg = document.getElementById('weekly-avg-value');
    const timeInRange = document.getElementById('time-in-range-value');
    const avgDisplay = document.getElementById('avg-display');

    if (readings.length > 0) {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const weeklyReadings = readings.filter(r => r.timestamp >= oneWeekAgo);
        const dailyReadings = readings.filter(r => r.timestamp >= oneDayAgo);

        // Weekly Average
        if (weeklyReadings.length > 0) {
            const weeklySum = weeklyReadings.reduce((acc, r) => acc + r.glucose, 0);
            weeklyAvg.textContent = Math.round(weeklySum / weeklyReadings.length);
        } else {
            weeklyAvg.textContent = '--';
        }

        // 24-Hour Average
        if (dailyReadings.length > 0) {
            const dailySum = dailyReadings.reduce((acc, r) => acc + r.glucose, 0);
            const dailyAvg = Math.round(dailySum / dailyReadings.length);
            avgDisplay.innerHTML = `${dailyAvg} <span class="unit">mg/dL Avg.</span>`;
            
            // Color code the average based on status
            const avgStatusClass = getStatusClass(dailyAvg);
            const avgStatusColor = getStatusColor(dailyAvg);
            avgDisplay.className = `avg-display ${avgStatusClass}`;
            avgDisplay.style.color = avgStatusColor;
        } else {
            avgDisplay.innerHTML = '-- <span class="unit">mg/dL Avg.</span>';
            avgDisplay.className = 'avg-display';
            avgDisplay.style.color = '';
        }

        // Time in Range (70-180 mg/dL)
        const inRangeReadings = readings.filter(r => r.glucose >= 70 && r.glucose <= 180).length;
        const timeInRangePercent = Math.round((inRangeReadings / readings.length) * 100);
        timeInRange.textContent = timeInRangePercent;

        // Color code time in range
        if (timeInRangePercent >= 70) {
            timeInRange.style.color = '#10b981'; // Green
        } else if (timeInRangePercent >= 50) {
            timeInRange.style.color = '#f59e0b'; // Orange
        } else {
            timeInRange.style.color = '#ef4444'; // Red
        }

    } else {
        weeklyAvg.textContent = '--';
        timeInRange.textContent = '--';
        avgDisplay.innerHTML = '-- <span class="unit">mg/dL Avg.</span>';
        avgDisplay.className = 'avg-display';
        avgDisplay.style.color = '';
        timeInRange.style.color = '';
    }
}

function updateRecentReadingsList(readings) {
    const listContainer = document.querySelector('.history-list-container');
    if (!listContainer) return;

    // Clear existing readings (but not the 'View All' button)
    const existingItems = listContainer.querySelectorAll('.history-item2');
    existingItems.forEach(item => item.remove());

    const recent = readings.slice(0, RECENT_READINGS_COUNT);

    if (recent.length === 0) {
        const noReadingItem = document.createElement('div');
        noReadingItem.className = 'history-item2';
        noReadingItem.innerHTML = `<div class="details">No readings found. Add your first reading!</div>`;
        listContainer.prepend(noReadingItem);
    } else {
        recent.forEach(reading => {
            const item = document.createElement('div');
            item.className = 'history-item2';
            
            const glucose = reading.glucose;
            const statusClass = getStatusClass(glucose);
            const statusColor = getStatusColor(glucose);
            const readingDate = new Date(reading.timestamp);
            
            item.innerHTML = `
                <div class="details">
                    <span class="reading-value status ${statusClass}" style="color: ${statusColor}">
                        ${glucose} <span class="unit">mg/dL</span>
                    </span>
                </div>
                <div class="time">
                    ${formatTime12Hour(reading.time)}
                    <span>${readingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
            `;
            listContainer.prepend(item);
        });
    }
}
//             item.innerHTML = `
//                 <div class="details">
//                     <span class="reading-value status ${statusClass}" style="color: ${statusColor}">
//                         ${glucose} <span class="unit">mg/dL</span>
//                     </span>
//                     <span class="reading-comment">${reading.comment || 'No comment'}</span>
//                 </div>
//                 <div class="time">
//                     ${formatTime12Hour(reading.time)}
//                     <span>${readingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
//                 </div>
//             `;
//             listContainer.prepend(item);
//         });
//     }
// }

// 5. ADD READING MODAL FUNCTIONS
function openAddReadingModal() {
    const modal = document.getElementById('addReadingModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set default values
    const now = new Date();
    document.getElementById('reading-date').value = now.toISOString().split('T')[0];
    document.getElementById('reading-time').value = now.toTimeString().slice(0, 5);
    document.getElementById('glucose-value').value = '';
    document.getElementById('reading-comment').value = '';
}

function closeAddReadingModal() {
    const modal = document.getElementById('addReadingModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

async function saveNewReading() {
    const glucose = parseInt(document.getElementById('glucose-value').value);
    const comment = document.getElementById('reading-comment').value;
    const date = document.getElementById('reading-date').value;
    const time = document.getElementById('reading-time').value;

    if (!glucose || !date || !time) {
        alert('Please fill in all required fields');
        return;
    }

    if (glucose < 1 || glucose > 600) {
        alert('Please enter a valid glucose level (1-600 mg/dL)');
        return;
    }

    const saveBtn = document.querySelector('#addReadingModal .login-button');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;

    try {
        // Combine date and time into a timestamp
        const dateTimeString = `${date}T${time}`;
        const timestamp = new Date(dateTimeString);

        await db.collection('readings').add({
            userId: currentUser.uid,
            glucose: glucose,
            comment: comment,
            date: date,
            time: time,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            created: timestamp
        });

        closeAddReadingModal();
        showNotification('Reading added successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving reading:', error);
        showNotification('Error saving reading. Please try again.', 'error');
    } finally {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

// 6. PROFILE IMAGE HANDLING
async function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const profileImgHeader = document.getElementById('profile-img-header');
    const userDocRef = db.collection('users').doc(currentUser.uid);

    try {
        // Create a storage reference
        const storageRef = storage.ref(`profile_images/${currentUser.uid}/${file.name}`);
        
        // Show loading state
        profileImgHeader.style.opacity = '0.5';

        // Upload the file
        const uploadTask = storageRef.put(file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Progress handling (optional)
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.error("Upload failed:", error);
                showNotification('Error uploading profile image.', 'error');
                profileImgHeader.style.opacity = '1';
            },
            async () => {
                // Upload complete
                try {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    
                    // Update Firestore
                    await userDocRef.update({ profileImage: downloadURL });
                    
                    // Update image on page
                    profileImgHeader.src = downloadURL;
                    profileImgHeader.style.opacity = '1';
                    
                    showNotification('Profile image updated successfully!', 'success');
                } catch (error) {
                    console.error("Error updating profile:", error);
                    showNotification('Error updating profile.', 'error');
                    profileImgHeader.style.opacity = '1';
                }
            }
        );

    } catch (error) {
        console.error("Error handling profile upload:", error);
        showNotification('Error uploading profile image.', 'error');
        profileImgHeader.style.opacity = '1';
    }
}

// 7. PDF EXPORT FUNCTION
async function exportDashboardAsPDF() {
    if (!currentUser) {
        alert('Please sign in to export.');
        return;
    }

    if (typeof jsPDF === 'undefined') {
        alert("PDF library not loaded. Please try again.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    try {
        // Get user data
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.exists ? userDoc.data() : { firstName: 'User', lastName: '' };
        const fullName = `${userData.firstName} ${userData.lastName}`.trim();

        // PDF content
        let y = 20;

        // Header
        pdf.setFontSize(20);
        pdf.setTextColor(59, 130, 246);
        pdf.text('SugarTrack Report', 105, y, { align: 'center' });
        y += 10;

        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated for: ${fullName}`, 105, y, { align: 'center' });
        y += 8;
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 105, y, { align: 'center' });
        y += 15;

        // Latest Reading
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Latest Reading', 20, y);
        y += 10;

        if (allReadings.length > 0) {
            const latest = allReadings[0];
            pdf.setFontSize(12);
            pdf.text(`Glucose: ${latest.glucose} mg/dL`, 20, y);
            y += 6;
            pdf.text(`Status: ${getStatusText(latest.glucose)}`, 20, y);
            y += 6;
            pdf.text(`Time: ${new Date(latest.timestamp).toLocaleString()}`, 20, y);
            y += 6;
            if (latest.comment) {
                pdf.text(`Comment: ${latest.comment}`, 20, y);
                y += 6;
            }
        } else {
            pdf.text('No readings available', 20, y);
            y += 10;
        }

        y += 10;

        // Recent Readings Table
        if (allReadings.length > 0) {
            pdf.setFontSize(16);
            pdf.text('Recent Readings', 20, y);
            y += 10;

            const headers = ['Date', 'Time', 'Glucose', 'Status'];
            const columnWidths = [40, 30, 30, 40];
            const rowHeight = 8;

            // Table header
            pdf.setFillColor(59, 130, 246);
            pdf.setTextColor(255, 255, 255);
            pdf.rect(20, y, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
            
            let x = 20;
            headers.forEach((header, i) => {
                pdf.text(header, x + columnWidths[i] / 2, y + 5, { align: 'center' });
                x += columnWidths[i];
            });
            y += rowHeight;

            // Table rows
            pdf.setTextColor(0, 0, 0);
            const recentReadings = allReadings.slice(0, 10);

            recentReadings.forEach(reading => {
                if (y > 270) {
                    pdf.addPage();
                    y = 20;
                }

                const rowData = [
                    reading.date,
                    formatTime12Hour(reading.time),
                    reading.glucose.toString(),
                    getStatusText(reading.glucose)
                ];

                x = 20;
                rowData.forEach((cell, i) => {
                    pdf.text(cell, x + 2, y + 5, { align: 'left' });
                    x += columnWidths[i];
                });
                y += rowHeight;
            });
        }

        pdf.save(`sugartrack-report-${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// 8. UTILITY FUNCTIONS
function logoutUser() {
    auth.signOut()
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        });
}

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

// Add CSS for animations
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SugarTrack Dashboard initialized');
});



















// Profile Dropdown Menu Functions
function setupProfileDropdown() {
    const profileTrigger = document.getElementById('profile-menu-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');
    const dropdownLogoutBtn = document.getElementById('dropdown-logout-btn');
    const overlay = document.createElement('div');
    
    overlay.className = 'profile-menu-overlay';
    document.body.appendChild(overlay);

    // Toggle dropdown menu
    profileTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = profileDropdown.classList.contains('active');
        
        if (isActive) {
            closeProfileDropdown();
        } else {
            openProfileDropdown();
        }
    });

    // Close dropdown when clicking outside
    overlay.addEventListener('click', closeProfileDropdown);
    
    // Close dropdown when clicking on menu items (except logout which has its own handler)
    profileDropdown.addEventListener('click', function(e) {
        if (e.target.closest('.profile-menu-item') && !e.target.closest('.logout-btn')) {
            setTimeout(closeProfileDropdown, 200);
        }
    });

    // Logout handler
    dropdownLogoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeProfileDropdown();
        logoutUser();
    });

    // Close dropdown when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProfileDropdown();
        }
    });

    // Update dropdown user info
    updateDropdownUserInfo();
}

function openProfileDropdown() {
    const profileDropdown = document.getElementById('profile-dropdown');
    const overlay = document.querySelector('.profile-menu-overlay');
    
    profileDropdown.classList.add('active');
    overlay.classList.add('active');
    
    // Update user info in dropdown
    updateDropdownUserInfo();
}

function closeProfileDropdown() {
    const profileDropdown = document.getElementById('profile-dropdown');
    const overlay = document.querySelector('.profile-menu-overlay');
    
    profileDropdown.classList.remove('active');
    overlay.classList.remove('active');
}

function updateDropdownUserInfo() {
    if (!currentUser) return;
    
    // Get user data from Firestore
    db.collection('users').doc(currentUser.uid).get().then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            const dropdownUserName = document.getElementById('dropdown-user-name');
            const dropdownUserEmail = document.getElementById('dropdown-user-email');
            const dropdownProfileImg = document.getElementById('dropdown-profile-img');
            
            if (dropdownUserName) {
                dropdownUserName.textContent = `${userData.firstName || 'User'} ${userData.lastName || ''}`.trim();
            }
            
            if (dropdownUserEmail) {
                dropdownUserEmail.textContent = currentUser.email || 'user@example.com';
            }
            
            if (dropdownProfileImg && userData.profileImage) {
                dropdownProfileImg.src = userData.profileImage;
            }
        }
    }).catch((error) => {
        console.log("Error getting user data for dropdown:", error);
    });
}setupProfileDropdown();

// // Update the loadDashboardData function to include profile dropdown setup
// function loadDashboardData(user) {
//     // ... existing code ...
    
//     // Load user info
//     const userDocRef = db.collection('users').doc(user.uid);
//     userDocRef.get().then((doc) => {
//         if (doc.exists) {
//             const userData = doc.data();
//             const welcomeMessage = document.getElementById('welcome-message');
//             const profileImgHeader = document.getElementById('profile-img-header');
//             const dropdownProfileImg = document.getElementById('dropdown-profile-img');
            
//             if (welcomeMessage) {
//                 welcomeMessage.textContent = `Welcome! ${userData.firstName || 'User'}`;
//             }
//             if (profileImgHeader && userData.profileImage) {
//                 profileImgHeader.src = userData.profileImage;
//             }
//             if (dropdownProfileImg && userData.profileImage) {
//                 dropdownProfileImg.src = userData.profileImage;
//             }
//         }
//     }).catch((error) => {
//         console.log("Error getting user document:", error);
//     });

//     // ... rest of existing code ...
// }

// // Update the setupEventListeners function
// function setupEventListeners() {
//     const exportBtn = document.getElementById('export-btn');
//     const logoutBtn = document.getElementById('logout-btn');
//     const navExpand = document.getElementById('nav-expand');
    
//     if (exportBtn) {
//         exportBtn.addEventListener('click', exportDashboardAsPDF);
//     }
    
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', logoutUser);
//     }
    
//     if (navExpand) {
//         navExpand.addEventListener('click', openAddReadingModal);
//     }
    
//     // Close modal events
//     document.querySelectorAll('.close-modal').forEach(btn => {
//         btn.addEventListener('click', closeAddReadingModal);
//     });
    
//     // Close modal when clicking outside
//     document.getElementById('addReadingModal').addEventListener('click', function(e) {
//         if (e.target === this) {
//             closeAddReadingModal();
//         }
//     });

    // Setup profile dropdown
    
    
//     // Remove the old profile image upload handler since it's now in the dropdown
//     const profileImageUploadHeader = document.getElementById('profile-image-upload-header');
//     if (profileImageUploadHeader) {
//         profileImageUploadHeader.addEventListener('change', handleProfileImageUpload);
//     }
// }

