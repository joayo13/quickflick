"use server";

import { createClient } from "@/utils/supabase/server";

export async function deleteWatchlistItem(id: number) {
    const supabase = await createClient();

    const { data, error } = await supabase.from("watchlist").delete().eq("id", id);

    if (error) {
        console.error("Failed to delete watchlist item:", error);
        throw error;
    }

    return data; // returns the deleted row(s)
}
