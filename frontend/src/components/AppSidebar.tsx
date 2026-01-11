import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GlobeAltIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ScaleIcon,
  BeakerIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { District, districts } from '@/data/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedDistrict?: District | null;
  onDistrictSelect?: (district: District) => void;
  showDistrictList?: boolean;
  districtsData?: District[];
}

const navigation = [
  { name: 'National Overview', href: '/', icon: GlobeAltIcon },
  { name: 'Anomaly & Risk', href: '/anomaly-risk', icon: ExclamationTriangleIcon },
  { name: 'Temporal Trends', href: '/temporal-trends', icon: ChartBarIcon },
  { name: 'Inclusion & Equity', href: '/inclusion-equity', icon: ScaleIcon },
  { name: 'Logs', href: '/logs', icon: DocumentTextIcon },
];

const getRiskColor = (level: string) => {
  switch (level) {
    case 'critical': return 'bg-risk-critical';
    case 'high': return 'bg-risk-high';
    case 'medium': return 'bg-risk-medium';
    default: return 'bg-risk-low';
  }
};

export function AppSidebar({
  collapsed,
  onToggle,
  selectedDistrict,
  onDistrictSelect,
  showDistrictList = false,
  districtsData
}: AppSidebarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const sourceDistricts = districtsData || districts;

  const filteredDistricts = sourceDistricts.filter(district => {
    const matchesSearch = district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      district.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || district.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border z-50 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-foreground">AARI</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center mx-auto">
            <span className="text-accent-foreground font-bold text-sm">A</span>
          </div>
        )}
      </div>

      {/* District List Section (when not collapsed and on overview page) */}
      {!collapsed && showDistrictList && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search & Filter */}
          <div className="p-3 space-y-2 border-b border-border">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search districts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none cursor-pointer"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* District Count */}
          <div className="px-3 py-2 text-xs text-muted-foreground">
            {filteredDistricts.length} districts
          </div>

          {/* Scrollable District List */}
          <ScrollArea className="flex-1">
            <div className="px-2 pb-2 space-y-1">
              {filteredDistricts.map((district) => (
                <button
                  key={district.id}
                  onClick={() => onDistrictSelect?.(district)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150',
                    selectedDistrict?.id === district.id
                      ? 'bg-accent/10 border-2 border-accent'
                      : 'hover:bg-muted border-2 border-transparent'
                  )}
                >
                  <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', getRiskColor(district.riskLevel))} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{district.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{district.state}</p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                    {district.metrics.saturationRatio}%
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Navigation Links */}
      <div className={cn(
        'border-t border-border',
        !collapsed && showDistrictList ? 'py-2' : 'flex-1 py-4'
      )}>
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
