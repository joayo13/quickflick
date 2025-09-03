"use server";

import { createClient } from "@/utils/supabase/server";

export default async function fetchWatchlist() {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) throw new Error("Not logged in");

    const userId = authData.user.id;

    const { data: watchlist, error: watchlistError } = await supabase
        .from("watchlist")
        .select(`*, movies(*)`)
        .eq("user_id", userId);

    if (watchlistError) throw watchlistError;
    return watchlist;
}
