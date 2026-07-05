import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, MessageSquare } from "lucide-react";

interface Complaint { id: string; reference: string; category: string; subject: string; description: string; station: string | null; status: string; admin_response: string | null; created_at: string; updated_at: string; }

const timeline = ["submitted", "under_review", "resolved"];
const statusColors: Record<string, string> = {
  submitted: "bg-info/10 text-info", under_review: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success", rejected: "bg-destructive/10 text-destructive",
};

export default function TrackComplaintPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const initial = params.get("ref") || "";
  const [ref, setRef] = useState(initial);
  const [result, setResult] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const track = async (r: string) => {
    if (!r || !user) return;
    setLoading(true);
    const { data } = await supabase.from("complaints").select("*").eq("reference", r.trim()).eq("user_id", user.id).maybeSingle();
    setResult((data as Complaint) || null);
    setSearched(true);
    setLoading(false);
  };

  useEffect(() => { if (initial) track(initial); /* eslint-disable-next-line */ }, [user]);

  const stepIdx = result ? Math.max(0, timeline.indexOf(result.status)) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Track a complaint</h1>
      <p className="text-muted-foreground mb-6">Look up any complaint you've filed by its reference.</p>
      <Card className="rounded-3xl">
        <CardContent className="p-6 flex gap-3">
          <Input value={ref} onChange={e => setRef(e.target.value)} placeholder="JMRC-XXXXXX" className="rounded-xl h-11" />
          <Button onClick={() => track(ref)} className="rounded-full gap-1.5"><Search className="w-4 h-4" />Track</Button>
        </CardContent>
      </Card>

      {loading && <div className="py-10 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}

      {!loading && searched && !result && (
        <Card className="rounded-3xl mt-6"><CardContent className="p-10 text-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="font-medium">No complaint found</p>
          <p className="text-sm text-muted-foreground">Check the reference or file a new complaint.</p>
        </CardContent></Card>
      )}

      {result && (
        <Card className="rounded-3xl mt-6">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{result.reference}</p>
                <h3 className="text-xl font-bold">{result.subject}</h3>
              </div>
              <Badge className={statusColors[result.status]}>{result.status.replace("_", " ")}</Badge>
            </div>
            <div className="flex items-center justify-between">
              {timeline.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= stepIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                    <span className="text-[10px] mt-1.5 capitalize">{s.replace("_", " ")}</span>
                  </div>
                  {i < timeline.length - 1 && <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${i < stepIdx ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>
            <div className="text-sm space-y-2">
              <p><span className="text-muted-foreground">Category: </span>{result.category}</p>
              {result.station && <p><span className="text-muted-foreground">Station: </span>{result.station}</p>}
              <p className="text-muted-foreground bg-muted p-3 rounded-xl">{result.description}</p>
              {result.admin_response && (
                <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl">
                  <p className="text-xs text-primary font-semibold mb-1">Response from JMRC</p>
                  <p>{result.admin_response}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Filed {new Date(result.created_at).toLocaleString("en-IN")} · Updated {new Date(result.updated_at).toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}