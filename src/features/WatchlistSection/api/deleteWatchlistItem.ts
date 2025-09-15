"use server";

import { createClient } from "@/utils/supabase/server";

export async function deleteWatchlistItem(id: number) {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) throw new Error("Not logged in");
    if (authData.user.email === "guest@quickflick.com") {
        return { data: null, userIsGuest: true };
    }

    const { data, error } = await supabase.from("watchlist").delete().eq("id", id);

    if (error) {
        console.error("Failed to delete watchlist item:", error);
        throw error;
    }

    return { data: data, userIsGuest: false }; // returns the deleted row(s)
}
