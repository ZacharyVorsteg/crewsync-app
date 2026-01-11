export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          user_id: string | null
          name: string
          phone: string | null
          email: string | null
          address: string | null
          geofence_radius: number
          noshow_alert_minutes: number
          stripe_customer_id: string | null
          subscription_status: string
          subscription_tier: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          geofence_radius?: number
          noshow_alert_minutes?: number
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          geofence_radius?: number
          noshow_alert_minutes?: number
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sites: {
        Row: {
          id: string
          company_id: string | null
          name: string
          address: string
          latitude: number | null
          longitude: number | null
          client_name: string | null
          client_email: string | null
          client_phone: string | null
          budget_hours: number | null
          service_frequency: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          name: string
          address: string
          latitude?: number | null
          longitude?: number | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          budget_hours?: number | null
          service_frequency?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          name?: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          budget_hours?: number | null
          service_frequency?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      site_checklists: {
        Row: {
          id: string
          site_id: string | null
          task: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          site_id?: string | null
          task: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          site_id?: string | null
          task?: string
          sort_order?: number
          created_at?: string
        }
      }
      crew_members: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
          name: string
          phone: string | null
          email: string | null
          language: string
          hourly_rate: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          name: string
          phone?: string | null
          email?: string | null
          language?: string
          hourly_rate?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          name?: string
          phone?: string | null
          email?: string | null
          language?: string
          hourly_rate?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          company_id: string | null
          site_id: string | null
          crew_member_id: string | null
          scheduled_date: string
          start_time: string
          end_time: string
          is_recurring: boolean
          recurrence_rule: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          site_id?: string | null
          crew_member_id?: string | null
          scheduled_date: string
          start_time: string
          end_time: string
          is_recurring?: boolean
          recurrence_rule?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          site_id?: string | null
          crew_member_id?: string | null
          scheduled_date?: string
          start_time?: string
          end_time?: string
          is_recurring?: boolean
          recurrence_rule?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      time_entries: {
        Row: {
          id: string
          company_id: string | null
          schedule_id: string | null
          crew_member_id: string | null
          site_id: string | null
          clock_in: string | null
          clock_in_latitude: number | null
          clock_in_longitude: number | null
          clock_in_verified: boolean | null
          clock_out: string | null
          clock_out_latitude: number | null
          clock_out_longitude: number | null
          clock_out_verified: boolean | null
          total_hours: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          schedule_id?: string | null
          crew_member_id?: string | null
          site_id?: string | null
          clock_in?: string | null
          clock_in_latitude?: number | null
          clock_in_longitude?: number | null
          clock_in_verified?: boolean | null
          clock_out?: string | null
          clock_out_latitude?: number | null
          clock_out_longitude?: number | null
          clock_out_verified?: boolean | null
          total_hours?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          schedule_id?: string | null
          crew_member_id?: string | null
          site_id?: string | null
          clock_in?: string | null
          clock_in_latitude?: number | null
          clock_in_longitude?: number | null
          clock_in_verified?: boolean | null
          clock_out?: string | null
          clock_out_latitude?: number | null
          clock_out_longitude?: number | null
          clock_out_verified?: boolean | null
          total_hours?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      checklist_completions: {
        Row: {
          id: string
          time_entry_id: string | null
          checklist_item_id: string | null
          completed_at: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          time_entry_id?: string | null
          checklist_item_id?: string | null
          completed_at?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          time_entry_id?: string | null
          checklist_item_id?: string | null
          completed_at?: string | null
          photo_url?: string | null
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          company_id: string | null
          type: string | null
          schedule_id: string | null
          crew_member_id: string | null
          site_id: string | null
          message: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          type?: string | null
          schedule_id?: string | null
          crew_member_id?: string | null
          site_id?: string | null
          message?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          type?: string | null
          schedule_id?: string | null
          crew_member_id?: string | null
          site_id?: string | null
          message?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      inspection_reports: {
        Row: {
          id: string
          site_id: string | null
          time_entry_id: string | null
          rating: number | null
          notes: string | null
          photos: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          site_id?: string | null
          time_entry_id?: string | null
          rating?: number | null
          notes?: string | null
          photos?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          site_id?: string | null
          time_entry_id?: string | null
          rating?: number | null
          notes?: string | null
          photos?: string[] | null
          created_at?: string
        }
      }
      client_portal_access: {
        Row: {
          id: string
          site_id: string | null
          access_token: string
          client_email: string | null
          is_active: boolean
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          site_id?: string | null
          access_token: string
          client_email?: string | null
          is_active?: boolean
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          site_id?: string | null
          access_token?: string
          client_email?: string | null
          is_active?: boolean
          created_at?: string
          expires_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          company_id: string | null
          site_id: string | null
          sender_type: string
          sender_name: string | null
          sender_email: string | null
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          site_id?: string | null
          sender_type: string
          sender_name?: string | null
          sender_email?: string | null
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          site_id?: string | null
          sender_type?: string
          sender_name?: string | null
          sender_email?: string | null
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: {
          lat1: number
          lon1: number
          lat2: number
          lon2: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Company = Database['public']['Tables']['companies']['Row']
export type Site = Database['public']['Tables']['sites']['Row']
export type SiteChecklist = Database['public']['Tables']['site_checklists']['Row']
export type CrewMember = Database['public']['Tables']['crew_members']['Row']
export type Schedule = Database['public']['Tables']['schedules']['Row']
export type TimeEntry = Database['public']['Tables']['time_entries']['Row']
export type ChecklistCompletion = Database['public']['Tables']['checklist_completions']['Row']
export type Alert = Database['public']['Tables']['alerts']['Row']
export type InspectionReport = Database['public']['Tables']['inspection_reports']['Row']
export type ClientPortalAccess = Database['public']['Tables']['client_portal_access']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

// Extended types with relations
export interface ScheduleWithRelations extends Schedule {
  site?: Site
  crew_member?: CrewMember
}

export interface TimeEntryWithRelations extends TimeEntry {
  schedule?: Schedule
  crew_member?: CrewMember
  site?: Site
}

export interface AlertWithRelations extends Alert {
  schedule?: Schedule
  crew_member?: CrewMember
  site?: Site
}
