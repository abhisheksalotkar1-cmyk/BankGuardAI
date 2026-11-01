export interface RiskDistributionItem {
  name: string;
  count: number;
  percentage: number;
  fill: string;
}

export interface GeographicDistributionItem {
  geography: string;
  customer_count: number;
  average_churn_probability: number;
  total_balance: number;
  average_credit_score: number;
}

export interface AgeCohortDistributionItem {
  cohort: string;
  total_customers: number;
  high_risk_customers: number;
  risk_rate: number;
}

export interface ActivityDistributionItem {
  status: string;
  total: number;
  high_risk: number;
  risk_rate: number;
}

export interface DashboardSummary {
  total_customers: number;
  predicted_churn_count: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  overall_churn_percentage: number;
  customer_retention_percentage: number;
  total_balance_at_risk: number;
  risk_distribution: RiskDistributionItem[];
  geographic_distribution: GeographicDistributionItem[];
  age_cohort_distribution: AgeCohortDistributionItem[];
  activity_distribution: ActivityDistributionItem[];
}

export interface Customer {
  id: number;
  customer_id: number;
  surname: string;
  credit_score: number;
  geography: string;
  gender: string;
  age: number;
  tenure: number;
  balance: number;
  num_of_products: number;
  has_cr_card: number;
  is_active_member: number;
  estimated_salary: number;
  churn?: number;
  predicted_churn?: number;
  churn_probability?: number;
  risk_level?: string;
  retention_status: string;
  notes?: string;
}

export interface FactorContribution {
  factor: string;
  impact: string;
  direction: 'risk_elevating' | 'risk_reducing';
  weight: number;
  explanation: string;
}

export interface RetentionRecommendation {
  action: string;
  priority: string;
  channel: string;
  description: string;
}

export interface CustomerDetail extends Customer {
  contributing_factors: FactorContribution[];
  retention_recommendations: RetentionRecommendation[];
}

export interface PredictResponse {
  customer_id: any;
  predicted_churn: number;
  churn_probability: number;
  churn_probability_percentage: number;
  risk_level: string;
  badge_color: string;
  confidence_score: number;
  contributing_factors: FactorContribution[];
  retention_recommendations: RetentionRecommendation[];
  disclaimer: string;
}

export interface ModelMetricComparison {
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  cv_f1_mean: number;
  cv_f1_std: number;
  training_samples: number;
  test_samples: number;
  confusion_matrix: {
    true_negative: number;
    false_positive: number;
    false_negative: number;
    true_positive: number;
  };
  roc_curve: Array<{ fpr: number; tpr: number }>;
  pr_curve: Array<{ recall: number; precision: number }>;
}

export interface FeatureImportanceItem {
  feature: string;
  raw_feature: string;
  importance: number;
}

export interface ModelPerformanceData {
  best_model_name: string;
  models_evaluated: string[];
  selection_metric: string;
  best_metrics: ModelMetricComparison;
  comparisons: ModelMetricComparison[];
  feature_importances: FeatureImportanceItem[];
}

export interface RetentionQueueItem {
  id: number;
  customer_id: number;
  surname: string;
  risk_level: string;
  churn_probability: number;
  balance: number;
  tenure: number;
  num_of_products: number;
  is_active_member: number;
  retention_status: string;
  recommended_action: RetentionRecommendation | null;
  all_actions: RetentionRecommendation[];
  notes?: string;
}

export interface RetentionQueueResponse {
  summary: {
    total_high_risk_customers: number;
    total_balance_at_risk: number;
    pending_review_count: number;
    in_contact_count: number;
    retained_count: number;
  };
  retention_queue: RetentionQueueItem[];
}
