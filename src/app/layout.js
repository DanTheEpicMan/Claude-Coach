import Link from 'next/link'
import './globals.css'

export default function Layout({ children }) {
  return (
      <html lang="en">
      <body className="bg-gray-50 text-slate-900"> {}
      <nav className="bg-red-900 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex space-x-8 font-medium">
              <Link href="/" className="hover:text-black">Home</Link>
              <Link href="/Workout" className="hover:text-black">Workout</Link>
              <Link href="/Debrief" className="hover:text-black">Debrief</Link>
              <Link href="/Diet" className="hover:text-black">Diet</Link>
              <Link href="/Chat" className="hover:text-black">Chat</Link>
              <Link href="/signinup" className="hover:text-black">Account</Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      </body>
      </html>
  )
}
