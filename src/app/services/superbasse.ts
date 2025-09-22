import { createClient } from "@supabase/supabase-js"
const supabaseUrl = process.env.EXPO_BASE_URL as string
const supabaseAnonKey = process.env.EXPO_ANON_KEY as string

export const supaabase = createClient(supabaseUrl, supabaseAnonKey)