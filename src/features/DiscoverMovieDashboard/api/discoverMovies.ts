"use server";

import { DiscoverMoviesParams } from "@/app/types";
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

        const data = await res.json();

        if (data?.success === false) {
            throw new Error(data.status_message || "Unknown TMDB error");
        }

        console.log(data);

        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
