"""
BankGuard AI - Dataset Management & Ingestion API
Author: abhisheksalotkar1-cmyk
"""

import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import pandas as pd
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Customer
from ml.preprocessing import validate_and_clean_data
from ml.prediction import ChurnPredictor

router = APIRouter(prefix="/dataset", tags=["Data Management"])
_predictor = None


def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = ChurnPredictor()
    return _predictor


@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Accepts CSV customer dataset, runs automated schema validation,
    cleans missing values, predicts churn risk scores, and updates the database.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are accepted.")

    try:
        content = await file.read()
        df_raw = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

    try:
        clean_df, audit_summary = validate_and_clean_data(df_raw)
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))

    predictor = get_predictor()
    inserted_count = 0
    updated_count = 0

    for _, row in clean_df.iterrows():
        c_id = int(row.get("customer_id", int(row.name + 20000000)))
        cust_dict = {
            "customer_id": c_id,
            "surname": str(row.get("surname", "Customer")),
            "credit_score": int(row["credit_score"]),
            "geography": str(row["geography"]),
            "gender": str(row["gender"]),
            "age": int(row["age"]),
            "tenure": int(row["tenure"]),
            "balance": float(row["balance"]),
            "num_of_products": int(row["num_of_products"]),
            "has_cr_card": int(row["has_cr_card"]),
            "is_active_member": int(row["is_active_member"]),
            "estimated_salary": float(row["estimated_salary"]),
        }

        pred = predictor.predict_customer(cust_dict)

        existing = db.query(Customer).filter(Customer.customer_id == c_id).first()
        if existing:
            for k, v in cust_dict.items():
                setattr(existing, k, v)
            existing.predicted_churn = pred["predicted_churn"]
            existing.churn_probability = pred["churn_probability"]
            existing.risk_level = pred["risk_level"]
            updated_count += 1
        else:
            new_cust = Customer(
                **cust_dict,
                churn=int(row.get("churn", 0)) if "churn" in row else None,
                predicted_churn=pred["predicted_churn"],
                churn_probability=pred["churn_probability"],
                risk_level=pred["risk_level"],
                retention_status="Pending Review",
            )
            db.add(new_cust)
            inserted_count += 1

    db.commit()

    return {
        "status": "success",
        "file_name": file.filename,
        "records_inserted": inserted_count,
        "records_updated": updated_count,
        "audit_report": audit_summary,
    }


@router.get("/preview")
def preview_dataset(limit: int = 15, db: Session = Depends(get_db)):
    """
    Returns live preview of stored dataset records.
    """
    customers = db.query(Customer).limit(limit).all()
    total_count = db.query(Customer).count()

    return {
        "total_records": total_count,
        "preview_records": [
            {
                "customer_id": c.customer_id,
                "surname": c.surname,
                "credit_score": c.credit_score,
                "geography": c.geography,
                "gender": c.gender,
                "age": c.age,
                "tenure": c.tenure,
                "balance": c.balance,
                "num_of_products": c.num_of_products,
                "has_cr_card": c.has_cr_card,
                "is_active_member": c.is_active_member,
                "estimated_salary": c.estimated_salary,
                "risk_level": c.risk_level,
                "churn_probability": c.churn_probability,
            }
            for c in customers
        ],
    }
