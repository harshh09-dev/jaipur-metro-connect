import { useState } from "react";
import { allStations, metroLines, type Station } from "@/data/metro-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Car, Accessibility, Search, ChevronDown, ChevronUp, Train, Filter, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

export default function StationsPage() {
  const [search, setSearch] = useState("");
  const [lineFilter, setLineFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = allStations.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchLine = lineFilter === "all" || s.line === lineFilter;
    return matchSearch && matchLine;
  });

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="page-container">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-2">
          <MapPin className="w-4 h-4" />
          Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Metro Stations</h1>
        <p className="text-muted-foreground">Explore all metro stations, facilities and nearby places.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search stations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={lineFilter === "all" ? "default" : "outline"}
            onClick={() => setLineFilter("all")}
            size="sm"
            className="h-11 px-4"
          >
            All Lines
          </Button>
          <Button
            variant={lineFilter === "pink" ? "default" : "outline"}
            onClick={() => setLineFilter("pink")}
            size="sm"
            className={`h-11 px-4 ${lineFilter === "pink" ? "bg-accent hover:bg-accent/90" : ""}`}
          >
            Pink Line
          </Button>
          <Button
            variant={lineFilter === "orange" ? "default" : "outline"}
            onClick={() => setLineFilter("orange")}
            size="sm"
            className={`h-11 px-4 ${lineFilter === "orange" ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}`}
          >
            Orange Line
          </Button>
        </div>
      </div>

      {/* Station Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(station => (
          <Card
            key={station.id}
            className={`cursor-pointer transition-all hover:shadow-md ${expandedId === station.id ? "ring-2 ring-accent/20" : ""}`}
            onClick={() => toggle(station.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${station.line === "pink" ? "bg-accent/10" : "bg-warning/10"}`}>
                    <Train className={`w-5 h-5 ${station.line === "pink" ? "text-accent" : "text-warning"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{station.name}</h3>
                    <Badge variant="outline" className="text-[10px] capitalize mt-0.5">{station.line} Line</Badge>
                  </div>
                </div>
                {expandedId === station.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>

              {/* Quick indicators */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {station.parking && (
                  <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /> Parking</span>
                )}
                {station.accessible && (
                  <span className="flex items-center gap-1"><Accessibility className="w-3.5 h-3.5 text-success" /> Accessible</span>
                )}
              </div>

              {/* Expanded */}
              {expandedId === station.id && (
                <div className="mt-4 pt-4 border-t space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Facilities</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {station.facilities.map(f => (
                        <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Nearby Places</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {station.nearbyPlaces.map(p => (
                        <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  </div>
                  <Link to="/journey-planner" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" className="w-full gap-2 mt-2">
                      <Navigation className="w-3 h-3" /> Plan Journey from Here
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-foreground">No stations found</p>
          <p className="text-sm text-muted-foreground">Try a different search term or filter.</p>
        </div>
      )}
    </div>
  );
}
