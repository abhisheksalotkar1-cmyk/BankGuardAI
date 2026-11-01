"""
BankGuard AI - Model Performance & Benchmark Telemetry API
Author: abhisheksalotkar1-cmyk
"""

import json
import os
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/models", tags=["Model Telemetry"])


@router.get("/performance")
def get_model_performance():
    """
    Returns authentic, calculated performance metrics for all compared models,
    including confusion matrix, ROC points, PR points, and feature importance rankings.
    """
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    project_root = os.path.dirname(backend_dir)
    json_path = os.path.join(project_root, "models", "artifacts", "model_comparison.json")

    if not os.path.exists(json_path):
        raise HTTPException(
            status_code=404,
            detail="Model comparison artifacts not found. Run training pipeline first.",
        )

    with open(json_path, "r") as f:
        data = json.load(f)

    return data
