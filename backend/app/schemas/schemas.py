from pydantic import BaseModel
from typing import Optional

class NationalSummary(BaseModel):
    total_enrolments: int
    average_saturation: float
    national_risk_index: float
    high_risk_districts: int

class DistrictResponse(BaseModel):
    district: str
    state: str
    risk_score: float
    risk_level: str
    asr: float
    uii: float
    tds: float
    
class RiskDistrict(DistrictResponse):
    pass
    
class TrendResponse(BaseModel):
    month: str
    uii: float
    asr: float
    risk_score: float
