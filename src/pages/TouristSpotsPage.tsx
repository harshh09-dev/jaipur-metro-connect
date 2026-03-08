import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, IndianRupee, Train, ArrowRight, Search, Landmark, TreePine, Store, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { touristSpots, spotCategories, type TouristSpot } from "@/data/tourist-data";

const categoryIcons: Record<string, React.ElementType> = {
  Heritage: Landmark,
  Museum: Landmark,
  Park: TreePine,
  Temple: Landmark,
  Market: Store,
  Lake: Waves,
};

export default function TouristSpotsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);

  const filtered = touristSpots.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nearestStation.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="metro-gradient text-primary-foreground py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Explore Jaipur via Metro</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl">
            Discover top tourist attractions and reach them easily using the metro network.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search places or stations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {spotCategories.map(cat => (
              <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat)} className="text-xs">
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedSpot && (
          <Card className="mb-8 border-2 border-secondary/20 animate-fade-in">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto bg-muted">
                  <img src={selectedSpot.image} alt={selectedSpot.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-secondary text-secondary-foreground">{selectedSpot.category}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSpot(null)} className="text-xs">Close</Button>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedSpot.name}</h2>
                  <p className="text-muted-foreground mb-4">{selectedSpot.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedSpot.openingHours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedSpot.entryFee}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>Best time: {selectedSpot.bestTime}</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Train className="w-4 h-4 text-secondary" /> Reach via Metro
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Nearest Station: <span className="font-semibold text-foreground">{selectedSpot.nearestStation}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Walking distance: <span className="font-semibold text-foreground">{selectedSpot.distance}</span>
                    </p>
                  </div>

                  <Link to={`/journey-planner?to=${selectedSpot.nearestStationId}`}>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                      Plan Metro Journey <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(spot => {
            const CatIcon = categoryIcons[spot.category] || Landmark;
            return (
              <Card key={spot.id} className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedSpot(spot)}>
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm gap-1">
                    <CatIcon className="w-3 h-3" /> {spot.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground mb-1">{spot.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{spot.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Train className="w-3.5 h-3.5 text-secondary" />
                      <span>{spot.nearestStation}</span>
                      <span className="text-foreground font-semibold">· {spot.distance}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-secondary text-xs gap-1 h-7 px-2">
                      Details <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No places found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
