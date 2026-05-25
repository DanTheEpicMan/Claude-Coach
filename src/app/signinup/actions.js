'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

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