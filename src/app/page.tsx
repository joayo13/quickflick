import DiscoverMovieSection from "@/app/features/DiscoverMovieSection/DiscoverMovieSection";
export default function Home() {
    return (
        <div className="min-h-screen items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
            <main className="flex flex-col items-start gap-8">
                <h1>QuickFlick</h1>
                <h2>TODO: Remember to attribute to tmdb and JustWatch</h2>
                <DiscoverMovieSection />
            </main>
        </div>
    );
}
