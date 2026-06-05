import {ThemeProvider} from "next-themes";
import Link from "next/link";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col place-items-center">
            {children}
        </div>
    );
}
