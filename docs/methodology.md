# BankGuard AI — Data Science & Machine Learning Methodology

## 1. Problem Formulation
Customer attrition in retail banking is an imbalanced binary classification challenge:
$$y \in \{0, 1\}$$
where $y = 1$ denotes account termination (churn) and $y = 0$ denotes continued active relationship.

Rather than treating the problem as a purely academic accuracy competition, BankGuard AI treats churn prediction as a high-stakes decision-support mechanism where **Recall on the minority class ($y = 1$)** and **Precision** are prioritized to ensure high-risk depositors are not missed.

---

## 2. Feature Engineering & Behavioral Derivations
Raw customer transaction snapshots are augmented with 5 derived features:
1. **Financial Leverage Ratio (`balance_to_salary_ratio`)**:
   $$\text{Ratio} = \frac{\text{Balance}}{\text{Estimated Salary} + 10^{-4}}$$
   Captures customer asset concentration relative to declared income.
2. **Product Density (`product_density`)**:
   $$\text{Density} = \frac{\text{NumOfProducts}}{\text{Tenure} + 1}$$
   Reflects the velocity and depth of product adoption across the customer lifecycle.
3. **Composite Engagement Score (`engagement_score`)**:
   $$\text{Score} = (2 \times \text{IsActiveMember}) + (1 \times \text{HasCrCard})$$
4. **Credit Tier Categorization (`credit_tier`)**:
   Binned into Exceptional (800+), Very Good (740–799), Good (670–739), Fair (580–669), and Poor (<580).
5. **Age Cohort Discretization (`age_group`)**:
   Young Adult (<30), Middle Age (30–50), Senior (51+).

---

## 3. Leakage Prevention Protocol
1. **Train/Test Separation**: An 80/20 stratified split is performed **before** any transformations or scaling are calculated.
2. **Pipeline Encapsulation**: Imputers, `StandardScaler`, and `OneHotEncoder` are fitted strictly inside `Pipeline` steps on training folds only.
3. **Stratified 5-Fold Cross Validation**: Cross-validation assesses estimator stability across 5 stratified folds to guard against overfitting.

---

## 4. Class Imbalance Strategy
Retail bank churn typically displays heavy skew (10% to 20% positive churn cases). BankGuard AI utilizes cost-sensitive learning via `class_weight='balanced'`, mathematically scaling the penalty on false negatives:
$$w_1 = \frac{N}{2 \times N_1}$$
This boosts sensitivity toward attrition patterns without generating synthetic artifacts in the test set.
