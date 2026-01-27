// // dashboard.js - New file to manage all logic for dashboard.html

// // Initialize Chart
// let sugarChart = null;
// let allReadings = [];
// let currentUser = null;

// // Helper function to format time
// function formatTime12Hour(time) {
//   if (!time) return "";
//   const [hours, minutes] = time.split(':');
//   let period = 'AM';
//   let hours12 = parseInt(hours, 10);

//   if (hours12 >= 12) {
//     period = 'PM';
//     if (hours12 > 12) {
//       hours12 -= 12;
//     }
//   } else if (hours12 === 0) {
//     hours12 = 12; // Midnight (12 AM)
//   }
//   return `${hours12}:${minutes} ${period}`;
// }

// // Function to get status class for reading
// function getStatusClass(glucose) {
//     if (glucose < 70) return 'out-of-range';
//     if (glucose >= 70 && glucose <= 180) return 'in-range'; // Assuming in-range
//     if (glucose > 180 && glucose <= 250) return 'mid-range'; // Example for mid-range
//     return 'out-of-range'; // High
// }
// function getStatusText(glucose) {
//     if (glucose < 70) return 'Low';
//     if (glucose >= 70 && glucose <= 180) return 'In Range';
//     if (glucose > 180 && glucose <= 250) return 'High';
//     return 'Very High';
// }


// // 1. AUTH STATE CHECK
// auth.onAuthStateChanged((user) => {
//   if (user) {
//     currentUser = user;
//     loadDashboardData(user);
//   } else {
//     // No user is signed in.
//     window.location.href = 'login.html';
//   }
// });

// // 2. LOAD ALL DASHBOARD DATA
// function loadDashboardData(user) {
//   const welcomeMessage = document.getElementById('welcome-message');
//   const profileImgHeader = document.getElementById('profile-img-header');
//   const profileImageUploadHeader = document.getElementById('profile-image-upload-header');
//   const exportBtn = document.getElementById('export-btn');
//   const logoutBtn = document.getElementById('logout-btn');

//   // Load user info
//   const userDocRef = db.collection('users').doc(user.uid);
//   userDocRef.get().then((doc) => {
//     if (doc.exists) {
//       const userData = doc.data();
//       if (welcomeMessage) {
//         welcomeMessage.textContent = `Welcome! ${userData.firstName || 'User'}`;
//       }
//       // Load profile image
//       if (profileImgHeader) {
//           profileImgHeader.src = userData.profileImageUrl || '0.png';
//       }
//     } else {
//       console.log("No such user document!");
//     }
//   }).catch((error) => {
//     console.log("Error getting user document:", error);
//   });

//   // Setup profile image upload
//   if (profileImgHeader && profileImageUploadHeader) {
//     profileImgHeader.addEventListener('click', () => profileImageUploadHeader.click());
//     profileImageUploadHeader.addEventListener('change', (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const storageRef = storage.ref(`profile_images/${user.uid}/${file.name}`);
//         const uploadTask = storageRef.put(file);

//         uploadTask.on('state_changed',
//             (snapshot) => { /* Handle progress */ },
//             (error) => { console.error("Upload failed:", error); },
//             () => {
//                 // Upload complete
//                 uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//                     // Update Firestore
//                     userDocRef.update({ profileImageUrl: downloadURL });
//                     // Update image on page
//                     profileImgHeader.src = downloadURL;
//                 });
//             }
//         );
//     });
//   }
  
//   // Setup logout button
//   if (logoutBtn) {
//       logoutBtn.addEventListener('click', logoutUser);
//   }
  
//   // Setup export button
//   if (exportBtn) {
//       exportBtn.addEventListener('click', () => {
//           if (currentUser) {
//               exportAsPDF(allReadings, currentUser);
//           } else {
//               alert('Please sign in to export.');
//           }
//       });
//   }

