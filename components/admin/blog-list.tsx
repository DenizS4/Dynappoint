"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Edit, Trash2 } from "lucide-react"
import { EditBlogModal } from "./edit-blog-modal"
import { useRouter } from "next/navigation"

interface Blog {
  id: string
  title: string
  description: string
  image_url: string | null
  external_url: string
  created_at: string
}

interface BlogListProps {
  blogs: Blog[]
}

export function BlogList({ blogs }: BlogListProps) {
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const deleteBlog = async (id: string) => {
    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting blog:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No blog posts yet. Add your first blog post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <Card key={blog.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">{blog.title}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{blog.description}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(blog.external_url, "_blank")}
                  className="h-6 px-2 text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingBlog(blog)} className="h-6 px-2 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBlog(blog.id)}
                  disabled={isDeleting === blog.id}
                  className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {editingBlog && <EditBlogModal blog={editingBlog} onClose={() => setEditingBlog(null)} />}
    </div>
  )
}
