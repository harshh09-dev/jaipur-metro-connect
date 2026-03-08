import { useState } from "react";
import { trackComplaint, type Complaint } from "@/data/metro-data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, User, MapPin, AlertTriangle, CheckCircle, CircleDot, Shield } from "lucide-react";

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  "Submitted": { color: "bg-info/10 text-info border-info/20", icon: CircleDot },
  "Under Review": { color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  "In Progress": { color: "bg-secondary/10 text-secondary border-secondary/20", icon: CircleDot },
  "Resolved": { color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  "Closed": { color: "bg-muted text-muted-foreground border-border", icon: CheckCircle },
};

const timelineSteps = ["Submitted", "Under Review", "In Progress", "Resolved"];

export default function TrackComplaintPage() {
  const [refId, setRefId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = () => {
    setError("");
    if (!refId.trim() || !phone.trim()) { setError("Both fields are required."); return; }
    const c = trackComplaint(refId.trim(), phone.trim());
    setResult(c);
    setSearched(true);
  };

  const getStepIndex = (status: string) => {
    const idx = timelineSteps.indexOf(status);
    return idx >= 0 ? idx : status === "Closed" ? 3 : 0;
  };

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-2">
            <Search className="w-4 h-4" />
            Track Status
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Track Your Complaint</h1>
          <p className="text-muted-foreground">Enter your reference ID and phone number to check status.</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Reference ID</label>
              <Input value={refId} onChange={e => setRefId(e.target.value)} placeholder="e.g. JMRC-SAMPLE1" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" maxLength={10} className="h-11" />
            </div>
            {error && <p className="text-destructive text-sm font-medium">{error}</p>}
            <Button onClick={handleTrack} className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Search className="w-4 h-4" /> Track Complaint
            </Button>
          </CardContent>
        </Card>

        {searched && !result && (
          <Card className="mt-6 border-destructive/20 animate-fade-in">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="font-bold text-foreground">No complaint found</p>
              <p className="text-sm text-muted-foreground">Please check your reference ID and phone number.</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="mt-6 space-y-4 animate-fade-in">
            {/* Status Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">{result.referenceId}</p>
                    <h3 className="text-xl font-bold text-foreground mt-1">{result.category} — {result.station}</h3>
                  </div>
                  <Badge className={`text-sm px-4 py-1.5 ${statusConfig[result.status]?.color || ""}`}>
                    {result.status}
                  </Badge>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between mt-6">
                  {timelineSteps.map((stepLabel, i) => {
                    const currentIdx = getStepIndex(result.status);
                    const isCompleted = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                      <div key={stepLabel} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent ? "bg-accent text-accent-foreground ring-4 ring-accent/20" :
                            isCompleted ? "bg-success text-success-foreground" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {isCompleted && !isCurrent ? "✓" : i + 1}
                          </div>
                          <span className={`text-[10px] mt-1.5 font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                            {stepLabel}
                          </span>
                        </div>
                        {i < timelineSteps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${i < currentIdx ? "bg-success" : "bg-border"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="font-bold text-foreground">Complaint Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Filed by</p>
                      <p className="font-medium text-foreground">{result.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Station</p>
                      <p className="font-medium text-foreground">{result.station}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline">{result.category}</Badge>
                  <Badge variant={result.priority === "Critical" ? "destructive" : "secondary"}>{result.priority}</Badge>
                </div>

                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{result.description}</p>

                {result.assignedOfficer && (
                  <div className="flex items-center gap-2 p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                    <Shield className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned Officer</p>
                      <p className="font-medium text-foreground text-sm">{result.assignedOfficer}</p>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1 pt-3 border-t">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Filed: {new Date(result.createdAt).toLocaleString("en-IN")}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated: {new Date(result.updatedAt).toLocaleString("en-IN")}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> SLA Deadline: {new Date(result.slaDeadline).toLocaleString("en-IN")}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
