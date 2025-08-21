import DiscoverMovieSection from "@/app/features/DiscoverMovieSection/DiscoverMovieSection";
export default function Home() {
    return (
        <div className="min-h-screen items-center justify-items-center font-sans">
            <main className="flex flex-col items-start">
                <DiscoverMovieSection />
            </main>
        </div>
    );
}
