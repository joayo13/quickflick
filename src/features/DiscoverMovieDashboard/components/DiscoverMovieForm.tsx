"use client";

import { FieldErrors, useForm } from "react-hook-form";
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
} from "@/components/ui/dropdown-menu";
import { CircleAlertIcon, CircleCheckIcon, SlidersHorizontalIcon } from "lucide-react";
import z from "zod";
import { FormSchema } from "../schemas/FormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStore } from "@/store/useStore";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { deepEqual } from "@/features/DiscoverMovieDashboard/utils/utils";
import { genresList, watchProvidersList } from "@/utils/tmdbUtils";

export function DiscoverMovieForm() {
    const { values, setValues, resetValues } = useFormStore();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: values,
        mode: "onSubmit",
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        if (deepEqual(data, values)) {
            toast("Current filters already active.", { icon: <CircleAlertIcon /> });
            return;
        }
        setValues(data);
        toast("Filters updated successfully.", { icon: <CircleCheckIcon /> });
    };

    const onSubmitError = (errors: FieldErrors) => {
        const firstError = Object.values(errors)[0]?.message;
        toast(firstError as string, { icon: <CircleAlertIcon /> });
    };

    const resetFormValues = () => {
        const defaults = resetValues();
        form.reset(defaults);
        toast("Filters reset to defaults.", { icon: <CircleCheckIcon /> });
    };

    return (
        <Form {...form}>
            <form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="absolute top-2 right-2 z-30 h-8 w-8 rounded-full"
                            variant="outline"
                        >
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
                                                {watchProvidersList.map((item) => (
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
                                                {genresList.map((item) => (
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
                                                {genresList.map((item) => (
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
                        <div className="block w-full">
                            <Button
                                className="w-1/2"
                                onClick={form.handleSubmit(onSubmit, onSubmitError)}
                                type="submit"
                                variant="default"
                            >
                                Apply Filters
                            </Button>
                            <Button
                                className="w-1/2"
                                onClick={resetFormValues}
                                type="submit"
                                variant="secondary"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </form>
        </Form>
    );
}
