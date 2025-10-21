"use server";

import { DiscoverMoviesParams } from "@/types/types";
import { buildDiscoverURL } from "../_utils/discoverUtils";

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
        throw err;
    }
}
