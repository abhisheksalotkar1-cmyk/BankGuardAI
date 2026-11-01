import React, { useEffect, useState } from 'react';
import {
  Database,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Table,
  RefreshCw,
} from 'lucide-react';
import { uploadDataset, fetchDatasetPreview } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export const DataManagementPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadPreview = () => {
    setPreviewLoading(true);
    fetchDatasetPreview()
      .then((res) => setPreview(res))
      .catch((err) => console.error(err))
      .finally(() => setPreviewLoading(false));
  };

  useEffect(() => {
    loadPreview();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg('');
      setUploadResult(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a CSV dataset file first.');
      return;
    }
    setUploading(true);
    setErrorMsg('');
    try {
      const res = await uploadDataset(file);
      setUploadResult(res);
      setFile(null);
      loadPreview();
    } catch (err: any) {
      setErrorMsg(err.message || 'Dataset upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleExport = () => {
    window.open('/api/reports/export', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Dataset Management & Pipeline Ingestion
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ingest external banking CSV records, trigger automated schema validation, and export scored intelligence.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Export All Predictions (.CSV)</span>
        </button>
      </div>

      {/* CSV Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              Upload Customer CSV Dataset
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Accepts CSV files with banking attributes (`CreditScore`, `Geography`, `Age`, `Tenure`, `Balance`, `NumOfProducts`, `HasCrCard`, `IsActiveMember`, `EstimatedSalary`).
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-navy-700 hover:border-cyan-500/50 rounded-2xl p-8 text-center cursor-pointer transition bg-navy-950/60">
                <input
                  type="file"
                  id="csvFileInput"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="csvFileInput" className="cursor-pointer block">
                  <FileText className="w-10 h-10 text-cyan-400 mx-auto mb-2 opacity-80" />
                  <span className="text-xs font-semibold text-white block">
                    {file ? file.name : 'Click to select CSV file from computer'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports standard retail churn datasets'}
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Processing & Ingesting Dataset...' : 'Validate & Ingest Dataset'}</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-navy-800 text-[11px] text-slate-500 flex justify-between">
            <span>Automated Missing Value Imputation: Enabled</span>
            <span>Outlier Clipping: Active</span>
          </div>
        </div>

        {/* Upload Audit Report */}
        <div className="lg:col-span-6 bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated Ingestion Audit Report
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time audit telemetry from the data cleaning pipeline
            </p>

            {uploadResult ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Successfully ingested <strong>{uploadResult.file_name}</strong>!
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      New Profiles Inserted
                    </span>
                    <span className="text-xl font-bold text-cyan-400 font-mono">
                      {uploadResult.records_inserted}
                    </span>
                  </div>
                  <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Existing Updated
                    </span>
                    <span className="text-xl font-bold text-emerald-400 font-mono">
                      {uploadResult.records_updated}
                    </span>
                  </div>
                </div>

                {uploadResult.audit_report && (
                  <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-[11px] text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Records Processed:</span>
                      <span className="font-mono">{uploadResult.audit_report.total_records_processed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valid Records Retained:</span>
                      <span className="font-mono text-emerald-400">{uploadResult.audit_report.valid_records_retained}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duplicates Removed:</span>
                      <span className="font-mono">{uploadResult.audit_report.duplicate_records_removed}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-navy-950/70 border border-navy-800 rounded-xl p-8 text-center text-slate-500 flex flex-col items-center justify-center my-auto min-h-[220px]">
                <FileText className="w-10 h-10 text-slate-700 mb-2" />
                <p className="text-xs">No active upload audit running.</p>
                <p className="text-[11px] text-slate-600 mt-1">Upload a CSV on the left to see instant pipeline validation results.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-navy-800 text-[11px] text-slate-500">
            Current active dataset: <strong>bankguard_synthetic_customers.csv</strong>
          </div>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-navy-800 bg-navy-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Ingested Dataset Preview ({preview ? preview.total_records : 0} Total Records)
            </h3>
          </div>
          <button
            onClick={loadPreview}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-navy-800 bg-navy-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Surname</th>
                <th className="py-3 px-4">Credit Score</th>
                <th className="py-3 px-4">Market</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Predicted Churn</th>
                <th className="py-3 px-4 text-right">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {previewLoading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Loading preview rows...
                  </td>
                </tr>
              ) : !preview || preview.preview_records.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    No preview records available.
                  </td>
                </tr>
              ) : (
                preview.preview_records.map((r: any, i: number) => (
                  <tr key={i} className="hover:bg-navy-850/60 transition">
                    <td className="py-2.5 px-4 font-mono text-cyan-400 font-medium">#{r.customer_id}</td>
                    <td className="py-2.5 px-4 font-semibold text-white">{r.surname}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-300">{r.credit_score}</td>
                    <td className="py-2.5 px-4 text-slate-300">{r.geography}</td>
                    <td className="py-2.5 px-4 text-slate-300">{r.age} yrs</td>
                    <td className="py-2.5 px-4 text-slate-200">€{r.balance.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-slate-300">{r.num_of_products}</td>
                    <td className="py-2.5 px-4">
                      {r.is_active_member === 1 ? (
                        <span className="text-emerald-400 text-[11px]">Active</span>
                      ) : (
                        <span className="text-rose-400 text-[11px]">Dormant</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-300">
                      {(r.churn_probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <RiskBadge riskLevel={r.risk_level} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
