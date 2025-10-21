"use server";

export default async function getWatchProviders(movie_id: number) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
    };
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movie_id}/watch/providers`,
            options
        );

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
