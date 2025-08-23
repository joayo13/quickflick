"use client";
import { TMDBDiscoverResponse } from "@/app/types";
import { useState } from "react";
import { DiscoverMovieForm } from "./components/DiscoverMovieForm";
import DiscoverMovieMovieCard from "./components/DiscoverMovieMovieCard";
import DiscoverMovieErrorCard from "./components/DiscoverMovieErrorCard";
import DiscoverMovieNoResultsCard from "./components/DiscoverMovieNoResultsCard";
import { useForm } from "react-hook-form";
import { FormSchema } from "./schemas/FormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { discoverMovies } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function DiscoverMovieSection() {
    const [movieData, setMovieData] = useState<TMDBDiscoverResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            watchProviders: ["8"],
            genres: ["28"],
        },
    });
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            // take form data and modify it to satisfy api url params
            const res = await discoverMovies(
                data.watchProviders.join("|"),
                data.genres.join("|"),
                1
            );

            // pass successfully retrieved result to state in parent component
            setError(null);
            setMovieData(res);
        } catch (err) {
            // pass error result to state in parent component
            setError(err as Error);
        }
    }

    function displayDiscoverMovieResults() {
        if (error) {
            return <DiscoverMovieErrorCard error={error} />;
        }
        if (movieData?.total_results === 0) {
            return <DiscoverMovieNoResultsCard />;
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
        <div className="max-w-3xl">
            <div className="fixed top-0 right-0 z-10">
                <DiscoverMovieForm form={form} />
                <Button onClick={() => form.handleSubmit(onSubmit)()}>Find Movie</Button>
            </div>

            <div className="grid place-items-center">{displayDiscoverMovieResults()}</div>
        </div>
    );
}
