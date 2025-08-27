import { afterEach, describe, expect, it, vi } from "vitest";
import { discoverMovies } from "../src/app/actions";
import { TMDBDiscoverResponse, TMDBMovie } from "@/app/types";

function createMockMovie(overrides?: Partial<TMDBMovie>): TMDBMovie {
    return {
        id: 1,
        title: "Default Movie",
        original_title: "Default Movie Original",
        overview: "Some overview",
        release_date: "2025-08-26",
        vote_average: 0,
        vote_count: 0,
        poster_path: null,
        backdrop_path: null,
        genre_ids: ["8"],
        ...overrides,
    };
}

describe("discoverMovies api", () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it("returns a promise response with constructed url if data provided", async () => {
        // Mock the API response you expect
        const mockResponse: TMDBDiscoverResponse = {
            page: 1,
            total_pages: 1,
            total_results: 1,
            results: [createMockMovie()],
        };

        global.fetch = vi.fn(
            () =>
                Promise.resolve({ json: () => Promise.resolve(mockResponse) }) as Promise<Response>
        );

        const res = await discoverMovies(
            "8",
            "8",
            new Date("2024-01-01"),
            new Date("2025-01-01"),
            6
        );

        // Verify output is transformed correctly
        expect(res.results).toEqual(mockResponse.results);

        // Verify URL was constructed properly
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("genres=8"), expect.any(Object));
    });

    it("rejects a promise if no data provided", async () => {
        // If discoverMovies throws an error when called with invalid args:
        await expect(discoverMovies("", "", new Date(), new Date(), 1)).rejects.toThrow();
    });
});
