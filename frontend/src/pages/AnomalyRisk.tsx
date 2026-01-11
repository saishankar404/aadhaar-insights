import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { fetchTopRiskDistricts, DistrictMetric } from '@/services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnomalyRisk = () => {
  const [districts, setDistricts] = useState<DistrictMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTopRiskDistricts(100);
        setDistricts(data);
      } catch (error) {
        console.error("Failed to fetch district data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Anomaly & Risk Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive risk assessment for all districts based on ASR, UII, and CBCG metrics.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>District Risk Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">Loading analysis data...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>District</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead className="text-right">Saturation (ASR)</TableHead>
                    <TableHead className="text-right">Update Intensity (UII)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {districts.map((d) => (
                    <TableRow key={d.district}>
                      <TableCell className="font-medium">{d.district}</TableCell>
                      <TableCell>{d.state}</TableCell>
                      <TableCell>{d.risk_score.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge variant={d.risk_level === 'Priority' ? 'destructive' : 'secondary'}>
                          {d.risk_level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{d.asr.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{d.uii?.toFixed(4) || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnomalyRisk;
