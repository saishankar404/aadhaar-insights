# AARI - Aadhaar Analytics & Reporting Interface

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture Overview](#architecture-overview)
5. [Key Code Snippets](#key-code-snippets)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [API Reference](#api-reference)
9. [Data Models](#data-models)
10. [Development Workflow](#development-workflow)
11. [References](#references)

---

## 1. Project Overview

**AARI (Aadhaar Analytics & Reporting Interface)** is a cutting-edge analytics dashboard designed to monitor, visualize, and secure India's Aadhaar ecosystem. The system provides administrators with a comprehensive "God's Eye View" of the national biometric identification system through advanced analytics and machine learning.

### Purpose & Vision

AARI addresses critical needs in managing one of the world's largest biometric identification systems by:

- **Risk Detection**: Identifying districts with unusual enrollment spikes or biometric update anomalies
- **Equity Monitoring**: Tracking saturation levels to ensure comprehensive citizen coverage
- **Fraud Prevention**: Using unsupervised ML models to flag suspicious patterns without accessing PII
- **Real-Time Visualization**: Providing interactive, vector-based mapping of India with district-level metrics

### Core Value Propositions

1. **Privacy-First Architecture**: All data is aggregated at the district level; no individual PII is exposed or stored
2. **Explainable AI**: Transparent ML models with clear risk scoring methodology
3. **Assistive Intelligence**: System flags anomalies for human review, never makes autonomous decisions
4. **Policy-Grade Language**: Neutral, non-accusatory terminology suitable for government use

### Target Users

- **UIDAI Administrators**: Monitor national Aadhaar ecosystem health
- **Policy Makers**: Assess coverage equity and identify underserved regions
- **Security Analysts**: Detect and investigate anomalous patterns
- **Data Scientists**: Analyze trends and generate insights from aggregated data

---

## 2. Key Features

### Interactive India Map
- Full-screen, vector-based visualization using MapLibre GL
- Color-coded district markers for instant situational awareness:
  - 🟢 **Low Risk** (≤25): Green
  - 🟡 **Medium Risk** (25-50): Amber
  - 🟠 **High Risk** (50-80): Orange
  - 🔴 **Priority** (>80): Red
- Click-through district details with comprehensive metrics

### Real-Time Risk Intelligence

**Risk Index**: Composite score (0-100) based on five key metrics:
- **ASR (Aadhaar Saturation Ratio)**: (Enrollments / Population) × 100
- **UII (Update Intensity Index)**: Updates / Active Aadhaar Base
- **TDS (Temporal Deviation Score)**: Z-score vs. historical moving average
- **CBCG (Child Biometric Compliance Gap)**: 1 - (Child Updates / Eligible Children)
- **AEPG (Aadhaar Equity Penetration Gap)**: 100 - ASR

**Anomaly Detection**: Unsupervised ML (Isolation Forest) flags statistical outliers

### Eight Dashboard Views

1. **Main Dashboard** (`/`): Interactive India map with KPI overlay
2. **Anomaly & Risk** (`/anomaly-risk`): Sortable risk analysis table
3. **Temporal Trends** (`/temporal-trends`): Time-series trend analysis
4. **Inclusion & Equity** (`/inclusion-equity`): Coverage equity metrics
5. **System Logs** (`/logs`): Data ingestion pipeline monitoring
6. **Admin Summary**: Executive dashboard view
7. **District Details**: Deep-dive into specific district metrics
8. **Simulator**: Data simulation interface for testing

### System Logging & Monitoring
- Dedicated log interface for data ingestion pipelines
- Model inference event tracking
- System health monitoring
- Audit trail for compliance

---

## 3. Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.8.3 | Type-safe development |
| **Vite** | 5.4.19 | Build tool & dev server |
| **TailwindCSS** | 3.4.17 | Utility-first styling |
| **Shadcn/UI** | Latest | Component library (50+ components) |
| **MapLibre GL JS** | 5.15.0 | Vector map rendering |
| **React Query** | 5.83.0 | Server state management |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **Recharts** | 2.15.4 | Data visualization |
| **Axios** | 1.13.2 | HTTP client |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | ≥0.109.0 | High-performance API framework |
| **Uvicorn** | ≥0.27.0 | ASGI server |
| **SQLAlchemy** | ≥2.0.25 | ORM & database toolkit |
| **SQLite** | N/A | Development database |
| **Pandas** | ≥2.2.0 | Data manipulation |
| **NumPy** | ≥1.26.3 | Numerical computing |
| **Scikit-learn** | ≥1.4.0 | Machine learning (Isolation Forest) |
| **Pydantic** | ≥2.5.3 | Data validation |

### Data Infrastructure

- **Dataset Size**: ~220MB of CSV data
- **Categories**: Enrollment, Demographic Updates, Biometric Updates
- **Timespan**: Multi-month historical data across 50+ districts
- **Format**: Aggregated district-level monthly statistics

---

## 4. Architecture Overview

### High-Level System Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   CSV Datasets  │─────▶│  Data Processing │─────▶│   SQLite DB     │
│  (220MB Files)  │      │   & ML Pipeline  │      │ (district_      │
└─────────────────┘      │                  │      │  metrics)       │
                         │ • Load & Merge   │      └────────┬────────┘
                         │ • Calc Metrics   │               │
                         │ • ML Scoring     │               │
                         └──────────────────┘               │
                                                            ▼
                         ┌──────────────────┐      ┌─────────────────┐
                         │  React Frontend  │◀─────│   FastAPI REST  │
                         │                  │      │      API        │
                         │ • MapLibre Map   │      │                 │
                         │ • 8 Dashboard    │      │ • 5 Endpoints   │
                         │   Views          │      │ • JSON Response │
                         │ • React Query    │      │ • CORS Enabled  │
                         └──────────────────┘      └─────────────────┘
```

### Data Flow Pipeline

1. **Ingestion** → Load CSV files from three categories (enrollment, demographic, biometric)
2. **Normalization** → Standardize district names and column headers to snake_case
3. **Aggregation** → Group by state-district-month, compute totals
4. **Metric Computation** → Calculate ASR, UII, TDS, CBCG, AEPG
5. **ML Scoring** → Run Isolation Forest to generate risk scores (0-100)
6. **Categorization** → Map risk scores to Low/Medium/High/Priority
7. **Storage** → Persist to SQLite `district_metrics` table
8. **API Serving** → FastAPI endpoints serve JSON to React frontend
9. **Visualization** → MapLibre renders district markers with color-coded risk levels

### Component Relationships

- **Backend Layer**: FastAPI handles all API routes, database queries, and ML model invocation
- **Data Layer**: SQLAlchemy ORM abstracts SQLite; production-ready for PostgreSQL migration
- **Frontend Layer**: React Query manages server state; MapLibre handles map rendering
- **Communication**: RESTful JSON API over HTTP (CORS enabled for development)

### Security & Privacy Approach

- **No PII Processing**: All data aggregated at district level before ingestion
- **Input Validation**: Pydantic schemas enforce strict typing on all API inputs
- **SQL Injection Prevention**: SQLAlchemy ORM; no raw SQL queries
- **Audit Logging**: All data ingestion and risk scoring events logged
- **Transparent AI**: Isolation Forest model explainable; risk factors visible to users

---

## 5. Key Code Snippets

### API Endpoint: Map Data (`backend/app/api/routes.py`)

```python
@router.get("/map")
def get_map_data(month: Optional[str] = None, db: Session = Depends(get_db)):
    """Returns data for geospatial visualization."""
    query = db.query(
        DistrictMetric.district,
        DistrictMetric.state,
        DistrictMetric.risk_score,
        DistrictMetric.risk_level,
        DistrictMetric.asr,
        DistrictMetric.uii,
        DistrictMetric.tds,
        DistrictMetric.aepg,
        DistrictMetric.cbcg
    )

    if month:
        query = query.filter(DistrictMetric.month == month)

    results = query.all()
    return [
        {
            "district": r.district,
            "state": r.state,
            "risk_score": r.risk_score,
            "risk_level": r.risk_level,
            "asr": r.asr,
            "uii": r.uii,
            "tds": r.tds,
            "aepg": r.aepg,
            "cbcg": r.cbcg
        }
        for r in results
    ]
```

### ML Model: Isolation Forest (`backend/app/core/ml.py`)

```python
class AnomalyDetector:
    def __init__(self, contamination=0.05):
        """
        Initialize Isolation Forest.
        contamination: The proportion of outliers in the data set (default 5%).
        """
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_jobs=-1
        )
        self.features = ['asr', 'uii', 'tds', 'cbcg', 'aepg']

    def train_and_predict(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Trains the model on provided metrics and returns risk scores (0-100) and levels.
        Lower raw Isolation Forest scores indicate anomalies; we invert to make higher = riskier.
        """
        X = df[self.features].fillna(0)

        # Fit and get anomaly scores
        self.model.fit(X)
        self.raw_scores = self.model.decision_function(X)

        # Normalize to 0-100 scale (higher = more risk)
        min_score = self.raw_scores.min()
        max_score = self.raw_scores.max()

        if max_score == min_score:
            risk_scores = np.zeros(len(self.raw_scores))
        else:
            risk_scores = ((max_score - self.raw_scores) / (max_score - min_score)) * 100

        return risk_scores, self.categorize_risk(risk_scores)

    def categorize_risk(self, scores: np.ndarray) -> np.ndarray:
        """Maps 0-100 scores to Low, Medium, High, Priority"""
        conditions = [
            (scores <= 25),
            (scores > 25) & (scores <= 50),
            (scores > 50) & (scores <= 80),
            (scores > 80)
        ]
        choices = ['Low', 'Medium', 'High', 'Priority']
        return np.select(conditions, choices, default='Low')
```

### Data Processing: Metric Calculation (`backend/app/core/processing.py`)

```python
class MetricEngine:
    @staticmethod
    def calculate_metrics(enrol_df: pd.DataFrame, demo_df: pd.DataFrame,
                         bio_df: pd.DataFrame) -> pd.DataFrame:
        """
        Merge datasets and compute core risk metrics.
        Common keys: district, state, month
        """
        # Normalize date columns to 'month' (YYYY-MM format)
        if 'date' in enrol_df.columns:
            enrol_df['month'] = enrol_df['date']

        # Aggregate enrollment data to district-month level
        base_df = enrol_df.groupby(['state', 'district', 'month']).agg({
           'total_enrolments': 'sum',
           'population_estimate': 'mean',
           'age_0_5': 'sum',
           'age_5_18': 'sum'
        }).reset_index()

        # Aggregate demographic updates
        demo_agg = demo_df.groupby(['state', 'district', 'month']).agg({
            'update_name': 'sum',
            'update_address': 'sum',
            'update_dob': 'sum',
            'update_gender': 'sum',
            'update_mobile': 'sum'
        }).reset_index()
        demo_agg['total_demo_updates'] = (
            demo_agg['update_name'] + demo_agg['update_address'] +
            demo_agg['update_dob'] + demo_agg['update_gender'] +
            demo_agg['update_mobile']
        )

        # Merge datasets and calculate metrics...
        # (See full implementation in processing.py)
```

### Map Component: MapLibre Setup (`frontend/src/components/map/IndiaMap.tsx`)

```typescript
export function IndiaMap({ selectedDistrict, onDistrictSelect, districtsData }: IndiaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize MapLibre GL map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY',
      center: [78.9629, 22.5937], // Center of India
      zoom: 4.5,
      maxZoom: 10,
      minZoom: 4
    });

    // Add district markers
    districtsData.forEach((district) => {
      const markerElement = createMarkerElement(district, false);

      const marker = new maplibregl.Marker(markerElement)
        .setLngLat([district.longitude, district.latitude])
        .addTo(map.current!);

      markerElement.addEventListener('click', () => {
        onDistrictSelect?.(district);
      });

      markersRef.current.push(marker);
    });
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
}
```

### API Client: TypeScript Service (`frontend/src/services/api.ts`)

```typescript
const API_BASE_URL = 'http://localhost:8005/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface NationalSummary {
    total_enrolments: number;
    average_saturation: number;
    national_risk_index: number;
    high_risk_districts: number;
}

export const fetchNationalSummary = async (): Promise<NationalSummary> => {
    const response = await api.get('/national/summary');
    return response.data;
};

export const fetchMapData = async (month?: string): Promise<DistrictMetric[]> => {
    const response = await api.get('/map', { params: { month } });
    return response.data;
};
```

### Routing Setup (`frontend/src/App.tsx`)

```typescript
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anomaly-risk" element={<AnomalyRisk />} />
          <Route path="/temporal-trends" element={<TemporalTrends />} />
          <Route path="/inclusion-equity" element={<InclusionEquity />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

---

## 6. Project Structure

```
aadhaar-insights/
├── backend/                          # FastAPI Backend Server
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app entry point & CORS config
│   │   ├── api/
│   │   │   └── routes.py             # REST API endpoints (5 routes)
│   │   ├── core/
│   │   │   ├── config.py             # Application settings
│   │   │   ├── ml.py                 # Isolation Forest anomaly detection
│   │   │   └── processing.py         # Data ingestion & metric calculation
│   │   ├── db/
│   │   │   ├── database.py           # SQLAlchemy setup & session management
│   │   │   └── models.py             # DistrictMetric ORM model
│   │   └── schemas/
│   │       └── schemas.py            # Pydantic validation schemas
│   ├── data/
│   │   └── datasets/                 # Runtime CSV storage (generated)
│   ├── aari.db                       # SQLite database (development)
│   ├── seed_data.py                  # Mock data generation script
│   ├── test_api.py                   # API endpoint tests
│   ├── requirements.txt              # Python dependencies (11 packages)
│   └── ARCHITECTURE.md               # Backend architecture documentation
│
├── frontend/                         # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── map/                  # Map-related components
│   │   │   │   ├── IndiaMap.tsx      # Main MapLibre GL map component
│   │   │   │   ├── DistrictPopup.tsx # Hover popup for districts
│   │   │   │   ├── KPIOverlay.tsx    # National KPI overlay on map
│   │   │   │   └── MapTooltip.tsx    # Custom tooltips
│   │   │   ├── ui/                   # 50+ Shadcn/UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── ... (47 more)
│   │   │   ├── AppSidebar.tsx        # Navigation sidebar
│   │   │   ├── DashboardLayout.tsx   # Main layout wrapper
│   │   │   ├── DistrictDetailPanel.tsx # Side panel for district details
│   │   │   ├── KPICard.tsx           # Reusable metric cards
│   │   │   └── SparklineChart.tsx    # Inline mini charts
│   │   ├── pages/                    # Route pages (8 views)
│   │   │   ├── Index.tsx             # Main dashboard with map
│   │   │   ├── AnomalyRisk.tsx       # Risk analysis table
│   │   │   ├── TemporalTrends.tsx    # Time-series charts
│   │   │   ├── InclusionEquity.tsx   # Equity metrics
│   │   │   ├── Logs.tsx              # System logs
│   │   │   ├── AdminSummary.tsx      # Executive dashboard
│   │   │   ├── Simulator.tsx         # Data simulator
│   │   │   └── NotFound.tsx          # 404 page
│   │   ├── services/
│   │   │   └── api.ts                # Axios API client & TypeScript interfaces
│   │   ├── data/
│   │   │   └── mockData.ts           # Mock district coordinates & helpers
│   │   ├── hooks/
│   │   │   └── use-mobile.tsx        # Responsive design hook
│   │   ├── lib/
│   │   │   └── utils.ts              # Utility functions (cn, formatters)
│   │   ├── App.tsx                   # Main app with React Router
│   │   └── main.tsx                  # Entry point
│   ├── public/                       # Static assets
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Node dependencies (48 packages)
│   ├── vite.config.ts                # Vite configuration (port 8080)
│   ├── tailwind.config.ts            # TailwindCSS theme configuration
│   ├── tsconfig.json                 # TypeScript compiler options
│   └── README.md                     # Frontend documentation
│
├── datasets/                         # Raw CSV Data (~220MB)
│   ├── enrolment/                    # ~46MB enrollment data
│   │   └── api_data_aadhar_enrolment_*.csv (3 files)
│   ├── demographic_update/           # ~92MB demographic update data
│   │   └── api_data_aadhar_demographic_*.csv (5 files)
│   └── biometric_update/             # ~83MB biometric update data
│       └── api_data_aadhar_biometric_*.csv (4 files)
│
└── README.md                         # Main project documentation
```

### Key File Descriptions

| File | Purpose |
|------|---------|
| `backend/app/main.py` | FastAPI application factory, CORS configuration |
| `backend/app/core/ml.py` | Isolation Forest model training & risk scoring |
| `backend/app/core/processing.py` | ETL pipeline for CSV ingestion & metric calculation |
| `backend/seed_data.py` | Generates mock data for 50 districts × 2 months |
| `frontend/src/components/map/IndiaMap.tsx` | Interactive MapLibre GL map with district markers |
| `frontend/src/pages/Index.tsx` | Main dashboard page combining map + KPIs |
| `frontend/src/services/api.ts` | Centralized API client with TypeScript types |

---

## 7. Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **Python**: v3.9 or higher ([Download](https://www.python.org/downloads/))
- **Git**: For version control ([Download](https://git-scm.com/))

### Installation & Setup

#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd aadhaar-insights
```

#### Step 2: Backend Setup

The backend runs on port **8005**.

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
# .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with mock data (generates aari.db)
python seed_data.py

# Start the FastAPI server
uvicorn app.main:app --reload --port 8005
```

✅ **Backend Ready**: Visit `http://localhost:8005/docs` for interactive API documentation (Swagger UI)

#### Step 3: Frontend Setup

The frontend runs on port **8080** (or next available).

```bash
# Open a new terminal window
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

✅ **Frontend Ready**: Open your browser to `http://localhost:8080/`

### Verification

- **Backend Health Check**: `curl http://localhost:8005/` → Should return `{"status": "ok"}`
- **API Test**: `curl http://localhost:8005/api/national/summary` → Returns JSON with national stats
- **Frontend**: Navigate to dashboard, verify map loads with district markers

### Database Seeding

The `seed_data.py` script generates mock data for:
- **50 districts** across multiple states
- **2 months** of historical data
- **Realistic metrics** with controlled variance

To reseed the database:

```bash
cd backend
rm aari.db  # Delete existing database
python seed_data.py  # Regenerate with fresh data
```

> 📖 **For detailed setup instructions**, see the main [README.md](./README.md)

---

## 8. API Reference

### Base URL

```
http://localhost:8005/api
```

### Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/national/summary` | GET | National aggregated statistics | `NationalSummary` |
| `/api/map` | GET | District-level geospatial & risk data | `DistrictMetric[]` |
| `/api/district/{id}` | GET | Specific district metrics | `DistrictResponse` |
| `/api/district/{id}/trends` | GET | Time-series data for charts | `TrendResponse` |
| `/api/risk/top` | GET | Highest risk districts for triage | `RiskDistrict[]` |

### Example: National Summary

**Request:**
```bash
GET http://localhost:8005/api/national/summary
```

**Response:**
```json
{
  "total_enrolments": 150000000,
  "average_saturation": 87.34,
  "national_risk_index": 23.45,
  "high_risk_districts": 12
}
```

### Interactive API Docs

FastAPI provides automatic interactive documentation:

- **Swagger UI**: `http://localhost:8005/docs`
- **ReDoc**: `http://localhost:8005/redoc`

> 📖 **For detailed API design and security considerations**, see [backend/ARCHITECTURE.md](./backend/ARCHITECTURE.md)

---

## 9. Data Models

### DistrictMetric (SQLAlchemy ORM Model)

**File**: `backend/app/db/models.py`

```python
class DistrictMetric(Base):
    __tablename__ = "district_metrics"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Identifiers
    state = Column(String, index=True)
    district = Column(String, index=True)
    month = Column(String, index=True)  # Format: YYYY-MM

    # Raw Data
    population_estimate = Column(Integer)
    total_enrolments = Column(Integer)

    # Calculated Metrics
    asr = Column(Float)   # Aadhaar Saturation Ratio (0-100+)
    uii = Column(Float)   # Update Intensity Index (0-1)
    tds = Column(Float)   # Temporal Deviation Score (z-score)
    cbcg = Column(Float)  # Child Biometric Compliance Gap (0-1)
    aepg = Column(Float)  # Aadhaar Equity Penetration Gap (0-100)

    # ML-Generated Scores
    risk_score = Column(Float)  # Normalized 0-100 (higher = riskier)
    risk_level = Column(String) # Low | Medium | High | Priority
```

### Metric Definitions

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| **ASR** | (Enrollments / Population) × 100 | Percentage of population enrolled; >100% may indicate duplicates |
| **UII** | Updates / Active Aadhaar Base | Frequency of updates; high values may indicate churn or fraud |
| **TDS** | Z-score of current vs. historical MA | Deviation from normal patterns; ±2 is significant |
| **CBCG** | 1 - (Child Updates / Eligible) | Gap in child biometric compliance; higher = more children missing |
| **AEPG** | 100 - ASR | Percentage of population not enrolled; equity gap measure |

### Data Aggregation Approach

1. **No PII**: All data pre-aggregated at district level before ingestion
2. **Time Granularity**: Monthly snapshots (YYYY-MM format)
3. **Spatial Granularity**: District-level (India has ~700 districts)
4. **Historical Data**: Multi-month rolling window for trend analysis
5. **Normalization**: All district names standardized to lowercase, snake_case

---

## 10. Development Workflow

### Running Locally

1. **Backend** (Terminal 1):
   ```bash
   cd backend
   source venv/bin/activate  # Activate virtual environment
   uvicorn app.main:app --reload --port 8005
   ```

2. **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

### Adding New Features

#### Backend: Adding a New API Endpoint

1. Define Pydantic schema in `backend/app/schemas/schemas.py`
2. Add route handler in `backend/app/api/routes.py`
3. Update database models in `backend/app/db/models.py` if needed
4. Test with `curl` or Postman
5. Verify in Swagger UI at `http://localhost:8005/docs`

#### Frontend: Adding a New Dashboard Page

1. Create page component in `frontend/src/pages/NewPage.tsx`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `frontend/src/components/AppSidebar.tsx`
4. Use React Query for data fetching:
   ```typescript
   const { data, isLoading } = useQuery({
     queryKey: ['myData'],
     queryFn: () => fetchMyData()
   });
   ```

### Testing Approach

**Backend Tests**:
- API endpoint tests in `backend/test_api.py`
- Run with: `pytest` (after installing `pytest`)

**Frontend Tests**:
- Component tests with Vitest (configured in `vite.config.ts`)
- Run with: `npm test`

**Manual Testing**:
1. Use FastAPI Swagger UI for API testing
2. Use browser DevTools Network tab for frontend debugging
3. Check console logs for React errors

### Code Quality

- **Backend**: Follow PEP 8 style guide; use `black` for formatting
- **Frontend**: ESLint configured in `eslint.config.js`; run `npm run lint`
- **TypeScript**: Strict mode enabled in `tsconfig.json`

### Deployment

> 📖 **For deployment instructions**, see:
> - Frontend deployment: [frontend/README.md](./frontend/README.md) (Lovable.dev integration)
> - Backend deployment: [backend/ARCHITECTURE.md](./backend/ARCHITECTURE.md) (production considerations)

---

## 11. References

### Internal Documentation

- **[Main README](./README.md)**: Comprehensive setup guide, project overview, and features
- **[Backend Architecture](./backend/ARCHITECTURE.md)**: Design principles, data pipeline, API design, security considerations
- **[Frontend README](./frontend/README.md)**: Lovable.dev integration, custom domain setup, deployment workflow

### External Resources

#### Technologies
- **[FastAPI Documentation](https://fastapi.tiangolo.com/)**: High-performance Python web framework
- **[React Documentation](https://react.dev/)**: Official React docs and tutorials
- **[MapLibre GL JS](https://maplibre.org/)**: Open-source vector map library
- **[Scikit-learn Isolation Forest](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html)**: Anomaly detection algorithm
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Shadcn/UI](https://ui.shadcn.com/)**: Beautifully designed React components

#### Development Tools
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling
- **[SQLAlchemy](https://www.sqlalchemy.org/)**: Python SQL toolkit and ORM
- **[React Query](https://tanstack.com/query/latest)**: Powerful server state management

### Support & Contributing

For questions, issues, or contributions:
1. Check existing documentation in `/README.md` and `/backend/ARCHITECTURE.md`
2. Review code comments in key files (`routes.py`, `ml.py`, `IndiaMap.tsx`)
3. Consult FastAPI auto-generated docs at `http://localhost:8005/docs`

### Project Metadata

- **Version**: 1.0.0
- **License**: [Add License Information]
- **Last Updated**: January 2026
- **Maintained By**: [Add Maintainer Information]

---

## 🎯 Quick Navigation

- [🏠 Main README](./README.md) - Setup & Features
- [🏗️ Backend Architecture](./backend/ARCHITECTURE.md) - Deep Technical Dive
- [🚀 Frontend Deployment](./frontend/README.md) - Lovable.dev Guide
- [📊 Live Demo](http://localhost:8080/) - Local Development Server
- [📚 API Docs](http://localhost:8005/docs) - Interactive Swagger UI

---

**Built with ❤️ for India's Digital Identity Infrastructure**
