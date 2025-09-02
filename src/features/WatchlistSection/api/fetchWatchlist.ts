"use server";

import { createClient } from "@/utils/supabase/server";

export default async function fetchWatchlist() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.log(error);
    }
    if (!data.user) throw new Error("Not logged in");

    const userId = data.user.id;

    const watchListdata = await supabase
        .from("watchlist")
        .select(
            `
    *,
    movies(*)
  `
        )
        .eq("user_id", userId);

    return watchListdata.data;
}
