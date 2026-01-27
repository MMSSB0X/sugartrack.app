// // charts.js - Improved with better data handling

// class SugarTrackCharts {
//     constructor() {
//         this.charts = {};
//         this.currentChartType = 'line';
//         this.colors = {
//             primary: '#3b82f6',
//             success: '#10b981',
//             warning: '#f59e0b',
//             danger: '#ef4444',
//             grid: 'rgba(0, 0, 0, 0.1)',
//             text: 'var(--text-color)'
//         };
        
//         this.init();
//     }

//     init() {
//         this.setupChartSwitcher();
//         this.updateColorsFromCSS();
//         console.log('SugarTrack Charts initialized');
//     }

//     updateColorsFromCSS() {
//         try {
//             const style = getComputedStyle(document.documentElement);
//             this.colors.text = style.getPropertyValue('--text-color').trim() || '#000000';
//             this.colors.grid = style.getPropertyValue('--border-color').trim() || 'rgba(0, 0, 0, 0.1)';
//         } catch (error) {
//             console.warn('Could not update colors from CSS:', error);
//         }
//     }

//     setupChartSwitcher() {
//         const switcher = document.querySelector('.chart-switcher');
//         if (!switcher) {
//             console.warn('Chart switcher not found');
//             return;
//         }

//         switcher.addEventListener('click', (e) => {
//             if (e.target.classList.contains('chart-btn') || e.target.closest('.chart-btn')) {
//                 const btn = e.target.classList.contains('chart-btn') ? e.target : e.target.closest('.chart-btn');
//                 const chartType = btn.dataset.chart;
                
//                 document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
//                 btn.classList.add('active');
                
//                 this.switchChartType(chartType);
//             }
//         });
//     }

//     switchChartType(type) {
//         console.log('Switching to chart type:', type);
//         this.currentChartType = type;
//         if (this.charts.main) {
//             this.destroyChart('main');
//         }
        
//         // Re-render chart with new type if we have data
//         if (window.allReadings && window.allReadings.length > 0) {
//             this.renderMainChart(window.allReadings);
//         } else {
//             console.log('No data available for chart rendering');
//         }
//     }

//     // Main function to update all charts
//     updateAllCharts(readings) {
//         console.log('updateAllCharts called with', readings ? readings.length : 0, 'readings');
//         this.renderMainChart(readings);
//     }

//     renderMainChart(readings) {
//         const ctx = document.getElementById('sugar-chart');
//         const noDataElement = document.getElementById('chart-no-data');
        
//         if (!ctx) {
//             console.error('Chart canvas not found');
//             return;
//         }

//         // Validate readings data
//         if (!readings || !Array.isArray(readings) || readings.length === 0) {
//             console.log('No readings data available, showing no data message');
//             if (noDataElement) noDataElement.style.display = 'flex';
//             if (this.charts.main) this.destroyChart('main');
//             return;
//         }

//         // Validate that readings have required fields
//         const validReadings = readings.filter(r => 
//             r && 
//             typeof r.glucose === 'number' && 
//             r.timestamp && 
//             !isNaN(new Date(r.timestamp).getTime())
//         );

//         if (validReadings.length === 0) {
//             console.warn('No valid readings found for chart');
//             if (noDataElement) noDataElement.style.display = 'flex';
//             if (this.charts.main) this.destroyChart('main');
//             return;
//         }

//         console.log('Rendering chart with', validReadings.length, 'valid readings');

//         // Show/hide no data message
//         if (noDataElement) noDataElement.style.display = 'none';

//         // Prepare data based on chart type
//         let chartData;
//         try {
//             switch (this.currentChartType) {
//                 case 'bar':
//                     chartData = this.prepareBarChartData(validReadings);
//                     break;
//                 case 'weekly':
//                     chartData = this.prepareWeeklyChartData(validReadings);
//                     break;
//                 case 'line':
//                 default:
//                     chartData = this.prepareLineChartData(validReadings);
//                     break;
//             }
//         } catch (error) {
//             console.error('Error preparing chart data:', error);
//             return;
//         }

//         // Destroy existing chart
//         if (this.charts.main) {
//             this.destroyChart('main');
//         }

//         // Create new chart
//         try {
//             this.charts.main = new Chart(ctx, {
//                 type: this.getChartType(),
//                 data: chartData,
//                 options: this.getChartOptions()
//             });
//             console.log('Chart rendered successfully');
//         } catch (error) {
//             console.error('Error creating chart:', error);
//         }
//     }

