"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Initialize sample users and predictions if none exist
  useEffect(() => {
    // Initialize sample users
    const storedUsers = localStorage.getItem("users")

    if (!storedUsers || JSON.parse(storedUsers).length === 0) {
      const sampleUsers = [
        {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          createdAt: Date.now(),
        },
        {
          id: "user-2",
          name: "Jane Smith",
          email: "jane@example.com",
          password: "password123",
          createdAt: Date.now(),
        },
        {
          id: "user-3",
          name: "Mike Johnson",
          email: "mike@example.com",
          password: "password123",
          createdAt: Date.now(),
        },
        {
          id: "user-4",
          name: "Sarah Williams",
          email: "sarah@example.com",
          password: "password123",
          createdAt: Date.now(),
        },
        {
          id: "user-5",
          name: "David Brown",
          email: "david@example.com",
          password: "password123",
          createdAt: Date.now(),
        },
      ]

      localStorage.setItem("users", JSON.stringify(sampleUsers))
    }

    // Initialize sample predictions if we have completed matches
    const storedPredictions = localStorage.getItem("userPredictions")
    const storedCompletedMatches = localStorage.getItem("completedMatches")

    if ((!storedPredictions || JSON.parse(storedPredictions).length === 0) && storedCompletedMatches) {
      const completedMatches = JSON.parse(storedCompletedMatches)
      const users = JSON.parse(storedUsers || "[]")

      if (completedMatches.length > 0 && users.length > 0) {
        const samplePredictions = []
        const today = new Date(2025, 2, 21).getTime() // March 21, 2025

        // Create sample predictions for each user for each completed match
        for (const user of users) {
          for (const match of completedMatches) {
            // Randomly decide if this user predicted this match
            if (Math.random() > 0.3) {
              // Create a prediction with random points distribution
              const team1Points = Math.floor(Math.random() * 11) // 0-10
              const team2Points = 10 - team1Points

              // Create the prediction
              samplePredictions.push({
                id: `pred-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                matchId: match.id,
                userId: user.email,
                team1Points,
                team2Points,
                result: "pending",
                createdAt: today - Math.floor(Math.random() * 86400000), // Random time today
              })
            }
          }
        }

        localStorage.setItem("userPredictions", JSON.stringify(samplePredictions))
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Get users from localStorage
      const storedUsers = localStorage.getItem("users") || "[]"
      const users = JSON.parse(storedUsers)

      // Find user with matching email and password
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (!user) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      // Set user session
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userName", user.name)
      localStorage.setItem("userEmail", user.email)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-muted/30 px-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-ipl-blue/5 via-ipl-purple/5 to-ipl-red/5 rounded-lg z-0"></div>
        <CardHeader className="space-y-1 relative z-10">
          <div className="mx-auto bg-gradient-to-r from-ipl-blue to-ipl-purple p-2 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-ipl-blue to-ipl-purple bg-clip-text text-transparent">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access IPL Predictor
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 relative z-10">
            {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 relative z-10">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-ipl-blue to-ipl-purple hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register
              </Link>
            </div>
            <div className="text-center text-sm">
              <Link href="/admin/login" className="text-primary hover:underline font-medium">
                Admin Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

