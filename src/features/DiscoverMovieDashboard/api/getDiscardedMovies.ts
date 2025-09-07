"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDiscardedMovies() {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) throw new Error("Not logged in");

    const { data, error } = await supabase
        .from("discarded_movies")
        .select("movies")
        .eq("id", authData.user.id)
        .single();

    if (error) throw error;

    // normalize to numbers just in case
    const movies: number[] = (data?.movies ?? []).map((id: string) => Number(id));

    return movies;
}
