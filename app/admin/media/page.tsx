import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { BlogList } from "@/components/admin/blog-list"
import { VideoList } from "@/components/admin/video-list"
import { AddMediaModal } from "@/components/admin/add-media-modal"

export default async function AdminMedia() {
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

  // Fetch blogs and videos
  const [blogsResult, videosResult] = await Promise.all([
    supabase.from("blogs").select("*").order("created_at", { ascending: false }),
    supabase.from("videos").select("*").order("created_at", { ascending: false }),
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
              <h1 className="text-xl font-bold text-foreground">Blogs & Videos</h1>
            </div>
            <AddMediaModal />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blogs Section */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Manage your blog posts and articles</CardDescription>
            </CardHeader>
            <CardContent>
              <BlogList blogs={blogsResult.data || []} />
            </CardContent>
          </Card>

          {/* Videos Section */}
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
              <CardDescription>Manage your video content</CardDescription>
            </CardHeader>
            <CardContent>
              <VideoList videos={videosResult.data || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
