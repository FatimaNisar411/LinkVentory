#!/bin/bash

# Local deployment test script
echo "🚀 Starting LinkVentory Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate || venv\Scripts\activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating template..."
    cat > .env << EOL
MONGO_URL=mongodb://localhost:27017
SECRET_KEY=your-secret-key-here-change-this-in-production
ALGORITHM=HS256
ENVIRONMENT=development
EOL
    echo "✏️  Please edit .env with your actual values"
fi

# Start the server
echo "🔥 Starting server on http://localhost:8000"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
