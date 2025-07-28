const geminiService = require('../services/geminiService');

// In-memory storage for quizzes (simulates localStorage on server)
const quizStorage = new Map();
let quizCounter = 1;

class QuizController {
  // Generate a new quiz
  async generateQuiz(req, res) {
    try {
      const { topic, difficulty, mcqs = 0, bool = 0, oneLine = 0, para = 0 } = req.body;

      // Validate input
      if (!topic || !difficulty) {
        return res.status(400).json({
          success: false,
          message: 'Topic and difficulty are required'
        });
      }

      if (mcqs + bool + oneLine + para === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one question type must be selected'
        });
      }

      const questionTypes = [
        { type: 'mcqs', count: mcqs },
        { type: 'bool', count: bool },
        { type: 'oneLine', count: oneLine },
        { type: 'para', count: para }
      ];

      const quizData = {
        id: quizCounter++,
        topic,
        difficulty,
        questions: {
          mcqs: [],
          trueFalse: [],
          oneLiner: [],
          paragraph: []
        },
        totalQuestions: mcqs + bool + oneLine + para,
        createdAt: new Date().toISOString()
      };

      // Generate questions for each type
      for (const { type, count } of questionTypes) {
        if (count > 0) {
          try {
            const questions = await geminiService.generateQuestions(topic, difficulty, type, count);
            
            // Process questions based on type
            switch (type) {
              case 'mcqs':
                if (Array.isArray(questions)) {
                  quizData.questions.mcqs = questions;
                }
                break;
              case 'bool':
                if (questions.questions && questions.answers) {
                  quizData.questions.trueFalse = questions.questions.map((q, i) => ({
                    question: q,
                    answer: questions.answers[i],
                    type: 'true_false'
                  }));
                }
                break;
              case 'oneLine':
                if (questions.questions && questions.answers) {
                  quizData.questions.oneLiner = questions.questions.map((q, i) => ({
                    question: q,
                    answer: questions.answers[i],
                    type: 'one_liner'
                  }));
                }
                break;
              case 'para':
                if (questions.questions) {
                  quizData.questions.paragraph = questions.questions.map(q => ({
                    question: q,
                    type: 'explanatory'
                  }));
                }
                break;
            }

            // Add delay between API calls to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            // Only log error for actual failures
            // console.error(`Error generating ${type} questions:`, error);
            // Continue with other question types even if one fails
          }
        }
      }

      // Store quiz in memory
      quizStorage.set(quizData.id, quizData);

      res.status(201).json({
        success: true,
        message: 'Quiz generated successfully',
        data: quizData
      });

    } catch (error) {
      console.error('Error in generateQuiz:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get all quizzes
  async getAllQuizzes(req, res) {
    try {
      const quizzes = Array.from(quizStorage.values()).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      res.status(200).json({
        success: true,
        data: quizzes
      });
    } catch (error) {
      console.error('Error in getAllQuizzes:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get quiz by ID
  async getQuizById(req, res) {
    try {
      const { id } = req.params;
      const quiz = quizStorage.get(parseInt(id));
      
      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }

      res.status(200).json({
        success: true,
        data: quiz
      });
    } catch (error) {
      console.error('Error in getQuizById:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete quiz by ID
  async deleteQuiz(req, res) {
    try {
      const { id } = req.params;
      const quiz = quizStorage.get(parseInt(id));
      
      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }

      quizStorage.delete(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Quiz deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteQuiz:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new QuizController(); 