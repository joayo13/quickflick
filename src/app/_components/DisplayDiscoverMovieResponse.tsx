// _components/DiscoverMovieResults.tsx
import DiscoverMovieErrorCard from "./DiscoverMovieErrorCard";
import DiscoverMovieNoResultsCard from "./DiscoverMovieNoResultsCard";
import DiscoverMovieEndOfResultsCard from "./DiscoverMovieEndOfResultsCard";
import DiscoverMovieWelcomeCard from "./DiscoverMovieWelcomeCard";
import DiscoverMovieResultList from "./DiscoverMovieResultList";
import { TMDBDiscoverResponse } from "@/types/types";

interface DisplayDiscoverMovieResponseProps {
    error: Error | null;
    movieData: TMDBDiscoverResponse | null;
    movieStoreHydrated: boolean;
}

export function DisplayDiscoverMovieResponse({
    error,
    movieData,
    movieStoreHydrated,
}: DisplayDiscoverMovieResponseProps) {
    if (error) {
        return <DiscoverMovieErrorCard error={error} />;
    }

    if (movieStoreHydrated && movieData === null) {
        return <DiscoverMovieWelcomeCard />;
    }

    if (movieData?.total_results === 0) {
        return <DiscoverMovieNoResultsCard />;
    }

    if (movieData?.results.length === 0 && movieData.page === movieData.total_pages) {
        return <DiscoverMovieEndOfResultsCard />;
    }

    if (movieData?.results) {
        return <DiscoverMovieResultList />;
    }

    return null;
}
