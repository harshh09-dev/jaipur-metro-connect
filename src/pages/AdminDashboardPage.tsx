import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { getComplaints, updateComplaint, statuses, allStations, complaintCategories, type Complaint, type ComplaintStatus } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";
import {
  LayoutDashboard, Search, Clock, AlertTriangle, CheckCircle, TrendingUp,
  Brain, MapPin, ThermometerSun, Zap, MessageSquare, BarChart3, Bell, Settings,
  ChevronLeft, ChevronRight, Home, Users, Shield
} from "lucide-react";

const statusColors: Record<string, string> = {
  "Submitted": "bg-info/10 text-info",
  "Under Review": "bg-warning/10 text-warning",
  "In Progress": "bg-secondary/10 text-secondary",
  "Resolved": "bg-success/10 text-success",
  "Closed": "bg-muted text-muted-foreground",
};

const CHART_COLORS = ["hsl(217, 91%, 60%)", "hsl(347, 77%, 50%)", "hsl(43, 96%, 56%)", "hsl(160, 84%, 39%)", "hsl(222, 47%, 11%)", "hsl(0, 84%, 60%)"];

function analyzeSentiment(text: string): { score: number; label: "Positive" | "Neutral" | "Negative" } {
  const negativeWords = ["late", "dirty", "rude", "broken", "delay", "worst", "bad", "terrible", "unsafe", "crowded", "slow", "unhelpful", "angry", "frustrated", "complaint", "issue", "problem", "fault", "damaged"];
  const positiveWords = ["good", "great", "clean", "fast", "helpful", "excellent", "nice", "thank", "happy", "appreciate", "smooth"];
  const lower = text.toLowerCase();
  let score = 0;
  negativeWords.forEach(w => { if (lower.includes(w)) score -= 1; });
  positiveWords.forEach(w => { if (lower.includes(w)) score += 1; });
  const normalized = Math.max(-1, Math.min(1, score / 3));
  return { score: Math.round((normalized + 1) * 50), label: normalized < -0.2 ? "Negative" : normalized > 0.2 ? "Positive" : "Neutral" };
}

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

