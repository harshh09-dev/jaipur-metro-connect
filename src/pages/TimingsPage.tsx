import { metroTimings } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Sun, CalendarDays } from "lucide-react";

export default function TimingsPage() {
  return (
    <div className="page-container">
      <h1 className="section-header">Metro Timings</h1>
      <p className="text-muted-foreground mb-8 -mt-4">First train, last train, frequency and holiday schedules.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metroTimings.map(timing => (
          <Card key={timing.line}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {timing.line}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-foreground">Regular Schedule</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">First Train</div>
                    <div className="text-lg font-bold text-foreground">{timing.firstTrain}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Last Train</div>
                    <div className="text-lg font-bold text-foreground">{timing.lastTrain}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{timing.frequency}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="w-4 h-4 text-secondary" />
                  <h3 className="font-semibold text-foreground">Holiday Schedule</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">First Train</div>
                    <div className="text-lg font-bold text-foreground">{timing.holidayFirstTrain}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Last Train</div>
                    <div className="text-lg font-bold text-foreground">{timing.holidayLastTrain}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{timing.holidayFrequency}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">Important Notes</h3>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Peak hours: 8:00 AM - 10:00 AM and 5:00 PM - 8:00 PM (Monday to Saturday)</li>
            <li>Holiday schedule applies on Sundays and government holidays</li>
            <li>Special timings may apply during festivals — check service alerts</li>
            <li>Last entry allowed 15 minutes before last train departure</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
