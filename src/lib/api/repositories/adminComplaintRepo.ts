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
    const { data, error } = await supabase
      .from("complaints")
      .select("*, profiles:profiles!complaints_user_id_fkey(full_name,email,phone)")
      .order("created_at", { ascending: false });
    if (error) {
      // fallback without join if FK missing in relationship graph
      const { data: d2, error: e2 } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
      if (e2) throw e2;
      return (d2 as AdminComplaintRow[]) || [];
    }
    return (data as AdminComplaintRow[]) || [];
  },
  async update(id: string, patch: Partial<AdminComplaintRow>) {
    const payload: Record<string, unknown> = { ...patch };
    if (patch.status === "resolved" && !patch.resolved_at) payload.resolved_at = new Date().toISOString();
    const { error } = await supabase.from("complaints").update(payload).eq("id", id);
    if (error) throw error;
  },
};