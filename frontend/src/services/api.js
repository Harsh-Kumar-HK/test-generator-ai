import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // Removed debug log
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Removed debug log
    return response;
  },
  (error) => {
    // Removed debug log
    return Promise.reject(error);
  }
);

// Quiz API methods
export const quizAPI = {
  // Generate a new quiz
  generateQuiz: async (quizData) => {
    const response = await api.post('/quiz/generate', quizData);
    return response.data;
  },

  // Get all quizzes
  getAllQuizzes: async () => {
    const response = await api.get('/quiz');
    return response.data;
  },

  // Get quiz by ID
  getQuizById: async (id) => {
    const response = await api.get(`/quiz/${id}`);
    return response.data;
  },

  // Delete quiz by ID
  deleteQuiz: async (id) => {
    const response = await api.delete(`/quiz/${id}`);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 