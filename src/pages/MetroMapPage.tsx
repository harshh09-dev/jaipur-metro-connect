import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pinkLineStations, orangeLineStations, allStations, calculateFare, type Station } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Train, MapPin, ZoomIn, ZoomOut, RotateCcw, IndianRupee, Clock, ArrowRight, Map } from "lucide-react";

const stationPositions: Record<string, { x: number; y: number }> = {
  "mansarovar": { x: 100, y: 200 },
  "new-aatish-market": { x: 200, y: 200 },
  "vivek-vihar": { x: 300, y: 200 },
  "shyam-nagar": { x: 400, y: 200 },
  "ram-nagar": { x: 500, y: 200 },
  "civil-lines": { x: 600, y: 200 },
  "railway-station": { x: 700, y: 300 },
  "sindhi-camp": { x: 800, y: 200 },
  "chandpole": { x: 900, y: 200 },
  "chhoti-chaupar": { x: 1000, y: 200 },
  "badi-chaupar": { x: 1100, y: 200 },
  "ambabari": { x: 700, y: 80 },
  "raja-park": { x: 700, y: 150 },
  "malviya-nagar": { x: 700, y: 220 },
  "tonk-road": { x: 700, y: 370 },
  "railway-station-orange": { x: 700, y: 300 },
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
    if (source?.id === station.id) return "hsl(160, 84%, 39%)";
    if (destination?.id === station.id) return "hsl(347, 77%, 50%)";
    if (isOnRoute(station.name)) return "hsl(217, 91%, 60%)";
    if (isInterchange(station.id)) return "hsl(43, 96%, 56%)";
    return station.line === "pink" ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)";
  };

  const pinkPath = pinkLineStations.map(s => {
    const pos = stationPositions[s.id];
    return pos ? `${pos.x},${pos.y}` : "";
  }).filter(Boolean);

  const orangeOrder = ["ambabari", "raja-park", "malviya-nagar", "railway-station-orange", "tonk-road", "jagatpura", "sitapura"];
  const orangePath = orangeOrder.map(id => {
    const pos = stationPositions[id];
    return pos ? `${pos.x},${pos.y}` : "";
  }).filter(Boolean);

  return (
    <div className="page-container">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-2">
          <Map className="w-4 h-4" />
          Network
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Metro Map</h1>
        <p className="text-muted-foreground">Click stations to plan your journey. First click = source, second = destination.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="pb-2 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
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
                viewBox="0 0 1200 600"
                className="w-full h-full"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: dragging ? "none" : "transform 0.2s ease",
                }}
              >
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(214, 32%, 95%)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="1200" height="600" fill="url(#grid)" />

                {/* Pink Line */}
                <polyline points={pinkPath.join(" ")} fill="none" stroke="hsl(347, 77%, 50%)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />

                {/* Orange Line */}
                <polyline points={orangePath.join(" ")} fill="none" stroke="hsl(43, 96%, 56%)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />

                {/* Route highlight */}
                {result && result.route.filter(r => r !== "(Transfer)").map((name, i, arr) => {
                  if (i === arr.length - 1) return null;
                  const s1 = allStations.find(s => s.name === name);
                  const s2 = allStations.find(s => s.name === arr[i + 1]);
                  if (!s1 || !s2) return null;
                  const p1 = stationPositions[s1.id];
                  const p2 = stationPositions[s2.id];
                  if (!p1 || !p2) return null;
                  return <line key={`route-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="hsl(217, 91%, 60%)" strokeWidth="10" strokeLinecap="round" opacity={0.4} />;
                })}

                {/* Interchange */}
                <circle cx={700} cy={300} r={16} fill="hsl(0, 0%, 100%)" stroke="hsl(43, 96%, 56%)" strokeWidth="3" />
                <text x={700} y={304} textAnchor="middle" fontSize="10" fontWeight="bold" fill="hsl(43, 96%, 56%)">⇆</text>

                {/* Stations */}
                {allStations.map(station => {
                  const pos = stationPositions[station.id];
                  if (!pos) return null;
                  if (station.id === "railway-station-orange") return null;

                  const isHovered = hoveredStation === station.id;
                  const isSelected = source?.id === station.id || destination?.id === station.id;
                  const onRoute = isOnRoute(station.name);
                  const radius = isSelected ? 12 : isHovered ? 10 : onRoute ? 9 : 7;

                  return (
                    <g key={station.id} className="cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); handleStationClick(station); }}
                      onMouseEnter={() => setHoveredStation(station.id)}
                      onMouseLeave={() => setHoveredStation(null)}
                    >
                      <circle cx={pos.x} cy={pos.y} r={radius} fill={getStationColor(station)} stroke="hsl(0, 0%, 100%)" strokeWidth="2.5"
                        style={{ transition: "r 0.15s ease, fill 0.15s ease" }} />
                      {isSelected && <circle cx={pos.x} cy={pos.y} r={radius + 5} fill="none" stroke={getStationColor(station)} strokeWidth="2" opacity="0.4" className="animate-pulse-gentle" />}
                      <text
                        x={pos.x}
                        y={station.line === "orange" && station.id !== "railway-station" ? pos.y : pos.y - 16}
                        dx={station.line === "orange" ? 18 : 0}
                        textAnchor={station.line === "orange" ? "start" : "middle"}
                        fontSize={isHovered || isSelected || onRoute ? "11" : "9"}
                        fontWeight={isSelected || onRoute ? "700" : "400"}
                        fill="hsl(222, 47%, 11%)"
                        className="pointer-events-none select-none"
                        fontFamily="Inter, system-ui, sans-serif"
                      >
                        {station.name}
                      </text>
                    </g>
                  );
                })}

                {/* Legend */}
                <g transform="translate(30, 480)">
                  <rect x={0} y={0} width={240} height={95} rx="12" fill="hsl(0, 0%, 100%)" stroke="hsl(214, 32%, 91%)" />
                  <text x={15} y={22} fontSize="11" fontWeight="700" fill="hsl(222, 47%, 11%)" fontFamily="Inter">Legend</text>
                  <circle cx={25} cy={42} r={5} fill="hsl(347, 77%, 50%)" />
                  <text x={38} y={46} fontSize="10" fill="hsl(222, 47%, 11%)" fontFamily="Inter">Pink Line</text>
                  <circle cx={130} cy={42} r={5} fill="hsl(43, 96%, 56%)" />
                  <text x={143} y={46} fontSize="10" fill="hsl(222, 47%, 11%)" fontFamily="Inter">Orange Line</text>
                  <circle cx={25} cy={62} r={5} fill="hsl(160, 84%, 39%)" />
                  <text x={38} y={66} fontSize="10" fill="hsl(222, 47%, 11%)" fontFamily="Inter">Source</text>
                  <circle cx={130} cy={62} r={5} fill="hsl(347, 77%, 50%)" />
                  <text x={143} y={66} fontSize="10" fill="hsl(222, 47%, 11%)" fontFamily="Inter">Destination</text>
                  <circle cx={25} cy={82} r={5} fill="hsl(0, 0%, 100%)" stroke="hsl(43, 96%, 56%)" strokeWidth="2" />
                  <text x={38} y={86} fontSize="10" fill="hsl(222, 47%, 11%)" fontFamily="Inter">Interchange</text>
                </g>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Selected Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">From</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="font-semibold text-foreground text-sm">{source?.name || "Click a station"}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">To</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="font-semibold text-foreground text-sm">{destination?.name || "Click another station"}</span>
                </div>
              </div>
              {(source || destination) && (
                <Button variant="outline" size="sm" className="w-full" onClick={() => { setSource(null); setDestination(null); }}>
                  Clear
                </Button>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card className="border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Train className="w-4 h-4 text-accent" />
                  Journey Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 bg-muted rounded-xl">
                    <IndianRupee className="w-4 h-4 mx-auto text-accent" />
                    <div className="text-lg font-extrabold text-foreground">₹{result.fare}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">Fare</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-xl">
                    <MapPin className="w-4 h-4 mx-auto text-secondary" />
                    <div className="text-lg font-extrabold text-foreground">{result.stations}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">Stops</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-xl">
                    <Clock className="w-4 h-4 mx-auto text-info" />
                    <div className="text-lg font-extrabold text-foreground">{result.time}m</div>
                    <div className="text-[9px] text-muted-foreground uppercase">Time</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Route</h4>
                  <div className="space-y-0 max-h-48 overflow-y-auto">
                    {result.route.map((stop, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${stop === "(Transfer)" ? "bg-warning" : i === 0 || i === result.route.length - 1 ? "bg-accent" : "bg-muted-foreground/30"}`} />
                          {i < result.route.length - 1 && <div className="w-0.5 h-5 bg-border" />}
                        </div>
                        <span className={`text-xs ${stop === "(Transfer)" ? "font-bold text-warning" : "text-muted-foreground"}`}>
                          {stop === "(Transfer)" ? "🔄 Transfer" : stop}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90" size="sm" onClick={() => navigate("/journey-planner")}>
                  Full Planner <ArrowRight className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          )}

          {hoveredStation && (() => {
            const station = allStations.find(s => s.id === hoveredStation);
            if (!station) return null;
            return (
              <Card className="animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: station.line === "pink" ? "hsl(347,77%,50%)" : "hsl(43,96%,56%)" }} />
                    <span className="font-bold text-sm text-foreground">{station.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs mb-2 capitalize">{station.line} Line</Badge>
                  <div className="flex flex-wrap gap-1 mt-1">
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
