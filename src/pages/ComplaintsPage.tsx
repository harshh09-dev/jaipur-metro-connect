import { useState } from "react";
import { allStations, complaintCategories, priorities, saveComplaint, type ComplaintCategory, type ComplaintPriority } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, ArrowRight, ArrowLeft, User, FileText, Upload, Eye, Shield, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  { num: 1, label: "Personal Info", icon: User },
  { num: 2, label: "Details", icon: FileText },
  { num: 3, label: "Evidence", icon: Upload },
  { num: 4, label: "Review", icon: Eye },
];

const categoryIcons: Record<string, string> = {
  Cleanliness: "🧹",
  Safety: "🛡️",
  "Staff Behavior": "👤",
  "Technical Issue": "⚙️",
  Delay: "⏰",
  Other: "📝",
};

export default function ComplaintsPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [station, setStation] = useState("");
  const [category, setCategory] = useState<ComplaintCategory | "">("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ComplaintPriority | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) e.phone = "Valid 10-digit phone required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!station) e.station = "Select a station";
    if (!category) e.category = "Select a category";
    if (!description.trim() || description.trim().length < 10) e.description = "Minimum 10 characters";
    if (!priority) e.priority = "Select priority";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    setErrors({});
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
    if (step === 3) setStep(4);
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => Math.max(1, s - 1));
  };

  const handleSubmit = () => {
    const complaint = saveComplaint({
      name, phone, email, station, category: category as ComplaintCategory,
      description, priority: priority as ComplaintPriority,
    });
    setSubmitted(complaint.referenceId);
    setStep(5);
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Complaint Submitted!</h1>
          <p className="text-muted-foreground mb-8">Your complaint has been registered successfully.</p>
          <Card className="border-2 border-success/20">
            <CardContent className="p-8">
              <p className="text-sm text-muted-foreground mb-2">Your Reference ID</p>
              <p className="text-3xl font-mono font-extrabold text-accent">{submitted}</p>
              <p className="text-xs text-muted-foreground mt-4">Save this ID to track your complaint status.</p>
            </CardContent>
          </Card>
          <div className="flex gap-3 justify-center mt-6">
            <Link to="/track-complaint">
              <Button variant="outline" className="gap-2">Track Complaint</Button>
            </Link>
            <Link to="/">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-2">
            <Shield className="w-4 h-4" />
            Feedback Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">File a Complaint</h1>
          <p className="text-muted-foreground">Report an issue or share your feedback with JMRC.</p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step >= s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCurrent ? "bg-accent text-accent-foreground ring-4 ring-accent/20" :
                    isActive ? "bg-accent text-accent-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-[-16px] ${step > s.num ? "bg-accent" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6 sm:p-8">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-bold text-lg text-foreground">Personal Information</h3>
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="h-11" />
                  {errors.name && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" maxLength={10} className="h-11" />
                  {errors.phone && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="h-11" />
                  {errors.email && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Complaint Details */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-bold text-lg text-foreground">Complaint Details</h3>
                <div>
                  <label className="block text-sm font-semibold mb-2">Station *</label>
                  <Select value={station} onValueChange={setStation}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select station" /></SelectTrigger>
                    <SelectContent>
                      {allStations.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.station && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.station}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {complaintCategories.map(c => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                          category === c
                            ? "border-accent bg-accent/5 text-accent"
                            : "border-border hover:border-accent/30 text-muted-foreground"
                        }`}
                      >
                        <span className="text-lg block mb-1">{categoryIcons[c]}</span>
                        {c}
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Priority *</label>
                  <Select value={priority} onValueChange={v => setPriority(v as ComplaintPriority)}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.priority && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.priority}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description *</label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue in detail (min 10 characters)" rows={4} />
                  {errors.description && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.description}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Evidence */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-bold text-lg text-foreground">Upload Evidence (Optional)</h3>
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-accent/30 transition-colors">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-semibold text-foreground mb-1">Drop files here or click to upload</p>
                  <p className="text-sm text-muted-foreground">Supports JPG, PNG up to 5MB</p>
                  <Button variant="outline" className="mt-4 gap-2">
                    <Upload className="w-4 h-4" /> Choose Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Evidence helps us investigate faster. You can skip this step if you don't have any.
                </p>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-bold text-lg text-foreground">Review & Submit</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-xl">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Personal Info</div>
                    <p className="font-medium text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground">{phone} • {email}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Complaint</div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{station}</Badge>
                      <Badge variant="outline">{category}</Badge>
                      <Badge variant={priority === "Critical" ? "destructive" : "default"}>{priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={handleNext} className="flex-1 h-11 bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex-1 h-11 bg-success text-success-foreground hover:bg-success/90 gap-2">
                  <CheckCircle className="w-4 h-4" /> Submit Complaint
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
