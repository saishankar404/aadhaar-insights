import { DashboardLayout } from '@/components/DashboardLayout';

const InclusionEquity = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Inclusion & Equity</h1>
        <p className="text-sm text-muted-foreground mt-1">Rural vs Urban analysis</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-medium mb-2">Rural Penetration</h3>
          <p className="text-4xl font-semibold text-foreground">94.2%</p>
          <p className="text-sm text-muted-foreground mt-1">Coverage in rural districts</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-medium mb-2">Urban Penetration</h3>
          <p className="text-4xl font-semibold text-foreground">99.4%</p>
          <p className="text-sm text-muted-foreground mt-1">Coverage in urban districts</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default InclusionEquity;
