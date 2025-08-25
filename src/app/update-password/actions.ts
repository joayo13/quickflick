"use server";

import { createClient } from "@/utils/supabase/server";

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
        throw error;
    }
    return "update password success";
}
