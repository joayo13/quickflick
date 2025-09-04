import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import WatchlistSection from "@/features/WatchlistSection/WatchlistSection";

export default async function Watchlist() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/login");
    }
    return (
        <>
            <WatchlistSection />
        </>
    );
}
