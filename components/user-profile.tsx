"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User } from "lucide-react"

interface UserProfileProps {
  onClose?: () => void
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    // Load user data
    const storedUserName = localStorage.getItem("userName") || ""
    const storedUserEmail = localStorage.getItem("userEmail") || ""

    setUserName(storedUserName)
    setUserEmail(storedUserEmail)

    // Load profile picture if exists
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUser = users.find((u: any) => u.email === storedUserEmail)

    if (currentUser && currentUser.profilePicture) {
      setProfilePicture(currentUser.profilePicture)
    }
  }, [])

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size should be less than 5MB" })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file" })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfilePicture(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      // Update user data in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.email === userEmail)

      if (userIndex >= 0) {
        // Update user name and profile picture
        users[userIndex].name = userName
        if (profilePicture) {
          users[userIndex].profilePicture = profilePicture
        }

        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("userName", userName)

        setMessage({ type: "success", text: "Profile updated successfully" })
      } else {
        setMessage({ type: "error", text: "User not found" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {message.text && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === "error" ? "bg-destructive/15 text-destructive" : "bg-green-100 text-green-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {profilePicture ? (
                  <AvatarImage src={profilePicture} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload profile picture</span>
              </label>
              <Input
                id="profile-picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">Click the camera icon to upload a profile picture</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={userEmail} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

