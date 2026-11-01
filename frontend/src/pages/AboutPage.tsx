import React from 'react';
import {
  ShieldCheck,
  Code2,
  Cpu,
  Layers,
  Database,
  Terminal,
  ExternalLink,
  GraduationCap,
  Sparkles,
  GitBranch,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title Card */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-navy-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              University Final-Year Demonstration Project
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              BankGuard AI Platform
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Intelligent Banking Customer Retention & Behaviour Analytics Platform.
              An analytical decision-support system designed to detect early customer attrition risk and deliver transparent retention interventions.
            </p>
          </div>

          <div className="bg-navy-950/80 border border-navy-800 p-4 rounded-2xl text-xs space-y-2 min-w-[220px]">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Author / Owner</span>
              <span className="font-bold text-white text-sm">Abhishek Salotkar</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">GitHub Handle</span>
              <a
                href="https://github.com/abhisheksalotkar1-cmyk"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-cyan-400 flex items-center gap-1 hover:underline"
              >
                abhisheksalotkar1-cmyk
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Repository</span>
              <span className="font-mono text-slate-300 text-[11px]">BankGuard-AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            The Banking Retention Problem
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Acquiring a new retail banking customer costs 5 to 7 times more than retaining an existing account holder.
            Yet financial institutions routinely fail to recognize early warning signs—such as declining transaction activity,
            unoptimized single-product holding, or balance dormancy—until an account closure notice is received.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            BankGuard AI transforms reactive attrition management into proactive relationship preservation by providing front-line relationship managers with empirical predictive intelligence and clear, transparent reasons behind each risk score.
          </p>
        </div>

        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Core Architectural Objectives
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Early Risk Detection:</strong> Predict customer churn probability using cross-validated ensemble learning.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Explainable AI (XAI):</strong> Deconstruct risk scores into transparent factor contributions without black-box opacity.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Actionable Retention:</strong> Provide rule-based intervention blueprints rather than automated marketing spam.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Production Rigor:</strong> Complete separation of ML pipelines to guarantee zero test leakage.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* System Architecture Diagram */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          End-to-End System Architecture
        </h3>

        <div className="bg-navy-950 p-6 rounded-xl border border-navy-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          <pre>{`
  [ Client Tier ]
  React 18 + Vite + TypeScript + Tailwind CSS + Recharts
         │
         │ REST API (JSON / FormData)
         ▼
  [ API Gateway & Application Layer ]
  FastAPI + Pydantic v2 Validation + CORS Middleware
         │
   ┌─────┴────────────────────────────────┐
   ▼                                      ▼
[ Relational Persistence ]     [ Machine Learning Core ]
SQLite / SQLAlchemy ORM         • Preprocessing Pipeline (StandardScaler + OneHotEncoder)
• Customer Master               • Stratified 5-Fold Cross Validation
• Prediction Audit Log          • Random Forest / Gradient Boosting / Logistic Regression
• Retention Status Tracking     • Transparent Factor Contribution Engine
                                • Rule-Based Action Generator
`}</pre>
        </div>
      </div>

      {/* Technology Stack Details */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          Production Technology Stack
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
            <span className="font-bold text-cyan-400 block mb-1">Backend</span>
            <ul className="text-slate-400 space-y-1 text-[11px]">
              <li>Python 3.14</li>
              <li>FastAPI 0.115+</li>
              <li>Pydantic v2</li>
              <li>Uvicorn ASGI</li>
            </ul>
          </div>

          <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
            <span className="font-bold text-emerald-400 block mb-1">Frontend</span>
            <ul className="text-slate-400 space-y-1 text-[11px]">
              <li>React 18 + Vite</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Recharts & Lucide</li>
            </ul>
          </div>

          <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
            <span className="font-bold text-cyan-400 block mb-1">Machine Learning</span>
            <ul className="text-slate-400 space-y-1 text-[11px]">
              <li>Scikit-learn 1.5+</li>
              <li>Pandas & NumPy</li>
              <li>Stratified CV</li>
              <li>Joblib Pipelines</li>
            </ul>
          </div>

          <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
            <span className="font-bold text-emerald-400 block mb-1">Database & Testing</span>
            <ul className="text-slate-400 space-y-1 text-[11px]">
              <li>SQLite / SQLAlchemy</li>
              <li>PostgreSQL Ready</li>
              <li>Pytest Suite (14 Tests)</li>
              <li>HTTPX TestClient</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ethical Scope & Limitations */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-3 text-xs text-slate-300">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          Methodological Governance & Limitations
        </h3>
        <p className="leading-relaxed text-slate-400">
          <strong>Decision Support Boundary:</strong> BankGuard AI is an analytical guidance tool. Churn probability represents statistical likelihood based on historical behavioral records, not certainty. The system never executes autonomous account modifications or unprompted promotional spam.
        </p>
        <p className="leading-relaxed text-slate-400">
          <strong>Data Provenance:</strong> The default baseline dataset consists of 2,500 synthetic customer records with realistic demographic and financial distributions, explicitly created for non-commercial academic demonstration without any exposure of sensitive real-world PII.
        </p>
      </div>
    </div>
  );
};
