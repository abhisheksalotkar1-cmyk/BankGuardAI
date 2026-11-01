# BankGuard AI — Model Evaluation & Benchmark Report

## 1. Experimental Setup
- **Dataset**: `bankguard_synthetic_customers.csv` (2,500 records)
- **Split Strategy**: 80% Training (2,000 samples) / 20% Held-Out Test (500 samples)
- **Stratification**: Target $y$ distribution preserved across folds
- **Validation**: 5-Fold Stratified Cross-Validation

---

## 2. Multi-Model Benchmark Results

| Model Architecture | Test Accuracy | Precision (Churn) | Recall (Churn) | F1-Score | ROC-AUC | 5-Fold CV F1 (Mean ± Std) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest (Champion)** | **79.0%** | **32.4%** | **54.5%** | **0.4068** | **0.7359** | **0.3709 ± 0.0099** |
| **Logistic Regression** | 66.8% | 23.1% | 65.2% | 0.3413 | 0.7178 | 0.3201 ± 0.0210 |
| **Gradient Boosting** | 86.8% | 50.0% | 15.2% | 0.2326 | 0.7351 | 0.2071 ± 0.0587 |

---

## 3. Champion Model Selection Rationale
While Gradient Boosting achieved a high raw accuracy (86.8%), its default unweighted configuration severely suppressed recall (identifying only 15.2% of at-risk accounts, creating unacceptable false negatives).

The **Random Forest with Balanced Class Weights** was selected as champion because:
1. It successfully flags **54.5% of churners** on unseen test data.
2. It maintains superior balance between precision and recall, yielding the highest **F1-Score (0.4068)**.
3. It achieved the most stable cross-validation variance across folds ($\pm 0.0099$).
4. Its ensemble tree structure provides natural feature attribution via Mean Decrease in Impurity (MDI).

---

## 4. Confusion Matrix Breakdown (Random Forest on Held-Out Test Set)

| Actual \ Predicted | Predicted Retained ($0$) | Predicted Churn ($1$) |
| :--- | :---: | :---: |
| **Actual Retained ($0$)** | **359** (True Negative) | **75** (False Positive) |
| **Actual Churn ($1$)** | **30** (False Negative) | **36** (True Positive) |

---

## 5. Top Predictive Features
1. **Age**: Older depositors show higher sensitivity to wealth migration.
2. **NumOfProducts**: Single-product accounts display low retention stickiness; 3+ products show service friction.
3. **Credit Score**: Measures broader financial stability.
4. **Balance to Salary Ratio**: Identifies high-capital accounts with flight exposure.
5. **Active Member Status**: Activity is the strongest single protective insulator against churn.
