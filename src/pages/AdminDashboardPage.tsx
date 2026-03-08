import { useState, useMemo } from "react";
import { getComplaints, updateComplaint, statuses, allStations, complaintCategories, type Complaint, type ComplaintStatus } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from "recharts";
import { LayoutDashboard, Search, Clock, AlertTriangle, CheckCircle, TrendingUp, Brain, MapPin, ThermometerSun, Zap } from "lucide-react";

const statusColors: Record<string, string> = {
  "Submitted": "bg-info/10 text-info",
  "Under Review": "bg-warning/10 text-warning",
  "In Progress": "bg-accent/10 text-accent",
  "Resolved": "bg-success/10 text-success",
  "Closed": "bg-muted text-muted-foreground",
};

const CHART_COLORS = ["hsl(215, 80%, 35%)", "hsl(350, 60%, 45%)", "hsl(35, 90%, 52%)", "hsl(145, 63%, 40%)", "hsl(200, 80%, 45%)", "hsl(0, 72%, 51%)"];

// Simple keyword-based sentiment analysis
function analyzeSentiment(text: string): { score: number; label: "Positive" | "Neutral" | "Negative" } {
  const negativeWords = ["late", "dirty", "rude", "broken", "delay", "worst", "bad", "terrible", "unsafe", "crowded", "slow", "unhelpful", "angry", "frustrated", "complaint", "issue", "problem", "fault", "damaged"];
  const positiveWords = ["good", "great", "clean", "fast", "helpful", "excellent", "nice", "thank", "happy", "appreciate", "smooth"];
  const lower = text.toLowerCase();
  let score = 0;
  negativeWords.forEach(w => { if (lower.includes(w)) score -= 1; });
  positiveWords.forEach(w => { if (lower.includes(w)) score += 1; });
  const normalized = Math.max(-1, Math.min(1, score / 3));
  return {
    score: Math.round((normalized + 1) * 50), // 0-100 scale
    label: normalized < -0.2 ? "Negative" : normalized > 0.2 ? "Positive" : "Neutral",
  };
}

// Simple complaint prediction based on historical patterns
function predictComplaints(complaints: Complaint[]) {
  const stationCounts: Record<string, number> = {};
  complaints.forEach(c => { stationCounts[c.station] = (stationCounts[c.station] || 0) + 1; });

  return allStations
    .map(s => {
      const count = stationCounts[s.name] || 0;
      const base = count * 1.2 + Math.random() * 2;
      const risk = base > 3 ? "High" : base > 1.5 ? "Medium" : "Low";
      return { station: s.name, predicted: Math.round(base * 10) / 10, risk, current: count };
    })
    .filter(s => s.current > 0 || s.predicted > 0.5)
    .sort((a, b) => b.predicted - a.predicted)
    .slice(0, 10);
}

// Generate daily trend data
function generateDailyTrend(complaints: Complaint[]) {
  const days = 7;
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const count = complaints.filter(c => {
      const cDate = new Date(c.createdAt);
      return cDate.toDateString() === date.toDateString();
    }).length;
    // Simulate some data for demo
    data.push({ day: dayStr, complaints: count || Math.floor(Math.random() * 5) + 1 });
  }
  return data;
}

