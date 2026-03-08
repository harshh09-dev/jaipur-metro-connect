import { useState } from "react";
import { allStations, calculateFare, type Station } from "@/data/metro-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Train, Clock, IndianRupee, ArrowRightLeft, MapPin } from "lucide-react";

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
      <h1 className="section-header">Journey Planner</h1>
      <p className="text-muted-foreground mb-8 -mt-4">Plan your metro journey with route, fare and travel time.</p>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="w-5 h-5 text-primary" />
              Plan Your Trip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">From</label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Pink Line</div>
                    {allStations.filter(s => s.line === "pink").map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Orange Line</div>
                    {allStations.filter(s => s.line === "orange").map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="icon" onClick={handleSwap} className="self-end">
                <ArrowRightLeft className="w-4 h-4" />
              </Button>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">To</label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Pink Line</div>
                    {allStations.filter(s => s.line === "pink").map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Orange Line</div>
                    {allStations.filter(s => s.line === "orange").map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button onClick={handlePlan} className="w-full" size="lg">
              Find Route
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="mt-6 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Journey Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <IndianRupee className="w-5 h-5 mx-auto text-primary mb-1" />
                  <div className="text-2xl font-bold text-foreground">₹{result.fare}</div>
                  <div className="text-xs text-muted-foreground">Fare</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <MapPin className="w-5 h-5 mx-auto text-secondary mb-1" />
                  <div className="text-2xl font-bold text-foreground">{result.stations}</div>
                  <div className="text-xs text-muted-foreground">Stations</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="w-5 h-5 mx-auto text-accent mb-1" />
                  <div className="text-2xl font-bold text-foreground">{result.time} min</div>
                  <div className="text-xs text-muted-foreground">Travel Time</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Route</h4>
                <div className="space-y-0">
                  {result.route.map((stop, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${stop === "(Transfer)" ? "bg-accent" : i === 0 || i === result.route.length - 1 ? "bg-primary" : "bg-primary/40"}`} />
                        {i < result.route.length - 1 && <div className="w-0.5 h-6 bg-border" />}
                      </div>
                      <span className={`text-sm ${stop === "(Transfer)" ? "font-semibold text-accent" : i === 0 || i === result.route.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {stop === "(Transfer)" ? "🔄 Transfer to other line" : stop}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
