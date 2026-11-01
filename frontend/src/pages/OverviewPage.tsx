import React, { useEffect, useState } from 'react';
import {
  Users,
  UserX,
  AlertOctagon,
  TrendingDown,
  ShieldCheck,
  Coins,
  Globe2,
  PieChart as PieIcon,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { DashboardSummary } from '../types';
import { fetchDashboardSummary } from '../services/api';

interface Props {
  onNavigate: (tab: any) => void;
}

export const OverviewPage: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" />
          <p className="text-slate-400 text-sm">Aggregating portfolio intelligence...</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Customers',
      value: data.total_customers.toLocaleString(),
      sub: 'Active monitored portfolio',
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Predicted Churn Cases',
      value: data.predicted_churn_count.toLocaleString(),
      sub: `${data.overall_churn_percentage}% attrition rate`,
      icon: UserX,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      label: 'High-Risk Priority',
      value: data.high_risk_count.toLocaleString(),
      sub: 'Action required immediately',
      icon: AlertOctagon,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Customer Retention',
      value: `${data.customer_retention_percentage}%`,
      sub: 'Portfolio stability index',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Total Capital At Risk',
      value: `€${(data.total_balance_at_risk / 1_000_000).toFixed(2)}M`,
      sub: 'High-risk account deposits',
      icon: Coins,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Executive Decision Support
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Banking Customer Retention Intelligence
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            BankGuard AI identifies subtle behavioural precursors to customer departure,
            quantifies portfolio flight risk, and directs proactive relationship intervention before account closure.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('predict')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-600/20"
          >
            Predict Risk
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('retention')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 text-xs font-bold transition"
          >
            Retention Queue ({data.high_risk_count})
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${kpi.bg} bg-navy-900/60 backdrop-blur-sm transition hover:border-slate-600`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {kpi.label}
                </span>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-black text-white tracking-tight">{kpi.value}</div>
              <p className="text-[11px] text-slate-400 mt-1">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Donut */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-400" />
                Portfolio Risk Distribution
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Stratified by empirical churn likelihood</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {data.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                  formatter={(val: any, name: any) => [`${val.toLocaleString()} Customers`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-navy-800">
            {data.risk_distribution.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.fill }} />
                  <span className="text-slate-300">{r.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-semibold text-white">{r.count}</span>
                  <span className="text-slate-400 text-[11px]">({r.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Market Performance */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                Regional Market Exposure
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Customer volume vs churn probability</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.geographic_distribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="geography" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="customer_count" name="Customers" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="average_churn_probability" name="Avg Churn %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-navy-800 text-center text-xs">
            {data.geographic_distribution.map((g, i) => (
              <div key={i} className="bg-navy-950 p-2 rounded-lg border border-navy-800/80">
                <span className="text-[10px] text-slate-400 block">{g.geography}</span>
                <span className="font-bold text-white text-xs">{g.average_churn_probability}% Churn</span>
              </div>
            ))}
          </div>
        </div>

        {/* Age Cohorts & Behavioral Activity */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Engagement & Cohort Vulnerability
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Risk rates across account activity</p>
          </div>

          <div className="space-y-4 my-auto">
            {/* Activity Comparison */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Member Activity Standing
              </span>
              <div className="space-y-2">
                {data.activity_distribution.map((act, i) => (
                  <div key={i} className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-200">{act.status}</span>
                      <span className={`font-mono font-bold ${act.risk_rate > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {act.risk_rate}% Attrition Risk
                      </span>
                    </div>
                    <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          act.risk_rate > 20 ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, act.risk_rate * 2.5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Cohorts */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Age Demographic Risk Rate
              </span>
              <div className="grid grid-cols-3 gap-2">
                {data.age_cohort_distribution.map((cohort, i) => (
                  <div key={i} className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 text-center">
                    <span className="text-[10px] text-slate-400 block truncate">{cohort.cohort.split(' ')[0]}</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{cohort.risk_rate}%</span>
                    <span className="text-[10px] text-slate-500">{cohort.high_risk_customers} High Risk</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-navy-800 flex justify-between text-xs text-slate-400">
            <span>Model: Random Forest Ensemble</span>
            <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => onNavigate('performance')}>
              View Metrics →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
