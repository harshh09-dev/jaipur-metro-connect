import { supabase } from "@/integrations/supabase/client";

export interface ComplaintRow {
  id: string;
  reference: string;
  category: string;
  subject: string;
  description: string;
  station: string | null;
  status: string;
  admin_response: string | null;
  created_at: string;
}

export interface NewComplaint {
  category: string;
  subject: string;
  description: string;
  station?: string | null;
}

export const complaintRepo = {
  async listForUser(userId: string): Promise<ComplaintRow[]> {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ComplaintRow[]) || [];
  },
  async create(userId: string, input: NewComplaint): Promise<string> {
    const reference = "JMRC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const { error } = await supabase.from("complaints").insert({
      user_id: userId,
      reference,
      category: input.category,
      subject: input.subject,
      description: input.description,
      station: input.station || null,
    });
    if (error) throw error;
    return reference;
  },
};