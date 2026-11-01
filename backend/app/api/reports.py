"""
BankGuard AI - Reports & Export Generation Router
Author: abhisheksalotkar1-cmyk
"""

import io
from fastapi import APIRouter, Depends
from fastapi.responses import Response
import pandas as pd
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Customer

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/export")
def export_predictions_csv(db: Session = Depends(get_db)):
    """
    Exports complete customer intelligence and risk predictions as CSV.
    """
    customers = db.query(Customer).all()
    records = [
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
            "predicted_churn": c.predicted_churn,
            "churn_probability": c.churn_probability,
            "risk_level": c.risk_level,
            "retention_status": c.retention_status,
        }
        for c in customers
    ]

    df = pd.DataFrame(records)
    stream = io.StringIO()
    df.to_csv(stream, index=False)

    response = Response(content=stream.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=bankguard_retention_intelligence.csv"
    return response
