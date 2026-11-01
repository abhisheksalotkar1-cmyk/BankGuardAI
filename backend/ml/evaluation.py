"""
BankGuard AI - Model Evaluation & Comparison Metrics Engine
Author: abhisheksalotkar1-cmyk
"""

from typing import Dict, Any, List
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve,
    precision_recall_curve,
)


def compute_comprehensive_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_prob: np.ndarray,
    model_name: str,
) -> Dict[str, Any]:
    """
    Computes rigorous evaluation metrics focusing on churn-class recall & precision.
    Includes confusion matrix breakdown, ROC points, and PR points.
    """
    cm = confusion_matrix(y_true, y_pred)
    # cm layout: [[TN, FP], [FN, TP]]
    tn, fp, fn, tp = cm.ravel()

    # ROC curve points (subsampled for lightweight UI rendering)
    fpr, tpr, roc_thresholds = roc_curve(y_true, y_prob)
    indices = np.linspace(0, len(fpr) - 1, min(25, len(fpr))).astype(int)
    roc_curve_points = [
        {"fpr": round(float(fpr[i]), 4), "tpr": round(float(tpr[i]), 4)}
        for i in indices
    ]

    # Precision-Recall curve
    prec, rec, pr_thresh = precision_recall_curve(y_true, y_prob)
    pr_indices = np.linspace(0, len(prec) - 1, min(25, len(prec))).astype(int)
    pr_curve_points = [
        {"recall": round(float(rec[i]), 4), "precision": round(float(prec[i]), 4)}
        for i in pr_indices
    ]

    metrics = {
        "model_name": model_name,
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_true, y_prob)), 4),
        "confusion_matrix": {
            "true_negative": int(tn),
            "false_positive": int(fp),
            "false_negative": int(fn),
            "true_positive": int(tp),
        },
        "roc_curve": roc_curve_points,
        "pr_curve": pr_curve_points,
    }

    return metrics
