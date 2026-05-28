import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import {NextResponse} from "next/server";

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {

          }
        },
      },
    }
  )
}

export async function getUser() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return user;
}

export async function isUserAuth() {
  let user = await getUser();
  return !!user;
}