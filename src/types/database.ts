export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin';
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
export type BlogPostStatus = 'draft' | 'published' | 'archived';
export type CommentStatus = 'pending' | 'approved' | 'spam' | 'deleted';
export type AnnouncementType = 'info' | 'warning' | 'success' | 'error' | 'maintenance';
export type AnnouncementTarget = 'all' | 'free' | 'pro' | 'enterprise' | 'admin';
export type AnnouncementLocation = 'banner' | 'modal' | 'toast' | 'dashboard';
export type AIUsageStatus = 'success' | 'error' | 'rate_limited';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: SubscriptionTier
          stripe_customer_id: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: SubscriptionTier
          stripe_customer_id?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: SubscriptionTier
          stripe_customer_id?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          status: SubscriptionStatus
          plan_id: string
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          status: SubscriptionStatus
          plan_id: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          status?: SubscriptionStatus
          plan_id?: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          category: string
          icon: string | null
          is_premium: boolean
          is_active: boolean
          usage_limit_free: number
          usage_limit_pro: number
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          category: string
          icon?: string | null
          is_premium?: boolean
          is_active?: boolean
          usage_limit_free?: number
          usage_limit_pro?: number
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          category?: string
          icon?: string | null
          is_premium?: boolean
          is_active?: boolean
          usage_limit_free?: number
          usage_limit_pro?: number
          metadata?: Json | null
          created_at?: string
        }
      }
      tool_usage: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          action: string | null
          input_data: Json | null
          output_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: string
          action?: string | null
          input_data?: Json | null
          output_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string
          action?: string | null
          input_data?: Json | null
          output_data?: Json | null
          created_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string
          created_at?: string
        }
      }
      template_categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          category_id: string | null
          file_url: string | null
          preview_url: string | null
          file_format: string
          file_size: number | null
          is_premium: boolean
          is_active: boolean
          download_count: number
          tags: string[] | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          category_id?: string | null
          file_url?: string | null
          preview_url?: string | null
          file_format: string
          file_size?: number | null
          is_premium?: boolean
          is_active?: boolean
          download_count?: number
          tags?: string[] | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          category_id?: string | null
          file_url?: string | null
          preview_url?: string | null
          file_format?: string
          file_size?: number | null
          is_premium?: boolean
          is_active?: boolean
          download_count?: number
          tags?: string[] | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      template_downloads: {
        Row: {
          id: string
          template_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          template_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      ai_tools: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          features: string[] | null
          is_premium: boolean
          is_active: boolean
          daily_limit_free: number
          daily_limit_pro: number
          monthly_limit_enterprise: number | null
          model_provider: string
          model_name: string | null
          system_prompt: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          features?: string[] | null
          is_premium?: boolean
          is_active?: boolean
          daily_limit_free?: number
          daily_limit_pro?: number
          monthly_limit_enterprise?: number | null
          model_provider?: string
          model_name?: string | null
          system_prompt?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          features?: string[] | null
          is_premium?: boolean
          is_active?: boolean
          daily_limit_free?: number
          daily_limit_pro?: number
          monthly_limit_enterprise?: number | null
          model_provider?: string
          model_name?: string | null
          system_prompt?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_tool_usage: {
        Row: {
          id: string
          ai_tool_id: string
          user_id: string | null
          input_tokens: number | null
          output_tokens: number | null
          total_tokens: number | null
          processing_time_ms: number | null
          status: AIUsageStatus
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ai_tool_id: string
          user_id?: string | null
          input_tokens?: number | null
          output_tokens?: number | null
          total_tokens?: number | null
          processing_time_ms?: number | null
          status: AIUsageStatus
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ai_tool_id?: string
          user_id?: string | null
          input_tokens?: number | null
          output_tokens?: number | null
          total_tokens?: number | null
          processing_time_ms?: number | null
          status?: AIUsageStatus
          error_message?: string | null
          created_at?: string
        }
      }
      user_ai_limits: {
        Row: {
          id: string
          user_id: string
          ai_tool_id: string
          usage_date: string
          usage_count: number
        }
        Insert: {
          id?: string
          user_id: string
          ai_tool_id: string
          usage_date: string
          usage_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          ai_tool_id?: string
          usage_date?: string
          usage_count?: number
        }
      }
      blog_categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string | null
          featured_image: string | null
          category_id: string | null
          author_id: string | null
          status: BlogPostStatus
          is_featured: boolean
          published_at: string | null
          view_count: number
          reading_time_minutes: number | null
          tags: string[] | null
          seo_title: string | null
          seo_description: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string | null
          content?: string | null
          featured_image?: string | null
          category_id?: string | null
          author_id?: string | null
          status?: BlogPostStatus
          is_featured?: boolean
          published_at?: string | null
          view_count?: number
          reading_time_minutes?: number | null
          tags?: string[] | null
          seo_title?: string | null
          seo_description?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string | null
          content?: string | null
          featured_image?: string | null
          category_id?: string | null
          author_id?: string | null
          status?: BlogPostStatus
          is_featured?: boolean
          published_at?: string | null
          view_count?: number
          reading_time_minutes?: number | null
          tags?: string[] | null
          seo_title?: string | null
          seo_description?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string | null
          parent_id: string | null
          content: string
          status: CommentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id?: string | null
          parent_id?: string | null
          content: string
          status?: CommentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string | null
          parent_id?: string | null
          content?: string
          status?: CommentStatus
          created_at?: string
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          type: AnnouncementType
          target_audience: AnnouncementTarget
          is_active: boolean
          is_dismissible: boolean
          display_location: AnnouncementLocation
          start_date: string
          end_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type?: AnnouncementType
          target_audience?: AnnouncementTarget
          is_active?: boolean
          is_dismissible?: boolean
          display_location?: AnnouncementLocation
          start_date?: string
          end_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: AnnouncementType
          target_audience?: AnnouncementTarget
          is_active?: boolean
          is_dismissible?: boolean
          display_location?: AnnouncementLocation
          start_date?: string
          end_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_dismissed_announcements: {
        Row: {
          id: string
          user_id: string
          announcement_id: string
          dismissed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          announcement_id: string
          dismissed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          announcement_id?: string
          dismissed_at?: string
        }
      }
      admin_activity_log: {
        Row: {
          id: string
          admin_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      daily_analytics: {
        Row: {
          id: string
          date: string
          total_users: number
          new_users: number
          active_users: number
          total_tool_uses: number
          total_ai_tool_uses: number
          total_template_downloads: number
          total_blog_views: number
          revenue_amount: number
          new_subscriptions: number
          canceled_subscriptions: number
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          total_users?: number
          new_users?: number
          active_users?: number
          total_tool_uses?: number
          total_ai_tool_uses?: number
          total_template_downloads?: number
          total_blog_views?: number
          revenue_amount?: number
          new_subscriptions?: number
          canceled_subscriptions?: number
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          total_users?: number
          new_users?: number
          active_users?: number
          total_tool_uses?: number
          total_ai_tool_uses?: number
          total_template_downloads?: number
          total_blog_views?: number
          revenue_amount?: number
          new_subscriptions?: number
          canceled_subscriptions?: number
          metadata?: Json | null
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_moderator_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      increment_blog_views: {
        Args: { post_slug: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Tool = Database['public']['Tables']['tools']['Row'];
export type ToolUsage = Database['public']['Tables']['tool_usage']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type UserFavorite = Database['public']['Tables']['user_favorites']['Row'];
export type TemplateCategory = Database['public']['Tables']['template_categories']['Row'];
export type Template = Database['public']['Tables']['templates']['Row'];
export type TemplateDownload = Database['public']['Tables']['template_downloads']['Row'];
export type AIToolDB = Database['public']['Tables']['ai_tools']['Row'];
export type AIToolUsage = Database['public']['Tables']['ai_tool_usage']['Row'];
export type UserAILimit = Database['public']['Tables']['user_ai_limits']['Row'];
export type BlogCategory = Database['public']['Tables']['blog_categories']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogComment = Database['public']['Tables']['blog_comments']['Row'];
export type Announcement = Database['public']['Tables']['announcements']['Row'];
export type AdminActivityLog = Database['public']['Tables']['admin_activity_log']['Row'];
export type DailyAnalytics = Database['public']['Tables']['daily_analytics']['Row'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
