"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Edit, Trash2 } from "lucide-react"
import { EditVideoModal } from "./edit-video-modal"
import { useRouter } from "next/navigation"

interface Video {
  id: string
  title: string
  description: string
  thumbnail_url: string | null
  external_url: string
  created_at: string
}

interface VideoListProps {
  videos: Video[]
}

export function VideoList({ videos }: VideoListProps) {
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const deleteVideo = async (id: string) => {
    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("videos").delete().eq("id", id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting video:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No videos yet. Add your first video!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Card key={video.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">{video.title}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{video.description}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(video.external_url, "_blank")}
                  className="h-6 px-2 text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingVideo(video)} className="h-6 px-2 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteVideo(video.id)}
                  disabled={isDeleting === video.id}
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

      {editingVideo && <EditVideoModal video={editingVideo} onClose={() => setEditingVideo(null)} />}
    </div>
  )
}
