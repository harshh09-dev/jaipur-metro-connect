import { useState } from "react";
import { allStations, metroLines, type Station } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Car, Accessibility, Search, ChevronDown, ChevronUp } from "lucide-react";

export default function StationsPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = allStations.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="page-container">
      <h1 className="section-header">Metro Stations</h1>
      <p className="text-muted-foreground mb-6 -mt-4">Explore all metro stations, facilities and nearby places.</p>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search stations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {metroLines.map(line => {
        const lineStations = filtered.filter(s => s.line === line.id);
        if (lineStations.length === 0) return null;
        return (
          <div key={line.id} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: line.color }} />
              <h2 className="text-xl font-bold text-foreground">{line.name}</h2>
              <Badge variant="secondary">{line.stations.length} stations</Badge>
            </div>
            <div className="space-y-3">
              {lineStations.map(station => (
                <Card key={station.id} className="cursor-pointer" onClick={() => toggle(station.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{station.name}</span>
                        {station.parking && <Car className="w-4 h-4 text-muted-foreground" />}
                        {station.accessible && <Accessibility className="w-4 h-4 text-success" />}
                      </div>
                      {expandedId === station.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    {expandedId === station.id && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">Facilities</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {station.facilities.map(f => (
                              <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">Nearby Places</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {station.nearbyPlaces.map(p => (
                              <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
