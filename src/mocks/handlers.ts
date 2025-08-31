// src/mocks/handlers.ts

import { http, HttpResponse } from "msw";

export const handlers = [
    http.get("https://api.themoviedb.org/3/discover/movie", ({ request }) => {
        const url = new URL(request.url);

        const page = Number(url.searchParams.get("page")) || 1;

        if (page > 500 || page < 0) {
            return HttpResponse.json({
                success: false,
                status_code: 22,
                status_message:
                    "Invalid page: Pages start at 1 and max at 500. They are expected to be an integer.",
            });
        }
        return HttpResponse.json({
            page,
            total_pages: 500,
            total_results: 10000,
            results: [
                {
                    id: page * 100,
                    title: `Mock Movie`,
                    original_title: `Original Title`,
                    overview: "This is a mock movie used for testing.",
                    release_date: "2025-01-01",
                    vote_average: 8.2,
                    vote_count: 256,
                    poster_path: "/mock-poster.jpg",
                    backdrop_path: "/mock-backdrop.jpg",
                    genre_ids: ["28", "12"],
                },
            ],
        });
    }),
];
