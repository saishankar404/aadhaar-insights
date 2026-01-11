import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { District } from '@/data/mockData';

interface DistrictPopupProps {
  district: District;
  onClose: () => void;
  onViewDetails: () => void;
}

export function DistrictPopup({ district, onClose, onViewDetails }: DistrictPopupProps) {
  const getRiskGradient = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-gradient-to-br from-red-50 to-red-100/50';
      case 'high': return 'bg-gradient-to-br from-orange-50 to-orange-100/50';
      case 'medium': return 'bg-gradient-to-br from-amber-50 to-amber-100/50';
      default: return 'bg-gradient-to-br from-green-50 to-green-100/50';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white shadow-red-200';
      case 'high': return 'bg-orange-500 text-white shadow-orange-200';
      case 'medium': return 'bg-amber-400 text-black shadow-amber-200';
      default: return 'bg-green-500 text-white shadow-green-200';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/50 p-4 min-w-[280px] w-[300px] ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">

      {/* Header Area */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 shadow-sm ${getRiskBadgeColor(district.riskLevel)}`}>
            {district.riskLevel === 'critical' ? 'Priority' : district.riskLevel} Risk
          </div>
          <h3 className="font-bold text-slate-900 text-base leading-tight">{district.name}</h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">{district.state}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 -mr-1.5 -mt-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <MetricBox label="SATURATION" value={`${district.metrics.saturationRatio}%`} />
        <MetricBox label="UPDATE INDEX" value={district.metrics.updateIntensity.toFixed(1)} />
        <MetricBox label="DEVIATION (σ)" value={district.metrics.temporalDeviation.toString()} />
        <MetricBox label="EQUITY GAP" value={`${district.metrics.equityGap}%`} />
      </div>

      {/* Action Button */}
      <button
        onClick={onViewDetails}
        className="w-full group flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg shadow-slate-200 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      >
        View Detail Analysis
        <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

function MetricBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-[13px] font-bold text-slate-800">{value}</p>
    </div>
  );
}
