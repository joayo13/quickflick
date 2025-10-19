import { DiscoverMoviesParams } from "@/types/types";
import { FormSchema } from "../_schemas/FormSchema";
import z from "zod";

export const deepEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function mapFormToDiscoverParams(
    data: z.infer<typeof FormSchema>,
    page: number,
    watchRegion: string
): DiscoverMoviesParams {
    return {
        watchProviders: data.watchProviders.join("|"),
        includeGenres: data.includeGenres.join("|"),
        excludeGenres: data.excludeGenres.join("|"),
        releaseDateGte: `${data.releaseYear[0]}-01-01`,
        releaseDateLte: `${data.releaseYear[1]}-01-01`,
        voteAverageGte: data.rating[0],
        voteAverageLte: data.rating[1],
        page,
        watchRegion,
    };
}

export function buildDiscoverURL(params: DiscoverMoviesParams) {
    const {
        watchProviders,
        includeGenres,
        excludeGenres,
        releaseDateGte,
        releaseDateLte,
        voteAverageGte,
        voteAverageLte,
        page,
        watchRegion,
    } = params;

    return `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}
    &primary_release_date.gte=${releaseDateGte}&primary_release_date.lte=${releaseDateLte}&sort_by=popularity.desc
    &vote_average.gte=${voteAverageGte}&vote_average.lte=${voteAverageLte}&vote_count.gte=100&watch_region=${watchRegion}&with_genres=${includeGenres}&without_genres=${excludeGenres}
    &with_original_language=en&with_watch_monetization_types=flatrate|ads|free&with_watch_providers=${watchProviders}`;
}
