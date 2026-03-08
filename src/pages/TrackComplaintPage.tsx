import { useState } from "react";
import { trackComplaint } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, User, MapPin, AlertTriangle } from "lucide-react";

const statusColors: Record<string, string> = {
  "Submitted": "bg-info/10 text-info",
  "Under Review": "bg-warning/10 text-warning",
  "In Progress": "bg-accent/10 text-accent",
  "Resolved": "bg-success/10 text-success",
  "Closed": "bg-muted text-muted-foreground",
};

export default function TrackComplaintPage() {
  const [refId, setRefId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<ReturnType<typeof trackComplaint>>(undefined as any);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = () => {
    setError("");
    if (!refId.trim() || !phone.trim()) { setError("Both fields are required."); return; }
    const c = trackComplaint(refId.trim(), phone.trim());
    setResult(c);
    setSearched(true);
  };

  return (
    <div className="page-container">
      <h1 className="section-header">Track Your Complaint</h1>
      <p className="text-muted-foreground mb-8 -mt-4">Enter your reference ID and phone number to check status.</p>

      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Track Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Reference ID</label>
              <Input value={refId} onChange={e => setRefId(e.target.value)} placeholder="e.g. JMRC-SAMPLE1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" maxLength={10} />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button onClick={handleTrack} className="w-full">Track Complaint</Button>
          </CardContent>
        </Card>

        {searched && !result && (
          <Card className="mt-6 border-destructive/20">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="font-semibold text-foreground">No complaint found</p>
              <p className="text-sm text-muted-foreground">Please check your reference ID and phone number.</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="mt-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">{result.referenceId}</span>
                <span className={`metro-badge ${statusColors[result.status] || ""}`}>{result.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{result.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{result.station}</span>
                </div>
              </div>

              <div>
                <Badge variant="outline">{result.category}</Badge>
                <Badge variant="outline" className="ml-2">{result.priority}</Badge>
              </div>

              <p className="text-sm text-muted-foreground">{result.description}</p>

              {result.assignedOfficer && (
                <p className="text-sm"><span className="text-muted-foreground">Assigned to:</span> <span className="font-medium text-foreground">{result.assignedOfficer}</span></p>
              )}

              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Filed: {new Date(result.createdAt).toLocaleString("en-IN")}</div>
                <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated: {new Date(result.updatedAt).toLocaleString("en-IN")}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
