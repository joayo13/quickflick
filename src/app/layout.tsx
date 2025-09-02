import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalNav } from "@/components/GlobalNav";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "QuickFlick",
    description: "Quick and simple movie finder.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
                <main className="flex min-h-[100dvh] items-center justify-center font-sans">
                    <section className="relative max-w-3xl">
                        <GlobalNav />
                        {children}
                    </section>
                </main>
            </body>
        </html>
    );
}
