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
      reports: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          priority: number
          status: string | number
          reporter_id: string
          location: string
          team_leader: string | null
          assigned_to_at: string | null
          completion_images: string[] | null
          completed_at: string | null
          approved_at: string | null
          is_resolved: boolean
          under_investigation_at: string | null
          work_in_progress_at: string | null
          resolved_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          priority: number
          status?: string | number
          reporter_id: string
          location: string
          team_leader?: string | null
          assigned_to_at?: string | null
          completion_images?: string[] | null
          completed_at?: string | null
          approved_at?: string | null
          is_resolved?: boolean
          under_investigation_at?: string | null
          work_in_progress_at?: string | null
          resolved_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          priority?: number
          status?: string | number
          reporter_id?: string
          location?: string
          team_leader?: string | null
          assigned_to_at?: string | null
          completion_images?: string[] | null
          completed_at?: string | null
          approved_at?: string | null
          is_resolved?: boolean
          under_investigation_at?: string | null
          work_in_progress_at?: string | null
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      attachments: {
        Row: {
          id: number
          issue_id: string
          file_url: string
          uploaded_at: string
          name: string
        }
        Insert: {
          id?: number
          issue_id: string
          file_url: string
          uploaded_at?: string
          name: string
        }
        Update: {
          id?: number
          issue_id?: string
          file_url?: string
          uploaded_at?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
