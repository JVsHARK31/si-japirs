import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)

// Sign in with Google via Supabase
export async function signInWithGoogle() {
  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

// Sign in with Discord via Supabase
export async function signInWithDiscord() {
  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'identify email',
    },
  })

  if (error) {
    throw error
  }

  return data
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, metadata?: any) {
  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })

  if (error) {
    throw error
  }

  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabaseAuth.auth.signOut()
  if (error) {
    throw error
  }
}

// Get current user session
export async function getSession() {
  const { data: { session }, error } = await supabaseAuth.auth.getSession()
  
  if (error) {
    throw error
  }

  return session
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabaseAuth.auth.getUser()
  
  if (error) {
    throw error
  }

  return user
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: any, session: any) => void) {
  return supabaseAuth.auth.onAuthStateChange(callback)
}