//   // Load readings (real-time)
//   db.collection('readings')
//     .where('userId', '==', user.uid)
//     .orderBy('timestamp', 'desc')
//     .onSnapshot((querySnapshot) => {
//       allReadings = [];
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         allReadings.push({
//           id: doc.id,
//           ...data,
//           timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
//         });
//       });
      
//       // Update all parts of the dashboard
//       updateDashboardUI(allReadings);
      
//     }, (error) => {
//       console.error("Error getting readings: ", error);
//     });
// }

// // 3. UPDATE UI ELEMENTS
// function updateDashboardUI(readings) {
//   updateLatestReading(readings);
//   updateMetrics(readings);
//   updateRecentReadingsList(readings);
//   renderSugarChart(readings);
// }

// function updateLatestReading(readings) {
//   const latestValue = document.getElementById('latest-reading-value');
//   const latestStatus = document.getElementById('latest-reading-status');
//   const latestTime = document.getElementById('latest-reading-time');

//   if (readings.length > 0) {
//     const latest = readings[0];
//     const glucose = latest.glucose;
    
//     latestValue.textContent = glucose || '--';
    
//     const statusClass = getStatusClass(glucose);
//     latestStatus.className = `status ${statusClass}`;
//     latestStatus.innerHTML = `<i class="fas fa-circle"></i> ${getStatusText(glucose)}`;

//     const readingDate = new Date(latest.timestamp);
//     latestTime.textContent = readingDate.toLocaleString('en-US', {
//         month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
//     });

//   } else {
//     latestValue.textContent = '--';
//     latestStatus.className = 'status';
//     latestStatus.innerHTML = '<i class="fas fa-circle"></i> --';
//     latestTime.textContent = 'No readings yet';
//   }
// }

// function updateMetrics(readings) {
//   const weeklyAvg = document.getElementById('weekly-avg-value');
//   const timeInRange = document.getElementById('time-in-range-value');
//   const avgDisplay = document.getElementById('avg-display');

//   if (readings.length > 0) {
//     const now = new Date();
//     const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

//     const weeklyReadings = readings.filter(r => r.timestamp >= oneWeekAgo);
//     const dailyReadings = readings.filter(r => r.timestamp >= oneDayAgo);

//     // Weekly Average
//     if (weeklyReadings.length > 0) {
//       const weeklySum = weeklyReadings.reduce((acc, r) => acc + r.glucose, 0);
//       weeklyAvg.textContent = (weeklySum / weeklyReadings.length).toFixed(0);
//     } else {
//       weeklyAvg.textContent = '--';
//     }

//     // 24-Hour Average
//     if (dailyReadings.length > 0) {
//       const dailySum = dailyReadings.reduce((acc, r) => acc + r.glucose, 0);
//       avgDisplay.innerHTML = `${(dailySum / dailyReadings.length).toFixed(0)} <span class="unit">mg/dL Avg.</span>`;
//     } else {
//       avgDisplay.innerHTML = '-- <span class="unit">mg/dL Avg.</span>';
//     }

//     // Time in Range (based on all readings)
//     const inRangeReadings = readings.filter(r => r.glucose >= 70 && r.glucose <= 180).length;
//     timeInRange.textContent = ((inRangeReadings / readings.length) * 100).toFixed(0);

//   } else {
//     weeklyAvg.textContent = '--';
//     timeInRange.textContent = '--';
//     avgDisplay.innerHTML = '-- <span class="unit">mg/dL Avg.</span>';
//   }
// }

// function updateRecentReadingsList(readings) {
//     const listContainer = document.querySelector('.history-list-container');
//     if (!listContainer) return;

//     // Clear existing readings (but not the 'View All' button)
//     const existingItems = listContainer.querySelectorAll('.history-item2');
//     existingItems.forEach(item => item.remove());

//     const viewAllButton = listContainer.querySelector('.view-text-button');
    
//     const recent = readings.slice(0, 3); // Get 3 most recent

//     if (recent.length === 0) {
//          const noReadingItem = document.createElement('div');
//          noReadingItem.className = 'history-item2';
//          noReadingItem.innerHTML = `<div class="details">No readings found.</div>`;
//          listContainer.prepend(noReadingItem); // Add before the button
//     } else {
//         recent.forEach(reading => {
//             const item = document.createElement('div');
//             item.className = 'history-item2';
            
//             const glucose = reading.glucose;
//             const statusClass = getStatusClass(glucose);
//             const readingDate = new Date(reading.timestamp);
            
//             item.innerHTML = `
//                 <div class="details status ${statusClass}">
//                     ${glucose} <span class="unit" style="font-size: 1.1rem;">mg/dL</span>
//                     <span>${reading.comment || 'No comment'}</span>
//                 </div>
//                 <div class="time">
//                     ${formatTime12Hour(reading.time)}
//                     <span>${readingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
//                 </div>
//             `;
//             listContainer.prepend(item); // Add before the button
//         });
//     }
// }


// // 4. RENDER CHART
// function renderSugarChart(readings) {
//   const ctx = document.getElementById('sugar-chart');
//   if (!ctx) return;

//   const now = new Date();
//   const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

//   // Filter for last 24 hours and reverse to show oldest to newest
//   const chartData = readings
//     .filter(r => r.timestamp >= oneDayAgo)
//     .map(r => ({ x: r.timestamp, y: r.glucose }))
//     .reverse();

//   if (sugarChart) {
//     sugarChart.data.labels = chartData.map(d => d.x);
//     sugarChart.data.datasets[0].data = chartData.map(d => d.y);
//     sugarChart.update();
//   } else {
//     sugarChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: chartData.map(d => d.x),
//         datasets: [{
//           label: 'Glucose',
//           data: chartData.map(d => d.y),
//           borderColor: 'rgb(59, 130, 246)',
//           backgroundColor: 'rgba(59, 130, 246, 0.1)',
//           borderWidth: 2,
//           fill: true,
//           tension: 0.3,
//           pointRadius: 4,
//           pointBackgroundColor: 'rgb(59, 130, 246)',
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           x: {
//             type: 'time',
//             time: {
//               unit: 'hour',
//               tooltipFormat: 'MMM d, h:mm a',
//               displayFormats: {
//                 hour: 'h a'
//               }
//             },
//             grid: {
//               display: false
//             }
//           },
//           y: {
//             beginAtZero: true,
//             title: {
//               display: true,
//               text: 'mg/dL'
//             }
//           }
//         },
//         plugins: {
//           legend: {
//             display: false
//           }
//         }
//       }
//     });
//   }
// }

// // 5. PDF EXPORT
// // (Adapted from script.js, requires jspdf and html2canvas)

// // === Put your Arabic font here ===
// const JannaBoldBase64 = `AAEAAAAWAQA...`; // Truncated for brevity, paste your full font string here

// function exportAsPDF(readings, currentUser) {
//     if (typeof jsPDF === 'undefined') {
//         console.error("jsPDF not loaded");
//         alert("Error: PDF library not loaded.");
//         return;
//     }
//     const { jsPDF } = window.jspdf;
//     const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4'
//     });

//     // Detect Arabic text
//     const containsArabic = readings.some(r =>
//         /[\u0600-\u06FF]/.test(r.comment || '') ||
//         /[\u0600-\u06FF]/.test(r.glucose?.toString() || '')
//     );
//     const isRTL = containsArabic;
//     let fontName = 'helvetica'; // Default font

//     // Load Arabic font if needed
//     if (isRTL) {
//         if (JannaBoldBase64.length < 200) { 
//             console.warn('Arabic font data not provided.');
//         } else {
//             try {
//                 pdf.addFileToVFS('JannaLTBold.ttf', JannaBoldBase64);
//                 pdf.addFont('JannaLTBold.ttf', 'Janna', 'normal');
//                 fontName = 'Janna';
//             } catch (e) {
//                 console.error("Error loading Arabic font:", e);
//             }
//         }
//     }
//     pdf.setFont(fontName);

//     // Branding
//     const websiteName = 'SugarTrack.com';
//     const websiteURL = 'https://sugartrack.example.com'; // Replace with your URL
//     pdf.setFontSize(22);
//     pdf.text(websiteName, 10, 18, { align: 'left' });
//     pdf.setFontSize(10);
//     pdf.setTextColor(0, 0, 255);
//     pdf.textWithLink(websiteURL, 10, 24, { url: websiteURL });
//     pdf.setTextColor(0, 0, 0);

//     // Get user full name from Firestore
//     db.collection('users').doc(currentUser.uid).get()
//         .then((docSnap) => {
//             const userData = docSnap.exists ? docSnap.data() : { firstName: 'User', lastName: '' };
//             const fullName = `${userData.firstName} ${userData.lastName}`.trim();

//             const pageWidth = pdf.internal.pageSize.getWidth();
//             let y = 40;

//             pdf.setFontSize(16);
//             pdf.setFont(fontName, 'bold');
//             pdf.text(`Glucose Readings - ${fullName}`, pageWidth / 2, y, { align: 'center' });
//             y += 10;

//             pdf.setFontSize(10);
//             pdf.setFont(fontName, 'normal');
//             pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
//             y += 15;

//             // Table
//             const headers = ['Date', 'Time', 'Glucose (mg/dL)', 'Comment'];
//             const columnWidths = [40, 30, 40, 80];
//             const rowHeight = 8;

//             pdf.setFont(fontName, 'bold');
//             pdf.setFillColor(37, 99, 235); // Blue
//             pdf.setTextColor(255, 255, 255); // White
//             pdf.rect(10, y, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
            
//             let x = 10;
//             headers.forEach((header, i) => {
//                 const centerX = x + columnWidths[i] / 2;
//                 const align = isRTL && i === headers.length - 1 ? 'right' : 'center';
//                 const textX = align === 'center' ? centerX : x + (align === 'right' ? columnWidths[i] - 2 : 2);
//                 pdf.text(header, textX, y + 6, { align: align });
//                 x += columnWidths[i];
//             });
//             y += rowHeight;

//             pdf.setFont(fontName, 'normal');
//             pdf.setTextColor(0, 0, 0);

//             // Sort readings from oldest to newest for the PDF
//             const sortedReadings = [...readings].reverse();

//             sortedReadings.forEach((reading) => {
//                 const formattedTime = formatTime12Hour(reading.time);
//                 const rowData = [
//                     reading.date,
//                     formattedTime,
//                     reading.glucose.toString(),
//                     reading.comment || ''
//                 ];

//                 if (y > 270) {
//                     pdf.addPage();
//                     y = 20;
//                     // Redraw header
//                     pdf.setFont(fontName, 'bold');
//                     pdf.setFillColor(37, 99, 235);
//                     pdf.setTextColor(255, 255, 255);
//                     pdf.rect(10, y, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
//                     let xHeader = 10;
//                     headers.forEach((header, i) => {
//                         const centerX = xHeader + columnWidths[i] / 2;
//                         const align = isRTL && i === headers.length - 1 ? 'right' : 'center';
//                         const textX = align === 'center' ? centerX : xHeader + (align === 'right' ? columnWidths[i] - 2 : 2);
//                         pdf.text(header, textX, y + 6, { align: align });
//                         xHeader += columnWidths[i];
//                     });
//                     y += rowHeight;
//                     pdf.setFont(fontName, 'normal');
//                     pdf.setTextColor(0, 0, 0);
//                 }

//                 let xData = 10;
//                 rowData.forEach((cell, i) => {
//                     const align = (isRTL && i === rowData.length - 1) ? 'right' : 'left';
//                     const textX = xData + (align === 'right' ? columnWidths[i] - 2 : 2);
//                     pdf.text(cell.toString(), textX, y + 6, { align: align });
//                     xData += columnWidths[i];
//                 });
//                 y += rowHeight;
//             });

//             pdf.save(`glucose-readings-${new Date().toISOString().split('T')[0]}.pdf`);
//         })
//         .catch((error) => {
//             console.error('Error generating PDF:', error);
//             alert('Error generating PDF. Please try again.');
//         });
// }










// script.js - Complete dashboard functionality
let sugarChart = null;
let allReadings = [];
let currentUser = null;

// CONFIG - Easy to change number of readings to display
const RECENT_READINGS_COUNT = 3; // Change to 4 if you want 4 readings

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

// Function to get status class for reading
// function getStatusClass(glucose) {
//     if (glucose < 70) return 'out-of-range';
//     if (glucose >= 70 && glucose <= 120) return 'in Range';
//     if (glucose >= 121 && glucose <= 180) return 'mid Range';
//     return 'out-of-range';
// }

// function getStatusText(glucose) {
//     if (glucose < 70) return 'Low';
//     if (glucose >= 70 && glucose <= 120) return 'In Range';
//     if (glucose >= 121 && glucose <= 180) return 'Mid Range';
//     if (glucose > 181 && glucose <= 250) return 'High';
//     return 'Very High';
// }
function getStatusClass(glucose) {
    if (glucose < 70) return 'out-of-range'; // Red for low
    if (glucose >= 70 && glucose <= 180) return 'in-range'; // Green for in range
    if (glucose > 180 && glucose <= 250) return 'mid-range'; // Orange for high
    return 'out-of-range'; // Red for very high
}

function getStatusText(glucose) {
    if (glucose < 70) return 'Low';
    if (glucose >= 70 && glucose <= 180) return 'In Range';
    if (glucose > 180 && glucose <= 250) return 'High';
    return 'Very High';
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
                welcomeMessage.textContent = `Welcome! ${userData.firstName || 'User'}`;
            }
            if (profileImgHeader) {
                profileImgHeader.src = userData.profileImage || 'images/user.png';
                // profileImgHeader.src = userData.profileImageUrl || 'images/user.png';
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
    renderSugarChart(readings);
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
        latestStatus.className = `status ${statusClass}`;
        latestStatus.innerHTML = `<i class="fas fa-circle"></i> ${getStatusText(glucose)}`;

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
            avgDisplay.innerHTML = `${Math.round(dailySum / dailyReadings.length)} <span class="unit">mg/dL Avg.</span>`;
        } else {
            avgDisplay.innerHTML = '-- <span class="unit">mg/dL Avg.</span>';
        }

        // Time in Range
        const inRangeReadings = readings.filter(r => r.glucose >= 70 && r.glucose <= 180).length;
        timeInRange.textContent = Math.round((inRangeReadings / readings.length) * 100);

    } else {
        weeklyAvg.textContent = '--';
        timeInRange.textContent = '--';
        avgDisplay.innerHTML = '-- <span class="unit">mg/dL Avg.</span>';
    }
}

function updateRecentReadingsList(readings) {
    const listContainer = document.querySelector('.history-list-container');
    if (!listContainer) return;

    // Clear existing readings (but not the 'View All' button)
    const existingItems = listContainer.querySelectorAll('.history-item2');
    existingItems.forEach(item => item.remove());

    const recent = readings.slice(0, RECENT_READINGS_COUNT); // Use configurable count

    if (recent.length === 0) {
        const noReadingItem = document.createElement('div');
        noReadingItem.className = 'history-item2';
        noReadingItem.innerHTML = `<div class="details">No readings found.</div>`;
        listContainer.prepend(noReadingItem);
    } else {
        recent.forEach(reading => {
            const item = document.createElement('div');
            item.className = 'history-item2';
            
            const glucose = reading.glucose;
            const statusClass = getStatusClass(glucose);
            const readingDate = new Date(reading.timestamp);
            
            item.innerHTML = `
                <div class="details status ${statusClass}">
                    ${glucose} <span class="unit" style="font-size: 1.1rem;">mg/dL</span>
                    <span>${reading.comment || 'No comment'}</span>
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

// 5. CHART.JS RENDERING
function renderSugarChart(readings) {
    const ctx = document.getElementById('sugar-chart');
    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Filter for last 24 hours
    const chartData = readings
        .filter(r => r.timestamp >= oneDayAgo)
        .map(r => ({ 
            x: r.timestamp, 
            y: r.glucose 
        }))
        .sort((a, b) => a.x - b.x); // Sort by timestamp

    if (sugarChart) {
        sugarChart.destroy();
    }

    sugarChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Glucose Level',
                data: chartData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'HH:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Glucose (mg/dL)'
                    },
                    suggestedMin: 50,
                    suggestedMax: 300
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Glucose: ${context.parsed.y} mg/dL`;
                        }
                    }
                }
            }
        }
    });
}

