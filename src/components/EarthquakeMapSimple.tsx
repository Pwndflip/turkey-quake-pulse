import React, { useState, useEffect } from 'react';
import { Earthquake, getMagnitudeLevel } from '@/types/earthquake';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Layers, Clock, AlertCircle } from 'lucide-react';

interface EarthquakeMapSimpleProps {
  earthquakes: Earthquake[];
  selectedEarthquake?: Earthquake;
  onEarthquakeSelect?: (earthquake: Earthquake) => void;
}

export function EarthquakeMapSimple({ earthquakes, selectedEarthquake, onEarthquakeSelect }: EarthquakeMapSimpleProps) {
  const [mapReady, setMapReady] = useState(false);
  
  useEffect(() => {
    // Simulate map initialization
    const timer = setTimeout(() => setMapReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Ensure earthquakes is always an array
  const safeEarthquakes = Array.isArray(earthquakes) ? earthquakes : [];

  const getBadgeVariant = (magnitude: number) => {
    const level = getMagnitudeLevel(magnitude);
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  if (!mapReady) {
    return (
      <Card className="w-full h-full shadow-ios-lg">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-muted-foreground">Harita yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full shadow-ios-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Türkiye Deprem Haritası
          <Badge variant="secondary" className="ml-auto text-xs">
            {safeEarthquakes.length} deprem
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full p-4">
        <div className="bg-muted rounded-lg p-4 h-full flex flex-col">
          <div className="text-center mb-4">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-semibold mb-2">İnteraktif Harita</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Leaflet harita kütüphanesi yükleniyor. Geçici olarak liste görünümü aktif.
            </p>
          </div>
          
          <div className="flex-1 overflow-auto space-y-2">
            {safeEarthquakes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Henüz deprem verisi yok.</p>
              </div>
            ) : (
              safeEarthquakes.map((earthquake) => (
                <div
                  key={earthquake.id}
                  className={`p-3 bg-card rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedEarthquake?.id === earthquake.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => onEarthquakeSelect?.(earthquake)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getBadgeVariant(earthquake.magnitude)} className="text-xs">
                        M {earthquake.magnitude}
                      </Badge>
                      {earthquake.isNew && (
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          YENİ
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(earthquake.timestamp), 'HH:mm')}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-sm mb-1">{earthquake.location}</h4>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{earthquake.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>{earthquake.depth} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{earthquake.latitude.toFixed(2)}, {earthquake.longitude.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}