# BankGuard AI — Synthetic Banking Dataset

## Overview & Provenance
This dataset was independently generated for the **BankGuard AI — Intelligent Banking Customer Retention & Behaviour Analytics Platform** project.

- **Author**: Abhishek Salotkar (`abhisheksalotkar1-cmyk`)
- **Status**: 100% Synthetic & Fictional Banking Records.
- **Purpose**: Academic demonstration, model evaluation, and portfolio demonstration.
- **Safety**: Contains **NO** Personally Identifiable Information (PII) and **NO** real customer bank data.

## Statistical Distributions & Logic
The synthetic generator (`generate_data.py`) constructs behavioral distributions reflecting real-world retail banking observations:
- **Demographics**: European retail markets (France, Germany, Spain).
- **Age Distribution**: Gamma-distributed retail account holders (mean age 39.4, min 18, max 85).
- **Balance Profiles**: 28% zero-balance secondary accounts; remainder normal distribution around €98,000.
- **Products**: 1 to 4 retail products with empirical churn correlation (multi-product cross-holding reduces churn at 2 products, spikes at 3+ due to service friction).
- **Engagement**: Composite activity score based on Active Membership flag and Credit Card status.

## Configurable External Dataset Adapter
BankGuard AI includes an automated dataset adapter in `backend/ml/preprocessing.py` capable of loading and cleaning external benchmarking datasets (e.g., standard anonymised retail churn datasets) while maintaining strict schema isolation.