//     getChartType() {
//         switch (this.currentChartType) {
//             case 'bar': return 'bar';
//             case 'line': return 'line';
//             case 'weekly': return 'line';
//             default: return 'line';
//         }
//     }

//     prepareLineChartData(readings) {
//         const chartData = this.filterLast24Hours(readings);
        
//         console.log('Line chart data:', {
//             labels: chartData.map(r => this.formatTimeLabel(r.timestamp)),
//             dataPoints: chartData.map(r => r.glucose)
//         });
        
//         return {
//             labels: chartData.map(r => this.formatTimeLabel(r.timestamp)),
//             datasets: [{
//                 label: 'Glucose Level (mg/dL)',
//                 data: chartData.map(r => r.glucose),
//                 borderColor: this.colors.primary,
//                 backgroundColor: this.hexToRgba(this.colors.primary, 0.1),
//                 tension: 0.4,
//                 fill: true,
//                 pointBackgroundColor: chartData.map(r => this.getPointColor(r.glucose)),
//                 pointBorderColor: '#ffffff',
//                 pointBorderWidth: 2,
//                 pointRadius: 4,
//                 pointHoverRadius: 6
//             }]
//         };
//     }

//     prepareBarChartData(readings) {
//         const chartData = this.filterLast24Hours(readings);
        
//         return {
//             labels: chartData.map(r => this.formatTimeLabel(r.timestamp)),
//             datasets: [{
//                 label: 'Glucose Level (mg/dL)',
//                 data: chartData.map(r => r.glucose),
//                 backgroundColor: chartData.map(r => this.getPointColor(r.glucose)),
//                 borderColor: chartData.map(r => this.hexToRgba(this.getPointColor(r.glucose), 0.8)),
//                 borderWidth: 1,
//                 borderRadius: 4
//             }]
//         };
//     }

//     prepareWeeklyChartData(readings) {
//         const weeklyData = this.groupByDay(readings);
//         const labels = Object.keys(weeklyData);
//         const averages = Object.values(weeklyData).map(dayReadings => {
//             const avg = dayReadings.reduce((sum, r) => sum + r.glucose, 0) / dayReadings.length;
//             return Math.round(avg * 10) / 10; // Round to 1 decimal place
//         });
        
//         console.log('Weekly chart data:', { labels, averages });
        
//         return {
//             labels: labels,
//             datasets: [{
//                 label: 'Daily Average (mg/dL)',
//                 data: averages,
//                 borderColor: this.colors.primary,
//                 backgroundColor: this.hexToRgba(this.colors.primary, 0.1),
//                 tension: 0.4,
//                 fill: true
//             }]
//         };
//     }

//     getChartOptions() {
//         const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
//         const textColor = isDarkMode ? '#ffffff' : '#000000';
//         const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

//         return {
//             responsive: true,
//             maintainAspectRatio: false,
//             interaction: {
//                 intersect: false,
//                 mode: 'index'
//             },
//             plugins: {
//                 legend: {
//                     display: false
//                 },
//                 tooltip: {
//                     backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
//                     titleColor: textColor,
//                     bodyColor: textColor,
//                     borderColor: gridColor,
//                     borderWidth: 1,
//                     callbacks: {
//                         label: function(context) {
//                             return `Glucose: ${context.parsed.y} mg/dL`;
//                         }
//                     }
//                 }
//             },
//             scales: {
//                 x: {
//                     grid: {
//                         color: gridColor
//                     },
//                     ticks: {
//                         color: textColor,
//                         maxRotation: 45
//                     }
//                 },
//                 y: {
//                     beginAtZero: false,
//                     grid: {
//                         color: gridColor
//                     },
//                     ticks: {
//                         color: textColor,
//                         callback: function(value) {
//                             return value + ' mg/dL';
//                         }
//                     },
//                     title: {
//                         display: true,
//                         text: 'Glucose Level (mg/dL)',
//                         color: textColor
//                     }
//                 }
//             }
//         };
//     }

//     // Helper methods
//     filterLast24Hours(readings) {
//         const now = new Date();
//         const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
//         const filtered = readings
//             .filter(r => {
//                 const readingDate = new Date(r.timestamp);
//                 return readingDate >= oneDayAgo;
//             })
//             .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort chronologically
        
//         console.log('Last 24 hours data:', filtered.length, 'readings');
//         return filtered;
//     }

//     groupByDay(readings) {
//         const weeklyData = {};
//         const now = new Date();
//         const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
//         const lastWeekReadings = readings.filter(r => {
//             const readingDate = new Date(r.timestamp);
//             return readingDate >= oneWeekAgo;
//         });
        
