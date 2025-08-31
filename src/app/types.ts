interface TMDBDiscoverResponse {
    page: number;
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
}

interface TMDBMovie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    poster_path: string | null;
    backdrop_path: string | null;
    genre_ids: string[] | null;
    original_language: string | null;
    // add any other fields you care about
}

interface DiscoverMoviesParams {
    watchProviders: string;
    includeGenres: string;
    excludeGenres: string;
    releaseDateGte: string; //YYYY-MM-DD
    releaseDateLte: string; //YYYY-MM-DD
    voteAverageGte?: number;
    voteAverageLte?: number;
    page: number;
}
export type { TMDBDiscoverResponse, TMDBMovie, DiscoverMoviesParams };
