import React from 'react';
import { EarthquakeStats } from '@/types/earthquake';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface EarthquakeStatsProps {
  stats: EarthquakeStats;
}

export function EarthquakeStatsComponent({ stats }: EarthquakeStatsProps) {
  return (
    <Card className="w-full shadow-ios">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          İstatistikler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/10">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Toplam Deprem</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5">
            <div className="text-2xl font-bold text-warning">{stats.last24h}</div>
            <div className="text-xs text-muted-foreground">Son 24 Saat</div>
          </div>
        </div>

        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-destructive/10 to-destructive/5">
          <div className="text-xl font-bold text-destructive">{stats.highMagnitude}</div>
          <div className="text-xs text-muted-foreground">Yüksek Büyüklük (4.0+)</div>
        </div>

        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sistem Durumu</span>
            <Badge 
              variant={stats.isActive ? "default" : "destructive"}
              className="text-xs"
            >
              {stats.isActive ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Aktif
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Pasif
                </>
              )}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Son Güncelleme</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                {format(new Date(stats.lastUpdate), 'dd.MM.yyyy HH:mm', { locale: tr })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}