export default function AdminDashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(getComplaints());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const refreshComplaints = () => setComplaints(getComplaints());

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateComplaint(id, { status });
    refreshComplaints();
  };

  const handleAssign = (id: string) => {
    const officer = prompt("Enter officer name:");
    if (officer) {
      updateComplaint(id, { assignedOfficer: officer });
      refreshComplaints();
    }
  };

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.referenceId.toLowerCase().includes(search.toLowerCase()) || c.station.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [complaints, search, statusFilter]);

  // Analytics
  const byStation = useMemo(() => {
    const map: Record<string, number> = {};
    complaints.forEach(c => { map[c.station] = (map[c.station] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [complaints]);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    complaints.forEach(c => { map[c.category] = (map[c.category] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  const resolutionRate = useMemo(() => {
    const resolved = complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length;
    return complaints.length > 0 ? Math.round((resolved / complaints.length) * 100) : 0;
  }, [complaints]);

  const slaBreaches = useMemo(() => {
    return complaints.filter(c => {
      if (c.status === "Resolved" || c.status === "Closed") return false;
      return new Date(c.slaDeadline) < new Date();
    });
  }, [complaints]);

  // Sentiment analysis
  const sentimentData = useMemo(() => {
    return complaints.map(c => ({
      ...c,
      sentiment: analyzeSentiment(c.description),
    }));
  }, [complaints]);

  const sentimentSummary = useMemo(() => {
    const counts = { Positive: 0, Neutral: 0, Negative: 0 };
    sentimentData.forEach(c => { counts[c.sentiment.label]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sentimentData]);

  // Predictions
  const predictions = useMemo(() => predictComplaints(complaints), [complaints]);
  const dailyTrend = useMemo(() => generateDailyTrend(complaints), [complaints]);

  // Station heatmap data
  const heatmapData = useMemo(() => {
    const stationCounts: Record<string, number> = {};
    complaints.forEach(c => { stationCounts[c.station] = (stationCounts[c.station] || 0) + 1; });
    const max = Math.max(...Object.values(stationCounts), 1);
    return allStations
      .filter(s => stationCounts[s.name])
      .map(s => ({
        name: s.name,
        line: s.line,
        count: stationCounts[s.name] || 0,
        intensity: ((stationCounts[s.name] || 0) / max * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  return (
    <div className="page-container">
      <h1 className="section-header flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6 text-primary" />
        Admin Dashboard
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{complaints.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-success">{resolutionRate}%</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-destructive">{slaBreaches.length}</div>
            <div className="text-sm text-muted-foreground">SLA Breach</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-warning">{complaints.filter(c => c.status === "Submitted").length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-secondary">{sentimentData.filter(c => c.sentiment.label === "Negative").length}</div>
            <div className="text-sm text-muted-foreground">Negative</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="complaints">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="sla">SLA Monitor</TabsTrigger>
        </TabsList>

        {/* Complaints Tab */}
        <TabsContent value="complaints">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, ID or station..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filtered.map(c => {
              const sentiment = analyzeSentiment(c.description);
              return (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs text-muted-foreground">{c.referenceId}</span>
                          <span className={`metro-badge ${statusColors[c.status]}`}>{c.status}</span>
                          <Badge variant={c.priority === "Critical" ? "destructive" : "outline"} className="text-xs">{c.priority}</Badge>
                          <span className={`metro-badge text-xs ${sentiment.label === "Negative" ? "bg-destructive/10 text-destructive" : sentiment.label === "Positive" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                            {sentiment.label === "Negative" ? "😠" : sentiment.label === "Positive" ? "😊" : "😐"} {sentiment.label}
                          </span>
                        </div>
                        <p className="font-medium text-foreground text-sm">{c.name} — {c.station}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.category}: {c.description.slice(0, 80)}...</p>
                        {c.assignedOfficer && <p className="text-xs text-muted-foreground mt-1">👤 {c.assignedOfficer}</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Select value={c.status} onValueChange={v => handleStatusChange(c.id, v as ComplaintStatus)}>
                          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => handleAssign(c.id)}>Assign</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Complaints by Station</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={byStation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(215, 80%, 35%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Complaints by Category</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={byCategory} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label>
                      {byCategory.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Daily Complaint Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dailyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="complaints" stroke="hsl(215, 80%, 35%)" fill="hsl(215, 80%, 35%)" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Resolution Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {statuses.map(s => {
                    const count = complaints.filter(c => c.status === s).length;
                    return (
                      <div key={s} className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">{count}</div>
                        <div className="text-xs text-muted-foreground">{s}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sentiment Tab */}
        <TabsContent value="sentiment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4" /> Sentiment Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={sentimentSummary} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label>
                      <Cell fill="hsl(145, 63%, 40%)" />
                      <Cell fill="hsl(215, 12%, 65%)" />
                      <Cell fill="hsl(0, 72%, 51%)" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Sentiment by Category</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complaintCategories.map(cat => {
                    const catComplaints = sentimentData.filter(c => c.category === cat);
                    if (catComplaints.length === 0) return null;
                    const avgScore = Math.round(catComplaints.reduce((sum, c) => sum + c.sentiment.score, 0) / catComplaints.length);
                    const neg = catComplaints.filter(c => c.sentiment.label === "Negative").length;
                    return (
                      <div key={cat} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-foreground">{cat}</span>
                          <span className="text-xs text-muted-foreground ml-2">({catComplaints.length} complaints)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-border rounded-full h-2 overflow-hidden">
                            <div className="h-full rounded-full" style={{
                              width: `${avgScore}%`,
                              background: avgScore < 35 ? "hsl(0, 72%, 51%)" : avgScore < 65 ? "hsl(38, 92%, 50%)" : "hsl(145, 63%, 40%)",
                            }} />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground w-12 text-right">{neg} neg</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Recent Negative Complaints</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sentimentData.filter(c => c.sentiment.label === "Negative").slice(0, 5).map(c => (
                    <div key={c.id} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                      <span className="text-lg">😠</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs text-muted-foreground">{c.referenceId}</span>
                          <Badge variant="outline" className="text-xs">{c.station}</Badge>
                        </div>
                        <p className="text-sm text-foreground">{c.description}</p>
                      </div>
                      <span className="text-xs text-destructive font-medium">{c.sentiment.score}/100</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ThermometerSun className="w-4 h-4" /> Station Complaint Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {heatmapData.map(s => (
                  <div key={s.name} className="relative p-4 rounded-lg border overflow-hidden" style={{
                    background: `linear-gradient(135deg, hsl(${s.intensity > 60 ? "0, 72%, 51%" : s.intensity > 30 ? "38, 92%, 50%" : "145, 63%, 40%"} / ${Math.max(0.05, s.intensity / 200)}), transparent)`,
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground">{s.name}</span>
                      </div>
                      <Badge variant={s.count > 2 ? "destructive" : s.count > 1 ? "default" : "secondary"} className="text-xs">
                        {s.count}
                      </Badge>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${s.intensity}%`,
                        background: s.intensity > 60 ? "hsl(0, 72%, 51%)" : s.intensity > 30 ? "hsl(38, 92%, 50%)" : "hsl(145, 63%, 40%)",
                      }} />
                    </div>
                    <div className={`text-[10px] mt-1 capitalize ${s.line === "pink" ? "text-secondary" : "text-accent"}`}>{s.line} Line</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4" /> 7-Day Complaint Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="station" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="current" name="Current" fill="hsl(215, 80%, 35%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predicted" name="Predicted" fill="hsl(350, 60%, 45%)" radius={[4, 4, 0, 0]} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">High Risk Stations</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictions.map(p => (
                    <div key={p.station} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${p.risk === "High" ? "bg-destructive" : p.risk === "Medium" ? "bg-warning" : "bg-success"}`} />
                        <span className="text-sm font-medium text-foreground">{p.station}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{p.predicted} predicted</span>
                        <Badge variant={p.risk === "High" ? "destructive" : p.risk === "Medium" ? "default" : "secondary"} className="text-xs">
                          {p.risk}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SLA Tab */}
        <TabsContent value="sla">
          <div className="space-y-4">
            {slaBreaches.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-10 h-10 text-success mx-auto mb-2" />
                  <p className="font-semibold text-foreground">No SLA Breaches</p>
                  <p className="text-sm text-muted-foreground">All complaints are within their SLA deadlines.</p>
                </CardContent>
              </Card>
            ) : (
              slaBreaches.map(c => (
                <Card key={c.id} className="border-destructive/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs">{c.referenceId}</span>
                          <Badge variant="destructive" className="text-xs">SLA Breached</Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground">{c.station} — {c.category}</p>
                        <p className="text-xs text-muted-foreground">Deadline: {new Date(c.slaDeadline).toLocaleString("en-IN")}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(c.id, "In Progress")}>Escalate</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
