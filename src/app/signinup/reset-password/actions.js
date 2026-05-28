'use server'

import { redirect } from 'next/navigation'
import { createClient } from 'src/utils/supabase/server'

export async function updatePassword(formData) {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: formData.get('password'),
    })

    console.log(error)
    if (error) {
        redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }

    redirect('/signinup')
}