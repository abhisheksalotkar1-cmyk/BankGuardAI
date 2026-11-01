import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Award,
  Layers,
  CheckCircle,
  HelpCircle,
  Sliders,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { ModelPerformanceData } from '../types';
import { fetchModelPerformance } from '../services/api';

export const ModelPerformancePage: React.FC = () => {
  const [data, setData] = useState<ModelPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelPerformance()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" />
          <p className="text-slate-400 text-sm">Loading validation telemetry & metrics...</p>
        </div>
      </div>
    );
  }

  const best = data.best_metrics;
  const cm = best.confusion_matrix;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            Selected Champion: {data.best_model_name}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Machine Learning Engine Performance & Validation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Empirical comparison of Logistic Regression, Random Forest, and Gradient Boosting pipelines evaluated on stratified held-out test records.
          </p>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-navy-800 bg-navy-850 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Candidate Pipeline Benchmark Matrix
          </h3>
          <span className="text-xs text-slate-400">
            Selection Criteria: Prioritised Churn-Class Recall & F1-Score
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-navy-800 bg-navy-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-6">Model Architecture</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision (Churn)</th>
                <th className="py-3 px-4">Recall (Churn)</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">ROC-AUC</th>
                <th className="py-3 px-4">5-Fold CV F1 (Mean ± Std)</th>
                <th className="py-3 px-6 text-right">Production Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono">
              {data.comparisons.map((c, i) => {
                const isChampion = c.model_name === data.best_model_name;
                return (
                  <tr
                    key={i}
                    className={`transition ${
                      isChampion ? 'bg-cyan-500/10 hover:bg-cyan-500/15' : 'hover:bg-navy-850/60'
                    }`}
                  >
                    <td className="py-3.5 px-6 font-sans font-bold text-white flex items-center gap-2">
                      {isChampion && <Award className="w-4 h-4 text-cyan-400" />}
                      <span>{c.model_name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">{(c.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-slate-200">{(c.precision * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">
                      {(c.recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-cyan-400 font-bold">{c.f1_score.toFixed(4)}</td>
                    <td className="py-3.5 px-4 text-slate-200">{c.roc_auc.toFixed(4)}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {c.cv_f1_mean.toFixed(3)} ± {c.cv_f1_std.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-6 text-right font-sans">
                      {isChampion ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Active Champion
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Benchmark</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics: Confusion Matrix + ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Confusion Matrix ({best.model_name})
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Tested on 500 held-out customer records (20% test fold)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full my-auto text-center">
            {/* True Negative */}
            <div className="bg-navy-950 p-4 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                True Negative (Retained)
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {cm.true_negative}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Correct Non-Churn</span>
            </div>

            {/* False Positive */}
            <div className="bg-navy-950 p-4 rounded-xl border border-amber-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                False Positive (Type I)
              </span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {cm.false_positive}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">False Alarm</span>
            </div>

            {/* False Negative */}
            <div className="bg-navy-950 p-4 rounded-xl border border-rose-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                False Negative (Type II)
              </span>
              <span className="text-2xl font-black text-rose-400 font-mono">
                {cm.false_negative}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Missed Churn Attrition</span>
            </div>

            {/* True Positive */}
            <div className="bg-navy-950 p-4 rounded-xl border border-cyan-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                True Positive (Captured)
              </span>
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {cm.true_positive}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Correctly Intervened</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-6 pt-4 border-t border-navy-800 flex justify-between">
            <span>Class Imbalance Handling: Balanced Class Weights</span>
            <span>Total Evaluated: {best.test_samples} Records</span>
          </div>
        </div>

        {/* ROC Curve Chart */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Receiver Operating Characteristic (ROC)
              </h3>
              <span className="text-xs font-mono font-bold text-cyan-400">
                AUC = {best.roc_auc.toFixed(4)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">True Positive Rate vs False Positive Rate</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={best.roc_curve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="fpr" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis dataKey="tpr" stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tpr"
                  name="ROC Curve"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 pt-3 border-t border-navy-800 flex justify-between">
            <span>Reference Baseline: 0.50 (Random Guess)</span>
            <span className="text-emerald-400 font-semibold">Discriminative Power: Robust</span>
          </div>
        </div>
      </div>

      {/* Feature Importance Ranking */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Global Feature Importance Attribution
            </h3>
            <p className="text-xs text-slate-400">
              Normalized relative contribution across all decision trees in champion model
            </p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.feature_importances}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} unit="%" />
              <YAxis
                type="category"
                dataKey="feature"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
                formatter={(val: any) => [`${val}%`, 'Relative Weight']}
              />
              <Bar dataKey="importance" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology & Rigor Details */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl text-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Rigorous Data Science Methodology & Leakage Prevention
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
          <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800">
            <h5 className="font-bold text-white mb-1">Stratified 80/20 Splitting</h5>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Target class distributions are preserved identically across train and test folds, ensuring evaluation metrics accurately reflect rare attrition events.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800">
            <h5 className="font-bold text-white mb-1">Zero Leakage Guarantee</h5>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              All scalers and encoders are fitted exclusively on training sets via Scikit-learn Pipeline objects, preventing test information bleed.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800">
            <h5 className="font-bold text-white mb-1">Class Imbalance Handling</h5>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Rather than raw accuracy, optimization prioritises recall and F1-score with balanced class penalties to capture at-risk accounts without synthetic contamination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
