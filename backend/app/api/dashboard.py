"""
BankGuard AI - Dashboard Summary API Router
Author: abhisheksalotkar1-cmyk
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.database.models import Customer
from app.schemas.customer import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Computes real-time analytical KPIs across the active customer portfolio.
    """
    total = db.query(Customer).count()
    if total == 0:
        return {
            "total_customers": 0,
            "predicted_churn_count": 0,
            "high_risk_count": 0,
            "medium_risk_count": 0,
            "low_risk_count": 0,
            "overall_churn_percentage": 0.0,
            "customer_retention_percentage": 100.0,
            "total_balance_at_risk": 0.0,
            "risk_distribution": [],
            "geographic_distribution": [],
            "age_cohort_distribution": [],
            "activity_distribution": [],
        }

    high_risk = db.query(Customer).filter(Customer.risk_level == "High Risk").count()
    medium_risk = db.query(Customer).filter(Customer.risk_level == "Medium Risk").count()
    low_risk = db.query(Customer).filter(Customer.risk_level == "Low Risk").count()

    predicted_churn = db.query(Customer).filter(Customer.predicted_churn == 1).count()
    churn_pct = round((predicted_churn / total) * 100.0, 2)
    retention_pct = round(100.0 - churn_pct, 2)

    # Balance at risk for high-risk customers
    high_risk_balance = (
        db.query(func.sum(Customer.balance))
        .filter(Customer.risk_level == "High Risk")
        .scalar()
        or 0.0
    )

    # Risk Distribution Breakdown
    risk_distribution = [
        {"name": "Low Risk (0-30%)", "count": low_risk, "percentage": round((low_risk / total) * 100, 1), "fill": "#10b981"},
        {"name": "Medium Risk (31-65%)", "count": medium_risk, "percentage": round((medium_risk / total) * 100, 1), "fill": "#f59e0b"},
        {"name": "High Risk (66-100%)", "count": high_risk, "percentage": round((high_risk / total) * 100, 1), "fill": "#f43f5e"},
    ]

    # Geographic Breakdown
    geo_stats = (
        db.query(
            Customer.geography,
            func.count(Customer.id).label("total"),
            func.avg(Customer.churn_probability).label("avg_prob"),
            func.sum(Customer.balance).label("total_balance"),
            func.avg(Customer.credit_score).label("avg_credit"),
        )
        .group_by(Customer.geography)
        .all()
    )

    geographic_distribution = [
        {
            "geography": row[0],
            "customer_count": row[1],
            "average_churn_probability": round((row[2] or 0.0) * 100, 1),
            "total_balance": round(float(row[3] or 0.0), 2),
            "average_credit_score": round(float(row[4] or 0.0), 1),
        }
        for row in geo_stats
    ]

    # Age Cohort Breakdown
    cohorts = [
        {"name": "18-30 (Young Adult)", "min": 18, "max": 30},
        {"name": "31-50 (Core Banking)", "min": 31, "max": 50},
        {"name": "51+ (Senior / Wealth)", "min": 51, "max": 120},
    ]
    age_cohort_distribution = []
    for c in cohorts:
        cnt = db.query(Customer).filter(Customer.age >= c["min"], Customer.age <= c["max"]).count()
        risk_cnt = db.query(Customer).filter(Customer.age >= c["min"], Customer.age <= c["max"], Customer.risk_level == "High Risk").count()
        age_cohort_distribution.append({
            "cohort": c["name"],
            "total_customers": cnt,
            "high_risk_customers": risk_cnt,
            "risk_rate": round((risk_cnt / max(cnt, 1)) * 100, 1),
        })

    # Activity Status Breakdown
    active_cnt = db.query(Customer).filter(Customer.is_active_member == 1).count()
    active_churn_cnt = db.query(Customer).filter(Customer.is_active_member == 1, Customer.risk_level == "High Risk").count()
    inactive_cnt = db.query(Customer).filter(Customer.is_active_member == 0).count()
    inactive_churn_cnt = db.query(Customer).filter(Customer.is_active_member == 0, Customer.risk_level == "High Risk").count()

    activity_distribution = [
        {"status": "Active Members", "total": active_cnt, "high_risk": active_churn_cnt, "risk_rate": round((active_churn_cnt / max(active_cnt, 1)) * 100, 1)},
        {"status": "Inactive Members", "total": inactive_cnt, "high_risk": inactive_churn_cnt, "risk_rate": round((inactive_churn_cnt / max(inactive_cnt, 1)) * 100, 1)},
    ]

    return {
        "total_customers": total,
        "predicted_churn_count": predicted_churn,
        "high_risk_count": high_risk,
        "medium_risk_count": medium_risk,
        "low_risk_count": low_risk,
        "overall_churn_percentage": churn_pct,
        "customer_retention_percentage": retention_pct,
        "total_balance_at_risk": round(float(high_risk_balance), 2),
        "risk_distribution": risk_distribution,
        "geographic_distribution": geographic_distribution,
        "age_cohort_distribution": age_cohort_distribution,
        "activity_distribution": activity_distribution,
    }
