// API Configuration - Dynamic for all devices
// In development: Uses current hostname (works on local network)
// In production: Set REACT_APP_API_URL environment variable
const getApiBaseUrl = () => {
  // If environment variable is set, use it (for production)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // For development: use current hostname with port 5000
  // This makes it work on any device on the same network
  const hostname = window.location.hostname;
  return `http://${hostname}:5000`;
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

export default {
  API_BASE_URL,
  API_URL,
  getImageUrl
};
