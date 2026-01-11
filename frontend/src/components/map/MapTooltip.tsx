import { type District, getRiskLabel, formatPercentage } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface MapTooltipProps {
  district: District;
  style?: React.CSSProperties;
  className?: string;
}

export function MapTooltip({ district, style, className }: MapTooltipProps) {
  return (
    <div
      className={cn(
        'z-50 bg-card border border-border rounded-xl shadow-xl p-4 min-w-[220px]',
        'animate-in fade-in-0 zoom-in-95 duration-200',
        className
      )}
      style={style}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-foreground">{district.name}</h4>
            <p className="text-xs text-muted-foreground">{district.state}</p>
          </div>
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded-full',
              district.riskLevel === 'low' && 'bg-green-100 text-green-700',
              district.riskLevel === 'medium' && 'bg-yellow-100 text-yellow-700',
              district.riskLevel === 'high' && 'bg-orange-100 text-orange-700',
              district.riskLevel === 'critical' && 'bg-red-100 text-red-700'
            )}
          >
            {getRiskLabel(district.riskLevel)}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <MetricItem
            label="Saturation"
            value={formatPercentage(district.metrics.saturationRatio)}
          />
          <MetricItem
            label="Child Compliance"
            value={formatPercentage(district.metrics.childBiometricCompliance)}
          />
          <MetricItem
            label="Update Intensity"
            value={formatPercentage(district.metrics.updateIntensity)}
          />
          <MetricItem
            label="Equity Gap"
            value={formatPercentage(district.metrics.equityGap)}
          />
        </div>

        {/* Action hint */}
        <p className="text-xs text-accent font-medium">Click to view details →</p>
      </div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
