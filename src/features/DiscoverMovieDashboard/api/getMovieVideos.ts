"use server";

interface VideoResponse {
    type: string;
}

export async function getMovieVideos(movie_id: number) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
    };

    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos`, options);

        const data = await res.json();

        if (data?.success === false) {
            throw new Error(data.status_message || "Unknown TMDB error");
        }

        if (data.results.length) {
            const firstTrailer = data.results.find((res: VideoResponse) => res.type === "Trailer");
            return firstTrailer;
        } else {
            return undefined;
        }
    } catch (err) {
        throw err;
    }
}
