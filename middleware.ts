import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [

    "/my-appointments/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
}
