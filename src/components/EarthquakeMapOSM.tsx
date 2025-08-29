import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Earthquake, getMagnitudeLevel, getMagnitudeColor } from '@/types/earthquake';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface EarthquakeMapOSMProps {
  earthquakes: Earthquake[];
  selectedEarthquake?: Earthquake;
  onEarthquakeSelect?: (earthquake: Earthquake) => void;
}

export function EarthquakeMapOSM({ earthquakes, selectedEarthquake, onEarthquakeSelect }: EarthquakeMapOSMProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [39.0, 35.0], // Turkey center
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when earthquakes change
  useEffect(() => {
    if (!mapInstanceRef.current || !Array.isArray(earthquakes)) return;

    try {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (mapInstanceRef.current && mapInstanceRef.current.hasLayer(marker)) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
      markersRef.current = [];

      // Add new markers
      earthquakes.forEach(earthquake => {
        if (!earthquake.latitude || !earthquake.longitude) return;

        const magnitudeLevel = getMagnitudeLevel(earthquake.magnitude);
        const color = getMagnitudeColor(earthquake.magnitude);
        const radius = Math.max(4, earthquake.magnitude * 3);

        const marker = L.circleMarker([earthquake.latitude, earthquake.longitude], {
          radius: radius,
          fillColor: color,
          color: color,
          weight: earthquake.isNew ? 3 : 2,
          opacity: earthquake.isNew ? 1 : 0.8,
          fillOpacity: earthquake.isNew ? 0.8 : 0.6,
        });

        // Create popup content
        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                magnitudeLevel === 'high' ? 'bg-red-100 text-red-800' : 
                magnitudeLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }">
                M ${earthquake.magnitude}
              </span>
              ${earthquake.isNew ? '<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 animate-pulse">YENİ</span>' : ''}
            </div>
            <h3 class="font-semibold text-sm mb-1">${earthquake.location}</h3>
            <p class="text-xs text-gray-600 mb-1">${earthquake.city}</p>
            <div class="text-xs space-y-1">
              <p><span class="font-medium">Derinlik:</span> ${earthquake.depth} km</p>
              <p><span class="font-medium">Zaman:</span> ${format(new Date(earthquake.timestamp), 'dd.MM.yyyy HH:mm')}</p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        // Add click event
        marker.on('click', () => {
          if (onEarthquakeSelect) {
            onEarthquakeSelect(earthquake);
          }
        });

        // Add marker to map and track it
        marker.addTo(mapInstanceRef.current!);
        markersRef.current.push(marker);
      });

      // Fit map to show all earthquakes if there are any
      if (earthquakes.length > 0 && markersRef.current.length > 0) {
        const group = new L.FeatureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
      }

    } catch (error) {
      console.error('Failed to update markers:', error);
    }
  }, [earthquakes, onEarthquakeSelect]);

  // Highlight selected earthquake
  useEffect(() => {
    if (!selectedEarthquake || !mapInstanceRef.current) return;

    try {
      const selectedMarker = markersRef.current.find((marker, index) => {
        const earthquake = earthquakes[index];
        return earthquake && earthquake.id === selectedEarthquake.id;
      });

      if (selectedMarker) {
        selectedMarker.openPopup();
        mapInstanceRef.current.setView(selectedMarker.getLatLng(), 8);
      }
    } catch (error) {
      console.error('Failed to highlight selected earthquake:', error);
    }
  }, [selectedEarthquake, earthquakes]);

  return (
    <Card className="w-full h-full p-0 overflow-hidden shadow-ios-lg">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </Card>
  );
}