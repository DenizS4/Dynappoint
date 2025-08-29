"use server"

import { createClient } from "@/lib/supabase/server"

export async function createAdminUser(email: string, password: string) {
  const supabase = await createClient()

  // Check if current user is admin
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Not authenticated")
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (adminError || !adminUser) {
    throw new Error("Not authorized")
  }

  try {
    // Create user directly in the database (simplified approach)
    // In production, you'd want to use Supabase's admin API or handle this differently
    const { data: newUser, error: createError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (createError) throw createError

    if (newUser.user) {
      // Add to admin_users table
      const { error: adminInsertError } = await supabase.from("admin_users").insert({
        id: newUser.user.id,
        email: email,
      })

      if (adminInsertError) throw adminInsertError
    }

    return { success: true }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create admin user")
  }
}
