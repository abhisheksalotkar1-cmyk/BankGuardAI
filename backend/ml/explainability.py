"""
BankGuard AI - Model Explainability & Factor Attribution Engine
Provides transparent feature contributions explaining WHY a customer is flagged at risk.
Author: abhisheksalotkar1-cmyk
"""

from typing import Dict, List, Any
import numpy as np
import pandas as pd


# Statistical baselines across typical retail banking cohorts
COHORT_BASELINES = {
    "age": 39.0,
    "balance": 85000.0,
    "credit_score": 650.0,
    "num_of_products": 1.5,
    "is_active_member": 1,
    "balance_to_salary_ratio": 0.85,
    "product_density": 0.35,
    "engagement_score": 2,
}


def compute_factor_contributions(customer_features: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Computes transparent, evidence-grounded factor attributions.
    Determines whether specific customer attributes push risk HIGHER or LOWER
    relative to healthy banking portfolio norms.
    """
    factors = []

    # 1. Age Factor
    age = float(customer_features.get("age", 35))
    if age >= 50:
        factors.append({
            "factor": "Mature Age Cohort",
            "impact": "Increases Risk",
            "direction": "risk_elevating",
            "weight": round(min(1.0, (age - 45) / 30.0) * 0.28, 2),
            "explanation": f"Customer is age {int(age)}. Demographically, customers over 50 demonstrate higher switching likelihood to conservative wealth custodians.",
        })
    elif age <= 30:
        factors.append({
            "factor": "Young Adult Segment",
            "impact": "Neutral / Mild Retention",
            "direction": "risk_reducing",
            "weight": 0.08,
            "explanation": f"Customer is age {int(age)} with high digital adoption potential.",
        })

    # 2. Activity / Member Engagement
    is_active = int(customer_features.get("is_active_member", 1))
    if is_active == 0:
        factors.append({
            "factor": "Dormant / Inactive Member Status",
            "impact": "Strongly Increases Risk",
            "direction": "risk_elevating",
            "weight": 0.35,
            "explanation": "Account shows no recent digital or in-branch transaction activity in the monitoring window.",
        })
    else:
        factors.append({
            "factor": "Active Account Engagement",
            "impact": "Significantly Protects",
            "direction": "risk_reducing",
            "weight": 0.25,
            "explanation": "Regular monthly transaction activity signals stable day-to-day utility.",
        })

    # 3. Product Holding Breadth
    num_products = int(customer_features.get("num_of_products", 1))
    if num_products == 1:
        factors.append({
            "factor": "Single Product Dependency",
            "impact": "Increases Risk",
            "direction": "risk_elevating",
            "weight": 0.22,
            "explanation": "Customer only holds a single banking product, creating shallow switching barriers.",
        })
    elif num_products == 2:
        factors.append({
            "factor": "Optimal Product Pairing (2 Products)",
            "impact": "Strongly Protects",
            "direction": "risk_reducing",
            "weight": 0.30,
            "explanation": "Holding dual products (e.g., current account + savings/card) correlates with peak customer loyalty.",
        })
    elif num_products >= 3:
        factors.append({
            "factor": "High Product Complexity (>=3)",
            "impact": "Increases Risk",
            "direction": "risk_elevating",
            "weight": 0.32,
            "explanation": "Customers with multiple fragmented products frequently experience fee friction or redundant service confusion.",
        })

    # 4. Financial Capital Exposure (Balance vs Salary)
    balance = float(customer_features.get("balance", 0.0))
    salary = float(customer_features.get("estimated_salary", 50000.0))
    ratio = balance / (salary + 1e-4)

    if balance > 100000 and is_active == 0:
        factors.append({
            "factor": "High Dormant Capital At Risk",
            "impact": "Critical Exposure",
            "direction": "risk_elevating",
            "weight": 0.38,
            "explanation": f"€{balance:,.2f} deposit balance held in an inactive profile; high flight risk to high-yield competitors.",
        })
    elif balance == 0:
        factors.append({
            "factor": "Zero Deposit Balance",
            "impact": "Moderate Risk",
            "direction": "risk_elevating",
            "weight": 0.18,
            "explanation": "Depleted balances often precede official account closure requests.",
        })

    # 5. Geographic Market
    geo = str(customer_features.get("geography", "France")).title()
    if geo == "Germany":
        factors.append({
            "factor": "High-Competition German Market",
            "impact": "Increases Risk",
            "direction": "risk_elevating",
            "weight": 0.15,
            "explanation": "Retail banking market in Germany shows structurally higher churn rates due to fintech promotional incentives.",
        })

    # 6. Credit Standing
    credit_score = float(customer_features.get("credit_score", 650))
    if credit_score < 580:
        factors.append({
            "factor": "Subprime Credit Score",
            "impact": "Increases Risk",
            "direction": "risk_elevating",
            "weight": 0.19,
            "explanation": f"Credit score ({int(credit_score)}) indicates financial distress or risk of credit line reduction.",
        })
    elif credit_score >= 750:
        factors.append({
            "factor": "Prime Credit Standing",
            "impact": "Protects",
            "direction": "risk_reducing",
            "weight": 0.12,
            "explanation": f"High credit rating ({int(credit_score)}) reflects solid financial health and stability.",
        })

    # Sort descending by influence weight
    factors.sort(key=lambda x: x["weight"], reverse=True)
    return factors
