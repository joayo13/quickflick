"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateWatchlistItemWatchedStatus(watchlistItemId: number, watched: boolean) {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) throw new Error("Not logged in");
    if (authData.user.email === "guest@quickflick.com") {
        return { data: null, userIsGuest: true };
    }

    // Update the watchlist entry
    const { data, error } = await supabase
        .from("watchlist")
        .update({ watched: watched })
        .eq("id", watchlistItemId)
        .select("*, movies(*)")
        .single();

    if (error) throw error;
    return { data: data, userIsGuest: true };
}
