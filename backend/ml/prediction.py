"""
BankGuard AI - Churn Risk & Retention Recommendation Inference Engine
Author: abhisheksalotkar1-cmyk
"""

import os
import sys
from typing import Dict, Any, List
import joblib
import numpy as np
import pandas as pd

# Ensure backend root is on sys.path
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from ml.explainability import compute_factor_contributions
from ml.feature_engineering import ALL_MODEL_FEATURES, engineer_features


DEFAULT_THRESHOLDS = {
    "low_max": 0.30,
    "medium_max": 0.65,
}

LEGAL_DISCLAIMER = (
    "Prediction is an empirical statistical estimate based on trained historical patterns, "
    "intended for analytical decision support and not absolute certainty."
)


def generate_retention_recommendations(
    customer_data: Dict[str, Any],
    churn_probability: float,
    risk_level: str,
) -> List[Dict[str, str]]:
    """
    Transparent, rule-based retention decision rules based on risk tier and behavioral indicators.
    Does NOT initiate automated spam or untargeted actions.
    """
    recommendations = []
    is_active = int(customer_data.get("is_active_member", 1))
    products = int(customer_data.get("num_of_products", 1))
    balance = float(customer_data.get("balance", 0.0))
    salary = float(customer_data.get("estimated_salary", 50000.0))
    age = float(customer_data.get("age", 40))

    if risk_level == "High Risk":
        # Rule 1: High risk + Dormancy
        if is_active == 0:
            recommendations.append({
                "action": "Proactive Personal Health Check",
                "priority": "Urgent",
                "channel": "Dedicated Relationship Manager Call",
                "description": "Customer is disengaged with zero recent activity. Schedule a discreet service quality check-in to identify unresolved issues or friction points.",
            })

        # Rule 2: High risk + High Balance at flight risk
        if balance > 75000:
            recommendations.append({
                "action": "Asset Retention & Term Deposit Incentive",
                "priority": "High",
                "channel": "Private Wealth Advisor Consultation",
                "description": f"Significant capital balance (€{balance:,.2f}) at risk of migration. Offer a competitive fixed-rate savings tier or priority fee waiver package.",
            })

        # Rule 3: Single product dependency
        if products == 1:
            recommendations.append({
                "action": "Multi-Product Engagement Offer",
                "priority": "Medium",
                "channel": "In-App Tailored Notification",
                "description": "Account is tied to only 1 product. Offer complimentary enrollment in automated high-yield savings or premium rewards card with 0 introductory fee.",
            })

        # Rule 4: Mature demographic
        if age >= 50:
            recommendations.append({
                "action": "Retirement & Estate Advisory Session",
                "priority": "Medium",
                "channel": "Branch Advisor Appointment",
                "description": "Invite customer for a complimentary retirement planning review or liquidity management consultation.",
            })

    elif risk_level == "Medium Risk":
        if is_active == 0:
            recommendations.append({
                "action": "Digital Re-Engagement Campaign",
                "priority": "Medium",
                "channel": "Digital Banking App Prompt",
                "description": "Highlight newly launched features (e.g. instant virtual debit card, round-up savings) to restore everyday login cadence.",
            })
        if products == 1:
            recommendations.append({
                "action": "Cross-Sell Relationship Deepening",
                "priority": "Low",
                "channel": "Email Statement Featurette",
                "description": "Recommend linking a secondary emergency reserve account with 0 maintenance fee.",
            })
        if balance > 50000:
            recommendations.append({
                "action": "Interest Rate Optimization Notification",
                "priority": "Low",
                "channel": "Mobile Banking Notification",
                "description": "Alert customer to automated interest optimization to enhance yields on stagnant liquid checking funds.",
            })

    else:
        # Low risk: Standard relationship health
        recommendations.append({
            "action": "Relationship Maintenance & Loyalty Appreciation",
            "priority": "Routine",
            "channel": "Quarterly Relationship Newsletter",
            "description": "Customer demonstrates healthy multi-faceted engagement. Maintain positive rapport with standard annual tier review.",
        })

    # Fallback safe recommendation if none matched
    if not recommendations:
        recommendations.append({
            "action": "Standard Account Monitoring",
            "priority": "Low",
            "channel": "Standard System Monitoring",
            "description": "Maintain standard quarterly engagement tracking without active intervention.",
        })

    return recommendations


class ChurnPredictor:
    """
    Encapsulates trained scikit-learn pipeline inference,
    risk categorization, explainability attribution, and retention suggestions.
    """

    def __init__(self, model_path: str = None):
        if model_path is None:
            backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(
                os.path.dirname(backend_dir), "models", "artifacts", "best_model_pipeline.joblib"
            )
        self.model_path = model_path
        self.pipeline = None
        self._load_pipeline()

    def _load_pipeline(self):
        if os.path.exists(self.model_path):
            self.pipeline = joblib.load(self.model_path)
        else:
            raise FileNotFoundError(
                f"Trained model pipeline not found at {self.model_path}. Run training.py first."
            )

    def predict_customer(
        self,
        customer_dict: Dict[str, Any],
        thresholds: Dict[str, float] = None,
    ) -> Dict[str, Any]:
        """
        Executes prediction pipeline for a single customer profile.
        """
        if thresholds is None:
            thresholds = DEFAULT_THRESHOLDS

        # Build single row dataframe
        df_raw = pd.DataFrame([customer_dict])
        df_enriched = engineer_features(df_raw)

        # Features required by model
        X = df_enriched[ALL_MODEL_FEATURES]

        # Model inference
        proba = float(self.pipeline.predict_proba(X)[0, 1])
        proba_percent = round(proba * 100.0, 2)

        # Categorise risk tier
        if proba <= thresholds.get("low_max", 0.30):
            risk_level = "Low Risk"
            badge_color = "emerald"
        elif proba <= thresholds.get("medium_max", 0.65):
            risk_level = "Medium Risk"
            badge_color = "amber"
        else:
            risk_level = "High Risk"
            badge_color = "rose"

        # Model prediction label (default 0.5 threshold for binary classification)
        predicted_churn = int(proba >= 0.50)

        # Factor contributions for explainability
        factor_breakdown = compute_factor_contributions(customer_dict)

        # Tailored retention strategy recommendations
        retention_actions = generate_retention_recommendations(customer_dict, proba, risk_level)

        return {
            "customer_id": customer_dict.get("customer_id", "REF-N/A"),
            "predicted_churn": predicted_churn,
            "churn_probability": round(proba, 4),
            "churn_probability_percentage": proba_percent,
            "risk_level": risk_level,
            "badge_color": badge_color,
            "thresholds_used": thresholds,
            "confidence_score": round(abs(proba - 0.5) * 2.0, 4),
            "contributing_factors": factor_breakdown,
            "retention_recommendations": retention_actions,
            "disclaimer": LEGAL_DISCLAIMER,
        }
