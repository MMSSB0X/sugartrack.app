// --- App State ---
const appState = {
    currentLocation: {
        latitude: 23.77,
        longitude: 90.39,
        name: ', '
    },
    settings: {
        unit: 'celsius', // 'celsius' or 'fahrenheit'
        accentColor: '#007BFF',
        is12Hour: true // NEW: Default to 12-hour
    },
    calendar: {
        currentDate: new Date()
    },
    searchDebounce: null
};

// --- DOM Elements ---
const dom = {
    // General
    body: document.body,
    sidebarNav: document.querySelector('.sidebar-nav'),
    navItems: document.querySelectorAll('.nav-item[data-page]'),
    pages: document.querySelectorAll('.page'),
    pagesContainer: document.querySelector('.pages-container'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeToggleSwitch: document.getElementById('theme-toggle-switch'),
    themeIcon: document.getElementById('theme-icon'),
    refreshButton: document.getElementById('refreshButton'),
    
    // Search
    searchInput: document.getElementById('search-input'),
    searchSuggestions: document.getElementById('search-suggestions'),

    // Widget Dashboard
    widgetClockTime: document.getElementById('widget-clock-time'),
    widgetClockDate: document.getElementById('widget-clock-date'),
    widgetWeatherLocation: document.getElementById('widget-weather-location'),
    widgetWeatherIcon: document.getElementById('widget-weather-icon'),
    widgetWeatherTemp: document.getElementById('widget-weather-temp'),
    widgetWeatherCond: document.getElementById('widget-weather-condition'),
    widgetCalendarGrid: document.getElementById('widget-calendar-grid'),
    widgetCalendarMonthYear: document.getElementById('widget-calendar-month-year'),

    // Weather Page
    greeting: document.getElementById('welcome-greeting'),
    currentDay: document.getElementById('current-day'),
    currentDate: document.getElementById('current-date'),
    locationName: document.getElementById('location-name'),
    mainWeatherIcon: document.getElementById('main-weather-icon'),
    currentTemp: document.getElementById('current-temp'),
    tempHighLow: document.getElementById('temp-high-low'),
    weatherCondition: document.getElementById('weather-condition'),
    feelsLikeTemp: document.getElementById('feels-like-temp'),
    windSpeed: document.getElementById('wind-speed'),
    humidity: document.getElementById('humidity'),
    humidityStatus: document.getElementById('humidity-status'),
    sunriseTime: document.getElementById('sunrise-time'),
    uvIndex: document.getElementById('uv-index'),
    uvStatus: document.getElementById('uv-status'),
    visibility: document.getElementById('visibility'),
    sunsetTime: document.getElementById('sunset-time'),
    forecastList: document.getElementById('forecast-list'),
    forecastHeader: document.getElementById('forecast-header'),
    
    // Full Calendar Page
    calendarMonthYear: document.getElementById('calendar-month-year'),
    prevMonthBtn: document.getElementById('prev-month-btn'),
    nextMonthBtn: document.getElementById('next-month-btn'),
    calendarGrid: document.getElementById('calendar-grid'),
    
    // Clock Page
    largeClockTime: document.getElementById('large-clock-time'),
    largeClockDate: document.getElementById('large-clock-date'),
    
    // Settings
    autoLocationToggle: document.getElementById('auto-location-toggle'),
    unitToggle: document.getElementById('unit-toggle'),
    clockFormatToggle: document.getElementById('clock-format-toggle'), // NEW
    colorSwatchesContainer: document.getElementById('color-swatches'),
    customColorInput: document.getElementById('custom-color-input'),
    customColorText: document.getElementById('custom-color-text'),
    saveColorBtn: document.getElementById('save-color-btn')
};

// --- Custom Alert Modal ---
const modalEl = document.getElementById('custom-alert-modal');
const modalTitleEl = document.getElementById('custom-alert-title');
const modalMessageEl = document.getElementById('custom-alert-message');
const modalCloseBtn = document.getElementById('custom-alert-close');

function showModal(title, message) {
    modalTitleEl.textContent = title;
    modalMessageEl.textContent = message;
    modalEl.style.display = 'block';
}

function closeModal() {
    modalEl.style.display = 'none';
}

// --- Date & Time ---
function updateDateTime() {
    const now = new Date();
    const hour = now.getHours();
    
    // NEW: Use setting for 12/24 hour format
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: appState.settings.is12Hour 
    };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    const dayOptions = { weekday: 'long' };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateOptionsLong = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    
    const dayString = now.toLocaleDateString('en-US', dayOptions);
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const dateStringLong = now.toLocaleDateString('en-US', dateOptionsLong);

    // 1. Update Greeting (Weather Page)
    if (dom.greeting) {
        if (hour < 12) dom.greeting.textContent = 'Good Morning';
        else if (hour < 18) dom.greeting.textContent = 'Good Afternoon';
        else dom.greeting.textContent = 'Good Evening';
    }

    // 2. Update Date (Weather Page)
    if (dom.currentDay) dom.currentDay.textContent = dayString;
    if (dom.currentDate) dom.currentDate.textContent = dateString;
    
    // 3. Update Widget Clock
    if (dom.widgetClockTime) dom.widgetClockTime.textContent = timeString;
    if (dom.widgetClockDate) dom.widgetClockDate.textContent = dateStringLong;
    
    // 4. Update Large Clock Page
    if (dom.largeClockTime) dom.largeClockTime.textContent = timeString;
    if (dom.largeClockDate) dom.largeClockDate.textContent = dateStringLong;
}

