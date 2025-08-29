import React from 'react';
import { Earthquake, getMagnitudeLevel } from '@/types/earthquake';
import { format, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Clock, Layers } from 'lucide-react';

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  selectedEarthquake?: Earthquake;
  onEarthquakeSelect?: (earthquake: Earthquake) => void;
}

function EarthquakeItem({ 
  earthquake, 
  isSelected, 
  onSelect 
}: { 
  earthquake: Earthquake; 
  isSelected: boolean;
  onSelect?: (earthquake: Earthquake) => void;
}) {
  const magnitudeLevel = getMagnitudeLevel(earthquake.magnitude);
  
  const getBadgeVariant = () => {
    switch (magnitudeLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-ios-lg ${
        isSelected ? 'ring-2 ring-primary shadow-ios-lg' : ''
      } ${earthquake.isNew ? 'animate-fade-in' : ''}`}
      onClick={() => onSelect?.(earthquake)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant()} className="text-xs font-mono">
              M {earthquake.magnitude}
            </Badge>
            {earthquake.isNew && (
              <Badge variant="destructive" className="text-xs animate-pulse-earthquake">
                YENİ
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(earthquake.timestamp), { 
              addSuffix: true,
              locale: tr 
            })}
          </span>
        </div>
        
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">
          {earthquake.location}
        </h3>
        
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
            <span>{format(new Date(earthquake.timestamp), 'HH:mm')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EarthquakeList({ earthquakes, selectedEarthquake, onEarthquakeSelect }: EarthquakeListProps) {
  return (
    <Card className="w-full h-full shadow-ios-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Son Depremler
          <Badge variant="secondary" className="ml-2 text-xs">
            {earthquakes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] px-4 pb-4">
          <div className="space-y-3">
            {earthquakes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Henüz deprem verisi yüklenmedi.</p>
              </div>
            ) : (
              earthquakes.map((earthquake) => (
                <EarthquakeItem
                  key={earthquake.id}
                  earthquake={earthquake}
                  isSelected={selectedEarthquake?.id === earthquake.id}
                  onSelect={onEarthquakeSelect}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}