export interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  city: string;
  latitude: number;
  longitude: number;
  depth: number;
  timestamp: string;
  isNew?: boolean;
}

export interface EarthquakeFilters {
  minMagnitude: number;
  maxMagnitude: number;
  city?: string;
  timeRange?: '1h' | '6h' | '24h' | '7d';
}

export interface EarthquakeStats {
  total: number;
  last24h: number;
  highMagnitude: number;
  isActive: boolean;
  lastUpdate: string;
}

export type MagnitudeLevel = 'low' | 'medium' | 'high';

export function getMagnitudeLevel(magnitude: number): MagnitudeLevel {
  if (magnitude < 3.0) return 'low';
  if (magnitude < 5.0) return 'medium';
  return 'high';
}

export function getMagnitudeColor(magnitude: number): string {
  const level = getMagnitudeLevel(magnitude);
  switch (level) {
    case 'low': return 'hsl(var(--earthquake-low))';
    case 'medium': return 'hsl(var(--earthquake-medium))';
    case 'high': return 'hsl(var(--earthquake-high))';
  }
}