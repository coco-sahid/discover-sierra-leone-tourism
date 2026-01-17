"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import "leaflet/dist/leaflet.css";

interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string;
  category: string;
  image: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  destinations: Destination[];
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
}

const regionCenters: Record<string, [number, number]> = {
  "All": [8.5, -12.0],
  "Western Area": [8.4, -13.15],
  "Northern Province": [9.4, -11.5],
  "Southern Province": [7.7, -12.0],
  "Eastern Province": [7.8, -11.0],
};

const regionZoom: Record<string, number> = {
  "All": 7.5,
  "Western Area": 10,
  "Northern Province": 8.5,
  "Southern Province": 9,
  "Eastern Province": 9,
};

function MapController({ region }: { region: string }) {
  const map = useMap();
  
  useEffect(() => {
    const center = regionCenters[region] || regionCenters["All"];
    const zoom = regionZoom[region] || regionZoom["All"];
    map.flyTo(center, zoom, { 
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [region, map]);
  
  return null;
}

export function MapView({ destinations, selectedRegion = "All", onRegionChange }: MapViewProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme || theme || 'light';

  const tileUrl = useMemo(() => {
    return currentTheme === 'dark'
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  }, [currentTheme]);

  const icons = useMemo(() => {
    const categories = ["Beaches", "Wildlife", "Culture", "Adventure"];
    const colors: Record<string, string> = {
      "Beaches": "#0ea5e9",
      "Wildlife": "#22c55e",
      "Culture": "#f59e0b",
      "Adventure": "#ef4444",
    };

    const iconMap: Record<string, L.DivIcon> = {};
    
    [...categories, "Default"].forEach(cat => {
      const color = colors[cat] || "#10b981";
      iconMap[cat] = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 36px;
            height: 36px;
            background: ${color};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 14px;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });
    });

    return iconMap;
  }, []);

  const getIcon = useCallback((category: string) => {
    return icons[category] || icons["Default"];
  }, [icons]);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
        <MapPin className="w-12 h-12 text-zinc-400 animate-bounce" />
      </div>
    );
  }

  return (
    <MapContainer
      center={regionCenters["All"]}
      zoom={7.5}
      scrollWheelZoom={true}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ background: currentTheme === 'dark' ? "#1a1a1a" : "#f4f4f5" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
      />
      <MapController region={selectedRegion} />
      
      <MarkerClusterGroup
        chunkedLoading
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
      >
        {destinations.map((dest) => (
          dest.latitude && dest.longitude && (
            <Marker
              key={dest.id}
              position={[Number(dest.latitude), Number(dest.longitude)]}
              icon={getIcon(dest.category)}
            >
              <Popup className="custom-popup">
                <div className="w-64">
                  <div className="relative h-32 -mx-3 -mt-3 mb-3 overflow-hidden rounded-t-lg">
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                      {dest.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-1 dark:text-zinc-100">{dest.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {dest.region}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 mb-3 leading-relaxed">
                    {dest.description}
                  </p>
                  <Link 
                    href={`/destinations/${dest.slug}`}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    Explore <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
