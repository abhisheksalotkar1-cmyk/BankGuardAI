"""
BankGuard AI - Real-Time Prediction Studio API Router
Author: abhisheksalotkar1-cmyk
"""

import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import PredictionAudit
from app.schemas.customer import PredictRequest, PredictResponse
from ml.prediction import ChurnPredictor

router = APIRouter(prefix="/predict", tags=["Prediction Studio"])
_predictor = None


def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = ChurnPredictor()
    return _predictor


@router.post("", response_model=PredictResponse)
def predict_churn_risk(
    payload: PredictRequest,
    db: Session = Depends(get_db),
):
    """
    Evaluates individual customer risk profile in real-time.
    Returns churn probability, risk level, contributing factors, and retention actions.
    """
    predictor = get_predictor()
    data_dict = payload.model_dump()

    prediction_result = predictor.predict_customer(data_dict)

    # Record audit log without sensitive PII
    try:
        audit_entry = PredictionAudit(
            customer_reference=str(prediction_result["customer_id"]),
            input_payload=json.dumps({
                k: v for k, v in data_dict.items() if k not in ["surname"]
            }),
            predicted_churn=prediction_result["predicted_churn"],
            churn_probability=prediction_result["churn_probability"],
            risk_level=prediction_result["risk_level"],
            contributing_factors_json=json.dumps(prediction_result["contributing_factors"]),
        )
        db.add(audit_entry)
        db.commit()
    except Exception as e:
        db.rollback()
        # Logging without crashing prediction
        print(f"Audit log recording error: {e}")

    return prediction_result
