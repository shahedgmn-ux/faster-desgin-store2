import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null

/** Checks the configured public database endpoint without exposing any secret key. */
export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: 'اطلاعات اتصال وارد نشده است؛ فایل .env را تنظیم کن.' }
  }
  const { error } = await supabase.from('products').select('id').limit(1)
  if (error) {
    return { ok: false, message: `اتصال تنظیم شده، اما بررسی جدول products ناموفق بود: ${error.message}` }
  }
  return { ok: true, message: 'اتصال به Supabase و جدول products برقرار است.' }
}
