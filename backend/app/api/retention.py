"""
BankGuard AI - Retention Centre Operations Router
Author: abhisheksalotkar1-cmyk
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.database.models import Customer
from ml.prediction import generate_retention_recommendations

router = APIRouter(prefix="/retention", tags=["Retention Centre"])


@router.get("/recommendations")
def get_retention_queue(
    status: Optional[str] = Query("all", description="Intervention status filter"),
    min_risk_level: Optional[str] = Query("High Risk", description="Target risk filter"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Customer)

    if min_risk_level and min_risk_level.lower() != "all":
        query = query.filter(Customer.risk_level.ilike(min_risk_level))

    if status and status.lower() != "all":
        query = query.filter(Customer.retention_status.ilike(status))

    # Prioritise customers with highest balance and churn risk
    customers = (
        query.order_by(Customer.churn_probability.desc(), Customer.balance.desc())
        .limit(limit)
        .all()
    )

    results = []
    for c in customers:
        c_dict = {
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
        }
        recs = generate_retention_recommendations(c_dict, c.churn_probability or 0.0, c.risk_level or "High Risk")
        results.append({
            "id": c.id,
            "customer_id": c.customer_id,
            "surname": c.surname,
            "risk_level": c.risk_level,
            "churn_probability": c.churn_probability,
            "balance": c.balance,
            "tenure": c.tenure,
            "num_of_products": c.num_of_products,
            "is_active_member": c.is_active_member,
            "retention_status": c.retention_status,
            "recommended_action": recs[0] if recs else None,
            "all_actions": recs,
            "notes": c.notes,
        })

    # Summary KPI stats
    total_high_risk = db.query(Customer).filter(Customer.risk_level == "High Risk").count()
    total_balance_at_risk = (
        db.query(func.sum(Customer.balance))
        .filter(Customer.risk_level == "High Risk")
        .scalar()
        or 0.0
    )
    pending_count = db.query(Customer).filter(Customer.retention_status == "Pending Review", Customer.risk_level == "High Risk").count()
    contacted_count = db.query(Customer).filter(Customer.retention_status == "In Contact").count()
    retained_count = db.query(Customer).filter(Customer.retention_status == "Retained").count()

    return {
        "summary": {
            "total_high_risk_customers": total_high_risk,
            "total_balance_at_risk": round(float(total_balance_at_risk), 2),
            "pending_review_count": pending_count,
            "in_contact_count": contacted_count,
            "retained_count": retained_count,
        },
        "retention_queue": results,
    }
