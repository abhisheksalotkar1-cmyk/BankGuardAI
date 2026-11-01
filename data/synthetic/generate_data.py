"""
BankGuard AI - Synthetic Banking Data Generator
Generates realistic, statistically consistent, yet entirely fictional banking records.
Explicitly designed to prevent leakage and model benchmark contamination.
Author: abhisheksalotkar1-cmyk
"""

import os
import numpy as np
import pandas as pd


def generate_synthetic_bank_data(num_samples: int = 2500, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)

    customer_ids = np.arange(15800001, 15800001 + num_samples)
    
    first_names = [
        "Aarav", "Elena", "Marcus", "Sophia", "Liam", "Amara", "Carlos", "Chloe",
        "Vikram", "Isabella", "Mateo", "Camila", "Lucas", "Aaliyah", "Noah", "Zara",
        "Oliver", "Fatima", "Ethan", "Ananya", "Julian", "Mia", "Leo", "Siddharth"
    ]
    last_names = [
        "Vance", "Moreau", "Chen", "Santoro", "Kowalski", "Schneider", "Patel", "Dubois",
        "Navarro", "Jensen", "Reyes", "O'Connor", "Mehta", "Berg", "Lefevre", "Alvarez"
    ]

    surnames = [
        f"{np.random.choice(first_names)} {np.random.choice(last_names)}"
        for _ in range(num_samples)
    ]

    credit_scores = np.clip(np.random.normal(loc=650, scale=95, size=num_samples).astype(int), 350, 850)
    geographies = np.random.choice(["France", "Germany", "Spain"], size=num_samples, p=[0.50, 0.25, 0.25])
    genders = np.random.choice(["Female", "Male"], size=num_samples, p=[0.46, 0.54])
    
    # Skewed realistic banking ages (mean ~ 39, range 18-85)
    ages = np.clip(np.random.gamma(shape=12, scale=3.2, size=num_samples).astype(int), 18, 85)
    tenures = np.random.randint(0, 11, size=num_samples)

    # Balance: ~30% have 0 balance (secondary checking/dormant), remainder normally distributed ~90,000
    has_zero_bal = np.random.rand(num_samples) < 0.28
    balances = np.where(
        has_zero_bal,
        0.0,
        np.clip(np.random.normal(loc=98000, scale=38000, size=num_samples), 1200, 260000),
    )
    balances = np.round(balances, 2)

    # Germany customers typically have higher average balances in European retail benchmarks
    balances = np.where(geographies == "Germany", np.maximum(balances, 35000.0), balances)

    num_of_products = np.random.choice([1, 2, 3, 4], size=num_samples, p=[0.51, 0.45, 0.035, 0.005])
    has_cr_card = np.random.choice([0, 1], size=num_samples, p=[0.29, 0.71])
    is_active_member = np.random.choice([0, 1], size=num_samples, p=[0.48, 0.52])
    estimated_salaries = np.round(np.random.uniform(18000, 195000, size=num_samples), 2)

    # Ground-truth Churn probability generation grounded in banking behavior logic:
    # 1. Base logit
    logit = -2.1
    # 2. Older customers have higher attrition risk in traditional banking (age > 42)
    logit += (ages - 38) * 0.055
    # 3. Germany region has higher competitive churn
    logit += np.where(geographies == "Germany", 0.65, 0.0)
    # 4. Female customers historically slight retention differential in European benchmarks
    logit += np.where(genders == "Female", 0.28, 0.0)
    # 5. Low credit score penalty
    logit += np.where(credit_scores < 500, 0.7, 0.0)
    # 6. Active membership strongly protects against churn
    logit -= np.where(is_active_member == 1, 1.1, 0.0)
    # 7. Number of products: 2 is the sweet spot, 1 is moderate risk, 3 & 4 have friction
    product_effect = np.select(
        [num_of_products == 1, num_of_products == 2, num_of_products >= 3],
        [0.2, -1.0, 1.8],
        default=0.0,
    )
    logit += product_effect
    # 8. High balance with inactive status increases churn
    logit += np.where((balances > 100000) & (is_active_member == 0), 0.5, 0.0)

    # Convert logit to sigmoid probability
    churn_prob = 1.0 / (1.0 + np.exp(-logit))
    
    # Generate binary churn outcome
    churn = (np.random.rand(num_samples) < churn_prob).astype(int)

    df = pd.DataFrame({
        "customer_id": customer_ids,
        "surname": surnames,
        "credit_score": credit_scores,
        "geography": geographies,
        "gender": genders,
        "age": ages,
        "tenure": tenures,
        "balance": balances,
        "num_of_products": num_of_products,
        "has_cr_card": has_cr_card,
        "is_active_member": is_active_member,
        "estimated_salary": estimated_salaries,
        "churn": churn,
        "is_synthetic": 1,
    })

    return df


if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    df = generate_synthetic_bank_data(num_samples=2500, random_seed=42)
    out_csv = os.path.join(out_dir, "bankguard_synthetic_customers.csv")
    df.to_csv(out_csv, index=False)
    print(f"Synthetic dataset saved: {out_csv}")
    print(f"Samples: {len(df)} | Overall Churn Rate: {df['churn'].mean():.2%}")
