"""
BACKEND CORS FIX NEEDED

Your backend at https://linkventory-production.up.railway.app is missing CORS headers.

Add this to your backend main.py file:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://linkventory.pages.dev",
        "https://*.pages.dev",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Add this for debugging
@app.middleware("http")
async def debug_cors(request, call_next):
    response = await call_next(request)
    print(f"Request: {request.method} {request.url}")
    print(f"Origin: {request.headers.get('origin')}")
    print(f"Response headers: {dict(response.headers)}")
    return response
```

The issue is that your signup endpoint returns no CORS headers, which causes the browser to block the request.
"""
