import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  RotateCcw,
  Shield,
  Layers,
} from 'lucide-react';
import { PredictResponse } from '../types';
import { predictCustomerRisk } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export const PredictionStudioPage: React.FC = () => {
  const [formData, setFormData] = useState({
    customer_id: 15890001,
    surname: 'Vance',
    credit_score: 620,
    geography: 'Germany',
    gender: 'Female',
    age: 51,
    tenure: 3,
    balance: 115000.0,
    num_of_products: 1,
    has_cr_card: 1,
    is_active_member: 0,
    estimated_salary: 82000.0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);

  const presets = [
    {
      name: 'High-Risk Wealth Depositor',
      desc: 'Age 52, single product, €120k balance, dormant',
      data: {
        customer_id: 15890002,
        surname: 'Moreau',
        credit_score: 610,
        geography: 'Germany',
        gender: 'Female',
        age: 52,
        tenure: 2,
        balance: 125000.0,
        num_of_products: 1,
        has_cr_card: 1,
        is_active_member: 0,
        estimated_salary: 78000.0,
      },
    },
    {
      name: 'Healthy Dual-Product Loyal',
      desc: 'Age 34, 2 products, active member, good credit',
      data: {
        customer_id: 15890003,
        surname: 'Chen',
        credit_score: 745,
        geography: 'France',
        gender: 'Male',
        age: 34,
        tenure: 6,
        balance: 62000.0,
        num_of_products: 2,
        has_cr_card: 1,
        is_active_member: 1,
        estimated_salary: 95000.0,
      },
    },
    {
      name: 'Multi-Product Friction Risk',
      desc: 'Age 46, 3 products, France, fair credit score',
      data: {
        customer_id: 15890004,
        surname: 'Santoro',
        credit_score: 590,
        geography: 'France',
        gender: 'Male',
        age: 46,
        tenure: 4,
        balance: 85000.0,
        num_of_products: 3,
        has_cr_card: 0,
        is_active_member: 1,
        estimated_salary: 64000.0,
      },
    },
  ];

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await predictCustomerRisk(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetData: any) => {
    setFormData(presetData);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Interactive Churn Prediction Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate customer financial profiles to receive real-time churn probability, factor attribution, and retention strategy.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Load Profile:</span>
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => applyPreset(p.data)}
              className="px-2.5 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-700 text-slate-300 text-xs transition"
              title={p.desc}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handlePredict} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-navy-800 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Customer Banking Profile Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Customer Surname / Alias</label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  Credit Score: <strong className="text-cyan-400 font-mono">{formData.credit_score}</strong>
                </label>
                <input
                  type="range"
                  min="350"
                  max="850"
                  step="5"
                  value={formData.credit_score}
                  onChange={(e) => setFormData({ ...formData, credit_score: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-2 bg-navy-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Geography / Branch</label>
                <select
                  value={formData.geography}
                  onChange={(e) => setFormData({ ...formData, geography: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Spain">Spain</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  Age: <strong className="text-white font-mono">{formData.age} Years</strong>
                </label>
                <input
                  type="number"
                  min="18"
                  max="95"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tenure (Years with Bank)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.tenure}
                  onChange={(e) => setFormData({ ...formData, tenure: Number(e.target.value) })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Account Deposit Balance (€)</label>
                <input
                  type="number"
                  step="1000"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Estimated Annual Salary (€)</label>
                <input
                  type="number"
                  step="1000"
                  value={formData.estimated_salary}
                  onChange={(e) => setFormData({ ...formData, estimated_salary: Number(e.target.value) })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Number of Products</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, num_of_products: num })}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${
                        formData.num_of_products === num
                          ? 'bg-cyan-600 border-cyan-400 text-white'
                          : 'bg-navy-950 border-navy-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Member Engagement Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active_member: 1 })}
                    className={`py-2 rounded-xl border text-xs font-bold transition ${
                      formData.is_active_member === 1
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-navy-950 border-navy-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active_member: 0 })}
                    className={`py-2 rounded-xl border text-xs font-bold transition ${
                      formData.is_active_member === 0
                        ? 'bg-rose-600 border-rose-400 text-white'
                        : 'bg-navy-950 border-navy-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-cyan-600/20 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Evaluating Model Inference...' : 'Evaluate Churn Risk Score'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Results Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Risk Assessment Output
                </span>
                <RiskBadge riskLevel={result.risk_level} />
              </div>

              {/* Gauge Display */}
              <div className="text-center py-2">
                <div className="inline-block relative">
                  <div className="text-4xl font-black text-white tracking-tight">
                    {result.churn_probability_percentage}%
                  </div>
                  <span className="text-xs text-slate-400 uppercase tracking-widest block mt-1">
                    Attrition Probability
                  </span>
                </div>
                <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden mt-3 border border-navy-800">
                  <div
                    className={`h-full transition-all duration-700 ${
                      result.risk_level === 'High Risk'
                        ? 'bg-rose-500'
                        : result.risk_level === 'Medium Risk'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${result.churn_probability_percentage}%` }}
                  />
                </div>
              </div>

              {/* Contributing Factors */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-cyan-400" />
                  Factor Breakdown
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {result.contributing_factors.map((f, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                        f.direction === 'risk_elevating'
                          ? 'bg-rose-500/5 border-rose-500/20 text-slate-300'
                          : 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                      }`}
                    >
                      {f.direction === 'risk_elevating' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-white">{f.factor}</div>
                        <div className="text-slate-400 text-[10px]">{f.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Retention Action */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Suggested Retention Action
                </h4>
                {result.retention_recommendations.slice(0, 2).map((rec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-slate-200 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{rec.action}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{rec.description}</p>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-[10px] text-slate-500 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <p>{result.disclaimer}</p>
              </div>
            </div>
          ) : (
            <div className="bg-navy-900 border border-dashed border-navy-700 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[420px] text-slate-400">
              <Cpu className="w-12 h-12 text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">No Prediction Generated Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Fill the customer attributes on the left or select a sample profile preset, then click "Evaluate Churn Risk Score".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
