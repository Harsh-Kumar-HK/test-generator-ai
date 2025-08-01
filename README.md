# Test Generator AI 🎯

An AI-powered quiz generator that creates customized tests using Google's Gemini AI. Perfect for educators, students, and anyone who needs quick, intelligent quiz creation.

## ✨ Features

- 🤖 **AI-Powered Questions**: Uses Gemini 2.0 Flash to generate intelligent questions
- 📝 **Multiple Formats**: MCQs, True/False, Short Answer, and Long Answer questions
- 🎯 **Customizable**: Choose topic, difficulty, and number of questions
- 💾 **Smart Storage**: In-memory backend + localStorage for persistence
- 📊 **Auto Grading**: Instant scoring with detailed results
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Google Gemini API Key

### Setup
```bash
# Clone and install
git clone <your-repo-url>
cd TestGeneratorAi

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Configure environment
cp backend/env.example backend/.env
# Edit backend/.env with your GEMINI_API_KEY

# Run the app
npm run dev
```

### Access
- **Frontend**: http://localhost:5176
- **Backend**: http://localhost:5002

## 📁 Folder Structure
```
TestGeneratorAi/
├── backend/          # Node.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   └── package.json
├── frontend/         # React App
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── package.json      # Root scripts
```

## ⚡ Run Commands
```bash
npm run dev          # Start both frontend & backend
npm run backend      # Start backend only
npm run frontend     # Start frontend only
npm run build        # Build frontend for production
```

## 🔧 For New Contributors
```bash
# Clone and setup
git clone <repo-url>
cd TestGeneratorAi
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Add your API key
cp backend/env.example backend/.env
# Edit backend/.env: GEMINI_API_KEY=your_key_here

# Start development
npm run dev
```

## 🛠️ Tech Stack

**Backend**: Node.js, Express, Gemini AI  
**Frontend**: React, Vite, Tailwind CSS  
**Storage**: In-memory + localStorage

## 📖 How to Use

1. **Start Quiz** → Enter topic and difficulty
2. **Configure Questions** → Choose number of each question type
3. **AI Generation** → Gemini creates questions instantly
4. **Take Quiz** → Answer questions one by one
5. **View Results** → Get score, grade, and detailed analysis

## 🔧 Environment Variables

```env
# backend/.env
GEMINI_API_KEY=your_api_key_here
PORT=5002
NODE_ENV=development
CORS_ORIGIN=http://localhost:5176
```

## 🚀 Deployment

**Frontend**: Deploy to Vercel  
**Backend**: Deploy to Railway  
**No Database**: Uses in-memory storage

---

**Built with ❤️ using React, Node.js, and Google Gemini AI**
