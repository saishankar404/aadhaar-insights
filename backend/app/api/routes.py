from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import SessionLocal
from app.db.models import DistrictMetric
from app.schemas.schemas import NationalSummary, DistrictResponse, RiskDistrict, TrendResponse # We need to create these schemas
from sqlalchemy import func, desc

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/national/summary")
def get_national_summary(db: Session = Depends(get_db)):
    """Returns aggregated national statistics."""
    # Aggregation query
    total_enrolments = db.query(func.sum(DistrictMetric.total_enrolments)).scalar() or 0
    avg_saturation = db.query(func.avg(DistrictMetric.asr)).scalar() or 0
    avg_risk = db.query(func.avg(DistrictMetric.risk_score)).scalar() or 0
    
    high_risk_count = db.query(DistrictMetric).filter(
        (DistrictMetric.risk_level == 'High') | (DistrictMetric.risk_level == 'Priority')
    ).count()

    return {
        "total_enrolments": total_enrolments,
        "average_saturation": round(avg_saturation, 2),
        "national_risk_index": round(avg_risk, 2),
        "high_risk_districts": high_risk_count
    }

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
            "risk_score": round(r.risk_score, 1),
            "risk_level": r.risk_level,
            "asr": round(r.asr, 1),
            "uii": round(r.uii, 3) if r.uii is not None else 0,
            "tds": round(r.tds, 2) if r.tds is not None else 0,
            "aepg": round(r.aepg, 1) if r.aepg is not None else 0,
            "cbcg": round(r.cbcg, 1) if r.cbcg is not None else 0,
        }
        for r in results
    ]

@router.get("/district/{district_id}")
def get_district_details(district_id: str, db: Session = Depends(get_db)):
    """Get latest metrics for a specific district."""
    # Assuming district_id is the name for now, or we should map ID. 
    # In real system we'd use int ID. Here we use name matching.
    metric = db.query(DistrictMetric).filter(DistrictMetric.district == district_id).order_by(desc(DistrictMetric.month)).first()
    
    if not metric:
        raise HTTPException(status_code=404, detail="District not found")
    
    return metric

@router.get("/district/{district_id}/trends")
def get_district_trends(district_id: str, db: Session = Depends(get_db)):
    """Get historical metrics for trend analysis."""
    metrics = db.query(DistrictMetric).filter(DistrictMetric.district == district_id).order_by(DistrictMetric.month).all()
    
    return [
        {
            "month": m.month,
            "uii": m.uii,
            "asr": m.asr,
            "risk_score": m.risk_score
        }
        for m in metrics
    ]

@router.get("/risk/top")
def get_top_risk_districts(limit: int = 10, db: Session = Depends(get_db)):
    """Returns top N highest risk districts."""
    results = db.query(DistrictMetric).order_by(desc(DistrictMetric.risk_score)).limit(limit).all()
    return results
