import {
  DashboardSummary,
  Customer,
  CustomerDetail,
  PredictResponse,
  ModelPerformanceData,
  RetentionQueueResponse,
} from '../types';

const BASE_URL = '/api';

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error('Failed to fetch health status');
  return res.json();
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${BASE_URL}/dashboard/summary`);
  if (!res.ok) throw new Error('Failed to load dashboard summary');
  return res.json();
}

export async function fetchCustomers(params: {
  skip?: number;
  limit?: number;
  search?: string;
  risk_level?: string;
  geography?: string;
  retention_status?: string;
  sort_by_risk?: boolean;
}): Promise<Customer[]> {
  const query = new URLSearchParams();
  if (params.skip !== undefined) query.set('skip', params.skip.toString());
  if (params.limit !== undefined) query.set('limit', params.limit.toString());
  if (params.search) query.set('search', params.search);
  if (params.risk_level) query.set('risk_level', params.risk_level);
  if (params.geography) query.set('geography', params.geography);
  if (params.retention_status) query.set('retention_status', params.retention_status);
  if (params.sort_by_risk) query.set('sort_by_risk', 'true');

  const res = await fetch(`${BASE_URL}/customers?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch customers list');
  return res.json();
}

export async function fetchCustomerProfile(customerId: number): Promise<CustomerDetail> {
  const res = await fetch(`${BASE_URL}/customers/${customerId}`);
  if (!res.ok) throw new Error(`Failed to load customer profile ${customerId}`);
  return res.json();
}

export async function updateCustomerStatus(
  customerId: number,
  retention_status: string,
  notes?: string
) {
  const res = await fetch(`${BASE_URL}/customers/${customerId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ retention_status, notes }),
  });
  if (!res.ok) throw new Error('Failed to update retention status');
  return res.json();
}

export async function predictCustomerRisk(payload: {
  customer_id?: number;
  surname?: string;
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
}): Promise<PredictResponse> {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to execute risk prediction');
  return res.json();
}

export async function fetchModelPerformance(): Promise<ModelPerformanceData> {
  const res = await fetch(`${BASE_URL}/models/performance`);
  if (!res.ok) throw new Error('Failed to fetch model telemetry data');
  return res.json();
}

export async function fetchRetentionQueue(params: {
  status?: string;
  min_risk_level?: string;
  limit?: number;
}): Promise<RetentionQueueResponse> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.min_risk_level) query.set('min_risk_level', params.min_risk_level);
  if (params.limit) query.set('limit', params.limit.toString());

  const res = await fetch(`${BASE_URL}/retention/recommendations?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch retention queue');
  return res.json();
}

export async function uploadDataset(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/dataset/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Dataset upload failed');
  }
  return res.json();
}

export async function fetchDatasetPreview() {
  const res = await fetch(`${BASE_URL}/dataset/preview`);
  if (!res.ok) throw new Error('Failed to fetch dataset preview');
  return res.json();
}
