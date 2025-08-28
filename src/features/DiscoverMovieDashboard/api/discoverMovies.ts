"use server";

import { DiscoverMoviesParams, TMDBDiscoverResponse } from "@/app/types";
import { buildDiscoverURL } from "../utils";

export async function discoverMovies(params: DiscoverMoviesParams) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
    };

    try {
        const res = await fetch(buildDiscoverURL(params), options);

        const data: TMDBDiscoverResponse = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
