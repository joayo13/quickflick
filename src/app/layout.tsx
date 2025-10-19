import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
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
            <Analytics />
            <body className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
                <GlobalNav />
                <main className="flex min-h-[100dvh] items-center justify-center font-sans">
                    <Toaster />
                    <section className="relative flex justify-center">{children}</section>
                </main>
            </body>
        </html>
    );
}
