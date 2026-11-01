import React from 'react';

interface Props {
  riskLevel?: string;
  probability?: number;
  showProbability?: boolean;
}

export const RiskBadge: React.FC<Props> = ({ riskLevel = 'Low Risk', probability, showProbability = false }) => {
  let bg = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
  let dot = 'bg-emerald-400';

  if (riskLevel.toLowerCase().includes('high')) {
    bg = 'bg-rose-500/15 border-rose-500/30 text-rose-400';
    dot = 'bg-rose-400';
  } else if (riskLevel.toLowerCase().includes('medium')) {
    bg = 'bg-amber-500/15 border-amber-500/30 text-amber-400';
    dot = 'bg-amber-400';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      <span>{riskLevel}</span>
      {showProbability && probability !== undefined && (
        <span className="opacity-80">({(probability * 100).toFixed(1)}%)</span>
      )}
    </span>
  );
};
