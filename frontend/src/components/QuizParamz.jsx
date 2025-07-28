import { useState } from "react";
import { quizAPI } from "../services/api";

export const QuizParamz = ({ onSub, onQuizGenerated }) => {
  const [inputs, setInputs] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate inputs
    if (!inputs.topic || !inputs.difficulty) {
      setMessage("Please fill in topic and difficulty level");
      return;
    }

    const totalQuestions = (parseInt(inputs.mcqs) || 0) + 
                          (parseInt(inputs.bool) || 0) + 
                          (parseInt(inputs.oneLine) || 0) + 
                          (parseInt(inputs.para) || 0);

    if (totalQuestions === 0) {
      setMessage("Please select at least one question type");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const quizData = {
        topic: inputs.topic,
        difficulty: inputs.difficulty,
        mcqs: parseInt(inputs.mcqs) || 0,
        bool: parseInt(inputs.bool) || 0,
        oneLine: parseInt(inputs.oneLine) || 0,
        para: parseInt(inputs.para) || 0
      };

      const response = await quizAPI.generateQuiz(quizData);
      
      if (response.success) {
        setMessage("Quiz generated successfully!");
        // Pass the generated quiz data to parent component
        if (onQuizGenerated) {
          onQuizGenerated(response.data);
        }
        // Proceed to quiz
        onSub();
      } else {
        setMessage(response.message || "Failed to generate quiz");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      setMessage(error.response?.data?.message || "Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyLevels = ["Easy", "Medium", "Hard"];

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-4xl font-semibold text-center text-gray-800">
          Quiz Configuration
        </h2>

        <div className="flex flex-col">
          <label className="mb-2 text-lg text-gray-700">
            Enter the Topic here:
          </label>
          <input
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            name="topic"
            value={inputs.topic || ""}
            onChange={handleChange}
            placeholder="Enter quiz topic"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-lg text-gray-700">
            Select Difficulty Level:
          </label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="difficulty"
            value={inputs.difficulty || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select difficulty
            </option>
            {difficultyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-2 text-lg text-gray-700">
              Select No. of MCQs:
            </label>
            <input
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              name="mcqs"
              min="0"
              max="20"
              value={inputs.mcqs || ""}
              onChange={handleChange}
              placeholder="Number of MCQs"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-lg text-gray-700">
              Select No. of True/False:
            </label>
            <input
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              name="bool"
              min="0"
              max="20"
              value={inputs.bool || ""}
              onChange={handleChange}
              placeholder="Number of True/False"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-lg text-gray-700">
              Select No. of One Line Answers:
            </label>
            <input
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              name="oneLine"
              min="0"
              max="20"
              value={inputs.oneLine || ""}
              onChange={handleChange}
              placeholder="Number of One Line Answers"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-lg text-gray-700">
              Select No. of One Paragraph Answers:
            </label>
            <input
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              name="para"
              min="0"
              max="20"
              value={inputs.para || ""}
              onChange={handleChange}
              placeholder="Number of One Paragraph Answers"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 font-semibold rounded-lg transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isLoading ? "Generating Quiz..." : "Generate Quiz"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("Failed") || message.includes("Please")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};
