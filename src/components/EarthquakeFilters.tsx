import React from 'react';
import { EarthquakeFilters } from '@/types/earthquake';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, RotateCcw } from 'lucide-react';

interface EarthquakeFiltersProps {
  filters: EarthquakeFilters;
  onFiltersChange: (filters: EarthquakeFilters) => void;
  earthquakeCount: number;
}

const cities = [
  'Tümü', 'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 
  'Konya', 'Gaziantep', 'Mersin', 'Elazig', 'Trabzon', 'Van', 'Erzurum'
];

const magnitudeRanges = [
  { label: 'Tüm Büyüklükler', min: 0, max: 10 },
  { label: '2.0 - 3.0 (Düşük)', min: 2.0, max: 3.0 },
  { label: '3.0 - 4.0 (Orta)', min: 3.0, max: 4.0 },
  { label: '4.0 - 5.0 (Güçlü)', min: 4.0, max: 5.0 },
  { label: '5.0+ (Yüksek)', min: 5.0, max: 10 }
];

const timeRanges = [
  { label: 'Son 1 saat', value: '1h' },
  { label: 'Son 6 saat', value: '6h' },
  { label: 'Son 24 saat', value: '24h' },
  { label: 'Son 7 gün', value: '7d' }
];

export function EarthquakeFiltersComponent({ 
  filters, 
  onFiltersChange, 
  earthquakeCount 
}: EarthquakeFiltersProps) {
  
  const handleMagnitudeChange = (value: string) => {
    const range = magnitudeRanges.find(r => r.label === value);
    if (range) {
      onFiltersChange({
        ...filters,
        minMagnitude: range.min,
        maxMagnitude: range.max
      });
    }
  };

  const handleCityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      city: value === 'Tümü' ? undefined : value
    });
  };

  const handleTimeRangeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      timeRange: value as EarthquakeFilters['timeRange']
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      minMagnitude: 0,
      maxMagnitude: 10,
      city: undefined,
      timeRange: undefined
    });
  };

  const currentMagnitudeRange = magnitudeRanges.find(
    r => r.min === filters.minMagnitude && r.max === filters.maxMagnitude
  );

  const currentTimeRange = timeRanges.find(r => r.value === filters.timeRange);

  return (
    <Card className="w-full shadow-ios">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <CardTitle className="text-lg font-semibold">Filtreler</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {earthquakeCount} sonuç
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Büyüklük Aralığı</Label>
          <Select 
            value={currentMagnitudeRange?.label} 
            onValueChange={handleMagnitudeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Büyüklük seçin" />
            </SelectTrigger>
            <SelectContent>
              {magnitudeRanges.map((range) => (
                <SelectItem key={range.label} value={range.label}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Şehir</Label>
          <Select value={filters.city || 'Tümü'} onValueChange={handleCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Zaman Aralığı</Label>
          <Select 
            value={currentTimeRange?.value || 'all'} 
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Zaman aralığı seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm zamanlar</SelectItem>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          onClick={resetFilters} 
          className="w-full"
          size="sm"
        >
          <RotateCcw className="w-3 h-3 mr-2" />
          Filtreleri Sıfırla
        </Button>
      </CardContent>
    </Card>
  );
}