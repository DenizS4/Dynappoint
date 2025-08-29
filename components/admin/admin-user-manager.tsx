"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { createAdminUser } from "@/app/admin/actions"

interface AdminUser {
  id: string
  email: string
  created_at: string
}

interface AdminUserManagerProps {
  adminUsers: AdminUser[]
}

export function AdminUserManager({ adminUsers }: AdminUserManagerProps) {
  const [adminUserList, setAdminUserList] = useState(adminUsers)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newUser, setNewUser] = useState({ email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const addAdminUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await createAdminUser(newUser.email, newUser.password)

      setNewUser({ email: "", password: "" })
      setIsAdding(false)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAdminUser = async (id: string) => {
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("admin_users").delete().eq("id", id)

      if (error) throw error

      setAdminUserList((prev) => prev.filter((user) => user.id !== id))
    } catch (error) {
      console.error("Error deleting admin user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add New Admin User */}
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Admin User
        </Button>
      ) : (
        <Card className="p-4">
          <form onSubmit={addAdminUser} className="space-y-4">
            <div>
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Admin User"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Admin Users List */}
      <div className="space-y-2">
        {adminUserList.map((adminUser) => (
          <Card key={adminUser.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{adminUser.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Added on {new Date(adminUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteAdminUser(adminUser.id)}
                disabled={isLoading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {adminUserList.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No admin users found. Add the first admin user!</p>
        </div>
      )}
    </div>
  )
}
