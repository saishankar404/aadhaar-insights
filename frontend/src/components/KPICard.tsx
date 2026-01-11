import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface KPICardProps {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'warning' | 'success';
  className?: string;
}

export function KPICard({
  title,
  value,
  suffix,
  trend,
  icon,
  variant = 'default',
  className,
}: KPICardProps) {
  const isPositiveTrend = trend && trend.value >= 0;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/5',
        variant === 'accent' && 'border-accent/20 bg-accent/5',
        variant === 'warning' && 'border-orange-500/20 bg-orange-50',
        variant === 'success' && 'border-green-500/20 bg-green-50',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </span>
            {suffix && (
              <span className="text-lg font-medium text-muted-foreground">{suffix}</span>
            )}
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {isPositiveTrend ? (
                <ArrowUpIcon className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <ArrowDownIcon className="h-3.5 w-3.5 text-red-600" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  isPositiveTrend ? 'text-green-600' : 'text-red-600'
                )}
              >
                {Math.abs(trend.value)}% {trend.label}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
