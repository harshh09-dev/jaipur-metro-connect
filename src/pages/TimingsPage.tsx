import { metroTimings, allStations } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Sun, CalendarDays, Train, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TimingsPage() {
  return (
    <div className="page-container">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-2">
          <Clock className="w-4 h-4" />
          Schedules
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Metro Timings</h1>
        <p className="text-muted-foreground">First train, last train, frequency and holiday schedules.</p>
      </div>

      {/* Line Timing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {metroTimings.map(timing => (
          <Card key={timing.line} className="overflow-hidden">
            <div className="h-1.5" style={{ backgroundColor: timing.line.includes("Pink") ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)" }} />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: timing.line.includes("Pink") ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)" }}>
                  <Train className="w-5 h-5 text-primary-foreground" />
                </div>
                {timing.line}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="w-4 h-4 text-warning" />
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Regular Schedule</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-muted rounded-xl">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">First Train</div>
                    <div className="text-2xl font-extrabold text-foreground">{timing.firstTrain}</div>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Train</div>
                    <div className="text-2xl font-extrabold text-foreground">{timing.lastTrain}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{timing.frequency}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="w-4 h-4 text-secondary" />
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Holiday Schedule</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">First Train</div>
                    <div className="text-2xl font-extrabold text-foreground">{timing.holidayFirstTrain}</div>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Train</div>
                    <div className="text-2xl font-extrabold text-foreground">{timing.holidayLastTrain}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{timing.holidayFrequency}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fare Structure */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Fare Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Journey Type</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Max Fare</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Same Line Travel</TableCell>
                  <TableCell>₹5 per station</TableCell>
                  <TableCell><Badge variant="secondary">₹25</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Inter-Line Transfer</TableCell>
                  <TableCell>₹30 base + ₹2 per station</TableCell>
                  <TableCell><Badge variant="outline">No cap</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Smart Card (15% discount)</TableCell>
                  <TableCell>Discounted rates on all journeys</TableCell>
                  <TableCell><Badge className="bg-success text-success-foreground">Save 15%</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Smart Card Info */}
      <Card className="mb-8 border-secondary/20">
        <CardContent className="p-6">
          <h3 className="font-bold text-foreground mb-3">Smart Card Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="p-4 bg-muted rounded-xl">
              <p className="font-semibold text-foreground mb-1">Purchase</p>
              <p>Available at all station counters for ₹100 (₹50 refundable deposit + ₹50 initial balance)</p>
            </div>
            <div className="p-4 bg-muted rounded-xl">
              <p className="font-semibold text-foreground mb-1">Recharge</p>
              <p>Top up at station counters or self-service kiosks. Min ₹50, Max ₹2,000</p>
            </div>
            <div className="p-4 bg-muted rounded-xl">
              <p className="font-semibold text-foreground mb-1">Benefits</p>
              <p>15% discount on all journeys, faster entry, no queuing for tokens</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-info" />
            <h3 className="font-bold text-foreground">Important Notes</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Peak hours: 8:00 AM – 10:00 AM and 5:00 PM – 8:00 PM (Mon – Sat)</li>
            <li>Holiday schedule applies on Sundays and government holidays</li>
            <li>Special timings may apply during festivals — check service alerts</li>
            <li>Last entry allowed 15 minutes before last train departure</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