//         lastWeekReadings.forEach(reading => {
//             const date = new Date(reading.timestamp);
//             const dateKey = date.toLocaleDateString('en-US', { 
//                 weekday: 'short', 
//                 month: 'short', 
//                 day: 'numeric' 
//             });
            
//             if (!weeklyData[dateKey]) {
//                 weeklyData[dateKey] = [];
//             }
//             weeklyData[dateKey].push(reading);
//         });
        
//         // Sort by date
//         const sortedData = {};
//         Object.keys(weeklyData)
//             .sort((a, b) => new Date(a) - new Date(b))
//             .forEach(key => {
//                 sortedData[key] = weeklyData[key];
//             });
        
//         return sortedData;
//     }

//     formatTimeLabel(timestamp) {
//         try {
//             const date = new Date(timestamp);
//             return date.toLocaleTimeString('en-US', { 
//                 hour: '2-digit', 
//                 minute: '2-digit',
//                 hour12: true 
//             });
//         } catch (error) {
//             console.warn('Error formatting time label:', error);
//             return 'Invalid Time';
//         }
//     }

//     getPointColor(glucose) {
//         if (glucose < 70) return this.colors.danger;      // Low - Red
//         if (glucose <= 130) return this.colors.success;   // In Range - Green
//         if (glucose <= 180) return this.colors.warning;   // High - Orange
//         return this.colors.danger;                        // Very High - Red
//     }

//     hexToRgba(hex, alpha) {
//         try {
//             const r = parseInt(hex.slice(1, 3), 16);
//             const g = parseInt(hex.slice(3, 5), 16);
//             const b = parseInt(hex.slice(5, 7), 16);
//             return `rgba(${r}, ${g}, ${b}, ${alpha})`;
//         } catch (error) {
//             console.warn('Error converting hex to rgba:', error);
//             return `rgba(59, 130, 246, ${alpha})`; // Fallback to primary blue
//         }
//     }

//     destroyChart(name) {
//         if (this.charts[name]) {
//             this.charts[name].destroy();
//             delete this.charts[name];
//         }
//     }

//     destroy() {
//         Object.keys(this.charts).forEach(name => this.destroyChart(name));
//     }
// }

// // Initialize charts when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('DOM loaded, initializing charts...');
//     window.chartFunctions = new SugarTrackCharts();
    
//     // If data is already available, render charts immediately
//     if (window.allReadings && window.allReadings.length > 0) {
//         console.log('Data already available, rendering initial charts');
//         window.chartFunctions.updateAllCharts(window.allReadings);
//     }
    
//     // Update charts when theme changes
//     const observer = new MutationObserver(function(mutations) {
//         mutations.forEach(function(mutation) {
//             if (mutation.attributeName === 'data-theme') {
//                 console.log('Theme changed, updating charts');
//                 window.chartFunctions.updateColorsFromCSS();
//                 if (window.allReadings && window.allReadings.length > 0) {
//                     window.chartFunctions.updateAllCharts(window.allReadings);
//                 }
//             }
//         });
//     });
    
//     observer.observe(document.documentElement, {
//         attributes: true
//     });
// });










// charts.js - Fixed responsive design with new features

class SugarTrackCharts {
    constructor() {
        this.charts = {};
        this.currentChartType = 'weekly';
        this.colors = {
            primary: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            grid: 'rgba(0, 0, 0, 0.1)',
            text: 'var(--text-color)',
            background: 'var(--card-bg)'
        };
        
        this.init();
    }

    init() {
        this.setupChartSwitcher();
        this.updateColorsFromCSS();
        this.setupResponsiveHandling();
        console.log('SugarTrack Charts initialized');
    }

