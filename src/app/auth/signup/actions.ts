"use server";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        // Handle common Supabase signup errors with friendly messages
        if (error.message.includes("Password")) {
            return { success: false, message: "Password does not meet requirements." };
        } else {
            return { success: false, message: error.message };
        }
    }

    return {
        success: true,
        message: "Signup successful! Please check your email to confirm your account.",
    };
}
