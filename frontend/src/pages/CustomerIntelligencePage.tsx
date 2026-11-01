import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  CreditCard,
  ArrowUpDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Customer } from '../types';
import { fetchCustomers } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { CustomerModal } from '../components/CustomerModal';

export const CustomerIntelligencePage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [geoFilter, setGeoFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortByRisk, setSortByRisk] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const limit = 25;

  const loadData = () => {
    setLoading(true);
    fetchCustomers({
      skip: page * limit,
      limit,
      search: searchTerm.trim() || undefined,
      risk_level: riskFilter !== 'all' ? riskFilter : undefined,
      geography: geoFilter !== 'all' ? geoFilter : undefined,
      retention_status: statusFilter !== 'all' ? statusFilter : undefined,
      sort_by_risk: sortByRisk,
    })
      .then((res) => setCustomers(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page, riskFilter, geoFilter, statusFilter, sortByRisk]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              Customer Intelligence Explorer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Search, filter, and inspect individual account risk scores and behavioural signals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortByRisk(!sortByRisk)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                sortByRisk
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  : 'bg-navy-850 border-navy-700 text-slate-300 hover:bg-navy-800'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortByRisk ? 'Sorted: Highest Risk First' : 'Sorted: Standard ID'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-navy-800/80">
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID (e.g. 15800001) or Surname..."
              className="w-full bg-navy-950 border border-navy-750 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </form>

          <div>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setPage(0);
              }}
              className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Risk Tiers</option>
              <option value="High Risk">High Risk (66-100%)</option>
              <option value="Medium Risk">Medium Risk (31-65%)</option>
              <option value="Low Risk">Low Risk (0-30%)</option>
            </select>
          </div>

          <div>
            <select
              value={geoFilter}
              onChange={(e) => {
                setGeoFilter(e.target.value);
                setPage(0);
              }}
              className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Geographies</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Spain">Spain</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Retention Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="In Contact">In Contact</option>
              <option value="Retained">Retained</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-navy-800 bg-navy-950/80 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Market</th>
                <th className="py-3.5 px-4">Credit Score</th>
                <th className="py-3.5 px-4">Balance</th>
                <th className="py-3.5 px-4">Products</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4">Churn Risk</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto mb-2" />
                    Loading portfolio records...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No customers match the current filter criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const prob = c.churn_probability !== undefined ? c.churn_probability : 0;
                  return (
                    <tr
                      key={c.customer_id}
                      className="hover:bg-navy-850/60 transition group cursor-pointer"
                      onClick={() => setSelectedCustomerId(c.customer_id)}
                    >
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="font-bold text-slate-100">{c.surname}</div>
                        <div className="text-[10px] text-slate-500 font-mono">#{c.customer_id}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {c.age} yrs • {c.gender}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-navy-800 border border-navy-700 text-[11px]">
                          {c.geography}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-cyan-400">
                        {c.credit_score}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">
                        €{c.balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="inline-flex items-center gap-1 font-mono">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          {c.num_of_products}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {c.is_active_member === 1 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                            <UserCheck className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 text-[11px]">
                            <UserX className="w-3.5 h-3.5" />
                            Dormant
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <RiskBadge riskLevel={c.risk_level} />
                          <span className="font-mono text-slate-400 text-[11px]">
                            {(prob * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-navy-800 text-slate-300 border border-navy-700">
                          {c.retention_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomerId(c.customer_id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-cyan-600 hover:text-white text-slate-300 border border-navy-700 text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-navy-800 bg-navy-950/60 text-xs text-slate-400">
          <span>
            Page <strong className="text-white">{page + 1}</strong> (Showing up to {limit} per page)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-700 text-slate-300 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={customers.length < limit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-700 text-slate-300 disabled:opacity-40 transition"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomerId && (
        <CustomerModal
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
          onStatusUpdated={loadData}
        />
      )}
    </div>
  );
};
