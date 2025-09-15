import { render, screen } from "@testing-library/react";
import DiscoverMovieDashboard from "./DiscoverMovieDashboard";
import { useMovieStore } from "@/store/useStore";

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
    beforeAll(async () => {
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
        useMovieStore.getState().setMovieData(await fetchMovies(`${baseURL}?page=1`));
        render(<DiscoverMovieDashboard />);
        const movieTitle = await screen.findByText("Original Title");
        expect(movieTitle.textContent).toBe("Original Title");
    });
    it("renders an error text from error card when out of page range", async () => {
        // directly set error in Zustand store
        useMovieStore
            .getState()
            .setError(new Error("Invalid page: Pages start at 1 and max at 500."));

        // render the dashboard
        render(<DiscoverMovieDashboard />);

        // assert the error card shows up
        const errorText = await screen.findByText("Error");
        expect(errorText.textContent).toBe("Error");
    });
    it("renders no results found card when results returned are empty", async () => {
        // directly set movieData in Zustand store
        useMovieStore.getState().setMovieData({
            page: 1,
            total_results: 0,
            total_pages: 0,
            results: [],
        });

        render(<DiscoverMovieDashboard />);

        // wait for the card to appear
        const noResultsText = await screen.findByText("No results found.");
        expect(noResultsText).toBeInTheDocument();
    });
    it("renders welcome card when no movie data is set", async () => {
        // set movieData and mark store as hydrated
        useMovieStore.setState({
            movieData: null,
            movieStoreHydrated: true,
            endOfListMovieData: undefined,
            error: null, // if you added error to the store
        });

        render(<DiscoverMovieDashboard />);

        // wait for the welcome card to appear
        const letsGetStarted = await screen.findByText("Let's get started.");
        expect(letsGetStarted).toBeInTheDocument();
    });
});
