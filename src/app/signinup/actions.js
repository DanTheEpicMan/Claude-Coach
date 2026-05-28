'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { getUser } from '@/utils/supabase/server'

//TODO: configure the exact allowed redirect URL in your Supabase project's Auth → URL Configuration → Redirect URLs whitelist as a second layer of defense.

export async function handleAuthAction() {
    return await getUser()
}

export async function resetPassword(formData) {
    const supabase = await createClient()

    const headersList = await headers()
    const origin = headersList.get('origin')
    //TODO: make this not commented out in prod
    // const origin = process.env.NEXT_PUBLIC_SITE_URL

    const { error } = await supabase.auth.resetPasswordForEmail(formData.get('email'), {
        redirectTo: `${origin}/signinup/reset-password`,
    })

    if (error) {
        redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
}

export async function signup(formData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }

    revalidatePath('/', 'layout') //re-renders
    redirect('/')
}

export async function login(formData) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (error) {
        redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function logout() {
    console.log("Logging Out")
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}