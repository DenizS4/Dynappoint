"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Faq {
  id: string
  question: string
  answer: string
  order_index: number
}

interface FaqManagerProps {
  faqs: Faq[]
}

export function FaqManager({ faqs }: FaqManagerProps) {
  const [faqList, setFaqList] = useState(faqs)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" })
  const router = useRouter()

  const addFaq = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("faqs")
        .insert({
          question: newFaq.question,
          answer: newFaq.answer,
          order_index: faqList.length,
        })
        .select()
        .single()

      if (error) throw error

      setFaqList((prev) => [...prev, data])
      setNewFaq({ question: "", answer: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Error adding FAQ:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFaq = async (id: string, question: string, answer: string) => {
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("faqs")
        .update({
          question,
          answer,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      setFaqList((prev) => prev.map((faq) => (faq.id === id ? { ...faq, question, answer } : faq)))
      setEditingId(null)
    } catch (error) {
      console.error("Error updating FAQ:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteFaq = async (id: string) => {
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("faqs").delete().eq("id", id)

      if (error) throw error

      setFaqList((prev) => prev.filter((faq) => faq.id !== id))
    } catch (error) {
      console.error("Error deleting FAQ:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add New FAQ */}
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New FAQ
        </Button>
      ) : (
        <Card className="p-4">
          <form onSubmit={addFaq} className="space-y-4">
            <div>
              <Label htmlFor="new-question">Question</Label>
              <Input
                id="new-question"
                value={newFaq.question}
                onChange={(e) => setNewFaq((prev) => ({ ...prev, question: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="new-answer">Answer</Label>
              <Textarea
                id="new-answer"
                value={newFaq.answer}
                onChange={(e) => setNewFaq((prev) => ({ ...prev, answer: e.target.value }))}
                rows={3}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add FAQ"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* FAQ List */}
      <div className="space-y-2">
        {faqList.map((faq) => (
          <FaqItem
            key={faq.id}
            faq={faq}
            isEditing={editingId === faq.id}
            onEdit={() => setEditingId(faq.id)}
            onSave={(question, answer) => updateFaq(faq.id, question, answer)}
            onCancel={() => setEditingId(null)}
            onDelete={() => deleteFaq(faq.id)}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}

function FaqItem({
  faq,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isLoading,
}: {
  faq: Faq
  isEditing: boolean
  onEdit: () => void
  onSave: (question: string, answer: string) => void
  onCancel: () => void
  onDelete: () => void
  isLoading: boolean
}) {
  const [editData, setEditData] = useState({
    question: faq.question,
    answer: faq.answer,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editData.question, editData.answer)
  }

  if (isEditing) {
    return (
      <Card className="p-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor={`edit-question-${faq.id}`}>Question</Label>
            <Input
              id={`edit-question-${faq.id}`}
              value={editData.question}
              onChange={(e) => setEditData((prev) => ({ ...prev, question: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor={`edit-answer-${faq.id}`}>Answer</Label>
            <Textarea
              id={`edit-answer-${faq.id}`}
              value={editData.answer}
              onChange={(e) => setEditData((prev) => ({ ...prev, answer: e.target.value }))}
              rows={3}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium mb-2">{faq.question}</h3>
          <p className="text-sm text-muted-foreground">{faq.answer}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="sm" onClick={onEdit} disabled={isLoading}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} disabled={isLoading} className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
