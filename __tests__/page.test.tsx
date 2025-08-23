import { expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DiscoverMovieSection from "@/app/features/DiscoverMovieSection/DiscoverMovieSection";
import * as actions from "@/app/actions";
import { describe } from "node:test";

describe("discover movie section", () => {
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
});
