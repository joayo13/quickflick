import DiscoverMovieSection from "@/components/DiscoverMovieSection";
export default function Home() {
    return (
        <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 items-start">
                <h1>QuickFlick</h1>
                <h2>TODO: Remember to attribute to tmdb and JustWatch</h2>
                <DiscoverMovieSection />
            </main>
        </div>
    );
}
