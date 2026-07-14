import { supabase } from "@/integrations/supabase/client";

export interface NotificationRow {
  id: string;
  user_id: string | null;
  title: string;
  body: string | null;
  category: string;
  priority: string;
  cta_label: string | null;
  cta_href: string | null;
  related_type: string | null;
  related_id: string | null;
  target_audience: string;
  read_at: string | null;
  archived_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export const notificationRepo = {
  async list(userId: string): Promise<NotificationRow[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .or(`user_id.eq.${userId},and(user_id.is.null,target_audience.in.(all,passengers))`)
      .is("archived_at", null)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return (data as NotificationRow[]) || [];
  },
  async markRead(ids: string[]) {
    if (!ids.length) return;
    const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).in("id", ids);
    if (error) throw error;
  },
  async markAllRead(userId: string) {
    const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() })
      .eq("user_id", userId).is("read_at", null);
    if (error) throw error;
  },
  async archive(id: string) {
    const { error } = await supabase.from("notifications").update({ archived_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },
  async remove(id: string) {
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) throw error;
  },
};