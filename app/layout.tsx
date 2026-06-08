import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Link from "next/link";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/*Navbar*/}
          <nav>
            <div className="mx-auto sm:px-6 lg:px-8*">
              <div className="flex justify-between h-16 items-center">
                <div className="flex space-x-8 font-medium">
                  <Link href="/" className="hover:text-gray-500">Home</Link>
                  <Link href="/workout" className="hover:text-gray-500">Workout</Link>
                  <Link href="/debrief" className="hover:text-gray-500">Debrief</Link>
                  <Link href="/diet" className="hover:text-gray-500">Diet</Link>
                  <Link href="/chat" className="hover:text-gray-500">Chat</Link>
                  <Link href="/account" className="hover:text-gray-500">Account</Link>
                </div>
              </div>
            </div>
          </nav>
          {/*rest of the page*/}
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
