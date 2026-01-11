from sqlalchemy import Column, Integer, String, Float, Date
from app.db.database import Base

class DistrictMetric(Base):
    __tablename__ = "district_metrics"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, index=True)
    district = Column(String, index=True)
    month = Column(String, index=True) # Storing as YYYY-MM string for simplicity or Date
    
    # Core Metrics
    population_estimate = Column(Integer)
    total_enrolments = Column(Integer)
    
    # Calculated Metrics
    asr = Column(Float)  # Aadhaar Saturation Ratio
    uii = Column(Float)  # Update Intensity Index
    tds = Column(Float)  # Temporal Deviation Score
    cbcg = Column(Float) # Child Biometric Compliance Gap
    aepg = Column(Float) # Aadhaar Equity Penetration Gap
    
    # ML Scoring
    risk_score = Column(Float) # Normalized 0-100
    risk_level = Column(String) # Low, Medium, High, Priority
