import { useState, useEffect, useCallback } from 'react';
import { Earthquake, EarthquakeStats } from '@/types/earthquake';

// Mock AFAD API data for development
const mockEarthquakes: Earthquake[] = [
  {
    id: '1',
    magnitude: 4.2,
    location: 'Marmara Denizi',
    city: 'Istanbul',
    latitude: 40.7831,
    longitude: 29.4714,
    depth: 12.5,
    timestamp: new Date().toISOString(),
    isNew: true
  },
  {
    id: '2',
    magnitude: 2.8,
    location: 'Ege Denizi',
    city: 'Izmir',
    latitude: 38.4237,
    longitude: 27.1428,
    depth: 8.3,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    magnitude: 5.1,
    location: 'Doğu Anadolu Fay Hattı',
    city: 'Elazig',
    latitude: 38.6748,
    longitude: 39.2266,
    depth: 15.7,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '4',
    magnitude: 3.4,
    location: 'Antalya Körfezi',
    city: 'Antalya',
    latitude: 36.8969,
    longitude: 30.7133,
    depth: 5.2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: '5',
    magnitude: 2.1,
    location: 'Karadeniz',
    city: 'Trabzon',
    latitude: 41.0015,
    longitude: 39.7178,
    depth: 18.9,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  }
];

export function useEarthquakes() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [stats, setStats] = useState<EarthquakeStats>({
    total: 0,
    last24h: 0,
    highMagnitude: 0,
    isActive: true,
    lastUpdate: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  const fetchEarthquakes = useCallback(async () => {
    try {
      // TODO: Replace with actual AFAD API call
      // const response = await fetch('https://api.afad.gov.tr/earthquakes');
      // const data = await response.json();
      
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      setEarthquakes(mockEarthquakes);
      
      // Calculate stats
      const now = Date.now();
      const last24h = mockEarthquakes.filter(
        eq => new Date(eq.timestamp).getTime() > now - 24 * 60 * 60 * 1000
      ).length;
      
      const highMagnitude = mockEarthquakes.filter(eq => eq.magnitude >= 4.0).length;
      
      setStats({
        total: mockEarthquakes.length,
        last24h,
        highMagnitude,
        isActive: true,
        lastUpdate: new Date().toISOString()
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch earthquakes:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarthquakes();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchEarthquakes, 30000);
    
    return () => clearInterval(interval);
  }, [fetchEarthquakes]);

  const addNewEarthquake = useCallback((earthquake: Earthquake) => {
    setEarthquakes(prev => [{ ...earthquake, isNew: true }, ...prev]);
    // Play alert sound here if needed
    console.log('New earthquake detected:', earthquake);
  }, []);

  return {
    earthquakes,
    stats,
    loading,
    refetch: fetchEarthquakes,
    addNewEarthquake
  };
}