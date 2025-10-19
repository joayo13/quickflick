import { unstable_ViewTransition as ViewTransition } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-[100dvh] w-[100vw] md:h-[750px] md:max-w-2xl">
            <ViewTransition>{children}</ViewTransition>
        </div>
    );
}
