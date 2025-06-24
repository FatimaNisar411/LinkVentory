# LinkVentory Backend Deployment Guide

## Environment Variables Required

Set these environment variables in your deployment platform:

- `MONGO_URL`: Your MongoDB connection string (e.g., MongoDB Atlas)
- `SECRET_KEY`: A secure secret key for JWT tokens
- `ALGORITHM`: JWT algorithm (default: "HS256")
- `ENVIRONMENT`: Set to "production" for production deployments

## Deployment Options

### 1. Render (Recommended)

1. Connect your GitHub repository to Render
2. Use the `render.yaml` configuration file
3. Set environment variables in Render dashboard
4. Deploy automatically on push to main branch

### 2. Docker Deployment

```bash
# Build the image
docker build -t linkventory-backend .

# Run the container
docker run -p 8000:8000 \
  -e MONGO_URL="your_mongo_url" \
  -e SECRET_KEY="your_secret_key" \
  -e ALGORITHM="HS256" \
  linkventory-backend
```

### 3. Manual Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export MONGO_URL="your_mongo_url"
export SECRET_KEY="your_secret_key"
export ALGORITHM="HS256"

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000
```

## MongoDB Setup

1. Create a MongoDB Atlas cluster (free tier available)
2. Create a database user with read/write permissions
3. Get the connection string and set it as MONGO_URL
4. Whitelist your deployment platform's IP addresses

## Health Checks

- `/ping` - Basic health check
- `/health` - Detailed health check with database status

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (local development)
- `https://linkventory.pages.dev` (production frontend)

Update the CORS origins in `main.py` if you deploy to a different domain.
