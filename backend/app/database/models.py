"""
BankGuard AI - SQLAlchemy Relational ORM Models
Author: abhisheksalotkar1-cmyk
"""

import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Text,
    Boolean,
)
from app.database.session import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, unique=True, index=True, nullable=False)
    surname = Column(String(100), nullable=False)
    credit_score = Column(Integer, nullable=False)
    geography = Column(String(50), nullable=False)
    gender = Column(String(20), nullable=False)
    age = Column(Integer, nullable=False)
    tenure = Column(Integer, nullable=False)
    balance = Column(Float, nullable=False, default=0.0)
    num_of_products = Column(Integer, nullable=False, default=1)
    has_cr_card = Column(Integer, nullable=False, default=1)
    is_active_member = Column(Integer, nullable=False, default=1)
    estimated_salary = Column(Float, nullable=False, default=0.0)
    
    # Ground truth (if historical) and model inference
    churn = Column(Integer, nullable=True)
    predicted_churn = Column(Integer, nullable=True)
    churn_probability = Column(Float, nullable=True)
    risk_level = Column(String(30), nullable=True)  # Low Risk, Medium Risk, High Risk
    retention_status = Column(String(50), nullable=False, default="Pending Review")  # Pending Review, In Contact, Retained, Lost
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class PredictionAudit(Base):
    __tablename__ = "prediction_audits"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    customer_reference = Column(String(100), nullable=False)
    input_payload = Column(Text, nullable=False)
    predicted_churn = Column(Integer, nullable=False)
    churn_probability = Column(Float, nullable=False)
    risk_level = Column(String(30), nullable=False)
    contributing_factors_json = Column(Text, nullable=True)
