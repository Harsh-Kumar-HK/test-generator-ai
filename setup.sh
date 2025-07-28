#!/bin/bash

echo "🚀 Setting up Test Generator AI..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env with your API keys and database configuration"
    echo "   Required: GEMINI_API_KEY and MONGO_URI"
else
    echo "✅ .env file already exists"
fi

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🎉 Setup complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your configuration:"
echo "   - GEMINI_API_KEY=your_gemini_api_key_here"
echo "   - MONGO_URI=mongodb://localhost:27017/test-generator-ai"
echo ""
echo "2. Start MongoDB (if using local instance)"
echo ""
echo "3. Run the application:"
echo "   npm run dev    # Start both frontend and backend"
echo "   or"
echo "   npm run backend  # Start only backend"
echo "   npm run frontend # Start only frontend"
echo ""
echo "4. Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Happy coding! 🎯" 