// --- Weather Data ---
function getWeatherIcon(code, isDay = true) {
    if ([0, 1].includes(code)) return isDay ? '#icon-sun' : '#icon-moon';
    if ([2].includes(code)) return isDay ? '#icon-cloud-sun' : '#icon-cloud-moon';
    if ([3].includes(code)) return '#icon-cloud';
    if ([45, 48].includes(code)) return '#icon-cloud'; // Fog
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return '#icon-cloud-rain';
    return '#icon-cloud'; // Default
}

function getWeatherCondition(code) {
     const weatherMap = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Rime Fog',
        51: 'Light Drizzle', 53: 'Drizzle', 55: 'Dense Drizzle',
        61: 'Slight Rain', 63: 'Rain', 65: 'Heavy Rain',
        80: 'Rain Showers', 81: 'Rain Showers', 82: 'Violent Rain Showers'
    };
    return weatherMap[code] || 'Unknown';
}

function formatTime(isoString) {
    const date = new Date(isoString);
    // NEW: Use setting for 12/24 hour format
    const options = { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: appState.settings.is12Hour 
    };
    return date.toLocaleTimeString('en-US', options);
}

function getUvStatus(uvIndex) {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
}

function getHumidityStatus(humidity) {
    if (humidity < 40) return 'Dry';
    if (humidity <= 60) return 'Good';
    return 'Humid';
}

