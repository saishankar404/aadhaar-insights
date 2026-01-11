import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { cn } from '@/lib/utils';
import { District } from '@/data/mockData';

interface DashboardLayoutProps {
  children: React.ReactNode;
  selectedDistrict?: District | null;
  onDistrictSelect?: (district: District) => void;
  districtsData?: District[];
}

export function DashboardLayout({ children, selectedDistrict, onDistrictSelect, districtsData }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isOverviewPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedDistrict={selectedDistrict}
        onDistrictSelect={onDistrictSelect}
        showDistrictList={isOverviewPage}
        districtsData={districtsData}
      />
      <main
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'ml-16' : 'ml-72',
          isOverviewPage ? 'h-screen' : 'min-h-screen p-6'
        )}
      >
        {children}
      </main>
    </div>
  );
}
