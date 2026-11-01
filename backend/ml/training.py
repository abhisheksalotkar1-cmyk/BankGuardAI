"""
BankGuard AI - Multi-Model Training & Benchmark Engine
Compares Logistic Regression, Random Forest, and Gradient Boosting pipelines.
Author: abhisheksalotkar1-cmyk
"""

import json
import os
import sys
from typing import Dict, Any, Tuple
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline

# Ensure backend root is on sys.path
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from ml.evaluation import compute_comprehensive_metrics
from ml.feature_engineering import ALL_MODEL_FEATURES
from ml.preprocessing import build_preprocessor, validate_and_clean_data


def train_and_compare_models(
    data_path: str,
    output_dir: str = None,
) -> Dict[str, Any]:
    """
    Trains candidate models, performs stratified cross-validation,
    evaluates on unseen test records, and saves the top production pipeline.
    """
    if output_dir is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_dir = os.path.join(os.path.dirname(base_dir), "models", "artifacts")
    os.makedirs(output_dir, exist_ok=True)

    # 1. Load and clean data
    raw_df = pd.read_csv(data_path)
    clean_df, audit_summary = validate_and_clean_data(raw_df)

    X = clean_df[ALL_MODEL_FEATURES]
    y = clean_df["churn"].astype(int).values

    # 2. Stratified train/test split to preserve target distribution
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    preprocessor = build_preprocessor()

    # Candidate models
    candidates = {
        "Logistic Regression": LogisticRegression(
            class_weight="balanced",
            max_iter=1000,
            random_state=42,
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=120,
            max_depth=8,
            class_weight="balanced",
            min_samples_split=5,
            random_state=42,
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=120,
            learning_rate=0.08,
            max_depth=4,
            random_state=42,
        ),
    }

    comparison_results = []
    trained_pipelines = {}
    cv_strategy = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    for name, clf in candidates.items():
        pipe = Pipeline(steps=[("preprocessor", preprocessor), ("classifier", clf)])

        # 5-Fold Stratified Cross Validation F1-score
        cv_scores = cross_val_score(pipe, X_train, y_train, cv=cv_strategy, scoring="f1")
        cv_f1_mean = round(float(np.mean(cv_scores)), 4)
        cv_f1_std = round(float(np.std(cv_scores)), 4)

        # Fit on full training set
        pipe.fit(X_train, y_train)
        trained_pipelines[name] = pipe

        # Test set evaluation
        y_pred = pipe.predict(X_test)
        y_prob = pipe.predict_proba(X_test)[:, 1]

        metrics = compute_comprehensive_metrics(y_test, y_pred, y_prob, name)
        metrics["cv_f1_mean"] = cv_f1_mean
        metrics["cv_f1_std"] = cv_f1_std
        metrics["training_samples"] = len(X_train)
        metrics["test_samples"] = len(X_test)

        comparison_results.append(metrics)

    # 3. Model Selection: Select model with highest Test F1-Score (prioritising recall & precision balance)
    best_candidate = max(comparison_results, key=lambda m: (m["f1_score"], m["roc_auc"]))
    best_model_name = best_candidate["model_name"]
    best_pipe = trained_pipelines[best_model_name]

    # 4. Extract Feature Importances
    feature_importances = []
    # Get feature names after one-hot encoding
    fitted_preprocessor = best_pipe.named_steps["preprocessor"]
    cat_encoder = fitted_preprocessor.named_transformers_["cat"]
    cat_feature_names = list(cat_encoder.get_feature_names_out())
    transformed_feature_names = fitted_preprocessor.transformers_[0][2] + cat_feature_names

    classifier = best_pipe.named_steps["classifier"]
    if hasattr(classifier, "feature_importances_"):
        raw_importances = classifier.feature_importances_
    elif hasattr(classifier, "coef_"):
        raw_importances = np.abs(classifier.coef_[0])
    else:
        raw_importances = np.ones(len(transformed_feature_names))

    # Normalize to 100%
    norm_importances = (raw_importances / np.sum(raw_importances)) * 100.0
    for fname, imp in zip(transformed_feature_names, norm_importances):
        # Format human-friendly name
        display_name = fname.replace("num__", "").replace("cat__", "").replace("_", " ").title()
        feature_importances.append({
            "feature": display_name,
            "raw_feature": fname,
            "importance": round(float(imp), 2),
        })
    feature_importances = sorted(feature_importances, key=lambda x: x["importance"], reverse=True)[:10]

    # 5. Persist Model and Metadata Artifacts
    model_path = os.path.join(output_dir, "best_model_pipeline.joblib")
    joblib.dump(best_pipe, model_path)

    metadata = {
        "best_model_name": best_model_name,
        "models_evaluated": list(candidates.keys()),
        "selection_metric": "F1-Score / ROC-AUC on Unseen Stratified Test Set",
        "best_metrics": best_candidate,
        "comparisons": comparison_results,
        "feature_importances": feature_importances,
        "audit_summary": audit_summary,
    }

    with open(os.path.join(output_dir, "model_comparison.json"), "w") as f:
        json.dump(metadata, f, indent=2)

    with open(os.path.join(output_dir, "feature_importance.json"), "w") as f:
        json.dump(feature_importances, f, indent=2)

    print(f"Training completed successfully!")
    print(f"Best Model Selected: {best_model_name}")
    print(f"F1-Score: {best_candidate['f1_score']} | ROC-AUC: {best_candidate['roc_auc']} | Recall: {best_candidate['recall']}")
    print(f"Pipeline saved to: {model_path}")

    return metadata


if __name__ == "__main__":
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(ml_dir))
    data_file = os.path.join(
        project_root,
        "data",
        "synthetic",
        "bankguard_synthetic_customers.csv",
    )
    train_and_compare_models(data_file)
