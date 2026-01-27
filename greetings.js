// // The list of messages to display randomly
// const greetings = [
//     "Welcome!, ",
//     "Feeling Good😊👍!,",
//     "Hello there!,",
//     "It's great to see you!,",
//     // "Hope you have a wonderful day!",
//     // "Ready to Track your Health ❤",
//     "Glad you're here!,"
// ];

// const defaultMessage = "Welcome!";

// // Function to get a random message
// function getRandomMessage() {
//     const randomIndex = Math.floor(Math.random() * greetings.length);
//     return greetings[randomIndex];
// }

// // Function to update ALL H1 tags with dynamicText class/id
// function updateGreetingDisplay() {
//     const headingElements = document.querySelectorAll('#dynamicText, .dynamic-text');
    
//     headingElements.forEach(headingElement => {
//         const greetingsEnabled = localStorage.getItem('greetingsEnabled') !== 'false'; // Default to true
        
//         if (greetingsEnabled) {
//             headingElement.textContent = getRandomMessage();
//         } else {
//             headingElement.textContent = defaultMessage;
//         }
//     });
// }

// // Function to initialize the toggle switch
// function initializeToggleSwitch() {
//     const toggleSwitch = document.getElementById('greetingsToggle');
//     if (!toggleSwitch) return;

//     // Set initial state
//     const greetingsEnabled = localStorage.getItem('greetingsEnabled') !== 'false';
//     toggleSwitch.checked = greetingsEnabled;

//     // Add event listener
//     toggleSwitch.addEventListener('change', function() {
//         localStorage.setItem('greetingsEnabled', this.checked);
//         updateGreetingDisplay();
        
//         // Dispatch custom event for other components to listen to
//         window.dispatchEvent(new CustomEvent('greetingsToggleChanged', {
//             detail: { enabled: this.checked }
//         }));
//     });
// }

// // Listen for storage changes (if user changes setting in another tab)
// window.addEventListener('storage', function(e) {
//     if (e.key === 'greetingsEnabled') {
//         updateGreetingDisplay();
//     }
// });

// // Initialize everything when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     initializeToggleSwitch();
//     updateGreetingDisplay();
// });

// // Also update when page becomes visible
// document.addEventListener('visibilitychange', function() {
//     if (!document.hidden) {
//         updateGreetingDisplay();
//     }
// });



























// The list of messages to display randomly
const greetings = [
    "Welcome!, ",
    "Feeling Good😊👍!,",
    "Hello there!,",
    "It's great to see you!,",
    // "Hope you have a wonderful day!",
    // "Ready to Track your Health ❤",
    "Glad you're here!,"
];

const defaultMessage = "Welcome!";

// Function to get a random message
function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

// Function to update ALL H1 tags with dynamicText class/id
function updateGreetingDisplay() {
    const headingElements = document.querySelectorAll('#dynamicText, .dynamic-text');
    
    headingElements.forEach(headingElement => {
        // Default to false (disabled) if not set in localStorage
        const greetingsEnabled = localStorage.getItem('greetingsEnabled') === 'true';
        
        if (greetingsEnabled) {
            headingElement.textContent = getRandomMessage();
        } else {
            headingElement.textContent = defaultMessage;
        }
    });
}

// Function to initialize the toggle switch
function initializeToggleSwitch() {
    const toggleSwitch = document.getElementById('greetingsToggle');
    if (!toggleSwitch) return;

    // Set initial state - if not set in localStorage, default to false (disabled)
    const greetingsEnabled = localStorage.getItem('greetingsEnabled') === 'true';
    toggleSwitch.checked = greetingsEnabled;

    // Add event listener
    toggleSwitch.addEventListener('change', function() {
        localStorage.setItem('greetingsEnabled', this.checked);
        updateGreetingDisplay();
        
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('greetingsToggleChanged', {
            detail: { enabled: this.checked }
        }));
    });
}

// Listen for storage changes (if user changes setting in another tab)
window.addEventListener('storage', function(e) {
    if (e.key === 'greetingsEnabled') {
        updateGreetingDisplay();
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeToggleSwitch();
    updateGreetingDisplay();
});

// Also update when page becomes visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateGreetingDisplay();
    }
});
