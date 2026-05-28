'use client';
import { signup, login, logout, resetPassword, handleAuthAction } from './actions'
import { useState, useEffect } from 'react';


//Meant to be used inside a form
function customButtonRed({ name, action }) {
    return (
    <button
        className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-600 rounded w-full"
        formAction={action}>
        {name}
    </button>
    )
}

//meant to be used inside a form
function PopupForgotPassword({isLogin}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSumbitted, setIsSumbitted] = useState(false);

    useEffect(() => {
        if (isSumbitted) {

            const timer = setTimeout(() => {
                setIsOpen(false);
                setIsSumbitted(false);
            }, 3000)

            return () => clearTimeout(timer);
        }
    }, [isSumbitted])

    if (isLogin) {
        return (
            <div>
                <button
                    type="button" //needed to stop form from auto closing because form
                    onClick={() => setIsOpen(true)}
                    className="hover:text-red-300 text-red-500"
                >
                    Forgot Password?
                </button>

                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl text-black font-bold">Password Reset</h2>
                            <p className="text-black">NOTE: Repeated password resets in a short time will lead to new emails not coming in, if you dont receive an email, try again in 1 hour</p>
                            <p className={"text-black"}>Enter the email for the account for witch you would like the password reset</p>
                            <input id="email" name="email" type="email" required className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-red-700 placeholder:text-red-950 text-red-950 focus:-outline-offset-1 focus:outline-2 focus:outline-red-300 sm:text-sm/6"/>
                            <button
                                formAction={resetPassword}
                                onClick={() => setIsSumbitted(true)}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Send me the reset email
                            </button>
                            {isSumbitted && (
                                <p className="text-green-800">Check your email for the password reset!</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    return (<span style={{display: 'none'}}/>)
}

function EnterForm({ title, lambdaFunction, isLogin }) {
    return (
        <div>
        <h1 className="text-3xl font-bold text-center">{title}</h1>
        <br/>
        <form>
            <div className="">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" required autoComplete="email" className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-red-700 placeholder:text-red-950 text-red-950 focus:-outline-offset-1 focus:outline-2 focus:outline-red-300 sm:text-sm/6 autofill:shadow-[inset_0_0_0px_1000px_#d1d5db] autofill:text-red-950" />
                <br/>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required autoComplete="password" className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-red-700 placeholder:text-red-950 text-red-950 focus:-outline-offset-1 focus:outline-2 focus:outline-red-300 sm:text-sm/6 autofill:shadow-[inset_0_0_0px_1000px_#d1d5db] autofill:text-red-950"/>
                <PopupForgotPassword isLogin={isLogin} />
                <br/>
                <div className="flex justify-center w-full">
                    {customButtonRed({name: title, action: lambdaFunction})}
                </div>
            </div>
        </form>
        </div>
    )
}



export default function SigninupPage() {
    const [user, setUser] = useState("...")

    useEffect(() => {
        async function fetchUser() {
            const userData = await handleAuthAction()
            setUser(userData)
        }
        fetchUser()
    }, [])

    //Shows loading when there is no content in the email
    const getEmailStr = str => {if (!str) {return "..."} return str }

    return (
        <div className="flex flex-col place-items-center">
        <p>Currently signed in as: {getEmailStr(user.email)}</p>
        <div className="flex flex-col place-items-center gap-8 p-10 gap-y-20">
            <div className="h-48 aspect-7/4">
                {EnterForm({title: 'Sign Up', lambdaFunction: signup, isLogin: false})}
            </div>
            <hr/>
            <div className="h-48 aspect-7/4">
                {EnterForm({title: 'Login', lambdaFunction: login, isLogin: true})}
            </div>
            <hr/>
            <div className="h-28 aspect-[3] flex flex-col place-items-center justify-between">
                <h1 className="text-3xl font-bold text-center">Logout</h1>
                {customButtonRed({name: "Logout", action: logout})}
            </div>
        </div>
        </div>
    )
}