async function fetchWeather() {
    const { latitude, longitude, name } = appState.currentLocation;
    const unit = appState.settings.unit;
    const tempUnit = unit === 'celsius' ? '°C' : '°F';
    const windUnit = unit === 'celsius' ? 'km/h' : 'mph';
    
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&temperature_unit=${unit}&wind_speed_unit=${unit === 'celsius' ? 'kmh' : 'mph'}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Weather data not found');
        const data = await response.json();
        
        const current = data.current;
        const daily = data.daily;
        const weatherIconId = getWeatherIcon(current.weather_code, current.is_day);
        const conditionText = getWeatherCondition(current.weather_code);

        // --- Update Main Weather Page ---
        if (dom.locationName) dom.locationName.textContent = name;
        if (dom.mainWeatherIcon) dom.mainWeatherIcon.innerHTML = `<use href="${weatherIconId}"></use>`;
        if (dom.currentTemp) dom.currentTemp.textContent = `${Math.round(current.temperature_2m)}${tempUnit}`;
        if (dom.tempHighLow) dom.tempHighLow.textContent = `/ ${Math.round(daily.temperature_2m_min[0])}${tempUnit}`;
        if (dom.weatherCondition) dom.weatherCondition.textContent = conditionText;
        if (dom.feelsLikeTemp) dom.feelsLikeTemp.textContent = `Feels like ${Math.round(current.apparent_temperature)}°`;

        // --- Update Today's Highlights ---
        if (dom.windSpeed) dom.windSpeed.textContent = current.wind_speed_10m.toFixed(1);
        if (dom.windSpeed) dom.windSpeed.nextElementSibling.textContent = windUnit;
        if (dom.humidity) dom.humidity.textContent = current.relative_humidity_2m;
        if (dom.humidityStatus) dom.humidityStatus.textContent = getHumidityStatus(current.relative_humidity_2m);
        if (dom.sunriseTime) dom.sunriseTime.textContent = formatTime(daily.sunrise[0]); // Updated by formatTime
        if (dom.sunsetTime) dom.sunsetTime.textContent = formatTime(daily.sunset[0]); // Updated by formatTime
        
        const uv = daily.uv_index_max[0].toFixed(0);
        if (dom.uvIndex) dom.uvIndex.textContent = uv;
        if (dom.uvStatus) dom.uvStatus.textContent = `${getUvStatus(uv)} UV`;

        const currentHour = new Date().getHours();
        const vis_km = (data.hourly.visibility[currentHour] / 1000).toFixed(0);
        const vis_miles = (data.hourly.visibility[currentHour] / 1609).toFixed(0);
        if (dom.visibility) dom.visibility.textContent = unit === 'celsius' ? vis_km : vis_miles;
        if (dom.visibility) dom.visibility.nextElementSibling.textContent = unit === 'celsius' ? 'km' : 'miles';

        // --- Update 5-Day Forecast ---
        if (dom.forecastHeader) dom.forecastHeader.textContent = `5 Day Forecast`;
        if (dom.forecastList) {
            dom.forecastList.innerHTML = ''; // Clear existing
            for (let i = 0; i < 5; i++) {
                const date = new Date(daily.time[i]);
                const day = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
                const forecastIcon = getWeatherIcon(daily.weather_code[i], true);
                const maxTemp = Math.round(daily.temperature_2m_max[i]);
                const itemHtml = `
                    <div class="forecast-item">
                        <span class="day">${day}</span>
                        <svg class="weather-icon-forecast"><use href="${forecastIcon}"></use></svg>
                        <span class="temp">${maxTemp}${tempUnit}</span>
                    </div>
                `;
                dom.forecastList.insertAdjacentHTML('beforeend', itemHtml);
            }
        }
        
        // --- NEW: Update Weather Widget ---
        if (dom.widgetWeatherLocation) dom.widgetWeatherLocation.textContent = name;
        if (dom.widgetWeatherIcon) dom.widgetWeatherIcon.innerHTML = `<use href="${weatherIconId}"></use>`;
        if (dom.widgetWeatherTemp) dom.widgetWeatherTemp.textContent = `${Math.round(current.temperature_2m)}${tempUnit}`;
        if (dom.widgetWeatherCond) dom.widgetWeatherCond.textContent = conditionText;


    } catch (error) {
        console.error('Error fetching weather:', error);
        if (dom.locationName) dom.locationName.textContent = 'Location not found';
        if (dom.widgetWeatherLocation) dom.widgetWeatherLocation.textContent = 'Location not found';
    }
}

