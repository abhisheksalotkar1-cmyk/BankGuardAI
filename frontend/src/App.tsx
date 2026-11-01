import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { OverviewPage } from './pages/OverviewPage';
import { CustomerIntelligencePage } from './pages/CustomerIntelligencePage';
import { PredictionStudioPage } from './pages/PredictionStudioPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { RetentionCentrePage } from './pages/RetentionCentrePage';
import { DataManagementPage } from './pages/DataManagementPage';
import { AboutPage } from './pages/AboutPage';
import { ShieldCheck, Github, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewPage onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'customers' && <CustomerIntelligencePage />}
        {activeTab === 'predict' && <PredictionStudioPage />}
        {activeTab === 'performance' && <ModelPerformancePage />}
        {activeTab === 'retention' && <RetentionCentrePage />}
        {activeTab === 'data' && <DataManagementPage />}
        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-800 bg-navy-900/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white tracking-tight">BankGuard AI</span>
            <span className="text-slate-500">•</span>
            <span>Intelligent Banking Customer Retention & Behaviour Analytics Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/abhisheksalotkar1-cmyk/Bank--Customer-Churn-"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
            >
              <Github className="w-4 h-4" />
              <span>abhisheksalotkar1-cmyk/Bank--Customer-Churn-</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
