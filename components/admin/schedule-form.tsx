"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

interface ScheduleData {
  id?: string
  day_of_week: number
  is_working: boolean
  start_time: string | null
  end_time: string | null
}

interface ScheduleFormProps {
  initialData: ScheduleData[]
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function ScheduleForm({ initialData }: ScheduleFormProps) {
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>(() => {
    // Initialize with existing data or default schedule
    const schedule: ScheduleData[] = []
    for (let i = 0; i < 7; i++) {
      const existing = initialData.find((item) => item.day_of_week === i)
      schedule.push(
        existing || {
          day_of_week: i,
          is_working: i >= 1 && i <= 5, // Monday to Friday by default
          start_time: "09:00",
          end_time: "17:00",
        },
      )
    }
    return schedule
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const updateDay = (dayIndex: number, updates: Partial<ScheduleData>) => {
    setScheduleData((prev) => prev.map((day) => (day.day_of_week === dayIndex ? { ...day, ...updates } : day)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      // Delete existing schedule
      await supabase.from("work_schedule").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      // Insert new schedule
      const { error } = await supabase.from("work_schedule").insert(
        scheduleData.map((day) => ({
          day_of_week: day.day_of_week,
          is_working: day.is_working,
          start_time: day.is_working ? day.start_time : null,
          end_time: day.is_working ? day.end_time : null,
        })),
      )

      if (error) throw error

      setMessage("Work schedule updated successfully!")
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {scheduleData.map((day) => (
        <div key={day.day_of_week} className="flex items-center gap-4 p-4 border border-border rounded-lg">
          <div className="w-24">
            <Label className="font-medium">{dayNames[day.day_of_week]}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={day.is_working}
              onCheckedChange={(checked) => updateDay(day.day_of_week, { is_working: checked })}
            />
            <Label className="text-sm">Working</Label>
          </div>
          {day.is_working && (
            <>
              <div className="flex items-center gap-2">
                <Label htmlFor={`start-${day.day_of_week}`} className="text-sm">
                  From:
                </Label>
                <Input
                  id={`start-${day.day_of_week}`}
                  type="time"
                  value={day.start_time || ""}
                  onChange={(e) => updateDay(day.day_of_week, { start_time: e.target.value })}
                  className="w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`end-${day.day_of_week}`} className="text-sm">
                  To:
                </Label>
                <Input
                  id={`end-${day.day_of_week}`}
                  type="time"
                  value={day.end_time || ""}
                  onChange={(e) => updateDay(day.day_of_week, { end_time: e.target.value })}
                  className="w-32"
                />
              </div>
            </>
          )}
        </div>
      ))}
      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-primary" : "text-destructive"}`}>{message}</p>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Schedule"}
      </Button>
    </form>
  )
}
