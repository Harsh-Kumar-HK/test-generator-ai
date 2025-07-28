import "./App.css";
import React, { useState, useEffect } from "react";
import { Header } from "./components/Header.jsx";
import { Welcome } from "./components/Welcome.jsx";
import { Result } from "./components/Result.jsx";
import { QuizParamz } from "./components/QuizParamz.jsx";
import { MCQSQuestion } from "./components/quizQuestion.jsx";
import { BooleanQuestion } from "./components/BooleanQuestion.jsx";
import { OneLineQuestion } from "./components/OneLineQuestion.jsx";
import { ParaQuestion } from "./components/ParaQuestion.jsx";
import { healthAPI } from "./services/api";

// localStorage keys
const STORAGE_KEYS = {
  QUIZ_DATA: 'testGenerator_quizData',
  ANSWERS: 'testGenerator_answers',
  CURRENT_QUESTION: 'testGenerator_currentQuestion',
  SHOW_WELCOME: 'testGenerator_showWelcome',
  SHOW_QUIZ_PARAMS: 'testGenerator_showQuizParams',
  SHOW_RESULT: 'testGenerator_showResult'
};

// Helper function to load from localStorage
const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

function App() {
  // Initialize state with localStorage values
  const [currentQuestion, setCurrentQuestion] = useState(() => 
    loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION, 0)
  );
  const [answers, setAnswers] = useState(() => 
    loadFromStorage(STORAGE_KEYS.ANSWERS, [])
  );
  const [showQuizParamz, setShowQuizParamz] = useState(() => 
    loadFromStorage(STORAGE_KEYS.SHOW_QUIZ_PARAMS, true)
  );
  const [showResult, setShowResult] = useState(() => 
    loadFromStorage(STORAGE_KEYS.SHOW_RESULT, false)
  );
  const [showWelcome, setShowWelcome] = useState(() => 
    loadFromStorage(STORAGE_KEYS.SHOW_WELCOME, true)
  );
  const [quizData, setQuizData] = useState(() => 
    loadFromStorage(STORAGE_KEYS.QUIZ_DATA, null)
  );
  const [allQuestions, setAllQuestions] = useState([]);
  const [error, setError] = useState("");
  const [renderError, setRenderError] = useState(false);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // Mark storage as loaded after initial render
  useEffect(() => {
    console.log('App mounted - localStorage state:', {
      quizData: !!quizData,
      currentQuestion,
      answers: answers.length,
      showWelcome,
      showQuizParamz,
      showResult
    });
    setIsStorageLoaded(true);
  }, [quizData, currentQuestion, answers.length, showWelcome, showQuizParamz, showResult]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isStorageLoaded) {
      try {
        if (quizData) {
          localStorage.setItem(STORAGE_KEYS.QUIZ_DATA, JSON.stringify(quizData));
        }
        localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
        localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, currentQuestion.toString());
        localStorage.setItem(STORAGE_KEYS.SHOW_WELCOME, JSON.stringify(showWelcome));
        localStorage.setItem(STORAGE_KEYS.SHOW_QUIZ_PARAMS, JSON.stringify(showQuizParamz));
        localStorage.setItem(STORAGE_KEYS.SHOW_RESULT, JSON.stringify(showResult));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [quizData, answers, currentQuestion, showWelcome, showQuizParamz, showResult, isStorageLoaded]);

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await healthAPI.checkHealth();
        console.log("API is healthy");
      } catch (error) {
        console.error("API health check failed:", error);
        setError("Backend API is not available. Please ensure the server is running.");
      }
    };
    checkHealth();
  }, []);

  // Error boundary effect
  useEffect(() => {
    const handleError = (event) => {
      console.error('App error caught:', event.error);
      setRenderError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  // Process quiz data and create questions array
  useEffect(() => {
    if (quizData) {
      const questions = [];
      
      // Add MCQs
      if (quizData.questions.mcqs && quizData.questions.mcqs.length > 0) {
        quizData.questions.mcqs.forEach(mcq => {
          questions.push({
            ...mcq,
            type: "mcqs"
          });
        });
      }

      // Add True/False questions
      if (quizData.questions.trueFalse && quizData.questions.trueFalse.length > 0) {
        quizData.questions.trueFalse.forEach(tf => {
          questions.push({
            type: "TRUE/FALSE",
            text: tf.question,
            answer: tf.answer,
            option: [
              { text: "True", isCorrect: tf.answer === "True" },
              { text: "False", isCorrect: tf.answer === "False" }
            ]
          });
        });
      }

      // Add One-liner questions
      if (quizData.questions.oneLiner && quizData.questions.oneLiner.length > 0) {
        quizData.questions.oneLiner.forEach(ol => {
          questions.push({
            type: "One Line Answer-Type",
            text: ol.question,
            correctAnswer: ol.answer
          });
        });
      }

      // Add Paragraph questions
      if (quizData.questions.paragraph && quizData.questions.paragraph.length > 0) {
        quizData.questions.paragraph.forEach(para => {
          questions.push({
            type: "One Paragraph Answer-Type",
            text: para.question,
            correctAnswer: ""
          });
        });
      }

      setAllQuestions(questions);
    }
  }, [quizData]);

  const handleAnswers = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion >= allQuestions.length - 1) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const setParamz = () => setShowWelcome(false);
  
  const saveParamz = () => setShowQuizParamz(false);

  const handleQuizGenerated = (data) => {
    setQuizData(data);
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setShowWelcome(true);
    setShowQuizParamz(true);
    setQuizData(null);
    setAllQuestions([]);
    setError("");
    
    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  };

  const renderQuestion = () => {
    if (allQuestions.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No questions available. Please generate a quiz first.</p>
        </div>
      );
    }

    const currentQ = allQuestions[currentQuestion];

    switch (currentQ.type) {
      case "mcqs":
        return (
          <MCQSQuestion
            question={currentQ}
            questionNumber={currentQuestion + 1}
            onAnswer={(isCorrect) => handleAnswers(isCorrect ? 1 : 0)}
          />
        );
      case "TRUE/FALSE":
        return (
          <BooleanQuestion
            question={currentQ}
            questionNumber={currentQuestion + 1}
            correctAnswer={currentQ.answer}
            onAnswer={(isCorrect) => handleAnswers(isCorrect ? 1 : 0)}
          />
        );
      case "One Line Answer-Type":
        return (
          <OneLineQuestion
            question={currentQ}
            questionNumber={currentQuestion + 1}
            onAnswer={(inputText) => handleAnswers(inputText)}
          />
        );
      case "One Paragraph Answer-Type":
        return (
          <ParaQuestion
            question={currentQ}
            questionNumber={currentQuestion + 1}
            onAnswer={(inputText) => handleAnswers(inputText)}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  if (error) {
    return (
      <div className="bg-zinc-200 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="bg-zinc-200 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">App Error</h2>
          <p className="text-gray-700 mb-4">Something went wrong. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-zinc-200 min-h-screen">
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="my-1 w-full max-w-4xl rounded-3xl bg-white p-5 shadow-lg md:m-10 md:p-10">
            {isStorageLoaded ? (
              <>
                {showWelcome && <Welcome onStart={setParamz} />}
                {!showWelcome && showQuizParamz && (
                  <QuizParamz onSub={saveParamz} onQuizGenerated={handleQuizGenerated} />
                )}
                {!showQuizParamz && !showResult && renderQuestion()}
                {showResult && (
                  <Result 
                    answers={answers} 
                    restartTest={restartTest}
                    totalQuestions={allQuestions.length}
                    quizData={quizData}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
