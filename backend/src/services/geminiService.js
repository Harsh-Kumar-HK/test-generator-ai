const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Security: Validate API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'AIzaSyC9RoubLI_hBi_ac5F-la5BSiv92cSQNb8') {
  throw new Error('Invalid or missing GEMINI_API_KEY. Please set a valid API key in production.');
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseMimeType: "text/plain",
};

class GeminiService {
  constructor() {
    this.chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "hello" }]
        },
        {
          role: "model",
          parts: [{ text: "Hello there! How can I help you today? 😊" }]
        },
        {
          role: "user",
          parts: [{
            text: `I am going to use you for customized quiz generation. I will give you:
- a topic,
- difficulty level (easy, medium, hard),
- types of questions (mcqs, bool, oneLine, para),
- number of questions for each type.

You must return a JSON object in the correct format based on the question type:

For mcqs (multiple choice questions):
Return an array of objects with:
- "question": "question text",
- "options": ["option1", "option2", "option3", "option4"],
- "answer": (index number, 1-based),
- "type": "mcqs"

For bool (true/false questions):
Return an object with:
- "questions": ["question1", "question2", ...],
- "answers": ["True", "False", ...],
- "type": "true_false"

For oneLine (short answer questions):
Return an object with:
- "questions": ["question1", "question2", ...],
- "answers": ["answer1", "answer2", ...],
- "type": "one_liner"

For para (paragraph/essay questions):
Return an object with:
- "questions": ["question1", "question2", ...],
- "type": "explanatory"

Examples:
MCQs: [{"question": "What is the capital of France?", "options": ["Berlin", "Madrid", "Paris", "Rome"], "answer": 3, "type": "mcqs"}]
True/False: {"questions": ["The Earth is round"], "answers": ["True"], "type": "true_false"}
One Line: {"questions": ["What is 2+2?"], "answers": ["4"], "type": "one_liner"}
Paragraph: {"questions": ["Explain photosynthesis"], "type": "explanatory"}

Do not include any explanation or extra text. Just return the JSON object in the exact format specified.`
          }]
        },
        {
          role: "model",
          parts: [{ text: "Yes, I understand. I will return a JSON object with the specified format for each question type. No extra text will be added. Ready when you are!" }]
        }
      ]
    });
  }

  async generateQuestions(topic, difficulty, questionType, count) {
    try {
      const prompt = `Topic: ${topic}, Difficulty: ${difficulty}, Question Type: ${questionType}, Number of Questions: ${count}. Generate the quiz object as discussed. Only respond with the final JSON object. Do not include any explanation or text.`;

      const result = await this.chatSession.sendMessage(prompt);
      const text = result.response.candidates[0]?.content?.parts?.map(p => p.text).join(' ') || '';
      
      return this.parseResponse(text);
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  parseResponse(response) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/{[\s\S]*}|\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Handle different response structures
      if (parsed.result) {
        return parsed.result;
      }
      
      return parsed;
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error(`Failed to parse response: ${error.message}`);
    }
  }
}

module.exports = new GeminiService(); 