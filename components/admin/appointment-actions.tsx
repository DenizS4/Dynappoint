"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Check, X, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface Appointment {
  id: string
  status: string
  name: string
  email: string
}

interface AppointmentActionsProps {
  appointment: Appointment
}

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("appointments").update({ status: newStatus }).eq("id", appointment.id)

      if (error) throw error

      if (newStatus === "confirmed" || newStatus === "cancelled") {
        try {
          await fetch("/api/send-appointment-emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "status_update",
              appointment: appointment,
              status: newStatus,
            }),
          })
          console.log("Status update email sent successfully")
        } catch (emailError) {
          console.error("Failed to send status update email:", emailError)
          // Don't fail the status update if email fails
        }
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating appointment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {appointment.status !== "confirmed" && (
          <DropdownMenuItem onClick={() => updateStatus("confirmed")} className="text-primary">
            <Check className="mr-2 h-4 w-4" />
            Confirm
          </DropdownMenuItem>
        )}
        {appointment.status !== "pending" && (
          <DropdownMenuItem onClick={() => updateStatus("pending")}>
            <Clock className="mr-2 h-4 w-4" />
            Mark Pending
          </DropdownMenuItem>
        )}
        {appointment.status !== "cancelled" && (
          <DropdownMenuItem onClick={() => updateStatus("cancelled")} className="text-destructive">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
