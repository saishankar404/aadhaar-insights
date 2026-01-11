# AARI - Aadhaar Analytics & Reporting Interface 🇮🇳

**AARI** is a cutting-edge analytics dashboard designed to monitor, visualize, and secure the Aadhaar ecosystem. It leverages unsupervised machine learning to detect anomalies, assess district-level risk profiles, and provide actionable insights for administrators—all while strictly adhering to privacy-first principles.

![AARI Dashboard](https://via.placeholder.com/1200x600?text=AARI+Dashboard+Preview)

## 🚀 Overview

The Aadhaar ecosystem handles billions of transactions and enrolments. AARI provides a "God's Eye View" of this data, enabling administrators to:
- **Identify Risk**: Spot districts with unusual enrolment spikes or biometric update anomalies.
- **Ensure Equity**: Monitor saturation levels to ensure no citizen is left behind.
- **Detect Fraud**: Use ML models to flag suspicious patterns without accessing PII (Personally Identifiable Information).
- **Visualize Data**: Interact with a high-performance, vector-based map of India.

## ✨ Key Features

- **Interactive India Map**: Full-screen, vector-based visualisation using `MapLibre GL`. Color-coded risk markers allow for instant situational awareness.
- **Real-Time Risk Intelligence**: 
    - **Risk Index**: Composite score based on enrolment velocity, biometric updates, and demographic changes.
    - **Anomaly Detection**: Unsupervised ML (Isolation Forest) models running on the backend to flag statistical outliers.
- **District-Level Granularity**: Drill down into specific districts to view detailed metrics like:
    - **Saturation Ratio**: Percentage of population covered.
    - **Update Intensity Index (UII)**: Frequency of updates relative to population.
    - **Equity Gap**: Disparities in coverage across demographics.
- **System Logs**: A dedicated log interface to monitor data ingestion pipelines, model inference events, and system health.
- **Privacy-First Architecture**: Changes are aggregated and analyzed; no individual PII is exposed or stored.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS, Shadcn/UI
- **Maps**: MapLibre GL JS
- **State Management**: React Query

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **ML/Data**: Scikit-learn, Pandas, NumPy
- **Architecture**: Modular REST API

---

## ⚡️ Getting Started

Follow these steps to set up and run the system locally.

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aadhaar-insights
```

### 2. Backend Setup
The backend runs on port `8005`.

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with mock data
python seed_data.py

# Run the server
uvicorn app.main:app --reload --port 8005
```
You should see `Application startup complete.` endpoint documentation is available at `http://localhost:8005/docs`.

### 3. Frontend Setup
The frontend runs on port `8081` (or next available).

```bash
# Open a new terminal window and navigate to the project root
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Dashboard
Open your browser and navigate to:
**`http://localhost:8081/`**

## 📂 Project Structure

```
aadhaar-insights/
├── backend/                 # FastAPI Server
│   ├── app/                 # Application Logic
│   │   ├── api/             # API Routes
│   │   ├── core/            # Config & ML Models
│   │   ├── db/              # Database Models
│   │   └── schemas/         # Pydantic Schemas
│   ├── data/                # Dataset Storage
│   └── seed_data.py         # Data Seeding Script
│
└── frontend/                # React Application
    ├── src/
    │   ├── components/      # Reusable UI Components
    │   │   ├── map/         # Map & Overlay Components
    │   │   └── ui/          # Shadcn UI Elements
    │   ├── pages/           # Application Routes (Index, Logs, etc.)
    │   └── services/        # API Integration
    └── public/              # Static Assets
```

 
