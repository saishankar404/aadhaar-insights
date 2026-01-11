import { type District, formatPercentage, formatNumber, getRiskLabel } from '@/data/mockData';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { SparklineChart } from './SparklineChart';

interface DistrictDetailPanelProps {
  district: District;
  onClose: () => void;
  className?: string;
}

export function DistrictDetailPanel({ district, onClose, className }: DistrictDetailPanelProps) {
  const metrics = [
    {
      label: 'Aadhaar Saturation',
      value: formatPercentage(district.metrics.saturationRatio),
      change: district.trend === 'improving' ? 2.4 : district.trend === 'declining' ? -1.8 : 0.2,
      normal: '> 95%',
    },
    {
      label: 'Update Intensity Index',
      value: formatPercentage(district.metrics.updateIntensity),
      change: 1.2,
      normal: '> 70%',
    },
    {
      label: 'Temporal Deviation',
      value: `${district.metrics.temporalDeviation > 0 ? '+' : ''}${district.metrics.temporalDeviation.toFixed(1)}`,
      change: district.metrics.temporalDeviation,
      normal: '±5',
    },
    {
      label: 'Equity Penetration Gap',
      value: formatPercentage(district.metrics.equityGap),
      change: district.trend === 'improving' ? -3.2 : 1.4,
      normal: '< 10%',
    },
  ];

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl shadow-xl overflow-hidden',
        'animate-in slide-in-from-right-4 duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{district.name}</h3>
            <p className="text-sm text-muted-foreground">{district.state}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-full',
                district.riskLevel === 'low' && 'bg-green-100 text-green-700',
                district.riskLevel === 'medium' && 'bg-yellow-100 text-yellow-700',
                district.riskLevel === 'high' && 'bg-orange-100 text-orange-700',
                district.riskLevel === 'critical' && 'bg-red-100 text-red-700'
              )}
            >
              {getRiskLabel(district.riskLevel)}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 space-y-4">
        {metrics.map((metric) => (
          <MetricRow key={metric.label} {...metric} />
        ))}
      </div>

      {/* Additional Stats */}
      <div className="p-4 border-t border-border bg-muted/20">
        <h4 className="text-sm font-medium text-foreground mb-3">Additional Statistics</h4>
        <div className="grid grid-cols-2 gap-3">
          <StatItem
            label="Enrolment Centers"
            value={district.metrics.enrolmentCenters.toString()}
          />
          <StatItem
            label="Monthly Updates"
            value={formatNumber(district.metrics.monthlyUpdates)}
          />
          <StatItem
            label="Child Compliance"
            value={formatPercentage(district.metrics.childBiometricCompliance)}
          />
          <StatItem
            label="Population"
            value={formatNumber(district.metrics.population)}
          />
        </div>
      </div>

      {/* Observation */}
      {(district.riskLevel === 'high' || district.riskLevel === 'critical') && (
        <div className="p-4 border-t border-border">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm font-medium text-accent">Statistical Deviation Observed</p>
            <p className="text-xs text-muted-foreground mt-1">
              This district shows deviation from expected enrollment patterns. 
              Consider targeted intervention measures.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricRow({
  label,
  value,
  change,
  normal,
}: {
  label: string;
  value: string;
  change: number;
  normal: string;
}) {
  const isPositive = change >= 0;
  
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">Normal: {normal}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-foreground">{value}</span>
          <span
            className={cn(
              'text-xs font-medium',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      </div>
      <SparklineChart positive={isPositive} />
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
