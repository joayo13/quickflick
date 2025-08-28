"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        // You can check error.message to distinguish different cases
        if (error.message.includes("Invalid login credentials")) {
            return { success: false, message: "Invalid email or password" };
        } else if (error.message.includes("User not confirmed")) {
            return { success: false, message: "Please verify your email before logging in." };
        } else {
            return { success: false, message: "Unexpected error occurred. Please try again." };
        }
    }

    return { success: true, message: "Login successful, redirecting to dashboard." };
}
