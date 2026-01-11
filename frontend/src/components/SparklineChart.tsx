import { useMemo } from 'react';

interface SparklineChartProps {
  positive?: boolean;
  data?: number[];
}

export function SparklineChart({ positive = true, data }: SparklineChartProps) {
  const chartData = useMemo(() => {
    if (data) return data;
    // Generate mock sparkline data
    const points = [];
    let value = 50;
    for (let i = 0; i < 12; i++) {
      value += (Math.random() - (positive ? 0.3 : 0.7)) * 15;
      value = Math.max(10, Math.min(90, value));
      points.push(value);
    }
    return points;
  }, [positive, data]);

  const pathD = useMemo(() => {
    const width = 60;
    const height = 24;
    const min = Math.min(...chartData);
    const max = Math.max(...chartData);
    const range = max - min || 1;
    
    const points = chartData.map((val, i) => ({
      x: (i / (chartData.length - 1)) * width,
      y: height - ((val - min) / range) * height,
    }));
    
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [chartData]);

  return (
    <svg width="60" height="24" className="flex-shrink-0">
      <path
        d={pathD}
        fill="none"
        stroke={positive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
