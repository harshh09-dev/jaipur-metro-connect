import { useState } from "react";
import { allStations, calculateFare, type Station } from "@/data/metro-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Clock, IndianRupee, ArrowRightLeft, MapPin, Route, Zap } from "lucide-react";

export default function JourneyPlannerPage() {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [result, setResult] = useState<ReturnType<typeof calculateFare> | null>(null);
  const [error, setError] = useState("");

  const handlePlan = () => {
    setError("");
    setResult(null);
    if (!source || !destination) { setError("Please select both source and destination."); return; }
    if (source === destination) { setError("Source and destination cannot be the same."); return; }
    const s = allStations.find(st => st.id === source)!;
    const d = allStations.find(st => st.id === destination)!;
    setResult(calculateFare(s, d));
  };

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
    setResult(null);
  };

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-2">
            <Route className="w-4 h-4" />
            Plan Your Trip
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Journey Planner</h1>
          <p className="text-muted-foreground">Plan your metro journey — get route, fare and travel time instantly.</p>
        </div>

        {/* Planner Card */}
        <Card className="shadow-lg border-2">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">From Station</label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-bold text-accent uppercase tracking-wider">Pink Line</div>
                    {allStations.filter(s => s.line === "pink").map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          {s.name}
                        </span>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-bold text-warning uppercase tracking-wider mt-1">Orange Line</div>
                    {allStations.filter(s => s.line === "orange").map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-warning" />
                          {s.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="icon" onClick={handleSwap} className="self-end h-12 w-12 rounded-full border-2">
                <ArrowRightLeft className="w-5 h-5" />
              </Button>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">To Station</label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-bold text-accent uppercase tracking-wider">Pink Line</div>
                    {allStations.filter(s => s.line === "pink").map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          {s.name}
                        </span>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-bold text-warning uppercase tracking-wider mt-1">Orange Line</div>
                    {allStations.filter(s => s.line === "orange").map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-warning" />
                          {s.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-destructive text-sm mt-4 font-medium">{error}</p>}

            <Button onClick={handlePlan} className="w-full mt-6 h-12 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Zap className="w-4 h-4" /> Find Route
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="mt-8 animate-fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="text-center border-2 border-accent/20">
                <CardContent className="p-5">
                  <IndianRupee className="w-6 h-6 mx-auto text-accent mb-2" />
                  <div className="text-3xl font-extrabold text-foreground">₹{result.fare}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Fare</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <MapPin className="w-6 h-6 mx-auto text-secondary mb-2" />
                  <div className="text-3xl font-extrabold text-foreground">{result.stations}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Stations</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <Clock className="w-6 h-6 mx-auto text-info mb-2" />
                  <div className="text-3xl font-extrabold text-foreground">{result.time} min</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Travel Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Route */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Route className="w-5 h-5 text-accent" />
                  Route Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {result.route.map((stop, i) => {
                    const isTransfer = stop === "(Transfer)";
                    const isTerminal = i === 0 || i === result.route.length - 1;
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            isTransfer ? "bg-warning border-warning" :
                            isTerminal ? "bg-accent border-accent" :
                            "bg-card border-muted-foreground/30"
                          }`} />
                          {i < result.route.length - 1 && (
                            <div className={`w-0.5 h-8 ${isTransfer ? "bg-warning/40" : "bg-border"}`} />
                          )}
                        </div>
                        <div className={`pb-2 ${isTransfer ? "py-2" : ""}`}>
                          {isTransfer ? (
                            <Badge className="bg-warning text-warning-foreground">🔄 Transfer to other line</Badge>
                          ) : (
                            <span className={`text-sm ${isTerminal ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                              {stop}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Fare Info */}
            <Card className="mt-4">
              <CardContent className="p-5">
                <h4 className="font-semibold text-sm text-foreground mb-2">Fare Calculation</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Same line: ₹5 per station (max ₹25)</p>
                  <p>• Inter-line transfer: ₹30 base + ₹2 per station</p>
                  <p>• Travel time: ~2.5 min/station + 5 min buffer</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
