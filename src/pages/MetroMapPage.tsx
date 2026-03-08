import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pinkLineStations, orangeLineStations, allStations, calculateFare, type Station } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Train, MapPin, ZoomIn, ZoomOut, RotateCcw, IndianRupee, Clock, ArrowRight } from "lucide-react";

// Station positions on SVG canvas (schematic layout)
const stationPositions: Record<string, { x: number; y: number }> = {
  // Pink Line - horizontal top
  "mansarovar": { x: 100, y: 200 },
  "new-aatish-market": { x: 200, y: 200 },
  "vivek-vihar": { x: 300, y: 200 },
  "shyam-nagar": { x: 400, y: 200 },
  "ram-nagar": { x: 500, y: 200 },
  "civil-lines": { x: 600, y: 200 },
  "railway-station": { x: 700, y: 300 }, // Interchange point
  "sindhi-camp": { x: 800, y: 200 },
  "chandpole": { x: 900, y: 200 },
  "chhoti-chaupar": { x: 1000, y: 200 },
  "badi-chaupar": { x: 1100, y: 200 },
  // Orange Line - vertical through interchange
  "ambabari": { x: 700, y: 80 },
  "raja-park": { x: 700, y: 150 },
  "malviya-nagar": { x: 700, y: 220 },
  "tonk-road": { x: 700, y: 370 },
  "railway-station-orange": { x: 700, y: 300 }, // Same visual point
  "jagatpura": { x: 700, y: 440 },
  "sitapura": { x: 700, y: 520 },
};

