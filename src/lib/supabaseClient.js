import { createClient } from '@supabase/supabase-js'

// Récupération sécurisée des variables d'environnement Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("⚠️ Attention : Les variables d'environnement Supabase sont manquantes !")
}

// Export du client Supabase prêt à l'emploi dans toute l'application
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)