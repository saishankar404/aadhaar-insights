from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes

app = FastAPI(
    title="AARI - Aadhaar Anomaly & Risk Intelligence",
    description="Backend for AARI Dashboard. Provides district-level risk metrics and anomaly scores.",
    version="1.0.0"
)

# CORS Middleware
# Allowing all origins for development simplicity, strictly restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routes
app.include_router(routes.router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "AARI Backend System Operational", "version": "1.0.0"}
