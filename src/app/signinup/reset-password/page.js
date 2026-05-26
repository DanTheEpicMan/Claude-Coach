import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'


export default async function ResetPasswordPage({ searchParams }) {
    const { code } = await searchParams

    if (!code) {
        redirect('/signinup')
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        redirect('/signinup')
    }

    return (
        <div className="flex flex-col place-items-center gap-8 p-10 gap-y-20">
            <div className="h-48 aspect-[7/4]">
                <h1 className="text-3xl font-bold text-center">Reset Password</h1>
                <label htmlFor="password">New Password</label>
                <input id="password" name="password" type="password" required autoComplete="password" className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-red-700 placeholder:text-red-950 text-red-950 focus:-outline-offset-1 focus:outline-2 focus:outline-red-300 sm:text-sm/6 autofill:shadow-[inset_0_0_0px_1000px_#d1d5db] autofill:text-red-950"/>
                <br/>
                <label htmlFor="password">Confirm New Password</label>
                <input id="password" name="password" type="password" required autoComplete="password" className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-red-700 placeholder:text-red-950 text-red-950 focus:-outline-offset-1 focus:outline-2 focus:outline-red-300 sm:text-sm/6 autofill:shadow-[inset_0_0_0px_1000px_#d1d5db] autofill:text-red-950"/>
                <br/>
                <button
                    className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-600 rounded w-full"
                    formAction={action}>
                    Update Password
                </button>
            </div>
        </div>
    )
}