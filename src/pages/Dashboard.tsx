import React, { useState, useMemo } from 'react';
import { useEarthquakes } from '@/hooks/useEarthquakes';
import { EarthquakeMapSimple } from '@/components/EarthquakeMapSimple';
import { EarthquakeList } from '@/components/EarthquakeList';
import { EarthquakeFiltersComponent } from '@/components/EarthquakeFilters';
import { EarthquakeStatsComponent } from '@/components/EarthquakeStats';
import { Earthquake, EarthquakeFilters } from '@/types/earthquake';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Map, List, BarChart3, Bell } from 'lucide-react';

export default function Dashboard() {
  const { earthquakes, stats, loading, refetch } = useEarthquakes();
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake>();
  const [filters, setFilters] = useState<EarthquakeFilters>({
    minMagnitude: 0,
    maxMagnitude: 10,
  });

  // Ensure earthquakes is always an array
  const safeEarthquakes = Array.isArray(earthquakes) ? earthquakes : [];

  const filteredEarthquakes = useMemo(() => {
    return safeEarthquakes.filter(eq => {
      // Magnitude filter
      if (eq.magnitude < filters.minMagnitude || eq.magnitude > filters.maxMagnitude) {
        return false;
      }
      
      // City filter
      if (filters.city && eq.city !== filters.city) {
        return false;
      }
      
      // Time range filter
      if (filters.timeRange) {
        const now = Date.now();
        const eqTime = new Date(eq.timestamp).getTime();
        let timeLimit = 0;
        
        switch (filters.timeRange) {
          case '1h':
            timeLimit = now - (1 * 60 * 60 * 1000);
            break;
          case '6h':
            timeLimit = now - (6 * 60 * 60 * 1000);
            break;
          case '24h':
            timeLimit = now - (24 * 60 * 60 * 1000);
            break;
          case '7d':
            timeLimit = now - (7 * 24 * 60 * 60 * 1000);
            break;
        }
        
        if (eqTime < timeLimit) {
          return false;
        }
      }
      
      return true;
    });
  }, [safeEarthquakes, filters]);

  const newEarthquakeCount = filteredEarthquakes.filter(eq => eq.isNew).length;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Türkiye Deprem İzleme
            </h1>
            <p className="text-muted-foreground mt-1">
              AFAD verilerine dayalı gerçek zamanlı deprem takibi
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {newEarthquakeCount > 0 && (
              <Badge variant="destructive" className="animate-pulse-earthquake">
                <Bell className="w-3 h-3 mr-1" />
                {newEarthquakeCount} yeni deprem
              </Badge>
            )}
            <Button 
              variant="outline" 
              onClick={refetch}
              disabled={loading}
              className="shadow-ios"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters & Stats */}
          <div className="xl:col-span-1 space-y-6">
            <EarthquakeFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              earthquakeCount={filteredEarthquakes.length}
            />
            <EarthquakeStatsComponent stats={stats} />
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-2 shadow-ios">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Harita Görünümü
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Liste Görünümü
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="mt-4">
                <div className="h-[700px] w-full">
                  <EarthquakeMapSimple
                    earthquakes={filteredEarthquakes}
                    selectedEarthquake={selectedEarthquake}
                    onEarthquakeSelect={setSelectedEarthquake}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-4">
                <div className="h-[700px] w-full">
                  <EarthquakeList
                    earthquakes={filteredEarthquakes}
                    selectedEarthquake={selectedEarthquake}
                    onEarthquakeSelect={setSelectedEarthquake}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="w-full shadow-ios-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-3">
                <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                <span className="text-lg font-medium">Deprem verileri yükleniyor...</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}