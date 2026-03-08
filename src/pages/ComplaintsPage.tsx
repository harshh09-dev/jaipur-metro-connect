import { useState } from "react";
import { allStations, complaintCategories, priorities, saveComplaint, type ComplaintCategory, type ComplaintPriority } from "@/data/metro-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

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
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = () => {
    if (!validateStep2()) return;
    const complaint = saveComplaint({
      name, phone, email, station, category: category as ComplaintCategory,
      description, priority: priority as ComplaintPriority,
    });
    setSubmitted(complaint.referenceId);
    setStep(3);
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Complaint Submitted</h1>
          <p className="text-muted-foreground mb-6">Your complaint has been registered successfully.</p>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Your Reference ID</p>
              <p className="text-2xl font-mono font-bold text-primary">{submitted}</p>
              <p className="text-xs text-muted-foreground mt-3">Save this ID to track your complaint status.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="section-header">File a Complaint</h1>
      <p className="text-muted-foreground mb-8 -mt-4">Report an issue or share your feedback with JMRC.</p>

      <div className="max-w-2xl mx-auto">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "Personal Info" : "Complaint Details"}
              </span>
              {s < 2 && <div className={`w-12 h-0.5 ${step > 1 ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              {step === 1 ? "Personal Information" : "Complaint Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number *</label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" maxLength={10} />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email *</label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <Button onClick={handleNext} className="w-full gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Station *</label>
                  <Select value={station} onValueChange={setStation}>
                    <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                    <SelectContent>
                      {allStations.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.station && <p className="text-destructive text-xs mt-1">{errors.station}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category *</label>
                  <Select value={category} onValueChange={v => setCategory(v as ComplaintCategory)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {complaintCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-destructive text-xs mt-1">{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Priority *</label>
                  <Select value={priority} onValueChange={v => setPriority(v as ComplaintPriority)}>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.priority && <p className="text-destructive text-xs mt-1">{errors.priority}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description *</label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue in detail (minimum 10 characters)" rows={4} />
                  {errors.description && <p className="text-destructive text-xs mt-1">{errors.description}</p>}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => { setStep(1); setErrors({}); }} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1 gap-2">
                    Submit Complaint <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
