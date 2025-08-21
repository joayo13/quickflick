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
    // add any other fields you care about
}

export type { TMDBDiscoverResponse, TMDBMovie };
