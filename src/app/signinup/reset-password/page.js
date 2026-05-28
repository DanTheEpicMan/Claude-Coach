'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from './actions'

export default function ResetPasswordPage({ searchParams }) {
    const router = useRouter()

    const [statusText, setStatusText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        setStatusText("Updating password... Please wait.")

        const formData = new FormData(event.currentTarget)

        try {
            await updatePassword(formData)

            setStatusText("Password updated successfully! Redirecting in 3 seconds...")

            setTimeout(() => {
                router.push('/signinup')
            }, 3000)

        } catch (error) {
            setStatusText("Failed to update password. Please try again.")
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col place-items-center gap-8 p-10 gap-y-20">
            <form onSubmit={handleSubmit} className="h-48 aspect-7/4">
                <h1 className="text-3xl font-bold text-center">Reset Password</h1>

                <label htmlFor="password">New Password</label>
                <input id="password" name="password" type="password" required className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-red-950 sm:text-sm/6"/>
                <br/>

                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-red-950 sm:text-sm/6"/>
                <br/>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-600 rounded w-full disabled:bg-gray-400">
                    {isSubmitting ? "Processing..." : "Update Password"}
                </button>

                {statusText && (
                    <p className="mt-4 text-center font-medium text-red-700 animate-pulse">
                        {statusText}
                    </p>
                )}
            </form>
        </div>
    )
}
