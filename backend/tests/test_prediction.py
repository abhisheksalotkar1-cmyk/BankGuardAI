"""
Unit tests for Churn Prediction & Risk Scoring Module
"""

from ml.prediction import ChurnPredictor, generate_retention_recommendations
from ml.explainability import compute_factor_contributions


def test_predictor_loads_and_infers():
    predictor = ChurnPredictor()
    sample = {
        "customer_id": 999999,
        "credit_score": 680,
        "geography": "France",
        "gender": "Female",
        "age": 45,
        "tenure": 3,
        "balance": 90000.0,
        "num_of_products": 1,
        "has_cr_card": 1,
        "is_active_member": 0,
        "estimated_salary": 65000.0,
    }

    result = predictor.predict_customer(sample)
    assert "churn_probability" in result
    assert 0.0 <= result["churn_probability"] <= 1.0
    assert result["risk_level"] in ["Low Risk", "Medium Risk", "High Risk"]
    assert len(result["contributing_factors"]) > 0
    assert len(result["retention_recommendations"]) > 0
    assert "disclaimer" in result


def test_risk_recommendation_logic():
    sample_high_risk = {
        "is_active_member": 0,
        "num_of_products": 1,
        "balance": 120000.0,
        "estimated_salary": 50000.0,
        "age": 55,
    }
    recs = generate_retention_recommendations(sample_high_risk, 0.85, "High Risk")
    actions = [r["action"] for r in recs]
    assert any("Health Check" in a or "Asset Retention" in a for a in actions)


def test_factor_contributions_dormancy():
    sample = {"is_active_member": 0, "age": 55, "num_of_products": 1, "balance": 150000.0}
    factors = compute_factor_contributions(sample)
    factor_names = [f["factor"] for f in factors]
    assert any("Inactive" in f or "Dormant" in f for f in factor_names)
