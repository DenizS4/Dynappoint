"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function AddMediaModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image_url: "",
    external_url: "",
  })

  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    thumbnail_url: "",
    external_url: "",
  })

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("blogs").insert({
        title: blogData.title,
        description: blogData.description,
        image_url: blogData.image_url || null,
        external_url: blogData.external_url,
      })

      if (error) throw error

      setBlogData({ title: "", description: "", image_url: "", external_url: "" })
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("videos").insert({
        title: videoData.title,
        description: videoData.description,
        thumbnail_url: videoData.thumbnail_url || null,
        external_url: videoData.external_url,
      })

      if (error) throw error

      setVideoData({ title: "", description: "", thumbnail_url: "", external_url: "" })
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>Add a new blog post or video to your site.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blog">Blog Post</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-4">
            <form onSubmit={handleAddBlog} className="space-y-4">
              <div>
                <Label htmlFor="blog-title">Title</Label>
                <Input
                  id="blog-title"
                  value={blogData.title}
                  onChange={(e) => setBlogData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="blog-description">Description</Label>
                <Textarea
                  id="blog-description"
                  value={blogData.description}
                  onChange={(e) => setBlogData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="blog-image">Image URL</Label>
                <Input
                  id="blog-image"
                  type="url"
                  value={blogData.image_url}
                  onChange={(e) => setBlogData((prev) => ({ ...prev, image_url: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="blog-url">External URL</Label>
                <Input
                  id="blog-url"
                  type="url"
                  value={blogData.external_url}
                  onChange={(e) => setBlogData((prev) => ({ ...prev, external_url: e.target.value }))}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Adding..." : "Add Blog Post"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <Label htmlFor="video-title">Title</Label>
                <Input
                  id="video-title"
                  value={videoData.title}
                  onChange={(e) => setVideoData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="video-description">Description</Label>
                <Textarea
                  id="video-description"
                  value={videoData.description}
                  onChange={(e) => setVideoData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="video-thumbnail">Thumbnail URL</Label>
                <Input
                  id="video-thumbnail"
                  type="url"
                  value={videoData.thumbnail_url}
                  onChange={(e) => setVideoData((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="video-url">External URL</Label>
                <Input
                  id="video-url"
                  type="url"
                  value={videoData.external_url}
                  onChange={(e) => setVideoData((prev) => ({ ...prev, external_url: e.target.value }))}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Adding..." : "Add Video"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
