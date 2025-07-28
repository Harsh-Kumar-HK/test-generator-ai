const express = require('express');
const cors = require('cors');
require('dotenv').config();

const quizRoutes = require('./routes/quizRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5176',
      'https://test-generator-ai.vercel.app',
      'https://test-generator-ai.vercel.app/'
    ];
    
    // Add CORS_ORIGIN from environment if it exists
    if (process.env.CORS_ORIGIN) {
      allowedOrigins.push(process.env.CORS_ORIGIN);
      // Also add without trailing slash
      if (process.env.CORS_ORIGIN.endsWith('/')) {
        allowedOrigins.push(process.env.CORS_ORIGIN.slice(0, -1));
      } else {
        allowedOrigins.push(process.env.CORS_ORIGIN + '/');
      }
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test Generator AI API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/quiz', quizRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // You may keep this log for deployment, or remove for production silence
  // console.log(`Server running on port ${PORT}`);
  // console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 