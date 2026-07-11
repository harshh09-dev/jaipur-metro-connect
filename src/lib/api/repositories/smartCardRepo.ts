import { supabase } from "@/integrations/supabase/client";

export interface SmartCardRow {
  card_number: string;
  balance: number;
  status: string;
  issue_date: string;
  expiry_date: string;
}

export interface TransactionRow {
  id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string | null;
  created_at: string;
}

export const smartCardRepo = {
  async getForUser(userId: string): Promise<SmartCardRow | null> {
    const { data, error } = await supabase
      .from("smart_cards")
      .select("card_number,balance,status,issue_date,expiry_date")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data as SmartCardRow | null;
  },
  async listTransactions(userId: string, limit = 50): Promise<TransactionRow[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as TransactionRow[]) || [];
  },
  async recharge(amount: number, method: string): Promise<SmartCardRow> {
    const { data, error } = await supabase.rpc("recharge_card", { _amount: amount, _method: method });
    if (error) throw error;
    return data as unknown as SmartCardRow;
  },
};