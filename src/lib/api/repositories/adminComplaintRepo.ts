import { supabase } from "@/integrations/supabase/client";

export interface AdminComplaintRow {
  id: string;
  user_id: string;
  reference: string;
  category: string;
  subject: string;
  description: string;
  station: string | null;
  status: string;
  priority: string;
  assigned_officer: string | null;
  admin_response: string | null;
  resolution_notes: string | null;
  sla_deadline: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string; email: string | null; phone: string | null } | null;
}

export const adminComplaintRepo = {
  async list(): Promise<AdminComplaintRow[]> {
    const { data, error } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const rows = (data || []) as unknown as AdminComplaintRow[];
    const ids = Array.from(new Set(rows.map((r) => r.user_id)));
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id,full_name,email,phone").in("id", ids);
      const map = new Map<string, { full_name: string; email: string | null; phone: string | null }>();
      (profs || []).forEach((p: { id: string; full_name: string; email: string | null; phone: string | null }) =>
        map.set(p.id, { full_name: p.full_name, email: p.email, phone: p.phone }));
      rows.forEach((r) => { r.profiles = map.get(r.user_id) ?? null; });
    }
    return rows;
  },
  async update(id: string, patch: Partial<AdminComplaintRow>) {
    const payload = { ...patch } as Partial<AdminComplaintRow>;
    if (patch.status === "resolved" && !patch.resolved_at) payload.resolved_at = new Date().toISOString();
    delete payload.profiles;
    const { error } = await supabase.from("complaints").update(payload as never).eq("id", id);
    if (error) throw error;
  },
};