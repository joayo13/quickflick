import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import DiscoverMovieSection from "@/app/features/DiscoverMovieSection/DiscoverMovieSection";
import * as actions from "@/app/actions";

describe("discover movie section", () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });
    it("shows error card when discoverMovies throws", async () => {
        vi.spyOn(actions, "discoverMovies").mockImplementation(() => {
            throw new Error("no results found");
        });

        render(<DiscoverMovieSection />);
        const button = screen.getByRole("button", { name: "Find Movie" });
        fireEvent.click(button);

        // Wait for error card to appear
        // Use getByText and check it's not null
        const errorCard = await screen.findByText(/no results found/i);
        expect(errorCard.textContent).toContain("no results found");
    });
    it("returns and displays movie image card on successful api call", async () => {
        vi.spyOn(actions, "discoverMovies").mockImplementation(() => {
            return Promise.resolve({
                page: 1,
                total_pages: 1,
                total_results: 1,
                results: [
                    {
                        title: "test",
                        vote_count: 1,
                        backdrop_path: "/test",
                        original_title: "Test Movie",
                        overview: "This is a test movie overview.",
                        poster_path: "/img/test-movie.jpg",
                        release_date: "2025-01-01",
                        vote_average: 8.5,
                        id: 12345,
                    },
                ],
            });
        });
        render(<DiscoverMovieSection />);
        const button = screen.getByRole("button", { name: "Find Movie" });
        fireEvent.click(button);

        const bgDiv = await screen.findByTestId("movie-bg");
        // or, if you use alt text or title:
        expect(bgDiv.style.backgroundImage).toContain("/img/test-movie.jpg");
    });
});
