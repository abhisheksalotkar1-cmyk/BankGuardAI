# BankGuard AI — System Architecture Document

## 1. Executive Summary
BankGuard AI is an analytical decision-support platform designed to predict retail banking customer attrition risk and suggest proactive, targeted relationship retention actions before an account closure occurs.

Author & Repository Owner: `abhisheksalotkar1-cmyk`

---

## 2. Architectural Blueprint

```
                     ┌─────────────────────────────────────────┐
                     │          React + Vite + Tailwind        │
                     │          Frontend Dashboard SPA         │
                     │      (Port 5173 / Production Dist)      │
                     └────────────────────┬────────────────────┘
                                          │
                                          │ REST API Requests
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │            FastAPI Gateway              │
                     │        (Pydantic v2 Validation)         │
                     └──────┬─────────────┬─────────────┬──────┘
                            │             │             │
              ┌─────────────┘             │             └─────────────┐
              ▼                           ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
    │  Customer Admin  │        │  Model Engine    │        │  Retention Queue │
    │  & CSV Ingestion │        │  & Explainers    │        │  & Lifecycle Ops │
    └─────────┬────────┘        └─────────┬────────┘        └─────────┬────────┘
              │                           │                           │
              └───────────────────┬───────┴───────────────────────────┘
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │   SQLAlchemy ORM Layer  │
                     │  (SQLite / PostgreSQL)  │
                     └─────────────────────────┘
```

---

## 3. Subsystem Breakdown

### 3.1 Frontend Tier (`/frontend`)
- **Framework**: React 18 with Vite build tooling and TypeScript strict type-checking.
- **Styling**: Tailwind CSS configured with a dark navy/fintech aesthetic (`#060A13` deep navy background, `#06b6d4` teal and `#10b981` emerald accents).
- **Data Visualization**: Recharts providing animated responsive rendering of:
  - Portfolio Risk Distribution (Donut Chart)
  - Regional Exposure (Bar Chart)
  - ROC Curve (Line Chart)
  - Feature Importance Rankings (Horizontal Bar Chart)
  - Confusion Matrix (4-Quadrant Heatmap)

### 3.2 Backend Tier (`/backend/app`)
- **FastAPI Core**: High-throughput asynchronous routing with automatic OpenAPI / Swagger interactive documentation at `/docs`.
- **Validation**: Pydantic v2 schemas enforcing boundaries on financial variables (e.g. Credit Score 300–850, Age 18–100, Balance >= 0).
- **Database Engine**: SQLAlchemy ORM with connection pooling; default SQLite for zero-configuration local laptop evaluation, easily reconfigured to PostgreSQL via the `DATABASE_URL` environment variable.

### 3.3 Machine Learning Engine (`/backend/ml`)
- **Pipeline Isolation**: Strict Scikit-learn Pipeline chaining `ColumnTransformer` (StandardScaler + OneHotEncoder) with candidate estimators to guarantee zero leakage between train and test folds.
- **Model Benchmark**: Multi-model comparison of Logistic Regression, Random Forest, and Gradient Boosting.
- **Explainability**: Transparent, deterministic factor attribution deconstructing customer risk scores into plain-English behavioral reasons.
- **Retention Rules**: Business logic module converting risk tiers and customer signals into relationship manager action plans.
