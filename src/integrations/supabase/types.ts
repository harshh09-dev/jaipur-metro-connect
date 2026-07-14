export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      complaints: {
        Row: {
          admin_response: string | null
          assigned_officer: string | null
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          priority: string
          reference: string
          resolution_notes: string | null
          resolved_at: string | null
          sla_deadline: string | null
          station: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          assigned_officer?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          priority?: string
          reference: string
          resolution_notes?: string | null
          resolved_at?: string | null
          sla_deadline?: string | null
          station?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          assigned_officer?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          priority?: string
          reference?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          sla_deadline?: string | null
          station?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          archived_at: string | null
          body: string | null
          category: string
          created_at: string
          cta_href: string | null
          cta_label: string | null
          expires_at: string | null
          id: string
          priority: string
          read_at: string | null
          related_id: string | null
          related_type: string | null
          target_audience: string
          title: string
          user_id: string | null
        }
        Insert: {
          archived_at?: string | null
          body?: string | null
          category?: string
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          expires_at?: string | null
          id?: string
          priority?: string
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          target_audience?: string
          title: string
          user_id?: string | null
        }
        Update: {
          archived_at?: string | null
          body?: string | null
          category?: string
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          expires_at?: string | null
          id?: string
          priority?: string
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          target_audience?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          dob: string | null
          email: string | null
          emergency_contact: string | null
          full_name: string
          gender: string | null
          gov_id: string | null
          id: string
          passenger_id: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          emergency_contact?: string | null
          full_name: string
          gender?: string | null
          gov_id?: string | null
          id: string
          passenger_id: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          emergency_contact?: string | null
          full_name?: string
          gender?: string | null
          gov_id?: string | null
          id?: string
          passenger_id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      smart_cards: {
        Row: {
          balance: number
          card_number: string
          created_at: string
          expiry_date: string
          id: string
          issue_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          card_number: string
          created_at?: string
          expiry_date?: string
          id?: string
          issue_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          card_number?: string
          created_at?: string
          expiry_date?: string
          id?: string
          issue_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          cancelled_at: string | null
          created_at: string
          fare: number
          from_station: string
          id: string
          journey_date: string
          passengers: number
          payment_method: string
          qr_payload: string
          reference: string
          status: string
          ticket_type: string
          to_station: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          fare: number
          from_station: string
          id?: string
          journey_date?: string
          passengers?: number
          payment_method?: string
          qr_payload: string
          reference: string
          status?: string
          ticket_type?: string
          to_station: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          fare?: number
          from_station?: string
          id?: string
          journey_date?: string
          passengers?: number
          payment_method?: string
          qr_payload?: string
          reference?: string
          status?: string
          ticket_type?: string
          to_station?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_ticket: {
        Args: {
          _fare: number
          _from: string
          _journey_date: string
          _passengers?: number
          _ticket_type?: string
          _to: string
        }
        Returns: {
          cancelled_at: string | null
          created_at: string
          fare: number
          from_station: string
          id: string
          journey_date: string
          passengers: number
          payment_method: string
          qr_payload: string
          reference: string
          status: string
          ticket_type: string
          to_station: string
          user_id: string
          valid_until: string | null
        }
        SetofOptions: {
          from: "*"
          to: "tickets"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      cancel_ticket: {
        Args: { _ticket_id: string }
        Returns: {
          cancelled_at: string | null
          created_at: string
          fare: number
          from_station: string
          id: string
          journey_date: string
          passengers: number
          payment_method: string
          qr_payload: string
          reference: string
          status: string
          ticket_type: string
          to_station: string
          user_id: string
          valid_until: string | null
        }
        SetofOptions: {
          from: "*"
          to: "tickets"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      recharge_card: {
        Args: { _amount: number; _method: string }
        Returns: {
          balance: number
          card_number: string
          created_at: string
          expiry_date: string
          id: string
          issue_date: string
          status: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "smart_cards"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "admin" | "passenger"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "passenger"],
    },
  },
} as const
