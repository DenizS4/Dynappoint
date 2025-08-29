"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface SeoData {
  id?: string
  content: string
}

interface SeoFormProps {
  initialData: SeoData | null
}

export function SeoForm({ initialData }: SeoFormProps) {
  const [content, setContent] = useState(initialData?.content || "")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      if (initialData?.id) {
        // Update existing
        const { error } = await supabase
          .from("seo_content")
          .update({
            content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase.from("seo_content").insert({
          content,
        })

        if (error) throw error
      }

      setMessage("SEO content updated successfully!")
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="seo-content">SEO Content</Label>
        <Textarea
          id="seo-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="Enter SEO-focused text content that will be displayed on your website..."
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          This content will be displayed on your website for SEO purposes. Include relevant keywords and information
          about your services.
        </p>
      </div>
      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-primary" : "text-destructive"}`}>{message}</p>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save SEO Content"}
      </Button>
    </form>
  )
}
