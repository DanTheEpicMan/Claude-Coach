'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function resetPassword(formData) {
    const supabase = await createClient()

    const headersList = await headers()
    const origin = headersList.get('origin')

    const { error } = await supabase.auth.resetPasswordForEmail(formData.get('email'), {
        redirectTo: `${origin}/signinup/reset-password`,
    })

    console.log(error)
}

export async function signup(formData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/error')
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
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}