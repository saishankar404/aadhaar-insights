import { DashboardLayout } from '@/components/DashboardLayout';

const Simulator = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Predictive Simulator</h1>
        <p className="text-sm text-muted-foreground mt-1">Model intervention outcomes</p>
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
        <p className="text-muted-foreground">Intervention simulator coming soon</p>
      </div>
    </div>
  </DashboardLayout>
);

export default Simulator;
