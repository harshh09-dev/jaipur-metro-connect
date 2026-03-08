import { useState, useMemo } from "react";
import { getComplaints, updateComplaint, statuses, type Complaint, type ComplaintStatus } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { LayoutDashboard, Search, Clock, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const statusColors: Record<string, string> = {
  "Submitted": "bg-info/10 text-info",
  "Under Review": "bg-warning/10 text-warning",
  "In Progress": "bg-accent/10 text-accent",
  "Resolved": "bg-success/10 text-success",
  "Closed": "bg-muted text-muted-foreground",
};

const CHART_COLORS = ["hsl(215, 80%, 35%)", "hsl(350, 60%, 45%)", "hsl(35, 90%, 52%)", "hsl(145, 63%, 40%)", "hsl(200, 80%, 45%)", "hsl(0, 72%, 51%)"];

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

  return (
    <div className="page-container">
      <h1 className="section-header flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6 text-primary" />
        Admin Dashboard
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{complaints.length}</div>
            <div className="text-sm text-muted-foreground">Total Complaints</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-success">{resolutionRate}%</div>
            <div className="text-sm text-muted-foreground">Resolution Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-destructive">{slaBreaches.length}</div>
            <div className="text-sm text-muted-foreground">SLA Breaches</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-warning">{complaints.filter(c => c.status === "Submitted").length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="complaints">
        <TabsList className="mb-6">
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="sla">SLA Monitor</TabsTrigger>
        </TabsList>

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
            {filtered.map(c => (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{c.referenceId}</span>
                        <span className={`metro-badge ${statusColors[c.status]}`}>{c.status}</span>
                        <Badge variant={c.priority === "Critical" ? "destructive" : "outline"} className="text-xs">{c.priority}</Badge>
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
            ))}
          </div>
        </TabsContent>

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

            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Resolution Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
