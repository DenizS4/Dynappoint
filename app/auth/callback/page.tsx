import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code: string }
}) {
  const supabase = await createClient()

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code)
    if (!error) {
      redirect("/")
    }
  }

  // Return the user to an error page with instructions
  redirect("/auth/auth-code-error")
}
