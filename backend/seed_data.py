import pandas as pd
import numpy as np
import os
import shutil
from datetime import date
from app.db.database import SessionLocal, engine, Base
from app.db.models import DistrictMetric

BASE_DIR = "backend/data/datasets"

# Real District Data from frontend + supplements
REAL_DISTRICTS = [
    # Frontend High risk
    {"name": "Tawang", "state": "Arunachal Pradesh"},
    {"name": "Kiphire", "state": "Nagaland"},
    {"name": "Churachandpur", "state": "Manipur"},
    {"name": "West Garo Hills", "state": "Meghalaya"},
    {"name": "Leh", "state": "Ladakh"},
    {"name": "Champhai", "state": "Mizoram"},
    # Frontend Medium risk
    {"name": "Kupwara", "state": "Jammu and Kashmir"},
    {"name": "Gumla", "state": "Jharkhand"},
    {"name": "Malkangiri", "state": "Odisha"},
    {"name": "Bijapur", "state": "Chhattisgarh"},
    # Frontend Low risk
    {"name": "South Delhi", "state": "Delhi"},
    {"name": "Hyderabad", "state": "Telangana"},
    {"name": "Bangalore Urban", "state": "Karnataka"},
    {"name": "Mumbai Suburban", "state": "Maharashtra"},
    {"name": "Chennai", "state": "Tamil Nadu"},
    {"name": "Ernakulam", "state": "Kerala"},
    {"name": "Lucknow", "state": "Uttar Pradesh"},
    {"name": "Jaipur", "state": "Rajasthan"},
    {"name": "Ahmedabad", "state": "Gujarat"},
    {"name": "Kolkata", "state": "West Bengal"},
    {"name": "Patna", "state": "Bihar"},
    # Supplements to reach ~50
    {"name": "Pune", "state": "Maharashtra"},
    {"name": "Nagpur", "state": "Maharashtra"},
    {"name": "Thane", "state": "Maharashtra"},
    {"name": "Nashik", "state": "Maharashtra"},
    {"name": "Indore", "state": "Madhya Pradesh"},
    {"name": "Bhopal", "state": "Madhya Pradesh"},
    {"name": "Gwalior", "state": "Madhya Pradesh"},
    {"name": "Jabalpur", "state": "Madhya Pradesh"},
    {"name": "Surat", "state": "Gujarat"},
    {"name": "Vadodara", "state": "Gujarat"},
    {"name": "Rajkot", "state": "Gujarat"},
    {"name": "Ludhiana", "state": "Punjab"},
    {"name": "Amritsar", "state": "Punjab"},
    {"name": "Jalandhar", "state": "Punjab"},
    {"name": "Visakhapatnam", "state": "Andhra Pradesh"},
    {"name": "Vijayawada", "state": "Andhra Pradesh"},
    {"name": "Guntur", "state": "Andhra Pradesh"},
    {"name": "Coimbatore", "state": "Tamil Nadu"},
    {"name": "Madurai", "state": "Tamil Nadu"},
    {"name": "Tiruchirappalli", "state": "Tamil Nadu"},
    {"name": "Kanpur", "state": "Uttar Pradesh"},
    {"name": "Ghaziabad", "state": "Uttar Pradesh"},
    {"name": "Agra", "state": "Uttar Pradesh"},
    {"name": "Varanasi", "state": "Uttar Pradesh"},
    {"name": "Meerut", "state": "Uttar Pradesh"},
    {"name": "Prayagraj", "state": "Uttar Pradesh"},
    {"name": "Ranchi", "state": "Jharkhand"},
    {"name": "Jamshedpur", "state": "Jharkhand"},
    {"name": "Dhanbad", "state": "Jharkhand"},
    {"name": "Raipur", "state": "Chhattisgarh"},
    {"name": "Bhilai", "state": "Chhattisgarh"},
]

def clean_data_dir():
    if os.path.exists(BASE_DIR):
        shutil.rmtree(BASE_DIR)
    os.makedirs(BASE_DIR)

