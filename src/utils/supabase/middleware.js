import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import {cookies} from "next/headers";

export async function isUserAuth() {
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
    return !!user;
}

export async function updateSession(request) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Supabase validatoin
    const {
        data: { user },
    } = await supabase.auth.getUser()

    //custom routing/protections
    if (
        !user && //not signed in
        !(request.nextUrl.pathname == "/" || request.nextUrl.pathname == "/signinup") //and not main/login page
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/signinup'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}