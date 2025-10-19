import { render, screen } from "@testing-library/react";
import { TMDBMovie } from "@/types/types";
import fetchWatchlist from "./_api/fetchWatchlist";

// have to mock view transition because its experimental and doesn't exist in test version of react-dom
vi.mock("react", async () => {
    const actual = await vi.importActual("react");
    type ViewTransitionProps = {
        children: React.ReactNode;
        name?: string;
    };
    return {
        ...actual,
        unstable_ViewTransition: ({ children }: ViewTransitionProps) => <>{children}</>,
    };
});

vi.mock("./api/fetchWatchlist");

const shrekMovie: TMDBMovie = {
    id: 808,
    title: "Shrek",
    original_title: "Shrek",
    overview:
        "Once upon a time there was a little ogre named Shrek. … A mean lord exiles fairytale creatures to the swamp of a grumpy ogre, who must go on a quest and rescue a princess for the lord in order to get his land back.",
    release_date: "2001-04-22",
    vote_average: 7.6,
    vote_count: 19319,
    poster_path: "/nostwoq0jLtXiuptlnJeHj141l4.jpg",
    backdrop_path: "/iVZ9JpBzEgiZXKMsXRDtPBULiUd.jpg",
    genre_ids: ["12", "16", "35", "14", "10751"],
    original_language: "en",
};

describe("Watchlist Section UI", () => {
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
        vi.mocked(fetchWatchlist).mockReset();
    });
    // it("renders a watchlist card in unwatched", async () => {
    //     vi.mocked(fetchWatchlist).mockResolvedValueOnce({
    //         watchlist: [
    //             {
    //                 id: 808,
    //                 movie_id: 808,
    //                 movies: shrekMovie,
    //                 user_id: "808",
    //                 watched: false,
    //             },
    //         ],
    //         userIsGuest: false,
    //     });

    //     render(<WatchlistSection />);
    //     const movieTitle = await screen.findByText("Shrek");
    //     expect(movieTitle).toBeInTheDocument();
    // });
    // it("renders no watchlist items card when no watchlist are fetched", async () => {
    //     vi.mocked(fetchWatchlist).mockResolvedValueOnce({
    //         watchlist: [],
    //         userIsGuest: false,
    //     });

    //     render(<WatchlistSection />);
    //     const movieTitle = await screen.findByText("No movies found in watchlist.");
    //     expect(movieTitle).toBeInTheDocument();
    // });
    // it("renders error message when fetch fails", async () => {
    //     vi.mocked(fetchWatchlist).mockRejectedValueOnce(new Error("Something went wrong"));

    //     render(<WatchlistSection />);

    //     const errorTitle = await screen.findByText("Something went wrong");
    //     expect(errorTitle).toBeInTheDocument();
    // });
});
