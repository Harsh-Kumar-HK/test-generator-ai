const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// POST /api/quiz/generate - Generate a new quiz
router.post('/generate', quizController.generateQuiz);

// GET /api/quiz - Get all quizzes
router.get('/', quizController.getAllQuizzes);

// GET /api/quiz/:id - Get quiz by ID
router.get('/:id', quizController.getQuizById);

// DELETE /api/quiz/:id - Delete quiz by ID
router.delete('/:id', quizController.deleteQuiz);

module.exports = router; 