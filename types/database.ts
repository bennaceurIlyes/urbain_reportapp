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
          status: number
          reporter_id: string
          location: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          priority: number
          status?: number
          reporter_id: string
          location: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          priority?: number
          status?: number
          reporter_id?: string
          location?: string
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
