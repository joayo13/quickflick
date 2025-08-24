import DiscoverMovieSection from "@/app/features/DiscoverMovieSection/DiscoverMovieSection";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/login");
    }
    return (
        <div className="min-h-screen items-center justify-items-center font-sans">
            <main className="flex flex-col items-start">
                <DiscoverMovieSection />
            </main>
        </div>
    );
}
