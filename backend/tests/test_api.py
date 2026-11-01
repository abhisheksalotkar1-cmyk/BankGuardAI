"""
Integration tests for FastAPI REST Endpoints
"""

import sys
import os
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["service"] == "BankGuard AI Platform"


def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_customers" in data
    assert "overall_churn_percentage" in data
    assert "risk_distribution" in data
    assert len(data["risk_distribution"]) == 3


def test_customers_list():
    response = client.get("/api/customers?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 10
    if len(data) > 0:
        assert "customer_id" in data[0]
        assert "risk_level" in data[0]


def test_predict_studio():
    payload = {
        "customer_id": 999991,
        "surname": "Evaluation",
        "credit_score": 600,
        "geography": "Germany",
        "gender": "Female",
        "age": 48,
        "tenure": 2,
        "balance": 110000.0,
        "num_of_products": 1,
        "has_cr_card": 1,
        "is_active_member": 0,
        "estimated_salary": 72000.0,
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "churn_probability" in res
    assert "risk_level" in res
    assert "contributing_factors" in res
    assert "retention_recommendations" in res


def test_model_performance_endpoint():
    response = client.get("/api/models/performance")
    assert response.status_code == 200
    perf = response.json()
    assert "best_model_name" in perf
    assert "comparisons" in perf
    assert len(perf["comparisons"]) == 3
    assert "feature_importances" in perf