// --- Search Functionality ---
async function getSearchSuggestions() {
    const query = dom.searchInput.value.trim();
    if (query.length < 3) {
        dom.searchSuggestions.style.display = 'none';
        return;
    }

    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`;
    
    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        
        dom.searchSuggestions.innerHTML = '';
        if (data.results && data.results.length > 0) {
            dom.searchSuggestions.style.display = 'block';
            data.results.forEach(location => {
                const name = `${location.name}, ${location.admin1 || ''} ${location.country_code}`;
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = name;
                item.addEventListener('click', () => selectSuggestion(location, name));
                dom.searchSuggestions.appendChild(item);
            });
        } else {
            dom.searchSuggestions.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function selectSuggestion(location, name) {
    appState.currentLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        name: name
    };
    // --- Save manual location ---
    localStorage.setItem('savedLocation', JSON.stringify(appState.currentLocation));
    // --- Disable auto-location when a manual one is set ---
    localStorage.removeItem('autoLocate');
    if (dom.autoLocationToggle) { // Check if element exists
        dom.autoLocationToggle.checked = false;
    }
    
    fetchWeather();
    dom.searchInput.value = '';
    dom.searchSuggestions.style.display = 'none';
    navigateToPage('weather'); // Go to weather page to see details
    // Scroll to top of page content
    dom.pagesContainer.scrollTop = 0;
}

// --- Navigation ---
function navigateToPage(pageId) {
    // Hide all pages
    dom.pages.forEach(page => page.classList.remove('active'));
    
    // Deactivate all nav items
    dom.navItems.forEach(item => item.classList.remove('active'));
    
    // Show selected page
    const newPage = document.getElementById(`page-${pageId}`);
    if (newPage) {
        newPage.classList.add('active');
    }
    
    // Activate selected nav item
    const newNavItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (newNavItem) {
        newNavItem.classList.add('active');
    }
    // Scroll to top of page content
    dom.pagesContainer.scrollTop = 0;
}

// --- Full Calendar ---
function buildCalendar() {
    // Check if calendar elements exist on the page
    if (!dom.calendarGrid || !dom.calendarMonthYear) {
        return;
    }
    
    const date = appState.calendar.currentDate;
    const year = date.getFullYear();
    const month = date.getMonth();
    
    dom.calendarMonthYear.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    dom.calendarGrid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        dom.calendarGrid.innerHTML += `<div class="calendar-cell day-name">${day}</div>`;
    });
    
    let dateCounter = 1;
    let nextMonthCounter = 1;
    
    for (let i = 0; i < 42; i++) { // 6 weeks
        let cellHtml = '';
        if (i < firstDay) {
            // Previous month
            const prevDate = daysInPrevMonth - firstDay + i + 1;
            cellHtml = `<div class="calendar-cell not-current-month"><span class="calendar-cell-date">${prevDate}</span></div>`;
        } else if (dateCounter <= daysInMonth) {
            // Current month
            const today = new Date();
            let isTodayClass = '';
            if (dateCounter === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                isTodayClass = ' is-today';
            }
            cellHtml = `<div class="calendar-cell${isTodayClass}"><span class="calendar-cell-date">${dateCounter}</span></div>`;
            dateCounter++;
        } else {
            // Next month
            cellHtml = `<div class="calendar-cell not-current-month"><span class="calendar-cell-date">${nextMonthCounter}</span></div>`;
            nextMonthCounter++;
        }
        dom.calendarGrid.innerHTML += cellHtml;
    }
}

// --- NEW: Widget Calendar ---
function buildWidgetCalendar() {
    if (!dom.widgetCalendarGrid || !dom.widgetCalendarMonthYear) {
        return;
    }
    
    const date = new Date(); // Always show current month
    const year = date.getFullYear();
    const month = date.getMonth();
    
    dom.widgetCalendarMonthYear.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    dom.widgetCalendarGrid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    dayNames.forEach(day => {
        dom.widgetCalendarGrid.innerHTML += `<div class="widget-calendar-cell day-name">${day}</div>`;
    });
    
    let dateCounter = 1;
    for (let i = 0; i < 35; i++) { // 5 weeks, good enough for a widget
        let cellHtml = '';
        if (i < firstDay) {
            cellHtml = `<div class="widget-calendar-cell"></div>`; // Empty
        } else if (dateCounter <= daysInMonth) {
            const today = new Date();
            let isTodayClass = '';
            if (dateCounter === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                isTodayClass = ' is-today';
            }
            cellHtml = `<div class="widget-calendar-cell${isTodayClass}">${dateCounter}</div>`;
            dateCounter++;
        } else {
            cellHtml = `<div class="widget-calendar-cell"></div>`; // Empty
        }
        dom.widgetCalendarGrid.innerHTML += cellHtml;
    }
}

// --- Settings ---
function handleThemeToggle(isUserClick = false) {
    const isLight = dom.themeToggleSwitch.checked;
    
    // Updated to swap Font Awesome classes
    if (isLight) {
        dom.body.classList.add('light-mode');
        dom.themeIcon.className = 'fa-solid fa-sun'; // Switched to FA
        if(isUserClick) localStorage.setItem('theme', 'light');
    } else {
        dom.body.classList.remove('light-mode');
        dom.themeIcon.className = 'fa-solid fa-moon'; // Switched to FA
        if(isUserClick) localStorage.setItem('theme', 'dark');
    }
}

function handleUnitToggle() {
    appState.settings.unit = dom.unitToggle.checked ? 'fahrenheit' : 'celsius';
    localStorage.setItem('unit', appState.settings.unit);
    fetchWeather(); // Refresh weather with new unit
}

// NEW: Handle Clock Format Toggle
function handleClockFormatToggle() {
    appState.settings.is12Hour = dom.clockFormatToggle.checked;
    localStorage.setItem('is12Hour', appState.settings.is12Hour);
    updateDateTime(); // Update all visible clocks
    fetchWeather(); // Re-fetch weather to update sunrise/sunset times
}

async function handleAutoLocationToggle() {
    if (dom.autoLocationToggle.checked) {
        if (!navigator.geolocation) {
            showModal('Error', 'Geolocation is not supported by your browser.');
            dom.autoLocationToggle.checked = false;
            return;
        }
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            
            const { latitude, longitude } = position.coords;
            
            // --- Reverse Geocode ---
            const geoApi = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
            const geoResponse = await fetch(geoApi);
            if (!geoResponse.ok) throw new Error('Could not find location name');
            const geoData = await geoResponse.json();
            
            const name = `${geoData.address.city || geoData.address.town || 'Unknown City'}, ${geoData.address.country}`;
            
            appState.currentLocation = { latitude, longitude, name };
            localStorage.setItem('autoLocate', 'true');
            localStorage.removeItem('savedLocation'); // Clear manual location
            fetchWeather();
            
        } catch (error) {
            console.error('Geolocation error:', error);
            let message = 'Could not get your location. Please ensure you have granted permission and are on a secure (HTTPS) connection.';
            if (error.code === 1) message = 'You denied location permission. Please enable it in your browser settings.';
            
            showModal('Geolocation Failed', message);
            dom.autoLocationToggle.checked = false;
            localStorage.removeItem('autoLocate');
        }
        
    } else {
        localStorage.removeItem('autoLocate');
    }
}

// --- Accent Color ---
function applyAccentColor(hexColor) {
    if (!hexColor) return;
    
    const darkColor = darkenColor(hexColor, 20);
    document.documentElement.style.setProperty('--accent-primary', hexColor);
    document.documentElement.style.setProperty('--accent-primary-dark', darkColor);
    appState.settings.accentColor = hexColor;
}

function darkenColor(hex, percent) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.floor(r * (100 - percent) / 100);
    g = Math.floor(g * (100 - percent) / 100);
    b = Math.floor(b * (100 - percent) / 100);

    r = (r < 0) ? 0 : r;
    g = (g < 0) ? 0 : g;
    b = (b < 0) ? 0 : b;

    const rr = ((r.toString(16).length === 1) ? '0' + r.toString(16) : r.toString(16));
    const gg = ((g.toString(16).length === 1) ? '0' + g.toString(16) : g.toString(16));
    const bb = ((b.toString(16).length === 1) ? '0' + b.toString(16) : b.toString(16));

    return '#' + rr + gg + bb;
}

function handleSaveColor() {
    const newColor = dom.customColorText.value;
    applyAccentColor(newColor);
    localStorage.setItem('accentColor', newColor);
}

// --- Initialization ---
async function initializeDashboard() {
    
    // --- Load Settings ---
    // 1. Accent Color
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        applyAccentColor(savedColor);
        if(dom.customColorInput) dom.customColorInput.value = savedColor;
        if(dom.customColorText) dom.customColorText.value = savedColor;
        // Update active swatch
        if(dom.colorSwatchesContainer) {
            document.querySelectorAll('.color-swatch').forEach(sw => {
                sw.classList.toggle('active', sw.dataset.color === savedColor);
            });
        }
    }

    // 2. Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        if(dom.themeToggleSwitch) dom.themeToggleSwitch.checked = true;
    }
    handleThemeToggle(false); // Apply loaded theme
    
    // 3. Unit
    const savedUnit = localStorage.getItem('unit');
    if (savedUnit === 'fahrenheit') {
        if(dom.unitToggle) dom.unitToggle.checked = true;
        appState.settings.unit = 'fahrenheit';
    }

    // 4. Clock Format (NEW)
    const savedClockFormat = localStorage.getItem('is12Hour');
    if (savedClockFormat === 'false') {
        appState.settings.is12Hour = false;
        if(dom.clockFormatToggle) dom.clockFormatToggle.checked = false;
    } else {
        appState.settings.is12Hour = true; // Default
        if(dom.clockFormatToggle) dom.clockFormatToggle.checked = true;
    }

    // 5. Location
    const autoLocate = localStorage.getItem('autoLocate');
    const savedLocation = localStorage.getItem('savedLocation');

    if (autoLocate === 'true') {
        if(dom.autoLocationToggle) dom.autoLocationToggle.checked = true;
        await handleAutoLocationToggle(); // Run auto-location
    } else if (savedLocation) {
        appState.currentLocation = JSON.parse(savedLocation);
        await fetchWeather(); // Fetch for saved manual location
    } else {
        await fetchWeather(); // Fetch for default location
    }

    // --- Update UI ---
    updateDateTime(); // Run once immediately
    buildCalendar(); // Build full calendar
    buildWidgetCalendar(); // Build widget calendar
    setInterval(updateDateTime, 1000); // Update clocks every second
    
    // --- Add Event Listeners ---
    
    // Refresh Button
    if (dom.refreshButton) {
        dom.refreshButton.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // Navigation
    dom.sidebarNav.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item[data-page]');
        if (navItem) {
            navigateToPage(navItem.dataset.page);
        }
    });
    
    // Search
    dom.searchInput.addEventListener('input', () => {
        clearTimeout(appState.searchDebounce);
        appState.searchDebounce = setTimeout(getSearchSuggestions, 300);
    });
    document.addEventListener('click', (e) => {
        if (dom.searchContainer && !dom.searchContainer.contains(e.target)) {
            dom.searchSuggestions.style.display = 'none';
        }
    });
    
    // Calendar
    if (dom.prevMonthBtn) {
        dom.prevMonthBtn.addEventListener('click', () => {
            appState.calendar.currentDate.setMonth(appState.calendar.currentDate.getMonth() - 1);
            buildCalendar();
        });
    }
    if (dom.nextMonthBtn) {
        dom.nextMonthBtn.addEventListener('click', () => {
            appState.calendar.currentDate.setMonth(appState.calendar.currentDate.getMonth() + 1);
            buildCalendar();
        });
    }
    
    // Settings
    if (dom.themeToggleBtn) {
        dom.themeToggleBtn.addEventListener('click', () => {
            dom.themeToggleSwitch.checked = !dom.themeToggleSwitch.checked;
            handleThemeToggle(true);
        });
    }
    if (dom.themeToggleSwitch) {
        dom.themeToggleSwitch.addEventListener('change', () => handleThemeToggle(true));
    }
    
    if (dom.unitToggle) {
        dom.unitToggle.addEventListener('change', handleUnitToggle);
    }
    if (dom.autoLocationToggle) {
        dom.autoLocationToggle.addEventListener('change', handleAutoLocationToggle);
    }
    // NEW: Clock format listener
    if (dom.clockFormatToggle) {
        dom.clockFormatToggle.addEventListener('change', handleClockFormatToggle);
    }
    
    // Color Settings
    if (dom.colorSwatchesContainer) {
        dom.colorSwatchesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-swatch')) {
                const color = e.target.dataset.color;
                dom.customColorInput.value = color;
                dom.customColorText.value = color;
                // Update active swatch
                dom.colorSwatchesContainer.querySelector('.color-swatch.active')?.classList.remove('active');
                e.target.classList.add('active');
            }
        });
    }
    if (dom.customColorInput) {
        dom.customColorInput.addEventListener('input', (e) => {
            dom.customColorText.value = e.target.value;
        });
    }
    if (dom.customColorText) {
        dom.customColorText.addEventListener('input', (e) => {
            dom.customColorInput.value = e.target.value;
        });
    }
    if (dom.saveColorBtn) {
        dom.saveColorBtn.addEventListener('click', handleSaveColor);
    }
    
    // Modal
    modalCloseBtn.addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
            closeModal();
        }
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', initializeDashboard);