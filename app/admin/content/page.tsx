import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { AboutForm } from "@/components/admin/about-form"
import { ScheduleForm } from "@/components/admin/schedule-form"
import { FooterForm } from "@/components/admin/footer-form"

export default async function AdminContent() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (adminError || !adminUser) {
    redirect("/admin/login")
  }

  // Fetch current content
  const [aboutResult, scheduleResult, footerResult] = await Promise.all([
    supabase.from("about_section").select("*").single(),
    supabase.from("work_schedule").select("*").order("day_of_week"),
    supabase.from("footer_info").select("*").single(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/admin" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </a>
              <h1 className="text-xl font-bold text-foreground">Site Content Management</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
            <CardDescription>Manage the about us section content and image</CardDescription>
          </CardHeader>
          <CardContent>
            <AboutForm initialData={aboutResult.data} />
          </CardContent>
        </Card>

        {/* Work Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Work Schedule</CardTitle>
            <CardDescription>Set your working hours for each day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleForm initialData={scheduleResult.data || []} />
          </CardContent>
        </Card>

        {/* Footer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Information</CardTitle>
            <CardDescription>Update contact information and company details</CardDescription>
          </CardHeader>
          <CardContent>
            <FooterForm initialData={footerResult.data} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
