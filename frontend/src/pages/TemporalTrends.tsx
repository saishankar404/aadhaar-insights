import { DashboardLayout } from '@/components/DashboardLayout';
import { trendData, policyEvents } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const TemporalTrends = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Temporal Trends</h1>
        <p className="text-sm text-muted-foreground mt-1">Enrolment and update patterns over time</p>
      </div>
      <div className="grid gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-medium mb-4">Monthly Enrolments & Updates</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="enrolments" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="updates" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
              {policyEvents.slice(0, 2).map((event) => (
                <ReferenceLine key={event.id} x={event.date.slice(0, 7)} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default TemporalTrends;
