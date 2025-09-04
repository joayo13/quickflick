import { unstable_ViewTransition as ViewTransition } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid h-[100dvh] w-[100vw] place-items-start md:h-[750px] md:w-[500px]">
            <ViewTransition>{children}</ViewTransition>
        </div>
    );
}
