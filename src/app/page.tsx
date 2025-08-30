import DiscoverMovieSection from "@/features/DiscoverMovieDashboard/DiscoverMovieDashboard";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/login");
    }
    return (
        <div className="flex min-h-[100dvh] items-center justify-center font-sans">
            <main>
                <DiscoverMovieSection />
            </main>
        </div>
    );
}
