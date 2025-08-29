export const runtime = 'nodejs';
import { type NextRequest, NextResponse } from "next/server"
import { sendAdminNotification, sendCustomerConfirmation, sendCustomerStatusUpdate } from "@/lib/email"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { type, appointment, status } = await request.json()

    const supabase = await createClient()
    const { data: settings } = await supabase.from("site_settings").select("contact_email").single()

    const adminEmail = settings?.contact_email

    switch (type) {
      case "new_appointment":
        // Send confirmation to customer
        await sendCustomerConfirmation(appointment)

        // Send notification to admin if email is configured
        if (adminEmail) {
          await sendAdminNotification(appointment, adminEmail)
        }
        break

      case "status_update":
        // Send status update to customer
        await sendCustomerStatusUpdate(appointment, status)
        break

      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
