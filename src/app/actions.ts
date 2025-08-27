"use server";

import { TMDBDiscoverResponse } from "@/app/types";

function buildDiscoverURL({
    watchProviders,
    genres,
    releaseDateGte,
    releaseDateLte,
    page,
}: {
    watchProviders: string;
    genres: string;
    releaseDateGte: Date;
    releaseDateLte: Date;
    page: number;
}) {
    return `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_date.gte=${releaseDateGte}&primary_release_date.lte=${releaseDateLte}&sort_by=popularity.desc&vote_average.gte=6&vote_count.gte=100&watch_region=CA&with_genres=${genres}&with_original_language=en&with_watch_monetization_types=flatrate|ads|free&with_watch_providers=${watchProviders}`;
}

function assertParams(params: Record<string, unknown>) {
    for (const [key, value] of Object.entries(params)) {
        if (!value) throw new Error(`Parameter "${key}" is missing`);
    }
}

export async function discoverMovies(
    watchProviders: string,
    genres: string,
    releaseDateGte: Date,
    releaseDateLte: Date,
    page: number
) {
    assertParams({ watchProviders, genres, page, releaseDateGte, releaseDateLte });

    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
    };

    try {
        const res = await fetch(
            buildDiscoverURL({ watchProviders, genres, releaseDateGte, releaseDateLte, page }),
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
