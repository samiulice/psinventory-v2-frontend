// Full URL of the current page
const currentUrl = window.location.href;
console.log("Full URL:", currentUrl);

// Just the domain (hostname) of the current page
const currentDomain = window.location.hostname;
console.log("Domain:", currentDomain);

// Build API base dynamically
let api;

if (currentDomain.includes('.pssoft.xyz')) {
    // Remove 'www.' if present
    const cleanDomain = currentDomain.replace(/^www\./, '');
    api = `https://api.${cleanDomain}/api/v2`;
} 
else if (currentDomain === 'localhost') {
    // Keep the same port if present, or default to 8000
    const port = window.location.port || '8000';
    api = `http://localhost:${port}/api/v2`;
} 
else {
    // Fallback for unknown environments
    api = 'http://localhost:8000/api/v2';
}

console.log("API Base:", api);