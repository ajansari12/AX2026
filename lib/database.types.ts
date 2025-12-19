export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
export type LeadSource = 'contact_form' | 'exit_modal' | 'resource_download' | 'pricing_page' | 'ai_chat';
export type BlogPostStatus = 'draft' | 'published';
export type BlogCategory = 'Strategy' | 'Automation' | 'AI' | 'Design' | 'Growth';
export type BookingStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type ChatRole = 'user' | 'assistant';

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          service_interest: string | null;
          message: string | null;
          source: LeadSource;
          status: LeadStatus;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          service_interest?: string | null;
          message?: string | null;
          source: LeadSource;
          status?: LeadStatus;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          service_interest?: string | null;
          message?: string | null;
          source?: LeadSource;
          status?: LeadStatus;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string;
          subscribed_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          source: string;
          subscribed_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string;
          subscribed_at?: string;
          is_active?: boolean;
        };
      };
      teardown_requests: {
        Row: {
          id: string;
          email: string;
          website_url: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          website_url: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          website_url?: string;
          status?: string;
          created_at?: string;
        };
      };
      resource_downloads: {
        Row: {
          id: string;
          email: string;
          resource_name: string;
          downloaded_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          resource_name: string;
          downloaded_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          resource_name?: string;
          downloaded_at?: string;
        };
      };
      authors: {
        Row: {
          id: string;
          name: string;
          role: string;
          avatar_url: string;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          avatar_url: string;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          avatar_url?: string;
          bio?: string | null;
          created_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          category: BlogCategory;
          read_time: string;
          published_date: string;
          image_url: string;
          author_id: string;
          featured: boolean;
          status: BlogPostStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          category: BlogCategory;
          read_time: string;
          published_date: string;
          image_url: string;
          author_id: string;
          featured?: boolean;
          status?: BlogPostStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          category?: BlogCategory;
          read_time?: string;
          published_date?: string;
          image_url?: string;
          author_id?: string;
          featured?: boolean;
          status?: BlogPostStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          cal_booking_id: string | null;
          name: string;
          email: string;
          scheduled_time: string;
          status: BookingStatus;
          notes: string | null;
          lead_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cal_booking_id?: string | null;
          name: string;
          email: string;
          scheduled_time: string;
          status?: BookingStatus;
          notes?: string | null;
          lead_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          cal_booking_id?: string | null;
          name?: string;
          email?: string;
          scheduled_time?: string;
          status?: BookingStatus;
          notes?: string | null;
          lead_id?: string | null;
          created_at?: string;
        };
      };
      chat_conversations: {
        Row: {
          id: string;
          visitor_id: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          visitor_id: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          visitor_id?: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: ChatRole;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: ChatRole;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: ChatRole;
          content?: string;
          created_at?: string;
        };
      };
    };
  };
}
