"""
BankGuard AI - Preprocessing & Pipeline Architecture
Author: abhisheksalotkar1-cmyk
"""

import sys
import os
from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Ensure backend root is on sys.path
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from ml.feature_engineering import (
    ALL_MODEL_FEATURES,
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
    engineer_features,
)

REQUIRED_RAW_COLUMNS = [
    "credit_score",
    "geography",
    "gender",
    "age",
    "tenure",
    "balance",
    "num_of_products",
    "has_cr_card",
    "is_active_member",
    "estimated_salary",
]


def validate_and_clean_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Validates uploaded or ingested customer datasets.
    Checks column presence, missing values, duplicates, and range boundaries.
    """
    cleaned = df.copy()
    cleaned.columns = [c.strip().lower().replace(" ", "_") for c in cleaned.columns]

    # Handle standard alias columns
    alias_map = {
        "customerid": "customer_id",
        "creditscore": "credit_score",
        "numofproducts": "num_of_products",
        "hascrcard": "has_cr_card",
        "isactivemember": "is_active_member",
        "estimatedsalary": "estimated_salary",
        "exited": "churn",
    }
    for old, new in alias_map.items():
        if old in cleaned.columns and new not in cleaned.columns:
            cleaned.rename(columns={old: new}, inplace=True)

    missing_cols = [col for col in REQUIRED_RAW_COLUMNS if col not in cleaned.columns]
    if missing_cols:
        raise ValueError(f"Missing required banking feature columns: {missing_cols}")

    total_initial = len(cleaned)
    initial_duplicates = int(cleaned.duplicated(subset=["customer_id"]).sum()) if "customer_id" in cleaned.columns else 0

    # Drop duplicate customer IDs if present
    if "customer_id" in cleaned.columns:
        cleaned.drop_duplicates(subset=["customer_id"], keep="first", inplace=True)

    # Impute or fill realistic defaults for minor missing records without dropping silently
    missing_report = cleaned[REQUIRED_RAW_COLUMNS].isnull().sum().to_dict()

    if cleaned["credit_score"].isnull().any():
        cleaned["credit_score"] = cleaned["credit_score"].fillna(cleaned["credit_score"].median())
    if cleaned["age"].isnull().any():
        cleaned["age"] = cleaned["age"].fillna(cleaned["age"].median())
    if cleaned["tenure"].isnull().any():
        cleaned["tenure"] = cleaned["tenure"].fillna(cleaned["tenure"].median())
    if cleaned["balance"].isnull().any():
        cleaned["balance"] = cleaned["balance"].fillna(0.0)
    if cleaned["num_of_products"].isnull().any():
        cleaned["num_of_products"] = cleaned["num_of_products"].fillna(1)
    if cleaned["has_cr_card"].isnull().any():
        cleaned["has_cr_card"] = cleaned["has_cr_card"].fillna(1)
    if cleaned["is_active_member"].isnull().any():
        cleaned["is_active_member"] = cleaned["is_active_member"].fillna(1)
    if cleaned["estimated_salary"].isnull().any():
        cleaned["estimated_salary"] = cleaned["estimated_salary"].fillna(cleaned["estimated_salary"].median())
    if cleaned["geography"].isnull().any():
        cleaned["geography"] = cleaned["geography"].fillna("France")
    if cleaned["gender"].isnull().any():
        cleaned["gender"] = cleaned["gender"].fillna("Female")

    # Value range sanity checks
    cleaned["credit_score"] = cleaned["credit_score"].clip(300, 850)
    cleaned["age"] = cleaned["age"].clip(18, 100)
    cleaned["tenure"] = cleaned["tenure"].clip(0, 20)
    cleaned["balance"] = cleaned["balance"].clip(lower=0.0)
    cleaned["num_of_products"] = cleaned["num_of_products"].clip(1, 4)
    cleaned["estimated_salary"] = cleaned["estimated_salary"].clip(lower=0.0)

    # Apply behavioral feature transformations
    enriched = engineer_features(cleaned)

    audit_summary = {
        "total_records_processed": total_initial,
        "valid_records_retained": len(enriched),
        "duplicate_records_removed": initial_duplicates,
        "missing_values_imputed": missing_report,
        "features_available": list(enriched.columns),
    }

    return enriched, audit_summary


def build_preprocessor() -> ColumnTransformer:
    """
    Constructs an isolated Sklearn ColumnTransformer.
    Numerical features are standard scaled; Categorical features are One-Hot Encoded.
    """
    num_pipe = StandardScaler()
    cat_pipe = OneHotEncoder(handle_unknown="ignore", sparse_output=False)

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipe, NUMERICAL_FEATURES),
            ("cat", cat_pipe, CATEGORICAL_FEATURES),
        ],
        remainder="drop",
    )
    return preprocessor
