"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, User, LogOut, CalendarDays } from "lucide-react"
import { AuthModal } from "./auth-modal"
import { useRouter } from "next/navigation"

interface ScheduleData {
  day_of_week: number
  is_working: boolean
  start_time: string | null
  end_time: string | null
}

interface Appointment {
  id: string
  name: string
  email: string
  phone: string
  appointment_date: string
  appointment_time: string
  message: string
  status: "pending" | "approved" | "confirmed" | "denied" | "completed"
  created_at: string
}

interface AppointmentSectionProps {
  scheduleData: ScheduleData[] | null
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
    case "confirmed":
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Approved
        </Badge>
      )
    case "denied":
      return <Badge variant="destructive">Denied</Badge>
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    default:
      return <Badge variant="outline">Pending</Badge>
  }
}

export function AppointmentSection({ scheduleData }: AppointmentSectionProps) {
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([])
  const [showMyAppointments, setShowMyAppointments] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
      if (user) {
        fetchUserAppointments(user.id)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === "SIGNED_IN") {
        setShowAuthModal(false)
        setShowBookingForm(true)
        if (session?.user) {
          fetchUserAppointments(session.user.id)
        }
      }
      if (event === "SIGNED_OUT") {
        setUserAppointments([])
        setShowMyAppointments(false)
        setShowBookingForm(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserAppointments = async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", userId)
      .order("appointment_date", { ascending: true })
    if (!error && data) {
      setUserAppointments(data)
    } else if (error) {
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleStartBooking = () => {
    if (user) {
      setShowBookingForm(true)
      setShowMyAppointments(false)
    } else {
      setShowAuthModal(true)
    }
  }

  const handleShowMyAppointments = () => {
    setShowMyAppointments(true)
    setShowBookingForm(false)
  }

  const workingHours = scheduleData?.filter((day) => day.is_working) || []

  if (isLoading) {
    return <div className="py-16 text-center">Loading...</div>
  }

  return (
    <section id="appointments" className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">Book an Appointment</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Schedule your appointment with us. We're here to provide you with exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Working Hours
              </CardTitle>
              <CardDescription>Our availability throughout the week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {scheduleData?.map((day) => (
                <div
                  key={day.day_of_week}
                  className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                >
                  <span className="font-medium">{dayNames[day.day_of_week]}</span>
                  <span className={day.is_working ? "text-primary" : "text-muted-foreground"}>
                    {day.is_working && day.start_time && day.end_time
                      ? `${day.start_time} - ${day.end_time}`
                      : "Closed"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Booking Form / My Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {showMyAppointments ? (
                  <>
                    <CalendarDays className="h-5 w-5 text-primary" />
                    My Appointments
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5 text-primary" />
                    Book Your Appointment
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {showMyAppointments
                  ? "View and manage your appointments"
                  : user
                    ? "Fill out the form below to schedule your appointment"
                    : "Sign in to book your appointment"}
              </CardDescription>
              {user && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex gap-2">
                    {userAppointments.length > 0 && !showMyAppointments && (
                      <Button variant="outline" size="sm" onClick={handleShowMyAppointments}>
                        My Appointments ({userAppointments.length})
                      </Button>
                    )}
                    {showMyAppointments && (
                      <Button variant="outline" size="sm" onClick={() => setShowMyAppointments(false)}>
                        Book New
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {showMyAppointments ? (
                <MyAppointments
                  appointments={userAppointments}
                  onRefresh={() => user && fetchUserAppointments(user.id)}
                />
              ) : !showBookingForm ? (
                <Button onClick={handleStartBooking} className="w-full" size="lg">
                  {user ? "Start Booking" : "Sign In to Book"}
                </Button>
              ) : (
                <BookingForm
                  user={user}
                  onSuccess={() => {
                    if (user) fetchUserAppointments(user.id)
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            setShowBookingForm(true)
          }}
        />
      </div>
    </section>
  )
}

function MyAppointments({ appointments, onRefresh }: { appointments: Appointment[]; onRefresh: () => void }) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No appointments found.</p>
        <p className="text-sm">Book your first appointment to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">{appointment.name}</div>
            {getStatusBadge(appointment.status)}
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
            </div>
            {appointment.phone && <div>Phone: {appointment.phone}</div>}
            {appointment.message && (
              <div className="mt-2 p-2 bg-muted rounded text-xs">
                <strong>Message:</strong> {appointment.message}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function BookingForm({ user, onSuccess }: { user: any; onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    date: "",
    time: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data: appointmentData, error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          appointment_date: formData.date,
          appointment_time: formData.time,
          message: formData.message,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      try {
        await fetch("/api/send-appointment-emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "new_appointment",
            appointment: appointmentData,
          }),
        })
        console.log("Email notifications sent successfully")
      } catch (emailError) {
        console.error("Failed to send email notifications:", emailError)
        // Don't fail the appointment creation if email fails
      }

      setIsSuccess(true)
      onSuccess?.()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-primary mx-auto" />
        <h3 className="text-lg font-semibold">Appointment Booked!</h3>
        <p className="text-muted-foreground">
          Your appointment has been successfully booked. We'll contact you soon to confirm the details.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Book Another Appointment
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Preferred Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Preferred Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          placeholder="Tell us about your appointment needs..."
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Booking Appointment..." : "Book Appointment"}
      </Button>
    </form>
  )
}
