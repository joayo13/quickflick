"use server";

import { TMDBDiscoverResponse } from "@/app/types";

export async function discoverMovies(watchProviders: string, genres: string, page: number) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
    };

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&vote_average.gte=6&vote_count.gte=100&watch_region=CA&with_genres=${genres}&with_original_language=en&with_watch_monetization_types=flatrate|ads|free&with_watch_providers=${watchProviders}`,
            options
        );

        const data: TMDBDiscoverResponse = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