// 6. ADD READING MODAL FUNCTIONS
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
            const recentReadings = allReadings.slice(0, 10); // Last 10 readings

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















// 5. CHART.JS RENDERING - ENHANCED VERSION
function renderSugarChart(readings) {
    const ctx = document.getElementById('sugar-chart');
    const noDataElement = document.getElementById('chart-no-data');
    
    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Filter for last 24 hours and sort by timestamp
    const chartData = readings
        .filter(r => {
            const readingTime = r.timestamp;
            return readingTime >= oneDayAgo;
        })
        .map(r => ({ 
            x: r.timestamp, 
            y: r.glucose 
        }))
        .sort((a, b) => a.x - b.x);

    console.log('Chart data for last 24 hours:', chartData);

    // Show/hide no data message
    if (chartData.length === 0) {
        if (noDataElement) noDataElement.style.display = 'flex';
        if (sugarChart) {
            sugarChart.destroy();
            sugarChart = null;
        }
        return;
    } else {
        if (noDataElement) noDataElement.style.display = 'none';
    }

    // Destroy existing chart if it exists
    if (sugarChart) {
        sugarChart.destroy();
    }

    // Create gradient for chart area
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

    // Create new chart
    sugarChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Glucose Level',
                data: chartData,
                borderColor: '#3b82f6',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                segment: {
                    borderColor: ctx => {
                        const value = ctx.p0.parsed.y;
                        if (value < 70) return '#ef4444'; // Red for low
                        if (value > 180) return '#f59e0b'; // Orange for high
                        return '#10b981'; // Green for in range
                    }
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'h:mm a'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time',
                        color: 'var(--text-color)',
                        font: {
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'var(--border-color)'
                    },
                    ticks: {
                        color: 'var(--text-color)',
                        maxTicksLimit: 6
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Glucose (mg/dL)',
                        color: 'var(--text-color)',
                        font: {
                            weight: '600'
                        }
                    },
                    suggestedMin: Math.max(40, Math.min(...chartData.map(d => d.y)) - 20),
                    suggestedMax: Math.min(400, Math.max(...chartData.map(d => d.y)) + 20),
                    grid: {
                        color: 'var(--border-color)'
                    },
                    ticks: {
                        color: 'var(--text-color)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'var(--card-bg)',
                    titleColor: 'var(--text-color)',
                    bodyColor: 'var(--text-color)',
                    borderColor: 'var(--border-color)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            let status = '';
                            if (value < 70) status = ' (Low)';
                            else if (value > 180) status = ' (High)';
                            else status = ' (In Range)';
                            
                            return `Glucose: ${value} mg/dL${status}`;
                        },
                        title: function(context) {
                            return new Date(context[0].parsed.x).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                line: {
                    cubicInterpolationMode: 'monotone'
                }
            }
        }
    });
}








