import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Faltam as variaveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. Confira o arquivo .env'
  )
}

export const supabase = createClient(url, anonKey)
