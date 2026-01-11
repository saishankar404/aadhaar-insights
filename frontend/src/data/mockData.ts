// AARI Dashboard Mock Data - Realistic Aadhaar Analytics

export interface District {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  coordinates: [number, number]; // [lng, lat]
  metrics: {
    saturationRatio: number; // 0-100
    updateIntensity: number; // 0-100
    temporalDeviation: number; // -50 to +50
    equityGap: number; // 0-100
    childBiometricCompliance: number; // 0-100
    enrolmentCenters: number;
    monthlyUpdates: number;
    population: number;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
}

export interface State {
  code: string;
  name: string;
  coordinates: [number, number];
  totalDistricts: number;
  avgSaturation: number;
}

export interface PolicyEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface TrendData {
  month: string;
  enrolments: number;
  updates: number;
  saturation: number;
}

// States of India - Kept as is
export const states: State[] = [
  { code: 'AN', name: 'Andaman and Nicobar Islands', coordinates: [92.6586, 11.7401], totalDistricts: 3, avgSaturation: 94.2 },
  { code: 'AP', name: 'Andhra Pradesh', coordinates: [79.7400, 15.9129], totalDistricts: 13, avgSaturation: 99.1 },
  { code: 'AR', name: 'Arunachal Pradesh', coordinates: [94.7278, 28.2180], totalDistricts: 25, avgSaturation: 78.4 },
  { code: 'AS', name: 'Assam', coordinates: [92.9376, 26.2006], totalDistricts: 35, avgSaturation: 91.2 },
  { code: 'BR', name: 'Bihar', coordinates: [85.3131, 25.0961], totalDistricts: 38, avgSaturation: 96.8 },
  { code: 'CH', name: 'Chandigarh', coordinates: [76.7794, 30.7333], totalDistricts: 1, avgSaturation: 99.4 },
  { code: 'CT', name: 'Chhattisgarh', coordinates: [81.8661, 21.2787], totalDistricts: 33, avgSaturation: 95.6 },
  { code: 'DL', name: 'Delhi', coordinates: [77.1025, 28.7041], totalDistricts: 11, avgSaturation: 99.7 },
  { code: 'GA', name: 'Goa', coordinates: [74.1240, 15.2993], totalDistricts: 2, avgSaturation: 98.9 },
  { code: 'GJ', name: 'Gujarat', coordinates: [71.1924, 22.2587], totalDistricts: 33, avgSaturation: 98.4 },
  { code: 'HR', name: 'Haryana', coordinates: [76.0856, 29.0588], totalDistricts: 22, avgSaturation: 99.2 },
  { code: 'HP', name: 'Himachal Pradesh', coordinates: [77.1734, 31.1048], totalDistricts: 12, avgSaturation: 98.7 },
  { code: 'JK', name: 'Jammu and Kashmir', coordinates: [74.7973, 33.7782], totalDistricts: 20, avgSaturation: 92.3 },
  { code: 'JH', name: 'Jharkhand', coordinates: [85.2799, 23.6102], totalDistricts: 24, avgSaturation: 94.1 },
  { code: 'KA', name: 'Karnataka', coordinates: [75.7139, 15.3173], totalDistricts: 31, avgSaturation: 98.6 },
  { code: 'KL', name: 'Kerala', coordinates: [76.2711, 10.8505], totalDistricts: 14, avgSaturation: 99.3 },
  { code: 'LA', name: 'Ladakh', coordinates: [77.5771, 34.1526], totalDistricts: 2, avgSaturation: 85.6 },
  { code: 'MP', name: 'Madhya Pradesh', coordinates: [78.6569, 22.9734], totalDistricts: 55, avgSaturation: 96.2 },
  { code: 'MH', name: 'Maharashtra', coordinates: [75.7139, 19.7515], totalDistricts: 36, avgSaturation: 98.8 },
  { code: 'MN', name: 'Manipur', coordinates: [93.9063, 24.6637], totalDistricts: 16, avgSaturation: 82.4 },
  { code: 'ML', name: 'Meghalaya', coordinates: [91.3662, 25.4670], totalDistricts: 12, avgSaturation: 79.8 },
  { code: 'MZ', name: 'Mizoram', coordinates: [92.9376, 23.1645], totalDistricts: 11, avgSaturation: 81.2 },
  { code: 'NL', name: 'Nagaland', coordinates: [94.5624, 26.1584], totalDistricts: 16, avgSaturation: 77.6 },
  { code: 'OR', name: 'Odisha', coordinates: [85.0985, 20.9517], totalDistricts: 30, avgSaturation: 95.4 },
  { code: 'PB', name: 'Punjab', coordinates: [75.3412, 31.1471], totalDistricts: 23, avgSaturation: 99.1 },
  { code: 'RJ', name: 'Rajasthan', coordinates: [74.2179, 27.0238], totalDistricts: 33, avgSaturation: 97.8 },
  { code: 'SK', name: 'Sikkim', coordinates: [88.5122, 27.5330], totalDistricts: 6, avgSaturation: 96.4 },
  { code: 'TN', name: 'Tamil Nadu', coordinates: [78.6569, 11.1271], totalDistricts: 38, avgSaturation: 99.2 },
  { code: 'TG', name: 'Telangana', coordinates: [79.0193, 18.1124], totalDistricts: 33, avgSaturation: 99.4 },
  { code: 'TR', name: 'Tripura', coordinates: [91.9882, 23.9408], totalDistricts: 8, avgSaturation: 93.7 },
  { code: 'UP', name: 'Uttar Pradesh', coordinates: [80.9462, 26.8467], totalDistricts: 75, avgSaturation: 97.6 },
  { code: 'UK', name: 'Uttarakhand', coordinates: [79.0193, 30.0668], totalDistricts: 13, avgSaturation: 98.1 },
  { code: 'WB', name: 'West Bengal', coordinates: [87.8550, 22.9868], totalDistricts: 23, avgSaturation: 97.2 },
];

const defaultMetrics = {
  saturationRatio: 0,
  updateIntensity: 0,
  temporalDeviation: 0,
  equityGap: 0,
  childBiometricCompliance: 0,
  enrolmentCenters: 0,
  monthlyUpdates: 0,
  population: 0,
};

// Expanded list of districts with coordinates to match backend seed data (69 districts)
export const districts: District[] = [
  // --- Original High Risk ---
  { id: 'AR-TAWANG', name: 'Tawang', state: 'Arunachal Pradesh', stateCode: 'AR', coordinates: [91.8587, 27.5861], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'NL-KIPHIRE', name: 'Kiphire', state: 'Nagaland', stateCode: 'NL', coordinates: [94.9682, 25.8819], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'MN-CHURACHANDPUR', name: 'Churachandpur', state: 'Manipur', stateCode: 'MN', coordinates: [93.6747, 24.3327], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'ML-WESTGARO', name: 'West Garo Hills', state: 'Meghalaya', stateCode: 'ML', coordinates: [90.2175, 25.5131], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'LA-LEH', name: 'Leh', state: 'Ladakh', stateCode: 'LA', coordinates: [77.5771, 34.1526], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'MZ-CHAMPHAI', name: 'Champhai', state: 'Mizoram', stateCode: 'MZ', coordinates: [93.3260, 23.4567], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  // --- Original Medium Risk ---
  { id: 'JK-KUPWARA', name: 'Kupwara', state: 'Jammu and Kashmir', stateCode: 'JK', coordinates: [74.2663, 34.5267], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'JH-GUMLA', name: 'Gumla', state: 'Jharkhand', stateCode: 'JH', coordinates: [84.5423, 23.0433], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'OR-MALKANGIRI', name: 'Malkangiri', state: 'Odisha', stateCode: 'OR', coordinates: [81.8867, 18.3507], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'CT-BIJAPUR', name: 'Bijapur', state: 'Chhattisgarh', stateCode: 'CT', coordinates: [80.8287, 18.8387], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  // --- Original Low Risk ---
  { id: 'DL-SOUTH', name: 'South Delhi', state: 'Delhi', stateCode: 'DL', coordinates: [77.2090, 28.5355], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'TG-HYDERABAD', name: 'Hyderabad', state: 'Telangana', stateCode: 'TG', coordinates: [78.4867, 17.3850], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'KA-BANGALORE', name: 'Bangalore Urban', state: 'Karnataka', stateCode: 'KA', coordinates: [77.5946, 12.9716], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'MH-MUMBAI', name: 'Mumbai Suburban', state: 'Maharashtra', stateCode: 'MH', coordinates: [72.8777, 19.0760], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'TN-CHENNAI', name: 'Chennai', state: 'Tamil Nadu', stateCode: 'TN', coordinates: [80.2707, 13.0827], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'KL-ERNAKULAM', name: 'Ernakulam', state: 'Kerala', stateCode: 'KL', coordinates: [76.2673, 9.9312], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'UP-LUCKNOW', name: 'Lucknow', state: 'Uttar Pradesh', stateCode: 'UP', coordinates: [80.9462, 26.8467], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'RJ-JAIPUR', name: 'Jaipur', state: 'Rajasthan', stateCode: 'RJ', coordinates: [75.7873, 26.9124], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'GJ-AHMEDABAD', name: 'Ahmedabad', state: 'Gujarat', stateCode: 'GJ', coordinates: [72.5714, 23.0225], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'WB-KOLKATA', name: 'Kolkata', state: 'West Bengal', stateCode: 'WB', coordinates: [88.3639, 22.5726], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'BR-PATNA', name: 'Patna', state: 'Bihar', stateCode: 'BR', coordinates: [85.1376, 25.5941], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  // --- Supplementary Districts (Added to match backend seed_data.py) ---
  { id: 'MH-PUNE', name: 'Pune', state: 'Maharashtra', stateCode: 'MH', coordinates: [73.8567, 18.5204], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'MH-NAGPUR', name: 'Nagpur', state: 'Maharashtra', stateCode: 'MH', coordinates: [79.0882, 21.1458], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'MH-THANE', name: 'Thane', state: 'Maharashtra', stateCode: 'MH', coordinates: [72.9781, 19.2183], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'MH-NASHIK', name: 'Nashik', state: 'Maharashtra', stateCode: 'MH', coordinates: [73.7898, 19.9975], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  { id: 'MP-INDORE', name: 'Indore', state: 'Madhya Pradesh', stateCode: 'MP', coordinates: [75.8577, 22.7196], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'MP-BHOPAL', name: 'Bhopal', state: 'Madhya Pradesh', stateCode: 'MP', coordinates: [77.4126, 23.2599], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'MP-GWALIOR', name: 'Gwalior', state: 'Madhya Pradesh', stateCode: 'MP', coordinates: [78.1828, 26.2183], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'MP-JABALPUR', name: 'Jabalpur', state: 'Madhya Pradesh', stateCode: 'MP', coordinates: [79.9199, 23.1815], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  { id: 'GJ-SURAT', name: 'Surat', state: 'Gujarat', stateCode: 'GJ', coordinates: [72.8311, 21.1702], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'GJ-VADODARA', name: 'Vadodara', state: 'Gujarat', stateCode: 'GJ', coordinates: [73.1812, 22.3072], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'GJ-RAJKOT', name: 'Rajkot', state: 'Gujarat', stateCode: 'GJ', coordinates: [70.8022, 22.3039], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  { id: 'PB-LUDHIANA', name: 'Ludhiana', state: 'Punjab', stateCode: 'PB', coordinates: [75.8573, 30.9010], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'PB-AMRITSAR', name: 'Amritsar', state: 'Punjab', stateCode: 'PB', coordinates: [74.8723, 31.6340], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'PB-JALANDHAR', name: 'Jalandhar', state: 'Punjab', stateCode: 'PB', coordinates: [75.5762, 31.3260], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  { id: 'AP-VISAKHAPATNAM', name: 'Visakhapatnam', state: 'Andhra Pradesh', stateCode: 'AP', coordinates: [83.2185, 17.6868], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'AP-VIJAYAWADA', name: 'Vijayawada', state: 'Andhra Pradesh', stateCode: 'AP', coordinates: [80.6480, 16.5062], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'AP-GUNTUR', name: 'Guntur', state: 'Andhra Pradesh', stateCode: 'AP', coordinates: [80.4365, 16.3067], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  { id: 'TN-COIMBATORE', name: 'Coimbatore', state: 'Tamil Nadu', stateCode: 'TN', coordinates: [76.9558, 11.0168], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'TN-MADURAI', name: 'Madurai', state: 'Tamil Nadu', stateCode: 'TN', coordinates: [78.1198, 9.9252], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'TN-TIRUCHIRAPPALLI', name: 'Tiruchirappalli', state: 'Tamil Nadu', stateCode: 'TN', coordinates: [78.7047, 10.7905], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  { id: 'UP-KANPUR', name: 'Kanpur', state: 'Uttar Pradesh', stateCode: 'UP', coordinates: [80.3319, 26.4499], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'UP-GHAZIABAD', name: 'Ghaziabad', state: 'Uttar Pradesh', stateCode: 'UP', coordinates: [77.4538, 28.6692], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'UP-AGRA', name: 'Agra', state: 'Uttar Pradesh', stateCode: 'UP', coordinates: [78.0081, 27.1767], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'UP-VARANASI', name: 'Varanasi', state: 'Uttar Pradesh', stateCode: 'UP', coordinates: [82.9739, 25.3176], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'UP-MEERUT', name: 'Meerut', state: 'Uttar Pradesh', stateCode: 'UP', coordinates: [77.7064, 28.9845], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'UP-PRAYAGRAJ', name: 'Prayagraj', state: 'Uttar Pradesh', stateCode: 'UP', coordinates: [81.8463, 25.4358], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  { id: 'JH-RANCHI', name: 'Ranchi', state: 'Jharkhand', stateCode: 'JH', coordinates: [85.3096, 23.3441], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'JH-JAMSHEDPUR', name: 'Jamshedpur', state: 'Jharkhand', stateCode: 'JH', coordinates: [86.2029, 22.8046], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'JH-DHANBAD', name: 'Dhanbad', state: 'Jharkhand', stateCode: 'JH', coordinates: [86.4304, 23.7957], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },

  { id: 'CT-RAIPUR', name: 'Raipur', state: 'Chhattisgarh', stateCode: 'CT', coordinates: [81.6296, 21.2514], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
  { id: 'CT-BHILAI', name: 'Bhilai', state: 'Chhattisgarh', stateCode: 'CT', coordinates: [81.3800, 21.1938], metrics: defaultMetrics, riskLevel: 'low', trend: 'stable' },
];

// ... Policy Events and KPIs kept same
export const policyEvents: PolicyEvent[] = [
  {
    id: 'PE001',
    date: '2024-03-15',
    title: 'Aadhaar-PAN Linkage Deadline',
    description: 'Mandatory linkage deadline resulted in surge of update requests',
    impact: 'positive',
  },
  {
    id: 'PE002',
    date: '2024-06-01',
    title: 'Free Child Biometric Update Initiative',
    description: 'Government waived fees for child biometric updates below age 5',
    impact: 'positive',
  },
  {
    id: 'PE003',
    date: '2024-08-20',
    title: 'Mobile Enrolment Units Expansion',
    description: 'Deployed 500 additional mobile units in remote districts',
    impact: 'positive',
  },
  {
    id: 'PE004',
    date: '2024-11-10',
    title: 'Northeast Special Drive',
    description: 'Targeted enrolment campaign in low-saturation northeast states',
    impact: 'positive',
  },
  {
    id: 'PE005',
    date: '2025-01-05',
    title: 'Digital Address Update Launch',
    description: 'Online address update facility launched nationwide',
    impact: 'positive',
  },
];

export const trendData: TrendData[] = [
  { month: '2024-01', enrolments: 2340000, updates: 4560000, saturation: 96.2 },
  { month: '2024-02', enrolments: 2180000, updates: 4890000, saturation: 96.4 },
  { month: '2024-03', enrolments: 2890000, updates: 7240000, saturation: 96.8 },
  { month: '2024-04', enrolments: 2560000, updates: 5120000, saturation: 97.0 },
  { month: '2024-05', enrolments: 2420000, updates: 4980000, saturation: 97.2 },
  { month: '2024-06', enrolments: 2780000, updates: 6340000, saturation: 97.4 },
  { month: '2024-07', enrolments: 2640000, updates: 5890000, saturation: 97.6 },
  { month: '2024-08', enrolments: 2920000, updates: 6120000, saturation: 97.8 },
  { month: '2024-09', enrolments: 2480000, updates: 5240000, saturation: 97.9 },
  { month: '2024-10', enrolments: 2360000, updates: 5080000, saturation: 98.0 },
  { month: '2024-11', enrolments: 2540000, updates: 5460000, saturation: 98.1 },
  { month: '2024-12', enrolments: 2120000, updates: 4780000, saturation: 98.2 },
  { month: '2025-01', enrolments: 2680000, updates: 5920000, saturation: 98.2 },
];

export const nationalKPIs = {
  totalPopulation: 1428627663,
  aadhaarIssued: 1403432456,
  saturationRate: 98.2,
  highRiskDistricts: 47,
  childBiometricGap: 2340000,
  monthlyEnrolments: 2680000,
  monthlyUpdates: 5920000,
  enrolmentCenters: 42567,
  updateGrowthRate: 12.4,
  avgProcessingTime: 8.2, // minutes
};

export const getRiskColor = (level: District['riskLevel']): string => {
  switch (level) {
    case 'low': return 'hsl(142, 71%, 45%)';
    case 'medium': return 'hsl(48, 96%, 53%)';
    case 'high': return 'hsl(25, 95%, 53%)';
    case 'critical': return 'hsl(0, 84%, 60%)';
    default: return 'hsl(220, 9%, 46%)';
  }
};

export const getRiskLabel = (level: District['riskLevel']): string => {
  switch (level) {
    case 'low': return 'Low Risk';
    case 'medium': return 'Medium Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Priority';
    default: return 'Unknown';
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const formatPercentage = (num: number): string => {
  return num.toFixed(1) + '%';
};