export default function MetroMapPage() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [source, setSource] = useState<Station | null>(null);
  const [destination, setDestination] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const result = source && destination ? calculateFare(source, destination) : null;
  const routeStationNames = result ? new Set(result.route.filter(r => r !== "(Transfer)")) : new Set<string>();

  const handleStationClick = (station: Station) => {
    if (!source) {
      setSource(station);
    } else if (!destination && station.id !== source.id) {
      setDestination(station);
    } else {
      setSource(station);
      setDestination(null);
    }
  };

  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.4));
  const handleReset = () => { setScale(1); setPan({ x: 0, y: 0 }); setSource(null); setDestination(null); };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setDragging(false);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setDragging(true);
    setDragStart({ x: t.clientX - pan.x, y: t.clientY - pan.y });
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const t = e.touches[0];
    setPan({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  const isOnRoute = (stationName: string) => routeStationNames.has(stationName);
  const isInterchange = (id: string) => id === "railway-station" || id === "railway-station-orange";

  const getStationColor = (station: Station) => {
    if (source?.id === station.id) return "hsl(145, 63%, 40%)"; // green for source
    if (destination?.id === station.id) return "hsl(0, 72%, 51%)"; // red for dest
    if (isOnRoute(station.name)) return "hsl(215, 80%, 35%)"; // blue for route
    if (isInterchange(station.id)) return "hsl(35, 90%, 52%)"; // gold for interchange
    return station.line === "pink" ? "hsl(350, 60%, 45%)" : "hsl(35, 90%, 52%)";
  };

  // Build pink line path
  const pinkPath = pinkLineStations.map(s => {
    const pos = stationPositions[s.id];
    return pos ? `${pos.x},${pos.y}` : "";
  }).filter(Boolean);

  // Orange line path (need to order by y position for vertical)
  const orangeOrder = ["ambabari", "raja-park", "malviya-nagar", "railway-station-orange", "tonk-road", "jagatpura", "sitapura"];
  const orangePath = orangeOrder.map(id => {
    const pos = stationPositions[id];
    return pos ? `${pos.x},${pos.y}` : "";
  }).filter(Boolean);

  return (
    <div className="page-container">
      <h1 className="section-header">Metro Map</h1>
      <p className="text-muted-foreground mb-6 -mt-4">Click stations to plan your journey. Click first station as source, second as destination.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
        {/* Map */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Jaipur Metro Network
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}><ZoomIn className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}><ZoomOut className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleReset}><RotateCcw className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div
              className="overflow-hidden cursor-grab active:cursor-grabbing bg-muted/30"
              style={{ height: "500px" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => setDragging(false)}
            >
              <svg
                ref={svgRef}
                viewBox="0 0 1200 600"
                className="w-full h-full"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: dragging ? "none" : "transform 0.2s ease",
                }}
              >
                {/* Grid background */}
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(214, 20%, 92%)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="1200" height="600" fill="url(#grid)" />

                {/* Pink Line */}
                <polyline
                  points={pinkPath.join(" ")}
                  fill="none"
                  stroke="hsl(350, 60%, 45%)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.8}
                />

                {/* Orange Line */}
                <polyline
                  points={orangePath.join(" ")}
                  fill="none"
                  stroke="hsl(35, 90%, 52%)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.8}
                />

                {/* Route highlight */}
                {result && (
                  <>
                    {result.route.filter(r => r !== "(Transfer)").map((name, i, arr) => {
                      if (i === arr.length - 1) return null;
                      const s1 = allStations.find(s => s.name === name);
                      const s2 = allStations.find(s => s.name === arr[i + 1]);
                      if (!s1 || !s2) return null;
                      const p1 = stationPositions[s1.id];
                      const p2 = stationPositions[s2.id];
                      if (!p1 || !p2) return null;
                      return (
                        <line key={`route-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                          stroke="hsl(215, 80%, 35%)" strokeWidth="10" strokeLinecap="round" opacity={0.5} />
                      );
                    })}
                  </>
                )}

                {/* Interchange symbol */}
                <circle cx={700} cy={300} r={16} fill="hsl(0, 0%, 100%)" stroke="hsl(35, 90%, 52%)" strokeWidth="3" />
                <text x={700} y={304} textAnchor="middle" fontSize="10" fontWeight="bold" fill="hsl(35, 90%, 52%)">⇆</text>

                {/* Stations */}
                {allStations.map(station => {
                  const pos = stationPositions[station.id];
                  if (!pos) return null;
                  if (station.id === "railway-station-orange") return null; // shared with pink interchange

                  const isHovered = hoveredStation === station.id;
                  const isSelected = source?.id === station.id || destination?.id === station.id;
                  const onRoute = isOnRoute(station.name);
                  const radius = isSelected ? 12 : isHovered ? 10 : onRoute ? 9 : 7;

                  return (
                    <g key={station.id}
                      className="cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); handleStationClick(station); }}
                      onMouseEnter={() => setHoveredStation(station.id)}
                      onMouseLeave={() => setHoveredStation(null)}
                    >
                      {/* Station dot */}
                      <circle
                        cx={pos.x} cy={pos.y} r={radius}
                        fill={getStationColor(station)}
                        stroke="hsl(0, 0%, 100%)"
                        strokeWidth="2.5"
                        style={{ transition: "r 0.15s ease, fill 0.15s ease" }}
                      />
                      {isSelected && (
                        <circle cx={pos.x} cy={pos.y} r={radius + 5}
                          fill="none" stroke={getStationColor(station)} strokeWidth="2" opacity="0.4"
                          className="animate-pulse-gentle" />
                      )}
                      {/* Label */}
                      <text
                        x={pos.x}
                        y={station.line === "orange" && station.id !== "railway-station" ? pos.y : pos.y - 16}
                        dx={station.line === "orange" ? 18 : 0}
                        textAnchor={station.line === "orange" ? "start" : "middle"}
                        fontSize={isHovered || isSelected || onRoute ? "11" : "9"}
                        fontWeight={isSelected || onRoute ? "600" : "400"}
                        fill={isSelected ? getStationColor(station) : "hsl(220, 25%, 10%)"}
                        className="pointer-events-none select-none"
                      >
                        {station.name}
                      </text>
                    </g>
                  );
                })}

                {/* Legend */}
                <g transform="translate(30, 480)">
                  <rect x={0} y={0} width={230} height={90} rx="8" fill="hsl(0, 0%, 100%)" stroke="hsl(214, 20%, 88%)" />
                  <text x={15} y={22} fontSize="12" fontWeight="bold" fill="hsl(220, 25%, 10%)">Legend</text>
                  <circle cx={25} cy={40} r={5} fill="hsl(350, 60%, 45%)" />
                  <text x={38} y={44} fontSize="10" fill="hsl(220, 25%, 10%)">Pink Line</text>
                  <circle cx={120} cy={40} r={5} fill="hsl(35, 90%, 52%)" />
                  <text x={133} y={44} fontSize="10" fill="hsl(220, 25%, 10%)">Orange Line</text>
                  <circle cx={25} cy={60} r={5} fill="hsl(145, 63%, 40%)" />
                  <text x={38} y={64} fontSize="10" fill="hsl(220, 25%, 10%)">Source</text>
                  <circle cx={120} cy={60} r={5} fill="hsl(0, 72%, 51%)" />
                  <text x={133} y={64} fontSize="10" fill="hsl(220, 25%, 10%)">Destination</text>
                  <circle cx={25} cy={80} r={5} fill="hsl(0, 0%, 100%)" stroke="hsl(35, 90%, 52%)" strokeWidth="2" />
                  <text x={38} y={84} fontSize="10" fill="hsl(220, 25%, 10%)">Interchange</text>
                </g>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Selected Stations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">From</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="font-medium text-foreground text-sm">{source?.name || "Click a station"}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">To</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="font-medium text-foreground text-sm">{destination?.name || "Click another station"}</span>
                </div>
              </div>
              {(source || destination) && (
                <Button variant="outline" size="sm" className="w-full" onClick={() => { setSource(null); setDestination(null); }}>
                  Clear Selection
                </Button>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Train className="w-4 h-4 text-primary" />
                  Journey Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <IndianRupee className="w-4 h-4 mx-auto text-primary" />
                    <div className="text-lg font-bold text-foreground">₹{result.fare}</div>
                    <div className="text-[10px] text-muted-foreground">Fare</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <MapPin className="w-4 h-4 mx-auto text-secondary" />
                    <div className="text-lg font-bold text-foreground">{result.stations}</div>
                    <div className="text-[10px] text-muted-foreground">Stations</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <Clock className="w-4 h-4 mx-auto text-accent" />
                    <div className="text-lg font-bold text-foreground">{result.time}m</div>
                    <div className="text-[10px] text-muted-foreground">Time</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-2">Route</h4>
                  <div className="space-y-0 max-h-48 overflow-y-auto">
                    {result.route.map((stop, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full ${stop === "(Transfer)" ? "bg-accent" : i === 0 || i === result.route.length - 1 ? "bg-primary" : "bg-primary/40"}`} />
                          {i < result.route.length - 1 && <div className="w-0.5 h-4 bg-border" />}
                        </div>
                        <span className={`text-xs ${stop === "(Transfer)" ? "font-semibold text-accent" : "text-muted-foreground"}`}>
                          {stop === "(Transfer)" ? "🔄 Transfer" : stop}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full gap-2" size="sm" onClick={() => navigate("/journey-planner")}>
                  Full Planner <ArrowRight className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Station Info on hover */}
          {hoveredStation && (() => {
            const station = allStations.find(s => s.id === hoveredStation);
            if (!station) return null;
            return (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ background: station.line === "pink" ? "hsl(350,60%,45%)" : "hsl(35,90%,52%)" }} />
                    <span className="font-semibold text-sm text-foreground">{station.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs mb-2 capitalize">{station.line} Line</Badge>
                  <div className="flex flex-wrap gap-1">
                    {station.facilities.slice(0, 3).map(f => (
                      <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
