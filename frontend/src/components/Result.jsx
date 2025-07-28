import React from "react";

export const Result = ({ answers, restartTest, totalQuestions, quizData }) => {
  // Calculate score for auto-graded questions (MCQs and True/False)
  const autoGradedQuestions = answers.filter(answer => 
    typeof answer === 'number' || answer === 1 || answer === 0
  );
  
  const score = autoGradedQuestions.reduce((total, val) => 
    total + (typeof val === "number" ? val : 0), 0
  );

  // Get written answers (One-liner and Paragraph)
  const writtenAnswers = answers.slice(autoGradedQuestions.length);

  // Calculate percentage
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Get grade based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 50) return { grade: 'C+', color: 'text-yellow-600' };
    if (percentage >= 40) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 30) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const gradeInfo = getGrade(percentage);

  return (
    <div className="flex flex-col gap-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800">Quiz Complete!</h2>
      
      {/* Quiz Info */}
      {quizData && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {quizData.topic}
          </h3>
          <p className="text-gray-600">
            Difficulty: {quizData.difficulty} | Questions: {totalQuestions}
          </p>
        </div>
      )}

      {/* Score Display */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <p className="text-2xl font-semibold text-gray-700 mb-2">
          Your Score: {score} out of {totalQuestions}
        </p>
        <p className="text-4xl font-bold mb-2" style={{ color: gradeInfo.color.replace('text-', '') }}>
          {percentage}%
        </p>
        <p className={`text-2xl font-bold ${gradeInfo.color}`}>
          Grade: {gradeInfo.grade}
        </p>
      </div>

      {/* Performance Message */}
      <div className="text-lg text-gray-600">
        {percentage >= 80 && "Excellent work! You have a strong understanding of this topic."}
        {percentage >= 60 && percentage < 80 && "Good job! You have a solid grasp of the material."}
        {percentage >= 40 && percentage < 60 && "Not bad! Review the material to improve your understanding."}
        {percentage < 40 && "Keep studying! Review the material and try again."}
      </div>

      {/* Written Answers Review */}
      {writtenAnswers.length > 0 && (
        <div className="mt-6 text-left">
          <h3 className="mb-3 text-xl font-semibold text-blue-600">
            Your Written Responses:
          </h3>
          <ul className="space-y-4">
            {writtenAnswers.map((answer, index) => (
              <li key={index} className="rounded-lg bg-blue-50 p-4">
                <p className="font-medium text-gray-800">
                  Question {autoGradedQuestions.length + index + 1}:
                </p>
                <p className="mt-1 text-gray-700">
                  Your answer: <span className="italic">{answer || "No answer provided"}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={restartTest}
          className="rounded-full bg-blue-600 px-6 py-3 text-xl text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
        <button
          onClick={() => window.print()}
          className="rounded-full bg-gray-600 px-6 py-3 text-xl text-white transition-colors hover:bg-gray-700"
        >
          Print Results
        </button>
      </div>
    </div>
  );
};