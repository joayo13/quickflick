"use client";
import { useForm } from "react-hook-form";

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { CircleAlertIcon, CircleCheckIcon, SlidersHorizontalIcon } from "lucide-react";
import z from "zod";
import { FormSchema } from "../schemas/FormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStore } from "@/store/useStore";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

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

export function DiscoverMovieForm() {
    const { values, setValues } = useFormStore();

    const deepEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: values,
        mode: "onSubmit",
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        if (deepEqual(data, values)) {
            toast("Filters already applied.", { icon: <CircleAlertIcon /> });
            return;
        }
        setValues(data);
        toast("Filters applied successfully.", { icon: <CircleCheckIcon /> });
    };

    return (
        <Form {...form}>
            <Toaster />
            <form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="h-8 w-8 rounded-full" variant="outline">
                            <SlidersHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Streams</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-w-screen p-4 lg:max-w-3xl">
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Genres</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-w-screen p-4 lg:max-w-3xl">
                                <FormField
                                    control={form.control}
                                    name="includeGenres"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">
                                                    Include Genres
                                                </FormLabel>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                {genres.map((item) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="includeGenres"
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
                                <FormField
                                    control={form.control}
                                    name="excludeGenres"
                                    render={() => (
                                        <FormItem>
                                            <div className="mt-6 mb-4">
                                                <FormLabel className="text-base">
                                                    Exclude Genres
                                                </FormLabel>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                {genres.map((item) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="excludeGenres"
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Year</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-w-screen p-4 lg:max-w-3xl">
                                <FormField
                                    control={form.control}
                                    name="releaseYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">
                                                    Release Year Range
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Slider
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    min={1950}
                                                    max={2025}
                                                    step={1}
                                                    className="w-[250px]"
                                                />
                                            </FormControl>
                                            <div className="mt-2 flex justify-between text-sm">
                                                <span>{field.value?.[0]}</span>
                                                <span>{field.value?.[1]}</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Rating</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-w-screen p-4 lg:max-w-3xl">
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">
                                                    Rating Range
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Slider
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    min={0.1}
                                                    max={10}
                                                    step={0.1}
                                                    className="w-[250px]"
                                                />
                                            </FormControl>
                                            <div className="mt-2 flex justify-between text-sm">
                                                <span>{field.value?.[0]}</span>
                                                <span>{field.value?.[1]}</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            onClick={() => form.handleSubmit(onSubmit)()}
                            type="submit"
                            variant="default"
                        >
                            Apply Filters
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            </form>
        </Form>
    );
}
