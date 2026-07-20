export type TmdbPosterSize = "w92" | "w185" | "w342" | "w500" | "w780" | "original";

export interface PosterSizeTier {
    low: TmdbPosterSize;
    high: TmdbPosterSize;
}

export function getTmdbPosterUrl(posterPath: string | null | undefined, size: TmdbPosterSize) {
    if (!posterPath) return "";
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

// DiscoverMovieResultCard has no view-transition pairing, so it can size independently.
export const DISCOVER_POSTER_SIZES: PosterSizeTier = { low: "w342", high: "w780" };

// WatchlistItem and the two watchlist thumbnail grids share a React ViewTransition
// `name` per movie so the thumbnail morphs into the detail view on click. If they
// requested different-resolution images the morph would visibly pop from blurry to
// sharp mid-transition, so all three MUST resolve to the exact same URL for a given
// movie + connection state.
export const WATCHLIST_POSTER_SIZES: PosterSizeTier = { low: "w342", high: "w500" };