    setupResponsiveHandling() {
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.charts.main) {
                    this.charts.main.resize();
                }
            }, 250);
        });

        // Handle theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.handleThemeChange();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    }

    handleThemeChange() {
        this.updateColorsFromCSS();
        if (this.charts.main && window.allReadings && window.allReadings.length > 0) {
            // Recreate chart with new colors
            this.destroyChart('main');
            setTimeout(() => this.renderMainChart(window.allReadings), 100);
        }
    }

    updateColorsFromCSS() {
        try {
            const style = getComputedStyle(document.documentElement);
            this.colors.text = style.getPropertyValue('--text-color').trim() || '#000000';
            this.colors.grid = style.getPropertyValue('--border-color').trim() || 'rgba(0, 0, 0, 0.1)';
            this.colors.background = style.getPropertyValue('--card-bg').trim() || '#ffffff';
        } catch (error) {
            console.warn('Could not update colors from CSS:', error);
        }
    }

    setupChartSwitcher() {
        const switcher = document.querySelector('.chart-switcher');
        if (!switcher) {
            console.warn('Chart switcher not found');
            return;
        }

        switcher.addEventListener('click', (e) => {
            const btn = e.target.closest('.chart-btn');
            if (btn) {
                const chartType = btn.dataset.chart;
                
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.switchChartType(chartType);
            }
        });
    }

    switchChartType(type) {
        console.log('Switching to chart type:', type);
        this.currentChartType = type;
        
        if (this.charts.main) {
            this.destroyChart('main');
        }
        
        if (window.allReadings && window.allReadings.length > 0) {
            setTimeout(() => this.renderMainChart(window.allReadings), 50);
        }
    }

    updateAllCharts(readings) {
        console.log('updateAllCharts called with', readings ? readings.length : 0, 'readings');
        this.renderMainChart(readings);
    }

    renderMainChart(readings) {
        const ctx = document.getElementById('sugar-chart');
        const noDataElement = document.getElementById('chart-no-data');
        
        if (!ctx) {
            console.error('Chart canvas not found');
            return;
        }

        // Clear any existing error states
        ctx.style.display = 'block';
        if (noDataElement) noDataElement.style.display = 'none';

        // Validate data
        if (!this.hasValidData(readings)) {
            this.showNoDataMessage();
            return;
        }

        try {
            const chartData = this.prepareChartData(readings);
            const options = this.getChartOptions();

            // Destroy existing chart
            if (this.charts.main) {
                this.destroyChart('main');
            }

            // Create new chart
            this.charts.main = new Chart(ctx, {
                type: this.getChartType(),
                data: chartData,
                options: options,
                plugins: this.getChartPlugins()
            });

            console.log('Chart rendered successfully:', this.currentChartType);

        } catch (error) {
            console.error('Error rendering chart:', error);
            this.showNoDataMessage();
        }
    }

    hasValidData(readings) {
        return readings && 
               Array.isArray(readings) && 
               readings.length > 0 &&
               readings.some(r => r && typeof r.glucose === 'number' && r.timestamp);
    }

    showNoDataMessage() {
        const noDataElement = document.getElementById('chart-no-data');
        const ctx = document.getElementById('sugar-chart');
        
        if (noDataElement) noDataElement.style.display = 'flex';
        if (ctx) ctx.style.display = 'none';
        if (this.charts.main) this.destroyChart('main');
    }

    getChartType() {
        const types = {
            'line': 'line',
            'bar': 'bar',
            'weekly': 'line'
        };
        return types[this.currentChartType] || 'line';
    }

    prepareChartData(readings) {
        const validReadings = readings.filter(r => 
            r && typeof r.glucose === 'number' && r.timestamp
        );

        switch (this.currentChartType) {
            case 'bar':
                return this.prepareBarChartData(validReadings);
            case 'weekly':
                return this.prepareWeeklyChartData(validReadings);
            case 'line':
            default:
                return this.prepareLineChartData(validReadings);
        }
    }

    // NEW: Enhanced Line Chart with multiple features
    prepareLineChartData(readings) {
        const chartData = this.filterLast24Hours(readings);
        const glucoseLevels = chartData.map(r => r.glucose);
        
        return {
            labels: chartData.map(r => this.formatTimeLabel(r.timestamp)),
            datasets: [
                {
                    label: 'Glucose Level',
                    data: glucoseLevels,
                    borderColor: this.colors.primary,
                    backgroundColor: this.hexToRgba(this.colors.primary, 0.1),
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: chartData.map(r => this.getPointColor(r.glucose)),
                    pointBorderColor: this.colors.background,
                    pointBorderWidth: 2,
                    pointRadius: this.getPointRadius(chartData.length),
                    pointHoverRadius: 6,
                    segment: {
                        borderColor: ctx => this.getSegmentColor(ctx, glucoseLevels),
                    }
                },
                // NEW: Average line
                {
                    label: 'Target Range',
                    data: chartData.map(() => 100),
                    borderColor: this.hexToRgba(this.colors.success, 0.5),
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        };
    }

    // NEW: Enhanced Bar Chart with grouping
    prepareBarChartData(readings) {
        const chartData = this.filterLast24Hours(readings);
        const timeRanges = this.groupByTimeRanges(chartData);
        
        return {
            labels: Object.keys(timeRanges),
            datasets: [
                {
                    label: 'Average Glucose',
                    data: Object.values(timeRanges).map(readings => {
                        const avg = readings.reduce((sum, r) => sum + r.glucose, 0) / readings.length;
                        return Math.round(avg);
                    }),
                    backgroundColor: Object.values(timeRanges).map(readings => {
                        const avg = readings.reduce((sum, r) => sum + r.glucose, 0) / readings.length;
                        return this.getPointColor(avg);
                    }),
                    borderColor: Object.values(timeRanges).map(readings => {
                        const avg = readings.reduce((sum, r) => sum + r.glucose, 0) / readings.length;
                        return this.hexToRgba(this.getPointColor(avg), 0.8);
                    }),
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        };
    }

    // NEW: Enhanced Weekly Chart with trends
    prepareWeeklyChartData(readings) {
        const weeklyData = this.groupByDay(readings);
        const labels = Object.keys(weeklyData);
        const averages = Object.values(weeklyData).map(dayReadings => {
            const avg = dayReadings.reduce((sum, r) => sum + r.glucose, 0) / dayReadings.length;
            return Math.round(avg * 10) / 10;
        });

        // Calculate trend
        const trend = this.calculateTrend(averages);
        
        return {
            labels: labels,
            datasets: [
                {
                    label: 'Daily Average',
                    data: averages,
                    borderColor: this.colors.primary,
                    backgroundColor: this.hexToRgba(this.colors.primary, 0.1),
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: averages.map(avg => this.getPointColor(avg)),
                    pointBorderColor: this.colors.background,
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                // NEW: Trend line
                {
                    label: 'Trend',
                    data: this.calculateTrendLine(averages),
                    borderColor: this.hexToRgba(trend.color, 0.7),
                    borderWidth: 2,
                    borderDash: [4, 4],
                    pointRadius: 0,
                    fill: false
                }
            ]
        };
    }

    getChartOptions() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = this.colors.text;
        const gridColor = this.colors.grid;
        const fontSize = window.innerWidth < 768 ? 10 : 12;

        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: this.currentChartType === 'weekly',
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            size: fontSize,
                            family: "'Inter', sans-serif"
                        },
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: this.colors.background,
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: gridColor,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    titleFont: {
                        family: "'Inter', sans-serif",
                        size: fontSize
                    },
                    bodyFont: {
                        family: "'Inter', sans-serif", 
                        size: fontSize
                    },
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += `${context.parsed.y} mg/dL`;
                            return label;
                        }
                    }
                },
                // NEW: Chart title with statistics
                title: {
                    display: true,
                    text: this.getChartTitle(),
                    color: textColor,
                    font: {
                        size: fontSize + 2,
                        family: "'Inter', sans-serif",
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 15
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: fontSize,
                            family: "'Inter', sans-serif"
                        },
                        maxRotation: 45,
                        padding: 5
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: fontSize,
                            family: "'Inter', sans-serif"
                        },
                        padding: 8,
                        callback: (value) => `${value} mg/dL`
                    },
                    title: {
                        display: true,
                        text: 'Glucose Level (mg/dL)',
                        color: textColor,
                        font: {
                            size: fontSize,
                            family: "'Inter', sans-serif",
                            weight: 'bold'
                        }
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 2
                },
                point: {
                    hoverRadius: 8
                }
            }
        };

        // Chart-specific adjustments
        if (this.currentChartType === 'bar') {
            baseOptions.scales.x.offset = true;
            baseOptions.barPercentage = 0.6;
            baseOptions.categoryPercentage = 0.8;
        }

        return baseOptions;
    }

    getChartPlugins() {
        // NEW: Custom plugin for range annotations
        return [{
            id: 'rangeAnnotations',
            afterDraw: (chart) => {
                this.drawRangeAnnotations(chart);
            }
        }];
    }

    // NEW: Draw range annotations
    drawRangeAnnotations(chart) {
        const ctx = chart.ctx;
        const yScale = chart.scales.y;
        const chartArea = chart.chartArea;
        
        // Draw target range (70-180 mg/dL)
        const rangeTop = yScale.getPixelForValue(180);
        const rangeBottom = yScale.getPixelForValue(70);
        
        ctx.save();
        ctx.fillStyle = this.hexToRgba(this.colors.success, 0.1);
        // ctx.fillRect(chartArea.left, rangeTop, chartArea.right - chartArea.left, rangeBottom - rangeTop);
        
        ctx.strokeStyle = this.hexToRgba(this.colors.success, 0.3);
        ctx.setLineDash([5, 3]);
        ctx.lineWidth = 1;
        // ctx.strokeRect(chartArea.left, rangeTop, chartArea.right - chartArea.left, rangeBottom - rangeTop);
        ctx.restore();
    }

    // NEW: Helper methods for enhanced features
    getPointRadius(dataLength) {
        if (dataLength > 20) return 3;
        if (dataLength > 10) return 4;
        return 5;
    }

    getSegmentColor(ctx, data) {
        const value = data[ctx.p0DataIndex];
        return this.getPointColor(value);
    }

    groupByTimeRanges(readings) {
        const ranges = {
            'Morning\n(6AM-12PM)': [],
            'Afternoon\n(12PM-6PM)': [], 
            'Evening\n(6PM-12AM)': [],
            'Night\n(12AM-6AM)': []
        };

        readings.forEach(reading => {
            const hour = new Date(reading.timestamp).getHours();
            if (hour >= 6 && hour < 12) ranges['Morning\n(6AM-12PM)'].push(reading);
            else if (hour >= 12 && hour < 18) ranges['Afternoon\n(12PM-6PM)'].push(reading);
            else if (hour >= 18 && hour < 24) ranges['Evening\n(6PM-12AM)'].push(reading);
            else ranges['Night\n(12AM-6AM)'].push(reading);
        });

        // Remove empty ranges
        Object.keys(ranges).forEach(key => {
            if (ranges[key].length === 0) delete ranges[key];
        });

        return ranges;
    }

    calculateTrend(data) {
        if (data.length < 2) return { direction: 'stable', color: this.colors.text };
        
        const first = data[0];
        const last = data[data.length - 1];
        const difference = last - first;
        
        if (Math.abs(difference) < 5) return { direction: 'stable', color: this.colors.text };
        if (difference > 0) return { direction: 'up', color: this.colors.danger };
        return { direction: 'down', color: this.colors.success };
    }

    calculateTrendLine(data) {
        if (data.length < 2) return data;
        
        const n = data.length;
        const x = Array.from({length: n}, (_, i) => i);
        const y = data;
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, _, i) => sum + x[i] * y[i], 0);
        const sumXX = x.reduce((sum, val) => sum + val * val, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return x.map(xi => slope * xi + intercept);
    }

    getChartTitle() {
        const titles = {
            'line': 'Last 24 Hours - Glucose Trends',
            'bar': 'Daily Patterns - Time Ranges', 
            'weekly': 'Weekly Overview - Daily Averages'
        };
        return titles[this.currentChartType] || 'Glucose Monitoring';
    }

    // Existing helper methods (keep these)
    filterLast24Hours(readings) {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        return readings
            .filter(r => new Date(r.timestamp) >= oneDayAgo)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    groupByDay(readings) {
        const weeklyData = {};
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const lastWeekReadings = readings.filter(r => new Date(r.timestamp) >= oneWeekAgo);
        
        lastWeekReadings.forEach(reading => {
            const date = new Date(reading.timestamp);
            const dateKey = date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
            if (!weeklyData[dateKey]) {
                weeklyData[dateKey] = [];
            }
            weeklyData[dateKey].push(reading);
        });
        
        // Sort by date
        const sortedData = {};
        Object.keys(weeklyData)
            .sort((a, b) => new Date(a) - new Date(b))
            .forEach(key => {
                sortedData[key] = weeklyData[key];
            });
        
        return sortedData;
    }

    formatTimeLabel(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        } catch (error) {
            return 'Invalid Time';
        }
    }

    getPointColor(glucose) {
        if (glucose < 70) return this.colors.danger;
        if (glucose <= 130) return this.colors.success;
        if (glucose <= 180) return this.colors.warning;
        return this.colors.danger;
    }

    hexToRgba(hex, alpha) {
        try {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } catch (error) {
            return `rgba(59, 130, 246, ${alpha})`;
        }
    }

    destroyChart(name) {
        if (this.charts[name]) {
            this.charts[name].destroy();
            delete this.charts[name];
        }
    }

    destroy() {
        Object.keys(this.charts).forEach(name => this.destroyChart(name));
    }
}

// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing charts...');
    window.chartFunctions = new SugarTrackCharts();
    
    // Initial render if data exists
    setTimeout(() => {
        if (window.allReadings && window.allReadings.length > 0) {
            window.chartFunctions.updateAllCharts(window.allReadings);
        }
    }, 100);
});








