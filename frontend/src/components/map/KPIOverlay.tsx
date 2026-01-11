import { nationalKPIs } from '@/data/mockData';
import { ChartBarIcon, ExclamationTriangleIcon, UserGroupIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export function KPIOverlay() {
  const kpis = [
    {
      label: 'National Saturation',
      value: nationalKPIs.saturationRate,
      suffix: '%',
      icon: ChartBarIcon,
    },
    {
      label: 'High-Risk Districts',
      value: nationalKPIs.highRiskDistricts,
      suffix: '',
      icon: ExclamationTriangleIcon,
    },
    {
      label: 'Child Bio Gap',
      value: `${(nationalKPIs.childBiometricGap / 1000000).toFixed(1)}M`,
      suffix: '',
      icon: UserGroupIcon,
    },
    {
      label: 'Update Growth',
      value: nationalKPIs.updateGrowthRate,
      suffix: '%',
      icon: ArrowTrendingUpIcon,
    },
  ];

  return (
    <div className="absolute bottom-6 right-6 z-10">
      <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 p-4">
        <div className="flex items-center gap-6">
          {kpis.map((kpi, index) => (
            <div key={kpi.label} className="flex items-center gap-3">
              {index > 0 && <div className="w-px h-10 bg-border/50" />}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <p className="text-lg font-semibold text-foreground">
                    {kpi.value}{kpi.suffix}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
