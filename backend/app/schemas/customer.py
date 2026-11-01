"""
BankGuard AI - Pydantic Request & Response Schemas
Author: abhisheksalotkar1-cmyk
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CustomerBase(BaseModel):
    customer_id: int = Field(..., description="Unique customer identification number")
    surname: str = Field(..., min_length=1, max_length=100)
    credit_score: int = Field(..., ge=300, le=850)
    geography: str = Field(..., description="Country branch (e.g. France, Germany, Spain)")
    gender: str = Field(..., description="Gender (Female, Male, Non-Binary)")
    age: int = Field(..., ge=18, le=100)
    tenure: int = Field(..., ge=0, le=25)
    balance: float = Field(..., ge=0.0)
    num_of_products: int = Field(..., ge=1, le=4)
    has_cr_card: int = Field(..., ge=0, le=1)
    is_active_member: int = Field(..., ge=0, le=1)
    estimated_salary: float = Field(..., ge=0.0)


class CustomerCreate(CustomerBase):
    churn: Optional[int] = Field(None, ge=0, le=1)


class CustomerUpdateStatus(BaseModel):
    retention_status: str = Field(..., description="Status (Pending Review, In Contact, Retained, Lost)")
    notes: Optional[str] = None


class CustomerOut(CustomerBase):
    id: int
    churn: Optional[int] = None
    predicted_churn: Optional[int] = None
    churn_probability: Optional[float] = None
    risk_level: Optional[str] = None
    retention_status: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class CustomerDetailOut(CustomerOut):
    contributing_factors: List[Dict[str, Any]] = []
    retention_recommendations: List[Dict[str, str]] = []


class PredictRequest(BaseModel):
    customer_id: Optional[int] = 999999
    surname: Optional[str] = "Applicant"
    credit_score: int = Field(650, ge=300, le=850)
    geography: str = "France"
    gender: str = "Female"
    age: int = Field(38, ge=18, le=100)
    tenure: int = Field(3, ge=0, le=25)
    balance: float = Field(50000.0, ge=0.0)
    num_of_products: int = Field(1, ge=1, le=4)
    has_cr_card: int = Field(1, ge=0, le=1)
    is_active_member: int = Field(1, ge=0, le=1)
    estimated_salary: float = Field(60000.0, ge=0.0)


class PredictResponse(BaseModel):
    customer_id: Any
    predicted_churn: int
    churn_probability: float
    churn_probability_percentage: float
    risk_level: str
    badge_color: str
    confidence_score: float
    contributing_factors: List[Dict[str, Any]]
    retention_recommendations: List[Dict[str, str]]
    disclaimer: str


class DashboardSummary(BaseModel):
    total_customers: int
    predicted_churn_count: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    overall_churn_percentage: float
    customer_retention_percentage: float
    total_balance_at_risk: float
    risk_distribution: List[Dict[str, Any]]
    geographic_distribution: List[Dict[str, Any]]
    age_cohort_distribution: List[Dict[str, Any]]
    activity_distribution: List[Dict[str, Any]]
