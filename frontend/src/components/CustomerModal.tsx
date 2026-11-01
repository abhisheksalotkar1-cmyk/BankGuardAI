import React, { useEffect, useState } from 'react';
import {
  X,
  User,
  CreditCard,
  Building,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Save,
} from 'lucide-react';
import { CustomerDetail } from '../types';
import { fetchCustomerProfile, updateCustomerStatus } from '../services/api';
import { RiskBadge } from './RiskBadge';

interface Props {
  customerId: number | null;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export const CustomerModal: React.FC<Props> = ({ customerId, onClose, onStatusUpdated }) => {
  const [profile, setProfile] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('Pending Review');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    fetchCustomerProfile(customerId)
      .then((data) => {
        setProfile(data);
        setStatus(data.retention_status);
        setNotes(data.notes || '');
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [customerId]);

  const handleSaveStatus = async () => {
    if (!customerId) return;
    setSaving(true);
    try {
      await updateCustomerStatus(customerId, status, notes);
      setSuccessMsg('Status updated successfully');
      if (onStatusUpdated) onStatusUpdated();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!customerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy-900 border border-navy-700 w-full max-w-3xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center border border-navy-700">
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {profile ? profile.surname : `Customer #${customerId}`}
                </h3>
                {profile && (
                  <RiskBadge
                    riskLevel={profile.risk_level}
                    probability={profile.churn_probability}
                    showProbability
                  />
                )}
              </div>
              <p className="text-xs text-slate-400">Account Reference: #{customerId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
            </div>
          ) : profile ? (
            <>
              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-navy-950/80 p-3.5 rounded-xl border border-navy-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Balance</span>
                  <span className="text-lg font-bold text-white">€{profile.balance.toLocaleString()}</span>
                </div>
                <div className="bg-navy-950/80 p-3.5 rounded-xl border border-navy-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Credit Score</span>
                  <span className="text-lg font-bold text-cyan-400">{profile.credit_score}</span>
                </div>
                <div className="bg-navy-950/80 p-3.5 rounded-xl border border-navy-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Est. Salary</span>
                  <span className="text-lg font-bold text-white">€{profile.estimated_salary.toLocaleString()}</span>
                </div>
                <div className="bg-navy-950/80 p-3.5 rounded-xl border border-navy-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Products Held</span>
                  <span className="text-lg font-bold text-emerald-400">{profile.num_of_products}</span>
                </div>
              </div>

              {/* Profile Details & Demographics */}
              <div className="bg-navy-950/60 p-4 rounded-xl border border-navy-800/80 text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-500 block mb-0.5">Demographics:</span>
                  <span className="font-semibold text-slate-200">{profile.age} yrs • {profile.gender}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Geography / Market:</span>
                  <span className="font-semibold text-slate-200">{profile.geography}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Tenure with Bank:</span>
                  <span className="font-semibold text-slate-200">{profile.tenure} Years</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Activity Standing:</span>
                  <span className={`font-semibold ${profile.is_active_member === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {profile.is_active_member === 1 ? 'Active Member' : 'Inactive Member'}
                  </span>
                </div>
              </div>

              {/* Factors Explaining Risk */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-cyan-400" />
                  Key Contributing Risk Factors
                </h4>
                <div className="space-y-2">
                  {profile.contributing_factors.map((f, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                        f.direction === 'risk_elevating'
                          ? 'bg-rose-500/5 border-rose-500/20 text-slate-300'
                          : 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                      }`}
                    >
                      <div className="mt-0.5">
                        {f.direction === 'risk_elevating' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-white">{f.factor}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              f.direction === 'risk_elevating'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {f.impact}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{f.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Retention Interventions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Tailored Retention Actions
                </h4>
                <div className="space-y-2">
                  {profile.retention_recommendations.map((r, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs text-slate-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-sm">{r.action}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-navy-800 text-slate-300 text-[10px] border border-navy-700">
                            {r.channel}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                            {r.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-[11px]">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retention Status Tracking Section */}
              <div className="bg-navy-950/90 p-4 rounded-xl border border-navy-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Retention Management & Advisor Notes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Intervention Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="In Contact">In Contact</option>
                      <option value="Retained">Retained</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Advisor Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Called client on Nov 1st; offered wealth tier advisory..."
                      className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-medium">{successMsg}</span>
                  <button
                    onClick={handleSaveStatus}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Update Status'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-rose-400 text-sm">Failed to load profile details.</p>
          )}
        </div>
      </div>
    </div>
  );
};
