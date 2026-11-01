"""
Unit tests for Feature Engineering Module
"""

import pandas as pd
from ml.feature_engineering import (
    assign_credit_tier,
    assign_age_group,
    engineer_features,
)


def test_credit_tier_assignment():
    assert assign_credit_tier(820) == "Exceptional"
    assert assign_credit_tier(750) == "VeryGood"
    assert assign_credit_tier(680) == "Good"
    assert assign_credit_tier(600) == "Fair"
    assert assign_credit_tier(500) == "Poor"


def test_age_group_assignment():
    assert assign_age_group(25) == "YoungAdult"
    assert assign_age_group(40) == "MiddleAge"
    assert assign_age_group(60) == "Senior"


def test_engineer_features_derives_metrics():
    df = pd.DataFrame([{
        "customer_id": 1,
        "credit_score": 700,
        "geography": "France",
        "gender": "Female",
        "age": 35,
        "tenure": 4,
        "balance": 50000.0,
        "num_of_products": 2,
        "has_cr_card": 1,
        "is_active_member": 1,
        "estimated_salary": 100000.0,
    }])

    enriched = engineer_features(df)
    assert "balance_to_salary_ratio" in enriched.columns
    assert "product_density" in enriched.columns
    assert "engagement_score" in enriched.columns
    assert "credit_tier" in enriched.columns
    assert "age_group" in enriched.columns

    assert enriched["balance_to_salary_ratio"].iloc[0] == 0.5
    assert enriched["engagement_score"].iloc[0] == 3
    assert enriched["credit_tier"].iloc[0] == "Good"
    assert enriched["age_group"].iloc[0] == "MiddleAge"
