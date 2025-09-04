"use client";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function GlobalNav() {
    const pathname = usePathname();

    async function handleLogout() {
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/auth/login");
    }

    const links = [
        { href: "/", label: "Dashboard" },
        { href: "/watchlist", label: "My Watchlist" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="fixed top-2 left-2 z-30 h-8 w-8" variant="outline">
                    <MenuIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {links.map(({ href, label }) => {
                    const isActive = pathname === href;
                    return (
                        <DropdownMenuItem
                            key={href}
                            disabled={isActive} // prevent clicking
                            asChild={!isActive} // only wrap with Link if not active
                        >
                            <Link href={href}>{label}</Link>
                        </DropdownMenuItem>
                    );
                })}
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
