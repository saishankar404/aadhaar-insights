import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { District, districts as geoDistricts } from '@/data/mockData';
import { fetchNationalSummary, fetchMapData, NationalSummary } from '@/services/api';
import { IndiaMap } from '@/components/map/IndiaMap';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserGroupIcon, ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Index = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [summary, setSummary] = useState<NationalSummary | null>(null);
  const [mapDistricts, setMapDistricts] = useState<District[]>(geoDistricts);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryData, mapData] = await Promise.all([
          fetchNationalSummary(),
          fetchMapData()
        ]);

        setSummary(summaryData);

        // Create a lookup map for backend data - keys normalized
        const backendDataMap = new Map(mapData.map(d => [d.district.trim().toLowerCase(), d]));

        // Merge Backend Metrics with Frontend Geo Data
        const merged: District[] = geoDistricts.map((geo) => {
          const normalizedName = geo.name.trim().toLowerCase();

          // Try to find matching backend data
          const backendMetric = backendDataMap.get(normalizedName);

          if (!backendMetric) {
            // Log only unique missing districts to avoid clutter, or first few
            if (geoDistricts.indexOf(geo) < 5) console.warn(`Mismatch: Frontend '${normalizedName}' not in Backend keys.`);

            // If no backend data, standard fallback (or could hide)
            return {
              ...geo,
              riskLevel: 'low', // Default safely
              metrics: { ...geo.metrics, saturationRatio: 0, updateIntensity: 0 }
            };
          }

          return {
            ...geo,
            // Keep the geo name to ensure coordinate consistency
            state: backendMetric.state,
            riskLevel: (backendMetric.risk_level.toLowerCase() === 'priority' ? 'critical' : backendMetric.risk_level.toLowerCase()) as District['riskLevel'],
            metrics: {
              ...geo.metrics,
              saturationRatio: backendMetric.asr,
              // Backend UII is 0.0-1.0 probably, waiting to see, but earlier code used *100.
              // Logic check: if backend sends raw float, we might need *100 if frontend expects percentage.
              // Assuming backend uses standard decimal (0.12) -> 12%
              updateIntensity: backendMetric.uii ? backendMetric.uii * 100 : 0,
              temporalDeviation: backendMetric.tds || 0,
              equityGap: backendMetric.aepg || 0,
              childBiometricCompliance: backendMetric.cbcg || 0,
            }
          };
        });

        setMapDistricts(merged);

      } catch (e) {
        console.error("Failed to load dashboard data", e);
      }
    };
    loadData();
  }, []);

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
  };

  const handleViewDetails = (district: District) => {
    navigate('/anomaly-risk', { state: { district } });
  };

  return (
    <DashboardLayout
      selectedDistrict={selectedDistrict}
      onDistrictSelect={handleDistrictSelect}
      districtsData={mapDistricts}
    >
      <div className="flex-1 w-full h-full overflow-hidden relative">
        <IndiaMap
          selectedDistrict={selectedDistrict}
          onDistrictSelect={handleDistrictSelect}
          onViewDetails={handleViewDetails}
          districtsData={mapDistricts}
          summary={summary}
        />
      </div>
    </DashboardLayout>
  );
};

export default Index;
