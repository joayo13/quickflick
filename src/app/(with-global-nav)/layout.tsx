import { GlobalNav } from "@/components/GlobalNav";
import "../globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <GlobalNav />
            {children}
        </>
    );
}
