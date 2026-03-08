import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pinkLineStations, orangeLineStations, allStations, calculateFare, type Station } from "@/data/metro-data";
import { touristSpots } from "@/data/tourist-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Train, MapPin, ZoomIn, ZoomOut, RotateCcw, IndianRupee, Clock, ArrowRight, Map, Play, Pause, Landmark } from "lucide-react";

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

// Tourist spots near stations
const stationTouristMap: Record<string, string[]> = {};
touristSpots.forEach(spot => {
  if (!stationTouristMap[spot.nearestStationId]) stationTouristMap[spot.nearestStationId] = [];
  stationTouristMap[spot.nearestStationId].push(spot.name);
});

interface TrainState {
  id: string;
  line: "pink" | "orange";
  stationIndex: number;
  direction: 1 | -1;
  arriving: boolean;
}

export default function MetroMapPage() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [source, setSource] = useState<Station | null>(null);
  const [destination, setDestination] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [simulationOn, setSimulationOn] = useState(false);
  const [trains, setTrains] = useState<TrainState[]>([
    { id: "P1", line: "pink", stationIndex: 0, direction: 1, arriving: false },
    { id: "P2", line: "pink", stationIndex: 7, direction: -1, arriving: false },
    { id: "O1", line: "orange", stationIndex: 0, direction: 1, arriving: false },
    { id: "O2", line: "orange", stationIndex: 4, direction: -1, arriving: false },
  ]);
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);

  const result = source && destination ? calculateFare(source, destination) : null;
  const routeStationNames = result ? new Set(result.route.filter(r => r !== "(Transfer)")) : new Set<string>();

  // Train simulation
  useEffect(() => {
    if (!simulationOn) return;
    const interval = setInterval(() => {
      setTrains(prev => prev.map(t => {
        const lineStations = t.line === "pink" ? pinkLineStations : orangeLineStations;
        const maxIdx = lineStations.length - 1;

        // Toggle arriving state
        if (t.arriving) {
          let nextIdx = t.stationIndex + t.direction;
          let nextDir = t.direction;
          if (nextIdx > maxIdx) { nextIdx = maxIdx - 1; nextDir = -1; }
          if (nextIdx < 0) { nextIdx = 1; nextDir = 1; }
          return { ...t, stationIndex: nextIdx, direction: nextDir as 1 | -1, arriving: false };
        }
        return { ...t, arriving: true };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [simulationOn]);

  const getTrainPosition = (train: TrainState) => {
    const lineStations = train.line === "pink" ? pinkLineStations : orangeLineStations;
    const station = lineStations[train.stationIndex];
    if (!station) return null;
    const pos = stationPositions[station.id];
    if (!pos) return stationPositions[station.id === "railway-station-orange" ? "railway-station-orange" : station.id];
    return pos;
  };

  const handleStationClick = (station: Station) => {
    if (!source) setSource(station);
    else if (!destination && station.id !== source.id) setDestination(station);
    else { setSource(station); setDestination(null); }
  };

  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.4));
  const handleReset = () => { setScale(1); setPan({ x: 0, y: 0 }); setSource(null); setDestination(null); };

  const handleMouseDown = (e: React.MouseEvent) => { setDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); };
  const handleMouseMove = (e: React.MouseEvent) => { if (dragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setDragging(false);
  const handleTouchStart = (e: React.TouchEvent) => { const t = e.touches[0]; setDragging(true); setDragStart({ x: t.clientX - pan.x, y: t.clientY - pan.y }); };
  const handleTouchMove = (e: React.TouchEvent) => { if (!dragging) return; const t = e.touches[0]; setPan({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y }); };

  const isOnRoute = (stationName: string) => routeStationNames.has(stationName);
  const isInterchange = (id: string) => id === "railway-station" || id === "railway-station-orange";
  const hasTouristSpots = (id: string) => stationTouristMap[id]?.length > 0;

  const getStationColor = (station: Station) => {
    if (source?.id === station.id) return "hsl(160, 84%, 39%)";
    if (destination?.id === station.id) return "hsl(var(--accent))";
    if (isOnRoute(station.name)) return "hsl(var(--secondary))";
    if (isInterchange(station.id)) return "hsl(var(--warning))";
    return station.line === "pink" ? "hsl(var(--accent))" : "hsl(var(--warning))";
  };

  const pinkPath = pinkLineStations.map(s => stationPositions[s.id]).filter(Boolean).map(p => `${p.x},${p.y}`);
  const orangeOrder = ["ambabari", "raja-park", "malviya-nagar", "railway-station-orange", "tonk-road", "jagatpura", "sitapura"];
  const orangePath = orangeOrder.map(id => stationPositions[id]).filter(Boolean).map(p => `${p.x},${p.y}`);

  // Build SVG path string for route animation
  const routePathD = result ? (() => {
    const names = result.route.filter(r => r !== "(Transfer)");
    const points = names.map(name => {
      const st = allStations.find(s => s.name === name);
      return st ? stationPositions[st.id] : null;
    }).filter(Boolean) as { x: number; y: number }[];
    if (points.length < 2) return "";
    return "M " + points.map(p => `${p.x} ${p.y}`).join(" L ");
  })() : "";

  const lineOpacity = result ? 0.25 : 0.8;

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-1">
              <Map className="w-4 h-4" /> Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Metro Map</h1>
            <p className="text-muted-foreground text-sm">Click stations to plan. Toggle simulation to see live trains.</p>
          </div>
          <Button
            variant={simulationOn ? "default" : "outline"}
            onClick={() => setSimulationOn(!simulationOn)}
            className="gap-2"
          >
            {simulationOn ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {simulationOn ? "Stop" : "Simulate"}
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6">
          {/* Map */}
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="pb-2 flex flex-row items-center justify-between border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" /> Jaipur Metro Network
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}><ZoomIn className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}><ZoomOut className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleReset}><RotateCcw className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="overflow-hidden cursor-grab active:cursor-grabbing"
                style={{ height: "560px", background: "hsl(var(--map-bg))" }}
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
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--map-grid))" strokeWidth="0.5" />
                    </pattern>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="train-glow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <rect width="1200" height="600" fill="url(#grid)" />

                  {/* Lines (fade when route active) */}
                  <polyline points={pinkPath.join(" ")} fill="none" stroke="hsl(var(--accent))" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={lineOpacity} style={{ transition: "opacity 0.5s ease" }} />
                  <polyline points={orangePath.join(" ")} fill="none" stroke="hsl(var(--warning))" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={lineOpacity} style={{ transition: "opacity 0.5s ease" }} />

                  {/* Animated route highlight */}
                  {routePathD && (
                    <path d={routePathD} fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity={0.5} className="animate-draw-route" filter="url(#glow)" />
                  )}

                  {/* Interchange */}
                  <circle cx={700} cy={300} r={16} fill="hsl(var(--card))" stroke="hsl(var(--warning))" strokeWidth="3" />
                  <text x={700} y={304} textAnchor="middle" fontSize="10" fontWeight="bold" fill="hsl(var(--warning))">⇆</text>

                  {/* Tourist spot markers */}
                  {Object.entries(stationTouristMap).map(([stationId, spots]) => {
                    const pos = stationPositions[stationId];
                    if (!pos) return null;
                    return (
                      <g key={`tourist-${stationId}`}>
                        <circle cx={pos.x + 18} cy={pos.y - 18} r={8} fill="hsl(var(--secondary))" opacity={0.8} />
                        <text x={pos.x + 18} y={pos.y - 14} textAnchor="middle" fontSize="8" fill="white">★</text>
                      </g>
                    );
                  })}

                  {/* Stations */}
                  {allStations.map(station => {
                    const pos = stationPositions[station.id];
                    if (!pos || station.id === "railway-station-orange") return null;

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
                        {/* Glow for route stations */}
                        {onRoute && <circle cx={pos.x} cy={pos.y} r={radius + 6} fill="none" stroke="hsl(var(--map-glow))" strokeWidth="2" opacity="0.3" className="animate-station-glow" />}
                        {isSelected && <circle cx={pos.x} cy={pos.y} r={radius + 6} fill="none" stroke={getStationColor(station)} strokeWidth="2.5" opacity="0.5" className="animate-pulse-gentle" />}
                        <circle cx={pos.x} cy={pos.y} r={radius} fill={getStationColor(station)} stroke="hsl(var(--card))" strokeWidth="2.5"
                          style={{ transition: "all 0.2s ease" }}
                          filter={onRoute || isSelected ? "url(#glow)" : undefined}
                        />
                        <text
                          x={pos.x}
                          y={station.line === "orange" && station.id !== "railway-station" ? pos.y : pos.y - 16}
                          dx={station.line === "orange" ? 18 : 0}
                          textAnchor={station.line === "orange" ? "start" : "middle"}
                          fontSize={isHovered || isSelected || onRoute ? "11" : "9"}
                          fontWeight={isSelected || onRoute ? "700" : "400"}
                          fill="hsl(var(--map-text))"
                          className="pointer-events-none select-none"
                          fontFamily="Inter, system-ui, sans-serif"
                        >{station.name}</text>
                      </g>
                    );
                  })}

                  {/* Trains */}
                  {simulationOn && trains.map(train => {
                    const pos = getTrainPosition(train);
                    if (!pos) return null;
                    const color = train.line === "pink" ? "hsl(var(--accent))" : "hsl(var(--warning))";
                    return (
                      <g key={train.id}
                        onMouseEnter={() => setHoveredTrain(train.id)}
                        onMouseLeave={() => setHoveredTrain(null)}
                        style={{ transition: "transform 1s ease" }}
                      >
                        {train.arriving && <circle cx={pos.x} cy={pos.y} r={20} fill={color} opacity={0.15} className="animate-pulse-gentle" />}
                        <rect x={pos.x - 10} y={pos.y - 6} width={20} height={12} rx={3} fill={color} filter="url(#train-glow)" style={{ transition: "all 1s ease" }} />
                        <text x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize="7" fill="white" fontWeight="700" fontFamily="Inter">{train.id}</text>
                        {hoveredTrain === train.id && (
                          <g>
                            <rect x={pos.x + 14} y={pos.y - 30} width={120} height={48} rx={8} fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                            <text x={pos.x + 22} y={pos.y - 14} fontSize="9" fontWeight="700" fill="hsl(var(--foreground))" fontFamily="Inter">Train {train.id}</text>
                            <text x={pos.x + 22} y={pos.y - 2} fontSize="8" fill="hsl(var(--muted-foreground))" fontFamily="Inter">
                              {(train.line === "pink" ? pinkLineStations : orangeLineStations)[train.stationIndex]?.name || "—"}
                            </text>
                            <text x={pos.x + 22} y={pos.y + 10} fontSize="8" fill="hsl(var(--success))" fontFamily="Inter">
                              {train.arriving ? "Arriving..." : "In Transit"}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Legend */}
                  <g transform="translate(30, 470)">
                    <rect x={0} y={0} width={280} height={105} rx="12" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                    <text x={15} y={22} fontSize="11" fontWeight="700" fill="hsl(var(--foreground))" fontFamily="Inter">Legend</text>
                    <circle cx={25} cy={42} r={5} fill="hsl(var(--accent))" /><text x={38} y={46} fontSize="10" fill="hsl(var(--foreground))" fontFamily="Inter">Pink Line</text>
                    <circle cx={130} cy={42} r={5} fill="hsl(var(--warning))" /><text x={143} y={46} fontSize="10" fill="hsl(var(--foreground))" fontFamily="Inter">Orange Line</text>
                    <circle cx={25} cy={62} r={5} fill="hsl(160, 84%, 39%)" /><text x={38} y={66} fontSize="10" fill="hsl(var(--foreground))" fontFamily="Inter">Source</text>
                    <circle cx={130} cy={62} r={5} fill="hsl(var(--secondary))" /><text x={143} y={66} fontSize="10" fill="hsl(var(--foreground))" fontFamily="Inter">Route</text>
                    <circle cx={25} cy={82} r={5} fill="hsl(var(--card))" stroke="hsl(var(--warning))" strokeWidth="2" /><text x={38} y={86} fontSize="10" fill="hsl(var(--foreground))" fontFamily="Inter">Interchange</text>
                    <circle cx={130} cy={82} r={5} fill="hsl(var(--secondary))" /><text x={143} y={86} fontSize="10" fill="hsl(var(--foreground))" fontFamily="Inter">★ Tourist</text>
                    {simulationOn && <><rect x={220} y={34} width={16} height={10} rx={3} fill="hsl(var(--accent))" /><text x={242} y={44} fontSize="10" fill="hsl(var(--foreground))" fontFamily="Inter">Train</text></>}
                  </g>
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Selected Journey</CardTitle></CardHeader>
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
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setSource(null); setDestination(null); }}>Clear</Button>
                )}
              </CardContent>
            </Card>

            {result && (
              <Card className="border-accent/20 animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Train className="w-4 h-4 text-accent" /> Journey Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-3 bg-muted rounded-xl hover-lift">
                      <IndianRupee className="w-4 h-4 mx-auto text-accent" />
                      <div className="text-lg font-extrabold text-foreground">₹{result.fare}</div>
                      <div className="text-[9px] text-muted-foreground uppercase">Fare</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-xl hover-lift">
                      <MapPin className="w-4 h-4 mx-auto text-secondary" />
                      <div className="text-lg font-extrabold text-foreground">{result.stations}</div>
                      <div className="text-[9px] text-muted-foreground uppercase">Stops</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-xl hover-lift">
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

            {/* Station Hover Popup */}
            {hoveredStation && (() => {
              const station = allStations.find(s => s.id === hoveredStation);
              if (!station) return null;
              const spots = stationTouristMap[station.id];
              return (
                <Card className="animate-fade-in">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: station.line === "pink" ? "hsl(var(--accent))" : "hsl(var(--warning))" }} />
                      <span className="font-bold text-sm text-foreground">{station.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs mb-2 capitalize">{station.line} Line</Badge>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {station.facilities.slice(0, 4).map(f => (
                        <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                      ))}
                    </div>
                    {spots && spots.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-secondary font-medium mb-1">
                          <Landmark className="w-3 h-3" /> Nearby Attractions
                        </div>
                        {spots.map(s => (
                          <span key={s} className="text-[10px] text-muted-foreground block">• {s}</span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}

            {/* Simulation Info */}
            {simulationOn && (
              <Card className="border-success/20 animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse-gentle" />
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Live Simulation</span>
                  </div>
                  <div className="space-y-2">
                    {trains.map(t => {
                      const lineStations = t.line === "pink" ? pinkLineStations : orangeLineStations;
                      const current = lineStations[t.stationIndex]?.name || "—";
                      const nextIdx = t.stationIndex + t.direction;
                      const next = lineStations[Math.max(0, Math.min(nextIdx, lineStations.length - 1))]?.name || "—";
                      return (
                        <div key={t.id} className="flex items-center justify-between p-2 bg-muted rounded-lg text-xs">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-3 rounded ${t.line === "pink" ? "bg-accent" : "bg-warning"}`} />
                            <span className="font-bold text-foreground">{t.id}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-muted-foreground">{current}</span>
                            <span className="text-muted-foreground mx-1">→</span>
                            <span className="text-foreground font-medium">{next}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
