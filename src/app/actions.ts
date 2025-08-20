"use server";

export async function discoverMovie(watchProviders: string, genres: string) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
    };

    fetch(
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=6&vote_count.gte=50&watch_region=CA&with_genres=${genres}&with_original_language=en&with_watch_monetization_types=flatrate|ads|free&with_watch_providers=${watchProviders}`,
        options
    )
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
}
