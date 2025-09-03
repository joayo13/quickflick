"use server";

import { createClient } from "@/utils/supabase/server";

export async function sendResetPasswordEmail(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
    };

    const { error } = await supabase.auth.resetPasswordForEmail(data.email);

    if (error) {
        return { success: false, message: "Unknown error occurred, please try again." };
    }
    return { success: true, message: "reset email sent" };
}