def generate_chunked_data():
    """Generates synthetic policy data split across folders and chunked CSVs."""
    clean_data_dir()
    
    districts_list = [d["name"] for d in REAL_DISTRICTS]
    states_list = [d["state"] for d in REAL_DISTRICTS]
    
    # We'll maintain consistency: District[i] is always in State[i]
    
    months = ["2023-10", "2023-11"]
    
    # 1. Enrolment Dataset
    print("Generating Enrolment Dataset...")
    enrolment_dir = os.path.join(BASE_DIR, "enrolment")
    os.makedirs(enrolment_dir, exist_ok=True)
    
    enrolment_data = []
    for m in months:
        for d, s in zip(districts_list, states_list):
            # Vary population by "type" of district somewhat randomly but realistically
            # High profile cities get more pop
            is_metro = d in ["Mumbai Suburban", "South Delhi", "Bangalore Urban", "Chennai", "Kolkata", "Hyderabad"]
            pop = np.random.randint(1000000, 10000000) if is_metro else np.random.randint(50000, 2000000)
            
            # Saturation logic: Metros high, Remote low
            if d in ["Tawang", "Kiphire", "Churachandpur", "Leh"]: # Remote
                sat_ratio = np.random.uniform(0.6, 0.8)
            else:
                sat_ratio = np.random.uniform(0.85, 1.0)
                
            total_enrolled = int(pop * sat_ratio)
            
            enrolment_data.append({
                "Date": m,
                "State": s,
                "District": d,
                "Pin_Code": 100000 + np.random.randint(1, 90000),
                "Age_0_5": int(total_enrolled * 0.1),
                "Age_5_18": int(total_enrolled * 0.25),
                "Age_18_Plus": int(total_enrolled * 0.65),
                "Total_Enrolments": total_enrolled,
                "Population_Estimate": pop
            })
    
    df_enrolment = pd.DataFrame(enrolment_data)
    # Split into 2 files
    mid = len(df_enrolment) // 2
    df_enrolment.iloc[:mid].to_csv(os.path.join(enrolment_dir, "api_data_aadhar_enrolment_0_50.csv"), index=False)
    df_enrolment.iloc[mid:].to_csv(os.path.join(enrolment_dir, "api_data_aadhar_enrolment_50_100.csv"), index=False)

    # 2. Demographic Update Dataset
    print("Generating Demographic Update Dataset...")
    demo_dir = os.path.join(BASE_DIR, "demographic_update")
    os.makedirs(demo_dir, exist_ok=True)
    
    demo_data = []
    for m in months:
         for d, s in zip(districts_list, states_list):
            # Metros have more updates
            base_updates = 5000 if d in ["Mumbai Suburban", "South Delhi"] else 500
            
            demo_data.append({
                "Month": m,
                "State": s,
                "District": d,
                "Update_Name": np.random.randint(base_updates * 0.1, base_updates * 0.5),
                "Update_Address": np.random.randint(base_updates * 0.2, base_updates),
                "Update_DOB": np.random.randint(base_updates * 0.05, base_updates * 0.2),
                "Update_Gender": np.random.randint(0, base_updates * 0.1),
                "Update_Mobile": np.random.randint(base_updates, base_updates * 5)
            })
            
    df_demo = pd.DataFrame(demo_data)
    # Split into 3 files
    chunk_size = len(df_demo) // 3
    df_demo.iloc[:chunk_size].to_csv(os.path.join(demo_dir, "api_data_aadhar_demographic_0_33.csv"), index=False)
    df_demo.iloc[chunk_size:2*chunk_size].to_csv(os.path.join(demo_dir, "api_data_aadhar_demographic_33_66.csv"), index=False)
    df_demo.iloc[2*chunk_size:].to_csv(os.path.join(demo_dir, "api_data_aadhar_demographic_66_100.csv"), index=False)

    # 3. Biometric Update Dataset
    print("Generating Biometric Update Dataset...")
    bio_dir = os.path.join(BASE_DIR, "biometric_update")
    os.makedirs(bio_dir, exist_ok=True)
    
    bio_data = []
    for m in months:
        for d, s in zip(districts_list, states_list):
             # Logic: Low compliance in some districts for risk simulation
             is_risk = d in ["Tawang", "Kiphire"]
             bio_base = 200 if is_risk else 2000
             
             bio_data.append({
                "Month": m,
                "State": s,
                "District": d,
                "Update_Fingerprint": np.random.randint(bio_base, bio_base * 3),
                "Update_Iris": np.random.randint(bio_base * 0.5, bio_base),
                "Update_Face": np.random.randint(bio_base * 0.1, bio_base * 0.5),
                "Child_Biometric_Updates": np.random.randint(bio_base * 0.5, bio_base * 1.5),
            })

    df_bio = pd.DataFrame(bio_data)
    df_bio.iloc[:mid].to_csv(os.path.join(bio_dir, "api_data_aadhar_biometric_0_50.csv"), index=False)
    df_bio.iloc[mid:].to_csv(os.path.join(bio_dir, "api_data_aadhar_biometric_50_100.csv"), index=False)
    
    print(f"Data generation complete at {BASE_DIR}")
    return BASE_DIR

if __name__ == "__main__":
    generate_chunked_data()
