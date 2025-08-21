"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { discoverMovie } from "@/app/actions";
import { TMDBMovie } from "@/app/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

interface DiscoverMovieFormProps {
    onDiscoverMovieFormSuccess: (data: TMDBMovie | undefined) => void;
    onDiscoverMovieFormError: (data: Error | null) => void;
}

let resultsPageNumber = 1;

const watchProviders = [
    { id: "8", label: "Netflix" },
    { id: "119", label: "Prime Video" },
    { id: "337", label: "Disney+" },
    { id: "230", label: "Crave" },
    { id: "531", label: "Paramount Plus" },
    { id: "314", label: "CBC Gem" },
    { id: "350", label: "Apple TV+" },
    { id: "15", label: "Hulu" },
    { id: "99", label: "Shudder" },
] as const;

const genres = [
    { id: "28", label: "Action" },
    { id: "12", label: "Adventure" },
    { id: "16", label: "Animation" },
    { id: "35", label: "Comedy" },
    { id: "80", label: "Crime" },
    { id: "99", label: "Documentary" },
    { id: "18", label: "Drama" },
    { id: "10751", label: "Family" },
    { id: "14", label: "Fantasy" },
    { id: "36", label: "History" },
    { id: "27", label: "Horror" },
    { id: "10402", label: "Music" },
    { id: "9648", label: "Mystery" },
    { id: "10749", label: "Romance" },
    { id: "878", label: "Science Fiction" },
    { id: "10770", label: "TV Movie" },
    { id: "53", label: "Thriller" },
    { id: "10752", label: "War" },
    { id: "37", label: "Western" },
] as const;

const FormSchema = z.object({
    watchProviders: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    genres: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
});

export function DiscoverMovieForm({
    onDiscoverMovieFormSuccess,
    onDiscoverMovieFormError,
}: DiscoverMovieFormProps) {
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
            const res = await discoverMovie(
                data.watchProviders.join("|"),
                data.genres.join(","),
                resultsPageNumber
            );

            if (res?.total_results === 0) {
                throw new Error("No results found");
            }
            // cycle through the pages, and get a random entry from each page, looping back to page 1 if out of bounds

            if (res?.total_pages && resultsPageNumber < res.total_pages) {
                resultsPageNumber += 1;
            } else if (
                res?.total_pages &&
                resultsPageNumber >= res.total_pages
            ) {
                resultsPageNumber = 1;
                // this does not account for bug of being on page 2 when theres only one page availiable
            }
            const results = res?.results ?? [];

            const randomPageEntry = Math.floor(Math.random() * results.length);
            // pass successfully retrieved result to state in parent component
            onDiscoverMovieFormSuccess(results[randomPageEntry]);
        } catch (err) {
            // pass error result to state in parent component
            onDiscoverMovieFormError(err as Error);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Open</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <FormField
                            control={form.control}
                            name="watchProviders"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">
                                            Streaming Services
                                        </FormLabel>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {watchProviders.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="watchProviders"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-center gap-2"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(
                                                                        item.id
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        return checked
                                                                            ? field.onChange(
                                                                                  [
                                                                                      ...field.value,
                                                                                      item.id,
                                                                                  ]
                                                                              )
                                                                            : field.onChange(
                                                                                  field.value?.filter(
                                                                                      (
                                                                                          value
                                                                                      ) =>
                                                                                          value !==
                                                                                          item.id
                                                                                  )
                                                                              );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-sm font-normal">
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
                <FormField
                    control={form.control}
                    name="genres"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">
                                    Genres
                                </FormLabel>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {genres.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="genres"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-center gap-2"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(
                                                                item.id
                                                            )}
                                                            onCheckedChange={(
                                                                checked
                                                            ) => {
                                                                return checked
                                                                    ? field.onChange(
                                                                          [
                                                                              ...field.value,
                                                                              item.id,
                                                                          ]
                                                                      )
                                                                    : field.onChange(
                                                                          field.value?.filter(
                                                                              (
                                                                                  value
                                                                              ) =>
                                                                                  value !==
                                                                                  item.id
                                                                          )
                                                                      );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal">
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Find Movie</Button>
            </form>
        </Form>
    );
}
