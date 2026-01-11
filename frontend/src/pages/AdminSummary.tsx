import { DashboardLayout } from '@/components/DashboardLayout';
import { districts } from '@/data/mockData';

const AdminSummary = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin Summary</h1>
        <p className="text-sm text-muted-foreground mt-1">Priority districts and exports</p>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">District</th>
              <th className="text-left p-4 font-medium">State</th>
              <th className="text-left p-4 font-medium">Risk</th>
              <th className="text-right p-4 font-medium">Saturation</th>
            </tr>
          </thead>
          <tbody>
            {districts.filter(d => d.riskLevel === 'critical' || d.riskLevel === 'high').map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="p-4">{d.name}</td>
                <td className="p-4 text-muted-foreground">{d.state}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${d.riskLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{d.riskLevel}</span></td>
                <td className="p-4 text-right">{d.metrics.saturationRatio.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminSummary;
