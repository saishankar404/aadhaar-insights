import pandas as pd
import numpy as np
import glob
import os
from typing import List, Dict
from app.db.database import SessionLocal, engine, Base
from app.db.models import DistrictMetric

class DataLoader:
    @staticmethod
    def load_dataset(folder_path: str) -> pd.DataFrame:
        """Loads all CSVs in a directory and concatenates them."""
        all_files = glob.glob(os.path.join(folder_path, "*.csv"))
        if not all_files:
            print(f"Warning: No valid CSV files found in {folder_path}")
            return pd.DataFrame()
        
        df_list = []
        for filename in all_files:
            try:
                df = pd.read_csv(filename)
                df_list.append(df)
            except Exception as e:
                print(f"Error reading {filename}: {e}")
        
        if not df_list:
             return pd.DataFrame()
             
        full_df = pd.concat(df_list, ignore_index=True)
        return DataLoader.normalize_columns(full_df)

    @staticmethod
    def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
        """Standardizes column names to snake_case."""
        df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('-', '_')
        return df

class MetricEngine:
    @staticmethod
    def calculate_metrics(enrol_df: pd.DataFrame, demo_df: pd.DataFrame, bio_df: pd.DataFrame) -> pd.DataFrame:
        """
        Merge datasets and compute core risk metrics.
        Assumes common keys: district, state, month (or date normalized to mo).
        """
        # 1. Normalize Date/Month to YYYY-MM
        # Enrolment has 'date', others have 'month'. Standardize to 'month'
        if 'date' in enrol_df.columns:
            enrol_df['month'] = enrol_df['date']
        
        # 2. Aggregation to District-Month level
        # Enrolment is likely already snapshot-based, but we ensure uniqueness
        base_df = enrol_df.groupby(['state', 'district', 'month']).agg({
           'total_enrolments': 'sum',
           'population_estimate': 'mean', # Pop shouldn't sum across chunks if it's snapshot
           'age_0_5': 'sum',
           'age_5_18': 'sum'
        }).reset_index()

        # Demographic Updates Aggregation
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

        # Biometric Updates Aggregation
        bio_agg = bio_df.groupby(['state', 'district', 'month']).agg({
             'update_fingerprint': 'sum',
             'update_iris': 'sum', 
             'update_face': 'sum',
             'child_biometric_updates': 'sum'
        }).reset_index()
        bio_agg['total_bio_updates'] = (
            bio_agg['update_fingerprint'] + bio_agg['update_iris'] + bio_agg['update_face']
        )
        
        # 3. Operations Merge
        merged = pd.merge(base_df, demo_agg, on=['state', 'district', 'month'], how='left').fillna(0)
        merged = pd.merge(merged, bio_agg, on=['state', 'district', 'month'], how='left').fillna(0)

        # 4. Metric Computation
        
        # ASR: Aadhaar Saturation Ratio
        # ASR = total_enrolments / population_estimate * 100
        merged['asr'] = (merged['total_enrolments'] / merged['population_estimate'] * 100).replace([np.inf, -np.inf], 0).fillna(0)
        
        # UII: Update Intensity Index 
        # UII = (demographic_updates + biometric_updates) / active_aadhaar_base (total_enrolments)
        merged['uii'] = ((merged['total_demo_updates'] + merged['total_bio_updates']) / merged['total_enrolments']).replace([np.inf, -np.inf], 0).fillna(0)

        # CBCG: Child Biometric Compliance Gap
        # CBCG = 1 - (completed_child_biometric_updates / eligible_child_records)
        # We use Age 5-18 cohort as eligible proxy if not explicit
        # Note: real world is complex (cohort aging), this is a simplified proxy
        merged['eligible_children_proxy'] = merged['age_5_18'] 
        merged['cbcg'] = (1 - (merged['child_biometric_updates'] / merged['eligible_children_proxy'])).replace([np.inf, -np.inf], 0).fillna(0)
        # Cap at 0 (can't be negative gap in this logic) and 1
        merged['cbcg'] = merged['cbcg'].clip(0, 1)

        # AEPG: Aadhaar Equity Penetration Gap
        # Proxy: Difference between saturation and an ideal 100%, possibly weighted by sub-groups if we had them.
        # For now, simplistic: 100 - ASR (The gap itself)
        merged['aepg'] = (100 - merged['asr']).clip(0, 100)

        # TDS: Temporal Deviation Score
        # We calculate this later or per-group row operation
        # For efficiency, we can do a rolling calc per district
        merged = merged.sort_values(by=['district', 'month'])
        merged['rolling_mean_uii'] = merged.groupby('district')['uii'].transform(lambda x: x.rolling(3, min_periods=1).mean())
        merged['rolling_std_uii'] = merged.groupby('district')['uii'].transform(lambda x: x.rolling(3, min_periods=1).std())
        
        # TDS based on UII spikes
        merged['tds'] = ((merged['uii'] - merged['rolling_mean_uii']) / merged['rolling_std_uii']).fillna(0)
        
        return merged

class DataPipeline:
    def __init__(self, base_dir="backend/data/datasets"):
        self.base_dir = base_dir
        
    def run(self):
        print("Starting Data Pipeline...")
        
        # Ensure Schema Exists
        Base.metadata.create_all(bind=engine)
        
        # 1. Load Data
        print("Loading Enrolment Data...")
        enrol_df = DataLoader.load_dataset(os.path.join(self.base_dir, "enrolment"))
        
        print("Loading Demographic Updates...")
        demo_df = DataLoader.load_dataset(os.path.join(self.base_dir, "demographic_update"))
        
        print("Loading Biometric Updates...")
        bio_df = DataLoader.load_dataset(os.path.join(self.base_dir, "biometric_update"))
        
        if enrol_df.empty:
            print("CRITICAL: No enrolment data found. Aborting.")
            return

        # 2. Compute Metrics
        print("Computing Metrics...")
        metrics_df = MetricEngine.calculate_metrics(enrol_df, demo_df, bio_df)
        
        # 3. Apply ML
        print("Running Anomaly Detection...")
        from app.core.ml import AnomalyDetector
        
        detector = AnomalyDetector()
        scores, levels = detector.train_and_predict(metrics_df)
        
        metrics_df['risk_score'] = scores
        metrics_df['risk_level'] = levels

        # 4. Save to DB
        print("Saving to Database...")
        db = SessionLocal()
        # Simple upsert or recreate logic
        # For MVP, we wipe and load since it's a "Load all CSVs" task
        db.query(DistrictMetric).delete() # Warning: Destructive
        
        for _, row in metrics_df.iterrows():
            record = DistrictMetric(
                state=row['state'],
                district=row['district'],
                month=row['month'],
                population_estimate=row['population_estimate'],
                total_enrolments=row['total_enrolments'],
                asr=row['asr'],
                uii=row['uii'],
                tds=row['tds'],
                cbcg=row['cbcg'],
                aepg=row['aepg'],
                risk_score=row['risk_score'],
                risk_level=str(row['risk_level'])
            )
            db.add(record)
        
        db.commit()
        db.close()
        print("Pipeline Completed Successfully.")

if __name__ == "__main__":
    pipeline = DataPipeline()
    pipeline.run()
