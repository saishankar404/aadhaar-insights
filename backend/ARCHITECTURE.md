# AARI Backend Architecture

## 1. Design Principles
- **Privacy-First**: No PII processing. Aggregated data only.
- **Explainable AI**: No black-box models. Logic is explicit and transparent.
- **Assistive Intelligence**: System flags anomalies for human review, never makes decisions.
- **Policy-Grade Language**: strictly neutral, non-accusatory terminology.

## 2. System Context
The backend serves a React + Tailwind frontend. It ingests UIDAI aggregated datasets (CSV), processes them into metrics, runs unsupervised anomaly detection, and serves JSON via REST APIs.

## 3. Tech Stack
- **Language**: Python 3.10+
- **API Framework**: FastAPI
- **Data Processing**: Pandas, NumPy
- **Machine Learning**: Scikit-learn (Isolation Forest)
- **Database**: SQLite (Development) / PostgreSQL (Production ready approach code)
- **ORM**: SQLAlchemy

## 4. Data Pipeline
1.  **Ingestion**: Load CSVs containing district-level monthly stats.
2.  **Normalization**: Standardize district names and column headers.
3.  **Metric Computation**:
    - `Aadhaar Saturation`: (Enrolments / Population) * 100
    - `Update Intensity`: (Updates / Active Aadhaar)
    - `Child Compliance Gap`: 1 - (Child Updates / Eligible)
    - `Temporal Deviation`: Z-score of current metric vs historical moving average.
4.  **Anomaly Detection**:
    - Input: Computed metrics.
    - Model: Isolation Forest (unsupervised).
    - Output: `risk_score` (-1 to 1 scale normalized to 0-100), mapped to `Low`, `Medium`, `High`, `Priority`.
5.  **Storage**: Save results to `DistrictMetrics` table.

## 5. Folder Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Entry point
│   ├── api/                 # Route handlers
│   │   ├── routes.py
│   ├── core/                # Config & Logic
│   │   ├── config.py
│   │   ├── processing.py    # Data ingestion & metrics usage
│   │   ├── ml.py            # Isolation Forest logic
│   ├── db/                  # Database
│   │   ├── database.py
│   │   ├── models.py
│   ├── schemas/             # Pydantic models
│   │   ├── schemas.py
├── data/                    # Raw CSV storage (gitignored usually)
├── requirements.txt
├── README.md
```

## 6. API Design
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/national/summary` | GET | National aggregated stats. |
| `/api/map` | GET | District-level geospatial & risk data. |
| `/api/district/{id}` | GET | Specific district metrics. |
| `/api/district/{id}/trends` | GET | Time-series for charts. |
| `/api/risk/top` | GET | Highest risk districts for triage. |

## 7. Security & Compliance
- **Input Validation**: Strict typing with Pydantic.
- **Sanitization**: No raw SQL queries.
- **Logging**: Audit logs for data ingestion and risk scoring.