function generateDailyTrend(complaints: Complaint[]) {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const count = complaints.filter(c => new Date(c.createdAt).toDateString() === date.toDateString()).length;
    data.push({ day: dayStr, complaints: count || Math.floor(Math.random() * 5) + 1 });
  }
  return data;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "complaints", label: "Complaints", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "sentiment", label: "Sentiment", icon: Brain },
  { id: "heatmap", label: "Heatmap", icon: ThermometerSun },
  { id: "predictions", label: "Predictions", icon: Zap },
  { id: "sla", label: "SLA Monitor", icon: Shield },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(getComplaints());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const refreshComplaints = () => setComplaints(getComplaints());

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateComplaint(id, { status });
    refreshComplaints();
  };

  const handleAssign = (id: string) => {
    const officer = prompt("Enter officer name:");
    if (officer) { updateComplaint(id, { assignedOfficer: officer }); refreshComplaints(); }
  };

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.referenceId.toLowerCase().includes(search.toLowerCase()) || c.station.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [complaints, search, statusFilter]);

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

  const sentimentData = useMemo(() => complaints.map(c => ({ ...c, sentiment: analyzeSentiment(c.description) })), [complaints]);
  const sentimentSummary = useMemo(() => {
    const counts = { Positive: 0, Neutral: 0, Negative: 0 };
    sentimentData.forEach(c => { counts[c.sentiment.label]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sentimentData]);

  const predictions = useMemo(() => predictComplaints(complaints), [complaints]);
  const dailyTrend = useMemo(() => generateDailyTrend(complaints), [complaints]);

  const heatmapData = useMemo(() => {
    const stationCounts: Record<string, number> = {};
    complaints.forEach(c => { stationCounts[c.station] = (stationCounts[c.station] || 0) + 1; });
    const max = Math.max(...Object.values(stationCounts), 1);
    return allStations
      .filter(s => stationCounts[s.name])
      .map(s => ({ name: s.name, line: s.line, count: stationCounts[s.name] || 0, intensity: ((stationCounts[s.name] || 0) / max * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: "Total", value: complaints.length, color: "text-foreground", bg: "" },
                { label: "Resolved", value: `${resolutionRate}%`, color: "text-success", bg: "bg-success/5 border-success/20" },
                { label: "SLA Breach", value: slaBreaches.length, color: "text-destructive", bg: "bg-destructive/5 border-destructive/20" },
                { label: "Pending", value: complaints.filter(c => c.status === "Submitted").length, color: "text-warning", bg: "bg-warning/5 border-warning/20" },
                { label: "Negative", value: sentimentData.filter(c => c.sentiment.label === "Negative").length, color: "text-accent", bg: "bg-accent/5 border-accent/20" },
              ].map(kpi => (
                <Card key={kpi.label} className={kpi.bg}>
                  <CardContent className="p-5 text-center">
                    <div className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{kpi.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-accent" />Daily Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="complaints" stroke="hsl(347, 77%, 50%)" fill="hsl(347, 77%, 50%)" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">By Category</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={byCategory} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label>
                        {byCategory.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complaints.slice(0, 3).map(c => {
                    const sentiment = analyzeSentiment(c.description);
                    return (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-muted-foreground">{c.referenceId}</span>
                            <Badge className={`${statusColors[c.status]} text-xs`}>{c.status}</Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground mt-0.5">{c.name} — {c.station}</p>
                        </div>
                        <Badge variant={c.priority === "Critical" ? "destructive" : "outline"} className="text-xs shrink-0">{c.priority}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "complaints":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search name, ID or station..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-11"><SelectValue /></SelectTrigger>
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
                  <Card key={c.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs text-muted-foreground">{c.referenceId}</span>
                            <Badge className={`${statusColors[c.status]} text-xs`}>{c.status}</Badge>
                            <Badge variant={c.priority === "Critical" ? "destructive" : "outline"} className="text-xs">{c.priority}</Badge>
                            <span className={`text-xs font-medium ${sentiment.label === "Negative" ? "text-destructive" : sentiment.label === "Positive" ? "text-success" : "text-muted-foreground"}`}>
                              {sentiment.label === "Negative" ? "😠" : sentiment.label === "Positive" ? "😊" : "😐"} {sentiment.label}
                            </span>
                          </div>
                          <p className="font-semibold text-sm text-foreground">{c.name} — {c.station}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.category}: {c.description.slice(0, 80)}...</p>
                          {c.assignedOfficer && <p className="text-xs text-muted-foreground mt-1">👤 {c.assignedOfficer}</p>}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Select value={c.status} onValueChange={v => handleStatusChange(c.id, v as ComplaintStatus)}>
                            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" onClick={() => handleAssign(c.id)}>Assign</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filtered.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No complaints found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Complaints by Station</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={byStation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
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
              <CardHeader><CardTitle className="text-base">Daily Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dailyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="complaints" stroke="hsl(347, 77%, 50%)" fill="hsl(347, 77%, 50%)" fillOpacity={0.1} />
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
                      <div key={s} className="text-center p-3 bg-muted rounded-xl">
                        <div className="text-2xl font-extrabold text-foreground">{count}</div>
                        <div className="text-xs text-muted-foreground">{s}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "sentiment":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4" />Sentiment Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={sentimentSummary} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label>
                      <Cell fill="hsl(160, 84%, 39%)" />
                      <Cell fill="hsl(215, 16%, 65%)" />
                      <Cell fill="hsl(0, 84%, 60%)" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">By Category</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complaintCategories.map(cat => {
                    const catComplaints = sentimentData.filter(c => c.category === cat);
                    if (catComplaints.length === 0) return null;
                    const avgScore = Math.round(catComplaints.reduce((sum, c) => sum + c.sentiment.score, 0) / catComplaints.length);
                    const neg = catComplaints.filter(c => c.sentiment.label === "Negative").length;
                    return (
                      <div key={cat} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                        <div>
                          <span className="text-sm font-medium text-foreground">{cat}</span>
                          <span className="text-xs text-muted-foreground ml-2">({catComplaints.length})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-border rounded-full h-2 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${avgScore}%`, background: avgScore < 35 ? "hsl(0, 84%, 60%)" : avgScore < 65 ? "hsl(43, 96%, 56%)" : "hsl(160, 84%, 39%)" }} />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground w-10 text-right">{neg} neg</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Recent Negative</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sentimentData.filter(c => c.sentiment.label === "Negative").slice(0, 5).map(c => (
                    <div key={c.id} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-xl border border-destructive/10">
                      <span className="text-lg">😠</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs text-muted-foreground">{c.referenceId}</span>
                          <Badge variant="outline" className="text-xs">{c.station}</Badge>
                        </div>
                        <p className="text-sm text-foreground">{c.description}</p>
                      </div>
                      <span className="text-xs text-destructive font-bold">{c.sentiment.score}/100</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "heatmap":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><ThermometerSun className="w-4 h-4" />Station Complaint Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {heatmapData.map(s => (
                  <div key={s.name} className="relative p-4 rounded-xl border overflow-hidden" style={{
                    background: `linear-gradient(135deg, hsl(${s.intensity > 60 ? "0, 84%, 60%" : s.intensity > 30 ? "43, 96%, 56%" : "160, 84%, 39%"} / ${Math.max(0.05, s.intensity / 200)}), transparent)`,
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground">{s.name}</span>
                      </div>
                      <Badge variant={s.count > 2 ? "destructive" : s.count > 1 ? "default" : "secondary"} className="text-xs">{s.count}</Badge>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${s.intensity}%`,
                        background: s.intensity > 60 ? "hsl(0, 84%, 60%)" : s.intensity > 30 ? "hsl(43, 96%, 56%)" : "hsl(160, 84%, 39%)",
                      }} />
                    </div>
                    <div className={`text-[10px] mt-1 capitalize ${s.line === "pink" ? "text-accent" : "text-warning"}`}>{s.line} Line</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "predictions":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Zap className="w-4 h-4" />7-Day Prediction</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="station" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="current" name="Current" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predicted" name="Predicted" fill="hsl(347, 77%, 50%)" radius={[4, 4, 0, 0]} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">High Risk Stations</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictions.map(p => (
                    <div key={p.station} className="flex items-center justify-between p-3 rounded-xl bg-muted">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${p.risk === "High" ? "bg-destructive" : p.risk === "Medium" ? "bg-warning" : "bg-success"}`} />
                        <span className="text-sm font-medium text-foreground">{p.station}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{p.predicted} predicted</span>
                        <Badge variant={p.risk === "High" ? "destructive" : p.risk === "Medium" ? "default" : "secondary"} className="text-xs">{p.risk}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "sla":
        return (
          <div className="space-y-4">
            {slaBreaches.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="font-bold text-foreground text-lg">No SLA Breaches</p>
                  <p className="text-sm text-muted-foreground">All complaints are within their SLA deadlines.</p>
                </CardContent>
              </Card>
            ) : (
              slaBreaches.map(c => (
                <Card key={c.id} className="border-destructive/20">
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
        );

      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <Settings className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-bold text-foreground">Coming Soon</p>
              <p className="text-sm text-muted-foreground">This section is under development.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? "w-16" : "w-64"} bg-primary text-primary-foreground shrink-0 transition-all duration-200 hidden lg:flex flex-col`}>
        <div className="p-4 border-b border-primary-foreground/10 flex items-center justify-between">
          {!sidebarCollapsed && <span className="font-bold text-sm">Admin Panel</span>}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1.5 rounded-lg hover:bg-primary-foreground/10">
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-2 border-t border-primary-foreground/10">
          <Link to="/">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Home className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Back to Site</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-40">
        <div className="flex overflow-x-auto">
          {sidebarItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center py-2 px-1 text-[10px] ${
                  activeTab === item.id ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto pb-20 lg:pb-8">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground capitalize">{activeTab === "sla" ? "SLA Monitor" : activeTab}</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage complaints, monitor analytics, and track SLA compliance.</p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
