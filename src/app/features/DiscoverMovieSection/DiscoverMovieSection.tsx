"use client";
import { TMDBDiscoverResponse } from "@/app/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { DiscoverMovieForm } from "./components/DiscoverMovieForm";
import DiscoverMovieMovieCard from "./components/DiscoverMovieMovieCard";
import DiscoverMovieErrorCard from "./components/DiscoverMovieErrorCard";
import DiscoverMovieNoResultsCard from "./components/DiscoverMovieNoResultsCard";
import DiscoverMovieEndOfResultsCard from "./components/DiscoverMovieEndOfResultsCard";
import { useForm } from "react-hook-form";
import { FormSchema } from "./schemas/FormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { discoverMovies } from "@/app/actions";

export default function DiscoverMovieSection() {
    const [movieData, setMovieData] = useState<TMDBDiscoverResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [formStatus, setFormStatus] = useState<"initial" | "changed" | "unchanged">("initial");
    const pageNumberRef = useRef(1);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            watchProviders: ["8"],
            genres: ["28"],
        },
    });

    const onSubmit = useCallback(
        async (data: z.infer<typeof FormSchema>) => {
            // fetch movies then set movie data or error data
            try {
                const res = await discoverMovies(
                    data.watchProviders.join("|"),
                    data.genres.join(","),
                    pageNumberRef.current
                );
                setError(null);
                setMovieData(res);
            } catch (err) {
                setError(err as Error);
            }
        },
        [setError, setMovieData]
    );

    useEffect(() => {
        console.log("fired useeffect");
        // if the formstatus is initial or changed state, we will run the onsubmit
        if (formStatus !== "unchanged") {
            form.handleSubmit(onSubmit)();
            setFormStatus("unchanged");
        }
    }, [formStatus, form, onSubmit]);

    useEffect(() => {
        // this useeffect loads next page if we have reached end of current page results and more pages are left
        if (movieData?.results.length === 0 && pageNumberRef.current < movieData.total_pages) {
            pageNumberRef.current += 1;
            // refire the
            form.handleSubmit(onSubmit)();
        }
    }, [movieData, form, onSubmit]);

    function displayDiscoverMovieResults() {
        if (error) {
            return <DiscoverMovieErrorCard error={error} />;
        }
        if (movieData?.total_results === 0) {
            return <DiscoverMovieNoResultsCard />;
        }
        if (movieData?.results.length === 0 && movieData.page === movieData.total_pages) {
            return <DiscoverMovieEndOfResultsCard />;
        }
        if (movieData?.results) {
            return movieData.results.map((movieData) => (
                <DiscoverMovieMovieCard
                    key={movieData.id}
                    movieData={movieData}
                    setMovieData={setMovieData}
                ></DiscoverMovieMovieCard>
            ));
        }
    }

    return (
        <div className="relative max-w-3xl">
            <div className="absolute top-0 right-0 z-10">
                <DiscoverMovieForm form={form} setFormStatus={setFormStatus} />
            </div>

            <div className="grid place-items-center">{displayDiscoverMovieResults()}</div>
        </div>
    );
}
