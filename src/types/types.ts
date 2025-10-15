interface TMDBDiscoverResponse {
    page: number;
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
}

interface TrailerLink {
    key: string;
    id: string;
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

interface WatchlistData {
    id: number;
    movie_id: number;
    movies: TMDBMovie;
    user_id: string;
    watched: boolean;
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
    watchRegion: string;
}
export type { TMDBDiscoverResponse, TMDBMovie, DiscoverMoviesParams, WatchlistData, TrailerLink };
