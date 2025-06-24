@echo off
echo 🚀 Starting LinkVentory Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo 📦 Installing dependencies...
pip install -r requirements.txt

REM Check for .env file
if not exist ".env" (
    echo ⚠️  No .env file found. Creating template...
    (
        echo MONGO_URL=mongodb://localhost:27017
        echo SECRET_KEY=your-secret-key-here-change-this-in-production
        echo ALGORITHM=HS256
        echo ENVIRONMENT=development
    ) > .env
    echo ✏️  Please edit .env with your actual values
)

REM Start the server
echo 🔥 Starting server on http://localhost:8000
uvicorn main:app --reload --host 0.0.0.0 --port 8000
