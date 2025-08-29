import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Earthquake, getMagnitudeLevel, getMagnitudeColor } from '@/types/earthquake';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import 'leaflet/dist/leaflet.css';

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  selectedEarthquake?: Earthquake;
  onEarthquakeSelect?: (earthquake: Earthquake) => void;
}

const turkeyCenter: LatLngExpression = [39.0, 35.0];
const defaultZoom = 6;

function EarthquakeMarker({ earthquake, onSelect }: { 
  earthquake: Earthquake; 
  onSelect?: (earthquake: Earthquake) => void;
}) {
  const magnitudeLevel = getMagnitudeLevel(earthquake.magnitude);
  const color = getMagnitudeColor(earthquake.magnitude);
  
  const radius = Math.max(4, earthquake.magnitude * 3);
  const opacity = earthquake.isNew ? 1 : 0.8;
  
  return (
    <CircleMarker
      center={[earthquake.latitude, earthquake.longitude]}
      radius={radius}
      pathOptions={{
        fillColor: color,
        color: color,
        weight: earthquake.isNew ? 3 : 2,
        opacity: opacity,
        fillOpacity: earthquake.isNew ? 0.8 : 0.6,
      }}
      eventHandlers={{
        click: () => onSelect?.(earthquake),
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant={magnitudeLevel === 'high' ? 'destructive' : 
                     magnitudeLevel === 'medium' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              M {earthquake.magnitude}
            </Badge>
            {earthquake.isNew && (
              <Badge variant="destructive" className="text-xs animate-pulse-earthquake">
                YENİ
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-sm mb-1">{earthquake.location}</h3>
          <p className="text-xs text-muted-foreground mb-1">{earthquake.city}</p>
          <div className="text-xs space-y-1">
            <p><span className="font-medium">Derinlik:</span> {earthquake.depth} km</p>
            <p><span className="font-medium">Zaman:</span> {format(new Date(earthquake.timestamp), 'dd.MM.yyyy HH:mm')}</p>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

export function EarthquakeMap({ earthquakes, selectedEarthquake, onEarthquakeSelect }: EarthquakeMapProps) {
  const mapRef = useRef<any>(null);
  
  // Ensure earthquakes is always an array and memoize it
  const safeEarthquakes = useMemo(() => {
    return Array.isArray(earthquakes) ? earthquakes : [];
  }, [earthquakes]);

  // Memoize markers to prevent unnecessary re-renders
  const markers = useMemo(() => {
    return safeEarthquakes.map((earthquake) => (
      <EarthquakeMarker
        key={`marker-${earthquake.id}`}
        earthquake={earthquake}
        onSelect={onEarthquakeSelect}
      />
    ));
  }, [safeEarthquakes, onEarthquakeSelect]);

  return (
    <Card className="w-full h-full p-0 overflow-hidden shadow-ios-lg">
      <div style={{ height: '100%', width: '100%' }}>
        <MapContainer
          key="earthquake-map"
          center={turkeyCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {markers}
        </MapContainer>
      </div>
    </Card>
  );
}