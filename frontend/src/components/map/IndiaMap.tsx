import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { districts, getRiskColor, nationalKPIs, formatNumber, type District } from '@/data/mockData';
import { DistrictPopup } from './DistrictPopup';
import { cn } from '@/lib/utils';
import { ChartBarIcon, ExclamationTriangleIcon, UserGroupIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

import { NationalSummary } from '@/services/api';

interface IndiaMapProps {
  selectedDistrict?: District | null;
  onDistrictSelect?: (district: District) => void;
  onViewDetails?: (district: District) => void;
  className?: string;
  districtsData?: District[];
  summary?: NationalSummary | null;
}

export function IndiaMap({
  selectedDistrict,
  onDistrictSelect,
  onViewDetails,
  className,
  districtsData = districts, // Default to mock data if not provided
  summary,
}: IndiaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [popupDistrict, setPopupDistrict] = useState<District | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const createMarkerElement = useCallback((district: District, isSelected: boolean) => {
    const el = document.createElement('div');
    el.className = 'district-marker';

    const size = isSelected ? 44 : 36; // Slightly larger for visibility
    const riskColor = getRiskColor(district.riskLevel);
    // Green, Amber, Orange, Red hex codes based on request if necessary, 
    // but getRiskColor currently returns HSL strings. Let's stick to getRiskColor for consistency 
    // or override if we want exact requested hexes. 
    // Requested: Low(#22c55e), Medium(#f59e0b), High(#f97316), Priority(#ef4444)
    // We will trust getRiskColor or map it here if it mismatches.

    // Fix: Remove transition on the wrapper element to prevent "flying off" during zoom
    // MapLibre controls the transform of this element, so CSS transitions conflict with it.
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.cursor = 'pointer';
    el.style.zIndex = isSelected ? '20' : '10';

    // We create an inner container for the styling and animations
    el.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background-color: ${riskColor};
        border: ${isSelected ? '4px solid white' : '3px solid white'};
        border-radius: 50%;
        box-shadow: ${isSelected
        ? '0 0 0 4px rgba(253, 166, 32, 0.5), 0 8px 16px rgba(0,0,0,0.3)'
        : '0 4px 6px rgba(0,0,0,0.15)'};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
      ">
        <span style="
          color: white;
          font-size: ${isSelected ? '12px' : '11px'};
          font-weight: 700;
          letter-spacing: -0.02em;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        ">${Math.round(district.metrics.saturationRatio)}%</span>
      </div>
    `;

    return el;
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // Light, minimal basemap
      center: [82.8, 22.5],
      zoom: 4.2,
      minZoom: 3,
      maxZoom: 10,
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-left'
    );

    map.current.on('load', () => {
      setIsMapLoaded(true);
    });

    // Close popup when clicking on map
    map.current.on('click', (e) => {
      const target = e.originalEvent.target as HTMLElement;
      if (!target.closest('.district-marker')) {
        setPopupDistrict(null);
        setPopupPosition(null);
        // Note: We intentionally don't clear selectedDistrict from parent prop here 
        // because usually that state is managed by parent. 
        // But for visual popup closing, we clear local state.
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const addMarkers = useCallback(() => {
    if (!map.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    districtsData.forEach((district) => {
      const isSelected = selectedDistrict?.id === district.id;
      const el = createMarkerElement(district, isSelected);

      el.addEventListener('mouseenter', () => {
        if (!isSelected) {
          const inner = el.firstChild as HTMLElement;
          if (inner) {
            inner.style.transform = 'scale(1.1)';
            inner.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
          }
          el.style.zIndex = '15';
        }
      });

      el.addEventListener('mouseleave', () => {
        if (!isSelected) {
          const inner = el.firstChild as HTMLElement;
          if (inner) {
            inner.style.transform = 'scale(1)';
            inner.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
          }
          el.style.zIndex = '10';
        }
      });

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onDistrictSelect?.(district);
        setPopupDistrict(district);

        const rect = mapContainer.current?.getBoundingClientRect();
        if (rect) {
          const point = map.current!.project(district.coordinates);
          setPopupPosition({ x: point.x, y: point.y });
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(district.coordinates)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [selectedDistrict, onDistrictSelect, createMarkerElement, districtsData]);

  useEffect(() => {
    if (isMapLoaded && map.current) {
      addMarkers();

      // Handling fly-to on selection change
      if (selectedDistrict) {
        setPopupDistrict(selectedDistrict);
        map.current.flyTo({
          center: selectedDistrict.coordinates,
          zoom: 6.5, // Slightly closer
          speed: 1.2,
          curve: 1.5,
          easing: (t) => t * (2 - t),
        });

        // Debounce update popup position after fly
        setTimeout(() => {
          if (map.current && selectedDistrict) {
            const point = map.current.project(selectedDistrict.coordinates);
            setPopupPosition({ x: point.x, y: point.y });
          }
        }, 1000); // Wait for flight
      }
    }
  }, [selectedDistrict, addMarkers, isMapLoaded]);

  // Update popup position on map move
  useEffect(() => {
    if (!map.current) return;
    const updatePopupPosition = () => {
      if (popupDistrict && map.current) {
        const point = map.current.project(popupDistrict.coordinates);
        setPopupPosition({ x: point.x, y: point.y });
      }
    };
    map.current.on('move', updatePopupPosition);
    return () => {
      map.current?.off('move', updatePopupPosition);
    };
  }, [popupDistrict]);

  const handleClosePopup = () => {
    setPopupDistrict(null);
    setPopupPosition(null);
  };

  const handleViewDetails = () => {
    if (popupDistrict && onViewDetails) {
      onViewDetails(popupDistrict);
    }
  };

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-muted/20', className)}>
      <div ref={mapContainer} className="w-full h-full outline-none" />

      {/* Floating Popup (Overlay Card style as requested but context-aware) */}
      {popupDistrict && popupPosition && (
        <div
          className="absolute z-50 pointer-events-auto transition-transform duration-200 ease-out"
          style={{
            left: popupPosition.x,
            top: popupPosition.y - 24, // Offset slightly
            transform: 'translate(-50%, -100%)',
          }}
        >
          <DistrictPopup
            district={popupDistrict}
            onClose={handleClosePopup}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}

      {/* Modern Legend - Top Right - Glassmorphism */}
      <div className="absolute top-6 right-6 z-10 hidden md:block">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 p-3.5 ring-1 ring-black/5">
          <p className="text-[10px] font-bold text-muted-foreground mb-2.5 uppercase tracking-wider">Risk Level</p>
          <div className="flex flex-col gap-2">
            {[
              { level: 'low', label: 'Low (>95%)', color: 'hsl(142, 71%, 45%)' },
              { level: 'medium', label: 'Medium (85-95%)', color: 'hsl(48, 96%, 53%)' },
              { level: 'high', label: 'High (70-85%)', color: 'hsl(25, 95%, 53%)' },
              { level: 'critical', label: 'Priority (<70%)', color: 'hsl(0, 84%, 60%)' },
            ].map(({ level, label, color }) => (
              <div key={level} className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[11px] font-medium text-slate-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Overlay Card - Bottom Right - Glassmorphism */}
      <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 z-10">
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 px-5 py-4 ring-1 ring-black/5 max-w-full md:max-w-fit mx-auto md:mx-0 transition-all duration-300 hover:bg-white/95">
          <div className="flex items-center md:gap-6 gap-4 justify-between md:justify-start">

            {/* KPI 1 - Total Enrolments */}
            <KPIItem
              icon={UserGroupIcon}
              label="TOTAL ENROLMENTS"
              value={summary ? (summary.total_enrolments / 1000000).toFixed(1) + 'M' : '...'}
            />
            <div className="w-px h-8 bg-black/10 hidden md:block" />

            {/* KPI 2 - Avg Saturation */}
            <KPIItem
              icon={ChartBarIcon}
              label="AVG SATURATION"
              value={summary ? summary.average_saturation.toFixed(1) + '%' : '...'}
            />
            <div className="w-px h-8 bg-black/10 hidden md:block" />

            {/* KPI 3 - Risk Index */}
            <KPIItem
              icon={ExclamationTriangleIcon}
              label="RISK INDEX"
              value={summary ? summary.national_risk_index.toString() : '...'}
              accentColor="text-amber-600"
              bgColor="bg-amber-50"
            />
            <div className="w-px h-8 bg-black/10 hidden md:block" />

            {/* KPI 4 - High Risk Districts */}
            <KPIItem
              icon={ExclamationTriangleIcon}
              label="HIGH RISK DISTS"
              value={summary ? summary.high_risk_districts.toString() : '...'}
              accentColor="text-red-600"
              bgColor="bg-red-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for KPI items with enhanced design
function KPIItem({
  icon: Icon,
  label,
  value,
  accentColor = "text-amber-500",
  bgColor = "bg-amber-500/10"
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accentColor?: string;
  bgColor?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center shadow-sm`}>
        <Icon className={`w-5 h-5 ${accentColor}`} />
      </div>
      <div className="flex flex-col">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{label}</p>
        <p className="text-[15px] font-bold text-slate-800 leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}
