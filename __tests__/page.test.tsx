import { render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import DiscoverMovieDashboard from "../src/features/DiscoverMovieDashboard/DiscoverMovieDashboard";
import * as api from "../src/features/DiscoverMovieDashboard/api/discoverMovies";

const baseURL = "https://api.themoviedb.org/3/discover/movie";

export async function fetchMovies(url: string) {
    const res = await fetch(url);
    const data = await res.json();
    if (data?.success === false) {
        throw new Error(data.status_message);
    }
    return data;
}

// unit tests

describe("Discover movies API", () => {
    it("returns correct data for a valid page", async () => {
        const data = await fetchMovies(`${baseURL}?page=1`);
        expect(data.page).toBe(1);
        expect(data.results).toHaveLength(1);
        expect(data.results[0].original_title).toBe("Original Title");
    });

    it("returns an error for a page out of range", async () => {
        try {
            await fetchMovies(`${baseURL}?page=501`);
            throw new Error("Expected fetchMovies to throw an error for page > 500");
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message).toBe(
                    "Invalid page: Pages start at 1 and max at 500. They are expected to be an integer."
                );
            } else {
                throw new Error("Caught value is not an Error instance");
            }
        }
    });
});

// intergration tests

describe("DiscoverMovieDashboard UI", () => {
    beforeAll(() => {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: (query: string) => ({
                matches: false, // default to light mode
                media: query,
                onchange: null,
                addListener: () => {}, // deprecated but still called in some libs
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            }),
        });
    });
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    it("renders a movie card from the API", async () => {
        render(<DiscoverMovieDashboard />);
        const movieTitle = await screen.findByText("Original Title");
        expect(movieTitle.textContent).toBe("Original Title");
    });
    it("renders an error text from error card when out of page range", async () => {
        vi.spyOn(api, "discoverMovies").mockRejectedValue(
            new Error("Invalid page: Pages start at 1 and max at 500.")
        );
        render(<DiscoverMovieDashboard />);
        const errorText = await screen.findByText("Error");
        expect(errorText.textContent).toBe("Error");
    });
    it("renders no results found card when results returned are empty", async () => {
        vi.spyOn(api, "discoverMovies").mockResolvedValue({
            page: 1,
            total_results: 0,
            total_pages: 0,
            results: [],
        });
        render(<DiscoverMovieDashboard />);
        const errorText = await screen.findByText("No results found.");
        expect(errorText.textContent).toBe("No results found.");
    });
});
