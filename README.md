# BankGuard AI — Intelligent Banking Customer Retention & Behaviour Analytics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Tests: 14 Passed](https://img.shields.io/badge/Tests-14%20Passed-brightgreen.svg)](https://pytest.org)

> **University Final-Year Demonstration Project & Portfolio Presentation**  
> **Author & Repository Owner:** [Abhishek Salotkar](https://github.com/abhisheksalotkar1-cmyk) (`abhisheksalotkar1-cmyk`)  
> **Repository:** [https://github.com/abhisheksalotkar1-cmyk/Bank--Customer-Churn-](https://github.com/abhisheksalotkar1-cmyk/Bank--Customer-Churn-)

---

## 1. Problem Statement

Retail commercial banks frequently lose valuable account holders not because departures are sudden, but because institutions fail to detect subtle behavioral decay early enough. Declining transaction velocity, single-product exposure, and deposit dormancy are tell-tale indicators of customer attrition.

When a customer initiates an account closure request, retention costs are dramatically higher than when intervention occurs months earlier.

**BankGuard AI** is an analytical decision-support platform designed to answer:
1. **Who is at risk?** Identifying customers likely to leave before formal closure notices.
2. **Why are they at risk?** Deconstructing complex model scores into clear, evidence-based factor attributions.
3. **What action should the bank take?** Generating targeted, rule-based retention interventions rather than untargeted marketing spam.
4. **How is the portfolio trending?** Providing bank executives with real-time risk distribution, capital exposure, and cohort analysis.

*Notice: BankGuard AI is an analytical guidance and decision-support system, not an autonomous banking transaction platform.*

---

## 2. Key Capabilities & Platform Features

### 📊 Executive Overview Dashboard
- Monitored portfolio KPIs: Total Customers, Predicted Churn Cases, High-Risk Accounts, Churn Rate, Retention Rate, and Total Capital At Risk (€).
- Interactive Recharts visualizations: Risk distribution donut chart, regional market exposure (France, Germany, Spain), and age demographic vulnerability.

### 🔍 Customer Intelligence Explorer
- Filterable and searchable customer portfolio (by Customer ID or Surname).
- Multi-dimensional filters: Risk Tier (`High Risk`, `Medium Risk`, `Low Risk`), Geography, and Intervention Status.
- Deep-dive customer profile drawer detailing financial attributes, credit score, tenure, and activity standing.

### ⚙️ Interactive Prediction Studio
- Live simulation studio for banking advisors to evaluate any customer profile in real time.
- Input parameters: Credit Score, Geography, Gender, Age, Tenure, Balance, Number of Products, Credit Card flag, Active Member flag, and Estimated Salary.
- Instant feedback with animated probability gauge, risk classification, transparent factor explanations, and specific retention action plans.
- Quick-load preconfigured banking persona presets (High-Risk Wealth Depositor, Healthy Dual-Product Loyal, Multi-Product Friction Risk).

### 📈 Model Performance & Validation Telemetry
- Transparent multi-model benchmark matrix: **Random Forest (Champion)** vs **Logistic Regression** vs **Gradient Boosting**.
- Evaluated on an independent stratified held-out test fold (20%) and 5-Fold Stratified Cross-Validation.
- Full calculated confusion matrix breakdown (True Negatives, False Positives, False Negatives, True Positives).
- Actual Receiver Operating Characteristic (ROC) curve and feature importance rankings.

### 🤝 Retention Centre & Action Queue
- Prioritised queue of high-risk customers sorted by attrition likelihood and deposit balance.
- Rule-based action recommendations with suggested channels (e.g., Dedicated RM Call, Private Wealth Advisor, Digital In-App Alert).
- Interactive status lifecycle management (`Pending Review`, `In Contact`, `Retained`, `Lost`) with database persistence.

### 💾 Data Management & Ingestion Pipeline
- Upload external customer CSV datasets with automated schema validation, missing value imputation, and duplicate deduplication.
- Live database preview table.
- One-click export of complete prediction intelligence to CSV format.

---

## 3. System Architecture

```
                             [ User Browser / Analyst ]
                                         │
                                         ▼
                     ┌─────────────────────────────────────────┐
                     │          React 18 + Vite + TS           │
                     │         Modern Navy Fintech UI          │
                     │          (Tailwind + Recharts)          │
                     └───────────────────┬─────────────────────┘
                                         │
                                         │ HTTP REST (JSON)
                                         ▼
                     ┌─────────────────────────────────────────┐
                     │            FastAPI Backend              │
                     │       (Pydantic v2 Schema Guard)        │
                     └──────┬─────────────┬─────────────┬──────┘
                            │             │             │
              ┌─────────────┘             │             └─────────────┐
              ▼                           ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
    │  Customer Admin  │        │   ML Pipeline    │        │  Retention Queue │
    │  & CSV Ingestion │        │  & Explainers    │        │  & Lifecycle Ops │
    └─────────┬────────┘        └─────────┬────────┘        └─────────┬────────┘
              │                           │                           │
              └───────────────────┬───────┴───────────────────────────┘
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │   SQLAlchemy ORM Layer  │
                     │    (SQLite / Postgres)  │
                     └─────────────────────────┘
```

---

## 4. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons |
| **Backend API** | Python 3.10+, FastAPI, Pydantic v2, Uvicorn, Python-Multipart |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, Scipy, Joblib |
| **Database** | SQLite (default zero-config local), SQLAlchemy ORM (PostgreSQL ready) |
| **Testing** | Pytest, FastAPI TestClient, HTTPX |

---

## 5. Machine Learning Methodology & Evaluation

### Data Pipeline & Feature Engineering
To prevent information leakage, derived financial signals are row-independent:
1. `balance_to_salary_ratio`: Deposit concentration relative to income.
2. `product_density`: Products held relative to account tenure.
3. `engagement_score`: Composite activity index ($2 \times \text{Active} + 1 \times \text{Card}$).
4. `credit_tier`: Discretized rating (Exceptional, Very Good, Good, Fair, Poor).
5. `age_group`: Demographic stratification (Young Adult, Middle Age, Senior).

### Leakage Prevention
Preprocessing transformations (StandardScaler for numerical features, OneHotEncoder for categoricals) are encapsulated inside Scikit-learn `Pipeline` objects and fitted **strictly on the 80% training fold**.

### Model Benchmark Summary (Evaluated on Unseen Stratified Test Set)

| Model Architecture | Accuracy | Precision | Recall (Churn) | F1-Score | ROC-AUC | 5-Fold CV F1 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest (Champion)** | **79.0%** | **32.4%** | **54.5%** | **0.4068** | **0.7359** | **0.3709 ± 0.0099** |
| **Logistic Regression** | 66.8% | 23.1% | 65.2% | 0.3413 | 0.7178 | 0.3201 ± 0.0210 |
| **Gradient Boosting** | 86.8% | 50.0% | 15.2% | 0.2326 | 0.7351 | 0.2071 ± 0.0587 |

**Selection Rationale:** In financial attrition monitoring, identifying at-risk accounts (**Recall**) is paramount. Unweighted boosting misses 84.8% of churners despite high accuracy. Random Forest with balanced class weights maximizes true positive capture while maintaining high ROC-AUC and low cross-validation variance.

---

## 6. Project Structure

```
BankGuard-AI/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI widgets (Navbar, RiskBadge, CustomerModal)
│   │   ├── pages/            # 7 Dashboard Views (Overview, Intelligence, Studio, etc.)
│   │   ├── services/         # Typed API clients
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Application root & tab routing
│   │   └── main.tsx          # DOM entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/              # FastAPI routers (dashboard, customers, predict, models)
│   │   ├── database/         # SQLAlchemy models, session, auto-seeder
│   │   ├── schemas/          # Pydantic v2 request/response schemas
│   │   └── main.py           # Application entry point & CORS
│   ├── ml/
│   │   ├── feature_engineering.py  # Behavioral transformations
│   │   ├── preprocessing.py        # ColumnTransformer & schema cleaner
│   │   ├── training.py             # Multi-model CV trainer & artifact saver
│   │   ├── evaluation.py           # Metrics, CM & ROC curves
│   │   ├── explainability.py       # Factor attribution engine
│   │   └── prediction.py           # Inference & retention rules
│   ├── tests/                # 14 Pytest unit & integration tests
│   └── requirements.txt
│
├── data/
│   └── synthetic/            # Fictional 2,500 customer records & generator
│
├── models/
│   └── artifacts/            # Trained pipeline .joblib, metrics & feature importance
│
├── docs/                     # System architecture, methodology & model reports
├── run_bankguard.bat         # 1-Click Windows execution script
├── .gitignore
├── LICENSE                   # MIT License
└── README.md
```

---

## 7. Installation & Local Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm

### Step 1: Clone Repository
```bash
git clone https://github.com/abhisheksalotkar1-cmyk/Bank--Customer-Churn-.git
cd Bank--Customer-Churn-
```

### Step 2: Install Python Backend Dependencies
```bash
pip install -r backend/requirements.txt
```

### Step 3: Train Model & Populate Seed Database
```bash
# Windows PowerShell:
$env:PYTHONPATH = "backend"
py backend/ml/training.py
py backend/app/database/init_db.py

# Linux / macOS:
export PYTHONPATH="backend"
python3 backend/ml/training.py
python3 backend/app/database/init_db.py
```

### Step 4: Run Automated Tests
```bash
py -m pytest backend/tests -v
```

### Step 5: Install & Build Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

---

## 8. Running the Application

### Option A: 1-Click Windows Launcher (Recommended)
Double-click `run_bankguard.bat` in the project root. This launches both the backend and frontend in separate console windows.

### Option B: Manual Startup

**Terminal 1 — Backend:**
```bash
cd backend
# Windows:
$env:PYTHONPATH = "."
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open your browser to:
- **Web Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Interactive API Docs (Swagger):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 9. API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health telemetry & system status |
| `GET` | `/api/dashboard/summary` | Real-time portfolio KPIs & chart distributions |
| `GET` | `/api/customers` | Search & filter customer intelligence |
| `GET` | `/api/customers/{id}` | Individual customer profile, factor breakdown & retention plan |
| `PATCH` | `/api/customers/{id}/status` | Update customer retention status & advisor notes |
| `POST` | `/api/predict` | Real-time single customer churn risk inference |
| `GET` | `/api/models/performance` | Model benchmark matrix, CM, ROC curve & feature rankings |
| `GET` | `/api/retention/recommendations` | Prioritised high-risk action queue |
| `POST` | `/api/dataset/upload` | Ingest and validate external customer CSV |
| `GET` | `/api/reports/export` | Download full prediction dataset as CSV |

---

## 10. Limitations & Future Roadmap

- **Statistical Boundary:** Predictions represent empirical likelihoods based on historical training distributions, not absolute certainty.
- **Explainability:** Factor attribution is currently computed via model feature importance weights and demographic baselines; future releases can integrate native SHAP tree explainers.
- **Time-Series Tracking:** Future extensions may incorporate transactional stream ingestion (e.g. Apache Kafka) to track rolling 30-day velocity changes.

---

## 11. License & Author Attribution

- **Author / Repository Owner:** Abhishek Salotkar (`abhisheksalotkar1-cmyk`)
- **License:** Licensed under the [MIT License](LICENSE).
- **Data Attribution:** Default dataset is entirely synthetic, generated for academic and demonstration purposes without exposing real banking customers.
