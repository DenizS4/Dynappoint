import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const url = new URL(request.url)
  const from = url.searchParams.get("from")

  await supabase.auth.signOut()

  const to = from === "admin" ? "/admin/login" : "/"
  return NextResponse.redirect(new URL(to, request.url))
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const referer = request.headers.get("referer") || ""
  const isFromAdmin = referer.includes("/admin")

  await supabase.auth.signOut()

  const to = isFromAdmin ? "/admin/login" : "/"
  return NextResponse.redirect(new URL(to, request.url))
}