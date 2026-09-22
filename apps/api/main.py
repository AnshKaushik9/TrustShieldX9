from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TrustShield AI API",
    description="Backend API for TrustShield AI Digital Trust Platform",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "TrustShield AI API is running"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "database": "connected", "models": "loaded"}
