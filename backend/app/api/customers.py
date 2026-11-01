"""
BankGuard AI - Customer Intelligence & Profile Management API
Author: abhisheksalotkar1-cmyk
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Customer
from app.schemas.customer import CustomerOut, CustomerDetailOut, CustomerUpdateStatus
from ml.prediction import ChurnPredictor, generate_retention_recommendations
from ml.explainability import compute_factor_contributions

router = APIRouter(prefix="/customers", tags=["Customers"])
_predictor = None


def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = ChurnPredictor()
    return _predictor


@router.get("", response_model=List[CustomerOut])
def list_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    search: Optional[str] = None,
    risk_level: Optional[str] = None,
    geography: Optional[str] = None,
    retention_status: Optional[str] = None,
    sort_by_risk: bool = Query(False, description="Sort descending by churn probability"),
    db: Session = Depends(get_db),
):
    query = db.query(Customer)

    if search:
        search_clean = search.strip()
        if search_clean.isdigit():
            query = query.filter(Customer.customer_id == int(search_clean))
        else:
            query = query.filter(Customer.surname.ilike(f"%{search_clean}%"))

    if risk_level and risk_level.lower() != "all":
        query = query.filter(Customer.risk_level.ilike(risk_level))

    if geography and geography.lower() != "all":
        query = query.filter(Customer.geography.ilike(geography))

    if retention_status and retention_status.lower() != "all":
        query = query.filter(Customer.retention_status.ilike(retention_status))

    if sort_by_risk:
        query = query.order_by(Customer.churn_probability.desc())
    else:
        query = query.order_by(Customer.id.asc())

    return query.offset(skip).limit(limit).all()


@router.get("/count")
def get_customer_count(
    search: Optional[str] = None,
    risk_level: Optional[str] = None,
    geography: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Customer)
    if search:
        search_clean = search.strip()
        if search_clean.isdigit():
            query = query.filter(Customer.customer_id == int(search_clean))
        else:
            query = query.filter(Customer.surname.ilike(f"%{search_clean}%"))
    if risk_level and risk_level.lower() != "all":
        query = query.filter(Customer.risk_level.ilike(risk_level))
    if geography and geography.lower() != "all":
        query = query.filter(Customer.geography.ilike(geography))
    return {"total": query.count()}


@router.get("/{customer_id}", response_model=CustomerDetailOut)
def get_customer_profile(customer_id: int, db: Session = Depends(get_db)):
    cust = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail=f"Customer reference {customer_id} not found.")

    cust_dict = {
        "customer_id": cust.customer_id,
        "surname": cust.surname,
        "credit_score": cust.credit_score,
        "geography": cust.geography,
        "gender": cust.gender,
        "age": cust.age,
        "tenure": cust.tenure,
        "balance": cust.balance,
        "num_of_products": cust.num_of_products,
        "has_cr_card": cust.has_cr_card,
        "is_active_member": cust.is_active_member,
        "estimated_salary": cust.estimated_salary,
    }

    factors = compute_factor_contributions(cust_dict)
    recommendations = generate_retention_recommendations(
        cust_dict, cust.churn_probability or 0.0, cust.risk_level or "Low Risk"
    )

    result = CustomerDetailOut(
        id=cust.id,
        customer_id=cust.customer_id,
        surname=cust.surname,
        credit_score=cust.credit_score,
        geography=cust.geography,
        gender=cust.gender,
        age=cust.age,
        tenure=cust.tenure,
        balance=cust.balance,
        num_of_products=cust.num_of_products,
        has_cr_card=cust.has_cr_card,
        is_active_member=cust.is_active_member,
        estimated_salary=cust.estimated_salary,
        churn=cust.churn,
        predicted_churn=cust.predicted_churn,
        churn_probability=cust.churn_probability,
        risk_level=cust.risk_level,
        retention_status=cust.retention_status,
        notes=cust.notes,
        contributing_factors=factors,
        retention_recommendations=recommendations,
    )
    return result


@router.patch("/{customer_id}/status")
def update_retention_status(
    customer_id: int,
    payload: CustomerUpdateStatus,
    db: Session = Depends(get_db),
):
    cust = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")

    cust.retention_status = payload.retention_status
    if payload.notes is not None:
        cust.notes = payload.notes
    db.commit()
    db.refresh(cust)
    return {
        "customer_id": cust.customer_id,
        "retention_status": cust.retention_status,
        "notes": cust.notes,
        "message": "Retention status updated successfully",
    }
