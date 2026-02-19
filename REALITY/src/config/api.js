// API Configuration for AI_Auto
// Set this to your backend URL when available
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apis = {
    support: `${API_BASE_URL}/support`,
    // Add more API endpoints as needed
};

export { API_BASE_URL };
