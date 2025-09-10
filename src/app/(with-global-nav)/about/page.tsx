import React from "react";

export default function About() {
    return (
        <section className="max-w-2xl p-2">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">About QuickFlick</h1>
            <p className="mb-8">
                QuickFlick is meant to get straight to the point, see the poster, synopsis, and
                either swipe left to save it to your watchlist or swipe right to discard it. Add
                filters to find the type of movie you&apos;re looking for, and that&apos;s pretty
                much it!
            </p>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">Film Data</h2>
            <p className="mb-8">
                QuickFlick sources all film-related information from The Movie Database{" "}
                <a className="underline" href="https://www.themoviedb.org/">
                    TMDB
                </a>
                . QuickFlick uses the TMDB API but is neither certified nor endorsed by TMDB. If you
                notice missing titles or inaccurate details, please visit TMDB to make updates.
                You’ll need a TMDB account to contribute. Edits made there should appear in
                QuickFlick within about 30 hours.
            </p>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">Watch Provider Data</h2>
            <p>
                QuickFlick sources Watch Provider Data from{" "}
                <a className="underline" href="https://www.justwatch.com/">
                    JustWatch
                </a>
                . QuickFlick uses Watch Provider data from JustWatch but is neither certified nor
                endorsed by JustWatch.
            </p>
        </section>
    );
}
