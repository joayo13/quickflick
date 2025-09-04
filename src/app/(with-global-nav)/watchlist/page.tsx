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
        <div className="mt-16 grid h-full w-full grid-cols-[repeat(auto-fill,minmax(100px,100px))] justify-center gap-1 p-1">
            <WatchlistSection />
        </div>
    );
}
