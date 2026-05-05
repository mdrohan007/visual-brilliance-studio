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
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string
          id: string
          image_url: string
          sort_order: number
          storage_path: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          storage_path?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          storage_path?: string | null
          title?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bg_about_url: string | null
          bg_contact_url: string | null
          bg_home_url: string | null
          bg_skills_url: string | null
          bg_videos_url: string | null
          bio: string | null
          display_name: string
          email: string | null
          favicon_url: string | null
          footer_text: string | null
          hero_banner_url: string | null
          id: string
          logo_url: string | null
          title: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          bg_about_url?: string | null
          bg_contact_url?: string | null
          bg_home_url?: string | null
          bg_skills_url?: string | null
          bg_videos_url?: string | null
          bio?: string | null
          display_name?: string
          email?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          hero_banner_url?: string | null
          id?: string
          logo_url?: string | null
          title?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          bg_about_url?: string | null
          bg_contact_url?: string | null
          bg_home_url?: string | null
          bg_skills_url?: string | null
          bg_videos_url?: string | null
          bio?: string | null
          display_name?: string
          email?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          hero_banner_url?: string | null
          id?: string
          logo_url?: string | null
          title?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          icon_key: string
          id: string
          name: string
          sort_order: number
          visible: boolean
          years: number
        }
        Insert: {
          icon_key: string
          id?: string
          name: string
          sort_order?: number
          visible?: boolean
          years?: number
        }
        Update: {
          icon_key?: string
          id?: string
          name?: string
          sort_order?: number
          visible?: boolean
          years?: number
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          platform: string
          sort_order: number
          url: string
          visible: boolean
        }
        Insert: {
          id?: string
          platform: string
          sort_order?: number
          url?: string
          visible?: boolean
        }
        Update: {
          id?: string
          platform?: string
          sort_order?: number
          url?: string
          visible?: boolean
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
          role?: Database["public"]["Enums"]["app_role"]
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
      videos: {
        Row: {
          category: Database["public"]["Enums"]["video_category"]
          created_at: string
          id: string
          sort_order: number
          source: Database["public"]["Enums"]["video_source"]
          storage_path: string | null
          thumbnail_url: string | null
          title: string | null
          url: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["video_category"]
          created_at?: string
          id?: string
          sort_order?: number
          source?: Database["public"]["Enums"]["video_source"]
          storage_path?: string | null
          thumbnail_url?: string | null
          title?: string | null
          url: string
        }
        Update: {
          category?: Database["public"]["Enums"]["video_category"]
          created_at?: string
          id?: string
          sort_order?: number
          source?: Database["public"]["Enums"]["video_source"]
          storage_path?: string | null
          thumbnail_url?: string | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      visitor_logs: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          path: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          path?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          path?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      video_category: "premium" | "standard"
      video_source: "file" | "youtube"
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
      app_role: ["admin", "user"],
      video_category: ["premium", "standard"],
      video_source: ["file", "youtube"],
    },
  },
} as const
