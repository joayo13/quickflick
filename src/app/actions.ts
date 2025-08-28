"use server";

import { TMDBDiscoverResponse } from "@/app/types";

function buildDiscoverURL({
    watchProviders,
    includeGenres,
    excludeGenres,
    releaseDateGte,
    releaseDateLte,
    voteAverageGte,
    voteAverageLte,
    page,
}: {
    watchProviders: string;
    includeGenres: string;
    excludeGenres: string;
    releaseDateGte: Date;
    releaseDateLte: Date;
    voteAverageGte: number;
    voteAverageLte: number;
    page: number;
}) {
    return `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}
    &primary_release_date.gte=${releaseDateGte}&primary_release_date.lte=${releaseDateLte}&sort_by=popularity.desc
    &vote_average.gte=${voteAverageGte}&vote_average.lte=${voteAverageLte}&vote_count.gte=100&watch_region=CA&with_genres=${includeGenres}&without_genres=${excludeGenres}
    &with_original_language=en&with_watch_monetization_types=flatrate|ads|free&with_watch_providers=${watchProviders}`;
}

function assertParams(params: Record<string, unknown>) {
    for (const [key, value] of Object.entries(params)) {
        if (!value) throw new Error(`Parameter "${key}" is missing`);
    }
}

export async function discoverMovies(
    watchProviders: string,
    includeGenres: string,
    excludeGenres: string,
    releaseDateGte: Date,
    releaseDateLte: Date,
    voteAverageGte: number,
    voteAverageLte: number,
    page: number
) {
    assertParams({
        watchProviders,
        includeGenres,
        page,
        releaseDateGte,
        releaseDateLte,
    });

    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
    };

    try {
        const res = await fetch(
            buildDiscoverURL({
                watchProviders,
                includeGenres,
                excludeGenres,
                releaseDateGte,
                releaseDateLte,
                voteAverageGte,
                voteAverageLte,
                page,
            }),
            options
        );

        const data: TMDBDiscoverResponse = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
