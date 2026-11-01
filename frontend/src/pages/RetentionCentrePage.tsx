import React, { useEffect, useState } from 'react';
import {
  HeartHandshake,
  AlertOctagon,
  Coins,
  PhoneCall,
  Clock,
  CheckCircle2,
  Filter,
  Eye,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { RetentionQueueResponse, RetentionQueueItem } from '../types';
import { fetchRetentionQueue, updateCustomerStatus } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { CustomerModal } from '../components/CustomerModal';

export const RetentionCentrePage: React.FC = () => {
  const [data, setData] = useState<RetentionQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadQueue = () => {
    setLoading(true);
    fetchRetentionQueue({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      min_risk_level: 'High Risk',
      limit: 60,
    })
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQueue();
  }, [statusFilter]);

  const handleStatusChange = async (customerId: number, newStatus: string) => {
    setUpdatingId(customerId);
    try {
      await updateCustomerStatus(customerId, newStatus);
      loadQueue();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-cyan-400" />
            Customer Retention Centre & Action Queue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prioritised customer intervention queue with rule-based retention actions and relationship lifecycle tracking.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Intervention States</option>
            <option value="Pending Review">Pending Review</option>
            <option value="In Contact">In Contact</option>
            <option value="Retained">Retained</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Strip */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-navy-900 border border-navy-800 p-4 rounded-xl">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
              High Risk Priority
            </span>
            <span className="text-2xl font-black text-rose-400 font-mono">
              {data.summary.total_high_risk_customers}
            </span>
          </div>

          <div className="bg-navy-900 border border-navy-800 p-4 rounded-xl">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
              Deposit Capital At Risk
            </span>
            <span className="text-2xl font-black text-white font-mono">
              €{(data.summary.total_balance_at_risk / 1_000_000).toFixed(2)}M
            </span>
          </div>

          <div className="bg-navy-900 border border-navy-800 p-4 rounded-xl">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
              Pending Review
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              {data.summary.pending_review_count}
            </span>
          </div>

          <div className="bg-navy-900 border border-navy-800 p-4 rounded-xl">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
              In Active Contact
            </span>
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {data.summary.in_contact_count}
            </span>
          </div>

          <div className="bg-navy-900 border border-navy-800 p-4 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
              Successfully Retained
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {data.summary.retained_count}
            </span>
          </div>
        </div>
      )}

      {/* Retention Queue List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2" />
            Loading retention priority queue...
          </div>
        ) : !data || data.retention_queue.length === 0 ? (
          <div className="bg-navy-900 border border-dashed border-navy-700 rounded-2xl p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white mb-1">Queue Cleared</h4>
            <p className="text-xs text-slate-500">
              No customers found in this retention status category.
            </p>
          </div>
        ) : (
          data.retention_queue.map((item) => (
            <div
              key={item.customer_id}
              className="bg-navy-900 border border-navy-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              {/* Customer ID & Risk Indicators */}
              <div className="space-y-1 sm:min-w-[240px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.surname}</span>
                  <RiskBadge riskLevel={item.risk_level} probability={item.churn_probability} showProbability />
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Ref: #{item.customer_id}</span>
                  <span>•</span>
                  <span>Balance: <strong className="text-slate-200">€{item.balance.toLocaleString()}</strong></span>
                  <span>•</span>
                  <span>{item.is_active_member === 1 ? 'Active' : 'Dormant'}</span>
                </div>
              </div>

              {/* Recommended Action Card */}
              {item.recommended_action && (
                <div className="flex-1 bg-navy-950/70 border border-navy-800 rounded-xl p-3 text-xs w-full lg:max-w-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {item.recommended_action.action}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-navy-800 border border-navy-700 text-slate-300 text-[10px]">
                        {item.recommended_action.channel}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                        {item.recommended_action.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                    {item.recommended_action.description}
                  </p>
                </div>
              )}

              {/* Action & Status Select */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-navy-800 pt-3 lg:pt-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Status:</span>
                  <select
                    value={item.retention_status}
                    disabled={updatingId === item.customer_id}
                    onChange={(e) => handleStatusChange(item.customer_id, e.target.value)}
                    className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="In Contact">In Contact</option>
                    <option value="Retained">Retained</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedCustomerId(item.customer_id)}
                  className="px-3 py-1.5 rounded-lg bg-navy-850 hover:bg-cyan-600 hover:text-white text-slate-300 border border-navy-700 text-xs font-semibold transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer Modal */}
      {selectedCustomerId && (
        <CustomerModal
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
          onStatusUpdated={loadQueue}
        />
      )}
    </div>
  );
};
