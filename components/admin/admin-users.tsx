"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Trash2, Users } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: number
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        const storedUsers = localStorage.getItem("users") || "[]"
        const parsedUsers = JSON.parse(storedUsers)
        setUsers(parsedUsers)
        setFilteredUsers(parsedUsers)
      } catch (error) {
        console.error("Error loading users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredUsers(users)
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(term.toLowerCase()) ||
            user.email.toLowerCase().includes(term.toLowerCase()),
        ),
      )
    }
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const confirmDeleteUser = () => {
    if (!selectedUser) return

    const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
    setUsers(updatedUsers)
    setFilteredUsers(filteredUsers.filter((user) => user.id !== selectedUser.id))

    // Update localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Close dialog
    setShowDeleteDialog(false)
    setSelectedUser(null)
  }

  const handleDeleteAllUsers = () => {
    setShowDeleteAllDialog(true)
  }

  const confirmDeleteAllUsers = () => {
    // Clear all users
    localStorage.setItem("users", "[]")
    setUsers([])
    setFilteredUsers([])
    setShowDeleteAllDialog(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Manage Users</h2>
        </div>
        <Card className="p-8 text-center">
          <CardContent>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Manage Users</h2>
        {users.length > 0 && (
          <Button variant="destructive" size="sm" onClick={handleDeleteAllUsers} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete All Users
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8 bg-white"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <Card className="border shadow-md overflow-hidden">
        <CardHeader className="bg-secondary/50">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{new Date(user.createdAt).toLocaleDateString()}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete User Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for {selectedUser?.name} ({selectedUser?.email}). This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Users Confirmation */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Users?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete ALL user accounts ({users.length} users). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAllUsers} className="bg-destructive text-destructive-foreground">
              Delete All Users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

