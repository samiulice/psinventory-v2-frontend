const { hostname, port } = window.location;

let api;
const cleanDomain = hostname.replace(/^www\./, ''); // remove www.

// If the hostname contains "test" or "dev"
if (cleanDomain.includes('test') || cleanDomain.includes('dev')) {
    // Use dev API
    const mainDomain = cleanDomain.split('.').slice(-2).join('.'); // get main domain
    api = `https://api.dev.${mainDomain}/api/v2`;
}
// For other pssoft.xyz domains
else if (cleanDomain.endsWith('.pssoft.xyz')) {
    // Use dev API
    const mainDomain = cleanDomain.split('.').slice(-2).join('.'); // get main domain
    
    api = `https://api.${mainDomain}/api/v2`;
}
// Fallback
else {
    api = `http://localhost:${port || 8000}/api/v2`;
}

console.log("API Base:", api);
