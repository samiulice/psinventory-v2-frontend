const { hostname, port } = window.location;
let api;

const cleanDomain = hostname.replace(/^www\./, ''); // remove www.
const mainDomain = cleanDomain.split('.').slice(-2).join('.'); // get main domain

if (cleanDomain.includes('test') || cleanDomain.includes('dev')) {
  // Test or dev subdomains
  api = `https://api.dev.${mainDomain}/api/v2`;
} else if (cleanDomain.includes('demo')) {
  // Demo subdomain
  api = `https://api.demo.${mainDomain}/api/v2`;
} else if (cleanDomain.endsWith('.pssoft.xyz')) {
  // Other pssoft.xyz domains
  api = `https://api.${mainDomain}/api/v2`;
} else {
  // Fallback to localhost
  api = `http://localhost:${port || 8000}/api/v2`;
}

console.log("API Base:", api);
