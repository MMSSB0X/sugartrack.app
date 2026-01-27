// suggest.js
// AI-based Suggestions and Bar Chart for Glucose Readings

// Function to generate bar chart
function renderGlucoseBarChart(readings) {
    const container = document.getElementById('trendsChart');
    const canvas = document.getElementById('glucoseBarChart');
    const noDataEl = document.getElementById('trends-chart-no-data');
    
    if (!container || !canvas) return;

    // Clear existing chart
    if (window.barChart) {
        window.barChart.destroy();
    }

    const recentReadings = readings.slice(0, 10).reverse(); // Last 10 readings
    
    if (recentReadings.length === 0) {
        if (noDataEl) noDataEl.style.display = 'flex';
        container.style.display = 'none';
        return;
    } else {
        if (noDataEl) noDataEl.style.display = 'none';
        container.style.display = 'block';
    }
    
    const labels = recentReadings.map(r => {
        const date = new Date(r.timestamp);
        return `${date.getMonth()+1}/${date.getDate()}\n${r.time}`;
    });
    const data = recentReadings.map(r => r.glucose);
    const bgColors = data.map(val => {
        if (val >= 180) return 'rgba(239, 68, 68, 0.8)';      // High - Red
        if (val >= 130) return 'rgba(251, 191, 36, 0.8)';     // Medium - Orange
        return 'rgba(16, 185, 129, 0.8)';                     // Good - Green
    });

    const barCtx = canvas.getContext('2d');
    window.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Glucose (mg/dL)',
                data,
                backgroundColor: bgColors,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `${context.parsed.y} mg/dL`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: 'mg/dL',
                        color: 'var(--text-color)'
                    },
                    grid: {
                        color: 'var(--border-color)'
                    },
                    ticks: {
                        color: 'var(--text-color)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'var(--text-color)',
                        autoSkip: true,
                        maxRotation: 0,
                        minRotation: 0
                    }
                }
            }
        }
    });
}

// Function to analyze readings and return suggestion
function getAISuggestion(readings) {
    if (readings.length < 2) return 'Add at least two readings for suggestions.';
    const values = readings.map(r => r.glucose);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    if (avg >= 180) return '⚠️ Your average glucose is high. Consider consulting your doctor and reviewing your diet.';
    if (avg >= 130) return '⚠️ Glucose levels are in the medium range. Try to maintain a balanced lifestyle and monitor closely.';
    return '✅ Good control! Keep maintaining a healthy lifestyle.';
}

// Public function to be used from main script
function updateSuggestions(readings) {
    renderGlucoseBarChart(readings);
    const message = getAISuggestion(readings);
    const messageEl = document.getElementById('trendsMessage');
    if (messageEl) messageEl.textContent = message;
}

// Export functions for use in other files
window.suggestFunctions = {
    updateSuggestions
};