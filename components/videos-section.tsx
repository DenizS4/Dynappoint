"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, ExternalLink } from "lucide-react"
import Image from "next/image"

interface VideoData {
  id: string
  title: string
  description: string
  thumbnail_url: string | null
  external_url: string
}

interface VideosSectionProps {
  data: VideoData[]
}

export function VideosSection({ data }: VideosSectionProps) {
  return (
    <section id="videos" className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">Video Resources</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch our video content to learn more about our services and expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative group cursor-pointer">
                <Image
                  src={video.thumbnail_url || "/placeholder.svg?height=200&width=350"}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="bg-primary/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-primary-foreground fill-current" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                <CardDescription className="line-clamp-3">{video.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => window.open(video.external_url, "_blank")}
                >
                  Watch Video
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
