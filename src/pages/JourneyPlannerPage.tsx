import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { allStations, pinkLineStations, orangeLineStations, calculateFare, type Station } from "@/data/metro-data";
import { touristSpots } from "@/data/tourist-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Clock, IndianRupee, ArrowRightLeft, MapPin, Route, Zap, CreditCard, Navigation, Footprints, Landmark, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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

export default function JourneyPlannerPage() {
  const [searchParams] = useSearchParams();
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>(searchParams.get("to") || "");
  const [result, setResult] = useState<ReturnType<typeof calculateFare> | null>(null);
  const [error, setError] = useState("");
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Auto-calculate when both selected
  useEffect(() => {
    if (source && destination && source !== destination) {
      const s = allStations.find(st => st.id === source)!;
      const d = allStations.find(st => st.id === destination)!;
      setResult(calculateFare(s, d));
      setError("");
    } else {
      setResult(null);
    }
  }, [source, destination]);

  const handleSwap = () => {
    const tmp = source;
    setSource(destination);
    setDestination(tmp);
  };

  const handlePlan = () => {
    if (!source || !destination) { setError("Please select both stations."); return; }
    if (source === destination) { setError("Stations must be different."); return; }
  };

  const routeStationNames = result ? new Set(result.route.filter(r => r !== "(Transfer)")) : new Set<string>();

  // Nearest tourist spot to destination
  const destStation = allStations.find(s => s.id === destination);
  const nearbySpot = destStation ? touristSpots.find(t => t.nearestStationId === destination) : null;

  // Next train mock
  const nextTrainMin = Math.floor(Math.random() * 8) + 2;

  // SVG map helpers
  const pinkPath = pinkLineStations.map(s => stationPositions[s.id]).filter(Boolean).map(p => `${p.x},${p.y}`);
  const orangeOrder = ["ambabari", "raja-park", "malviya-nagar", "railway-station-orange", "tonk-road", "jagatpura", "sitapura"];
  const orangePath = orangeOrder.map(id => stationPositions[id]).filter(Boolean).map(p => `${p.x},${p.y}`);

  const handleMouseDown = (e: React.MouseEvent) => { setDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); };
  const handleMouseMove = (e: React.MouseEvent) => { if (dragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setDragging(false);

  const getStationColor = (station: Station) => {
    if (station.id === source) return "hsl(160, 84%, 39%)";
    if (station.id === destination) return "hsl(347, 77%, 50%)";
    if (routeStationNames.has(station.name)) return "hsl(217, 91%, 60%)";
    return station.line === "pink" ? "hsl(347, 77%, 85%)" : "hsl(43, 96%, 80%)";
  };

  const handleStationClick = (station: Station) => {
    if (!source) setSource(station.id);
    else if (!destination && station.id !== source) setDestination(station.id);
    else { setSource(station.id); setDestination(""); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-[420px,1fr] min-h-[calc(100vh-64px)]">
        {/* LEFT PANEL */}
        <div className="border-r border-border bg-card overflow-y-auto">
          {/* Search */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Route className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-none">Journey Planner</h1>
                <p className="text-xs text-muted-foreground">Find the fastest metro route</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-success ring-4 ring-success/20" />
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="h-11 pl-9 text-sm"><SelectValue placeholder="From station" /></SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-[10px] font-bold text-accent uppercase tracking-wider">Pink Line</div>
                    {allStations.filter(s => s.line === "pink").map(s => (
                      <SelectItem key={s.id} value={s.id}><span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />{s.name}</span></SelectItem>
                    ))}
                    <div className="px-2 py-1 text-[10px] font-bold text-warning uppercase tracking-wider mt-1">Orange Line</div>
                    {allStations.filter(s => s.line === "orange").map(s => (
                      <SelectItem key={s.id} value={s.id}><span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-warning" />{s.name}</span></SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <button onClick={handleSwap} className="p-1.5 rounded-full border-2 border-border hover:border-secondary hover:bg-secondary/5 transition-all active:rotate-180 duration-300">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-accent/20" />
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="h-11 pl-9 text-sm"><SelectValue placeholder="To station" /></SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-[10px] font-bold text-accent uppercase tracking-wider">Pink Line</div>
                    {allStations.filter(s => s.line === "pink").map(s => (
                      <SelectItem key={s.id} value={s.id}><span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />{s.name}</span></SelectItem>
                    ))}
                    <div className="px-2 py-1 text-[10px] font-bold text-warning uppercase tracking-wider mt-1">Orange Line</div>
                    {allStations.filter(s => s.line === "orange").map(s => (
                      <SelectItem key={s.id} value={s.id}><span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-warning" />{s.name}</span></SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-destructive text-xs font-medium">{error}</p>}

              <Button onClick={handlePlan} className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 gap-2 font-semibold">
                <Zap className="w-4 h-4" /> Find Route
              </Button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="animate-fade-in">
              {/* Stats */}
              <div className="grid grid-cols-3 border-b border-border">
                <div className="p-4 text-center border-r border-border">
                  <IndianRupee className="w-4 h-4 mx-auto text-accent mb-1" />
                  <div className="text-xl font-extrabold text-foreground">₹{result.fare}</div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Fare</div>
                </div>
                <div className="p-4 text-center border-r border-border">
                  <MapPin className="w-4 h-4 mx-auto text-secondary mb-1" />
                  <div className="text-xl font-extrabold text-foreground">{result.stations}</div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Stops</div>
                </div>
                <div className="p-4 text-center">
                  <Clock className="w-4 h-4 mx-auto text-info mb-1" />
                  <div className="text-xl font-extrabold text-foreground">{result.time}m</div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Time</div>
                </div>
              </div>

              {/* Route Timeline */}
              <div className="p-5 border-b border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Route</h3>
                <div className="space-y-0">
                  {result.route.map((stop, i) => {
                    const isTransfer = stop === "(Transfer)";
                    const isFirst = i === 0;
                    const isLast = i === result.route.length - 1;
                    const station = allStations.find(s => s.name === stop);
                    const lineColor = station?.line === "orange" ? "bg-warning" : "bg-accent";

                    return (
                      <div key={i} className="flex items-stretch gap-3">
                        <div className="flex flex-col items-center w-5">
                          {isTransfer ? (
                            <div className="w-5 h-5 rounded bg-warning/20 flex items-center justify-center text-warning text-[10px] font-bold shrink-0">⇆</div>
                          ) : (
                            <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                              isFirst ? "bg-success border-success" :
                              isLast ? "bg-accent border-accent" :
                              `bg-card border-muted-foreground/30`
                            }`} />
                          )}
                          {i < result.route.length - 1 && (
                            <div className={`w-0.5 flex-1 min-h-[20px] ${isTransfer ? "bg-warning/30" : "bg-border"}`} />
                          )}
                        </div>
                        <div className={`pb-3 ${isFirst || isLast ? "pt-0" : "pt-0"}`}>
                          {isTransfer ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] text-warning border-warning/30 bg-warning/5">Transfer Line</Badge>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${isFirst || isLast ? "font-bold text-foreground" : "text-muted-foreground"}`}>{stop}</span>
                              {station && (isFirst || isLast) && (
                                <Badge variant="secondary" className="text-[9px] capitalize">{station.line}</Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Smart Card Fare */}
              <div className="p-5 border-b border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Payment</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/5 border border-secondary/10">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">Smart Card</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-success">₹{Math.round(result.fare * 0.85)}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">15% off</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">QR Ticket / Token</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">₹{result.fare}</span>
                  </div>
                </div>
              </div>

              {/* Next Train */}
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/10">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <Train className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Next Train</p>
                    <p className="text-sm font-bold text-foreground">
                      {allStations.find(s => s.id === source)?.name || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-success">{nextTrainMin}</span>
                    <span className="text-xs text-muted-foreground ml-0.5">min</span>
                  </div>
                </div>
              </div>

              {/* Last Mile */}
              {nearbySpot && (
                <div className="p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Last Mile</h3>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Landmark className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-bold text-foreground">{nearbySpot.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Footprints className="w-3 h-3" /> {nearbySpot.distance} walk</span>
                      <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> from {nearbySpot.nearestStation}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!result && !error && (
            <div className="p-8 text-center">
              <Train className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Select source and destination to see route details</p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Metro Map */}
        <div className="relative bg-muted/30 hidden lg:block">
          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card shadow-md" onClick={() => setScale(s => Math.min(s + 0.2, 2.5))}><ZoomIn className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card shadow-md" onClick={() => setScale(s => Math.max(s - 0.2, 0.4))}><ZoomOut className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card shadow-md" onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}><RotateCcw className="w-4 h-4" /></Button>
          </div>

          <div
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
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

              {/* Lines */}
              <polyline points={pinkPath.join(" ")} fill="none" stroke="hsl(347, 77%, 50%)" strokeWidth="5" strokeLinecap="round" opacity={0.6} />
              <polyline points={orangePath.join(" ")} fill="none" stroke="hsl(43, 96%, 56%)" strokeWidth="5" strokeLinecap="round" opacity={0.6} />

              {/* Route highlight */}
              {result && result.route.filter(r => r !== "(Transfer)").map((name, i, arr) => {
                if (i === arr.length - 1) return null;
                const s1 = allStations.find(s => s.name === name);
                const s2 = allStations.find(s => s.name === arr[i + 1]);
                if (!s1 || !s2) return null;
                const p1 = stationPositions[s1.id];
                const p2 = stationPositions[s2.id];
                if (!p1 || !p2) return null;
                return <line key={`r-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="hsl(217, 91%, 60%)" strokeWidth="10" strokeLinecap="round" opacity={0.5} />;
              })}

              {/* Interchange */}
              <circle cx={700} cy={300} r={14} fill="hsl(0,0%,100%)" stroke="hsl(43,96%,56%)" strokeWidth="3" />
              <text x={700} y={304} textAnchor="middle" fontSize="10" fontWeight="bold" fill="hsl(43,96%,56%)">⇆</text>

              {/* Stations */}
              {allStations.map(station => {
                const pos = stationPositions[station.id];
                if (!pos || station.id === "railway-station-orange") return null;
                const isSelected = station.id === source || station.id === destination;
                const onRoute = routeStationNames.has(station.name);
                const r = isSelected ? 11 : onRoute ? 8 : 6;

                return (
                  <g key={station.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleStationClick(station); }}>
                    {isSelected && <circle cx={pos.x} cy={pos.y} r={r + 5} fill="none" stroke={getStationColor(station)} strokeWidth="2" opacity="0.4" className="animate-pulse-gentle" />}
                    <circle cx={pos.x} cy={pos.y} r={r} fill={getStationColor(station)} stroke="hsl(0,0%,100%)" strokeWidth="2" style={{ transition: "all 0.15s ease" }} />
                    <text
                      x={pos.x}
                      y={station.line === "orange" && station.id !== "railway-station" ? pos.y : pos.y - 14}
                      dx={station.line === "orange" ? 16 : 0}
                      textAnchor={station.line === "orange" ? "start" : "middle"}
                      fontSize={isSelected || onRoute ? "10" : "8"}
                      fontWeight={isSelected || onRoute ? "700" : "400"}
                      fill="hsl(222,47%,11%)"
                      className="pointer-events-none select-none"
                      fontFamily="Inter, system-ui, sans-serif"
                    >{station.name}</text>
                  </g>
                );
              })}

              {/* Legend */}
              <g transform="translate(30, 490)">
                <rect x={0} y={0} width={200} height={80} rx="10" fill="hsl(0,0%,100%)" stroke="hsl(214,32%,91%)" />
                <text x={12} y={20} fontSize="10" fontWeight="700" fill="hsl(222,47%,11%)" fontFamily="Inter">Legend</text>
                <circle cx={20} cy={38} r={4} fill="hsl(347,77%,50%)" /><text x={30} y={42} fontSize="9" fill="hsl(222,47%,11%)" fontFamily="Inter">Pink Line</text>
                <circle cx={110} cy={38} r={4} fill="hsl(43,96%,56%)" /><text x={120} y={42} fontSize="9" fill="hsl(222,47%,11%)" fontFamily="Inter">Orange Line</text>
                <circle cx={20} cy={58} r={4} fill="hsl(160,84%,39%)" /><text x={30} y={62} fontSize="9" fill="hsl(222,47%,11%)" fontFamily="Inter">Source</text>
                <circle cx={110} cy={58} r={4} fill="hsl(217,91%,60%)" /><text x={120} y={62} fontSize="9" fill="hsl(222,47%,11%)" fontFamily="Inter">Route</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Mobile Map Card */}
        <div className="lg:hidden p-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted/30 h-64 overflow-hidden">
                <svg viewBox="0 0 1200 600" className="w-full h-full">
                  <polyline points={pinkPath.join(" ")} fill="none" stroke="hsl(347,77%,50%)" strokeWidth="6" strokeLinecap="round" opacity={0.7} />
                  <polyline points={orangePath.join(" ")} fill="none" stroke="hsl(43,96%,56%)" strokeWidth="6" strokeLinecap="round" opacity={0.7} />
                  {result && result.route.filter(r => r !== "(Transfer)").map((name, i, arr) => {
                    if (i === arr.length - 1) return null;
                    const s1 = allStations.find(s => s.name === name);
                    const s2 = allStations.find(s => s.name === arr[i + 1]);
                    if (!s1 || !s2) return null;
                    const p1 = stationPositions[s1.id];
                    const p2 = stationPositions[s2.id];
                    if (!p1 || !p2) return null;
                    return <line key={`mr-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="hsl(217,91%,60%)" strokeWidth="10" strokeLinecap="round" opacity={0.5} />;
                  })}
                  <circle cx={700} cy={300} r={14} fill="hsl(0,0%,100%)" stroke="hsl(43,96%,56%)" strokeWidth="3" />
                  {allStations.map(station => {
                    const pos = stationPositions[station.id];
                    if (!pos || station.id === "railway-station-orange") return null;
                    const isSelected = station.id === source || station.id === destination;
                    const onRoute = routeStationNames.has(station.name);
                    return (
                      <g key={station.id}>
                        <circle cx={pos.x} cy={pos.y} r={isSelected ? 9 : onRoute ? 7 : 5} fill={getStationColor(station)} stroke="hsl(0,0%,100%)" strokeWidth="2" />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
