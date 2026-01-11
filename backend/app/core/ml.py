import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from typing import Tuple

class AnomalyDetector:
    def __init__(self, contamination=0.05):
        """
        Initialize Isolation Forest.
        contamination: The proportion of outliers in the data set. 
        """
        self.model = IsolationForest(contamination=contamination, random_state=42, n_jobs=-1)
        self.features = ['asr', 'uii', 'tds', 'cbcg', 'aepg']

    def train_and_predict(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Trains the model on the provided metrics and returns risk scores and levels.
        """
        # Select features for the model
        # Handle nan/inf just in case, though processing should have caught them
        X = df[self.features].fillna(0)
        
        # Fit and Predict
        # Isolation Forest returns -1 for outliers and 1 for inliers
        # decision_function returns anomaly score (lower is more anomalous)
        self.model.fit(X)
        self.raw_scores = self.model.decision_function(X)
        
        # Normalize scores to 0-100 scale where 100 is HIGHEST RISK
        # Raw scores are usually centered around 0, with negative being anomalies
        # We invert this: Lower raw score = Higher Risk
        
        # Min-max normalization helper
        min_score = self.raw_scores.min()
        max_score = self.raw_scores.max()
        
        # Invert: (max - x) / (max - min) * 100
        # If range is 0, default to 0
        if max_score == min_score:
            risk_scores = np.zeros(len(self.raw_scores))
        else:
            risk_scores = ((max_score - self.raw_scores) / (max_score - min_score)) * 100
            
        return risk_scores, self.categorize_risk(risk_scores)

    def categorize_risk(self, scores: np.ndarray) -> np.ndarray:
        """
        Maps 0-100 scores to Low, Medium, High, Priority
        Using fixed thresholds for policy stability, rather than quartiles.
        """
        conditions = [
            (scores <= 25),
            (scores > 25) & (scores <= 50),
            (scores > 50) & (scores <= 80),
            (scores > 80)
        ]
        choices = ['Low', 'Medium', 'High', 'Priority']
        
        # specifically handle numpy array logic
        return np.select(conditions, choices, default='Low')
