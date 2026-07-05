import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { profile, refreshProfile, user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (profile) setForm(profile); }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name, phone: form.phone, address: form.address,
      city: form.city, state: form.state, pincode: form.pincode, emergency_contact: form.emergency_contact,
    }).eq("id", user!.id);
    setSaving(false);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    toast({ title: "Profile updated" });
    refreshProfile();
  };

  if (!profile) return null;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-1">Profile</h1>
      <p className="text-muted-foreground mb-6">Passenger ID · {profile.passenger_id}</p>
      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5"><Label>Full name</Label><Input value={form.full_name || ""} onChange={e => setForm({ ...form, full_name: e.target.value })} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>Emergency contact</Label><Input value={form.emergency_contact || ""} onChange={e => setForm({ ...form, emergency_contact: e.target.value })} className="h-11 rounded-xl" /></div>
            <div className="col-span-2 space-y-1.5"><Label>Address</Label><Input value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>City</Label><Input value={form.city || ""} onChange={e => setForm({ ...form, city: e.target.value })} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>State</Label><Input value={form.state || ""} onChange={e => setForm({ ...form, state: e.target.value })} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>PIN</Label><Input value={form.pincode || ""} onChange={e => setForm({ ...form, pincode: e.target.value })} className="h-11 rounded-xl" /></div>
            <div className="col-span-2 flex justify-end"><Button type="submit" disabled={saving} className="rounded-full">{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Save changes</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}