"""
BankGuard AI - Feature Engineering Module
Transforms raw customer banking profiles into enriched predictive signals.
Author: abhisheksalotkar1-cmyk
"""

import numpy as np
import pandas as pd


NUMERICAL_FEATURES = [
    "credit_score",
    "age",
    "tenure",
    "balance",
    "num_of_products",
    "estimated_salary",
    "balance_to_salary_ratio",
    "product_density",
    "engagement_score",
]

CATEGORICAL_FEATURES = [
    "geography",
    "gender",
    "has_cr_card",
    "is_active_member",
    "age_group",
    "credit_tier",
]

ALL_MODEL_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES


def assign_credit_tier(score: float) -> str:
    """Categorises credit score into industry-standard tiers."""
    if score >= 800:
        return "Exceptional"
    if score >= 740:
        return "VeryGood"
    if score >= 670:
        return "Good"
    if score >= 580:
        return "Fair"
    return "Poor"


def assign_age_group(age: float) -> str:
    """Binned customer age brackets for demographic stratification."""
    if age < 30:
        return "YoungAdult"
    if age <= 50:
        return "MiddleAge"
    return "Senior"


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Applies transparent, business-grounded financial feature transformations.
    Prevents leakage by computing row-independent ratios and metrics.
    """
    data = df.copy()

    # Normalise column names if from diverse sources
    data.columns = [c.strip().lower().replace(" ", "_") for c in data.columns]

    # Map aliases if legacy or Kaggle dataset names are passed
    rename_map = {
        "customerid": "customer_id",
        "creditscore": "credit_score",
        "numofproducts": "num_of_products",
        "hascrcard": "has_cr_card",
        "isactivemember": "is_active_member",
        "estimatedsalary": "estimated_salary",
        "exited": "churn",
    }
    for old_col, new_col in rename_map.items():
        if old_col in data.columns and new_col not in data.columns:
            data.rename(columns={old_col: new_col}, inplace=True)

    # 1. Financial Leverage Ratio: Balance relative to Estimated Salary
    salary_safe = np.where(data["estimated_salary"] <= 0, 1.0, data["estimated_salary"])
    data["balance_to_salary_ratio"] = np.round(data["balance"] / salary_safe, 4)

    # 2. Product Density: Products held relative to tenure length
    data["product_density"] = np.round(data["num_of_products"] / (data["tenure"] + 1.0), 4)

    # 3. Composite Engagement Index: Active member status + credit card ownership
    data["engagement_score"] = (data["is_active_member"].astype(int) * 2) + data["has_cr_card"].astype(int)

    # 4. Demographic & Credit Tier discretisation
    data["credit_tier"] = data["credit_score"].apply(assign_credit_tier)
    data["age_group"] = data["age"].apply(assign_age_group)

    # Ensure binary flags are integers for consistency
    data["has_cr_card"] = data["has_cr_card"].astype(int)
    data["is_active_member"] = data["is_active_member"].astype(int)

    return data
