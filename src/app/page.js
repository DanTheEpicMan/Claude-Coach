import Link from 'next/link'
import { redirect } from 'next/navigation';
import { isUserAuth } from '../utils/supabase/middleware'

export default async function Home() {
  if (await isUserAuth()) {
    redirect(`/dashboard`)
  }
  return (
    <div>
    <h1>Welcome</h1>

    <p>This is an app designed to track your fitness by utilizing claude as a sort of 2nd brain to track every for you</p>

    <p>This is a 100% free service but it does require you to have your own claude subscription to actually use anything</p>

    <p>Please create an account</p>
    <Link href="/signinup" className="hover:text-black">Make an account</Link>
    </div>
  );
}
