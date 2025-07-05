import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://jbgvpcimlmrkzjqyjucc.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZ3ZwY2ltbG1ya3pqcXlqdWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjQ3NjQsImV4cCI6MjA2NzIwMDc2NH0.WR6epmAxNgP2pEuwtL3n6M2rHDzcdMmUXJfpdIsn5po"

// Client normal pour le frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client admin pour les API routes et webhooks (server-side only)
export const supabaseAdmin =
  typeof window === "undefined"
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          credits: number
          plan: string
          name: string
        }
        Insert: {
          id: string
          created_at?: string
          credits: number
          plan: string
          name: string
        }
        Update: {
          id?: string
          created_at?: string
          credits?: number
          plan?: string
          name?: string
        }
      }
    }
  }
}
