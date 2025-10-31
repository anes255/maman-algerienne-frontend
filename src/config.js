// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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
