"""
Unit tests for Preprocessing & Validation Module
"""

import pytest
import pandas as pd
from ml.preprocessing import validate_and_clean_data, build_preprocessor


def test_validate_and_clean_data_success():
    df = pd.DataFrame([{
        "customer_id": 101,
        "surname": "Smith",
        "credit_score": 620,
        "geography": "Germany",
        "gender": "Male",
        "age": 42,
        "tenure": 5,
        "balance": 80000.0,
        "num_of_products": 1,
        "has_cr_card": 1,
        "is_active_member": 0,
        "estimated_salary": 75000.0,
    }])

    cleaned, audit = validate_and_clean_data(df)
    assert len(cleaned) == 1
    assert audit["valid_records_retained"] == 1
    assert audit["duplicate_records_removed"] == 0


def test_validate_missing_columns_raises_error():
    df = pd.DataFrame([{
        "customer_id": 102,
        "surname": "Doe",
        "credit_score": 600,
        # missing age, tenure, geography etc
    }])

    with pytest.raises(ValueError) as exc:
        validate_and_clean_data(df)
    assert "Missing required banking feature columns" in str(exc.value)


def test_build_preprocessor_transformers():
    preprocessor = build_preprocessor()
    assert preprocessor is not None
    transformer_names = [t[0] for t in preprocessor.transformers]
    assert "num" in transformer_names
    assert "cat" in transformer_names
