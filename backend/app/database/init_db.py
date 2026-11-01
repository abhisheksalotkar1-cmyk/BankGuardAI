"""
BankGuard AI - Database Initialization & Auto-Seeding Pipeline
Author: abhisheksalotkar1-cmyk
"""

import os
import pandas as pd
from sqlalchemy.orm import Session
from app.database.session import engine, SessionLocal, Base
from app.database.models import Customer
from ml.prediction import ChurnPredictor


def ensure_database_seeded():
    """
    Initializes database schema and automatically populates initial
    customer dataset with pre-scored risk intelligence if empty.
    """
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        count = db.query(Customer).count()
        if count > 0:
            return  # Already populated

        # Locate synthetic baseline CSV
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        project_root = os.path.dirname(backend_dir)
        csv_path = os.path.join(
            project_root, "data", "synthetic", "bankguard_synthetic_customers.csv"
        )

        if not os.path.exists(csv_path):
            print(f"Warning: Dataset not found at {csv_path}, skipping seed.")
            return

        df = pd.read_csv(csv_path)
        predictor = ChurnPredictor()

        customers_to_add = []
        for _, row in df.iterrows():
            c_dict = {
                "customer_id": int(row["customer_id"]),
                "surname": str(row["surname"]),
                "credit_score": int(row["credit_score"]),
                "geography": str(row["geography"]),
                "gender": str(row["gender"]),
                "age": int(row["age"]),
                "tenure": int(row["tenure"]),
                "balance": float(row["balance"]),
                "num_of_products": int(row["num_of_products"]),
                "has_cr_card": int(row["has_cr_card"]),
                "is_active_member": int(row["is_active_member"]),
                "estimated_salary": float(row["estimated_salary"]),
            }
            # Predict risk attributes
            pred = predictor.predict_customer(c_dict)

            cust = Customer(
                customer_id=c_dict["customer_id"],
                surname=c_dict["surname"],
                credit_score=c_dict["credit_score"],
                geography=c_dict["geography"],
                gender=c_dict["gender"],
                age=c_dict["age"],
                tenure=c_dict["tenure"],
                balance=c_dict["balance"],
                num_of_products=c_dict["num_of_products"],
                has_cr_card=c_dict["has_cr_card"],
                is_active_member=c_dict["is_active_member"],
                estimated_salary=c_dict["estimated_salary"],
                churn=int(row.get("churn", 0)),
                predicted_churn=pred["predicted_churn"],
                churn_probability=pred["churn_probability"],
                risk_level=pred["risk_level"],
                retention_status="Pending Review",
            )
            customers_to_add.append(cust)

        # Bulk insert
        db.bulk_save_objects(customers_to_add)
        db.commit()
        print(f"Successfully seeded database with {len(customers_to_add)} pre-scored customer profiles.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    ensure_database_seeded()
