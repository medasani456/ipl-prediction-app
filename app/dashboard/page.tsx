"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import MatchesToPredict from "@/components/matches-to-predict"
import Leaderboard from "@/components/leaderboard"
import MyPredictions from "@/components/my-predictions"

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  // Set fixed date to March 22, 2025
  const [currentDate] = useState(new Date(2025, 2, 22)) // Month is 0-indexed, so 2 = March

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const storedUserName = localStorage.getItem("userName")
    const storedUserEmail = localStorage.getItem("userEmail")

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Set user data
    setUserName(storedUserName || "User")
    setUserEmail(storedUserEmail || "")
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary/30">
      <header className="bg-primary py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">IPL Predictor 2025</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9 border-2 border-white">
                  <AvatarFallback className="bg-ipl-darkgreen text-white">{userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{userName}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-100 text-primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="predict" className="space-y-4">
          <TabsList className="bg-primary">
            <TabsTrigger value="predict" className="data-[state=active]:bg-white">
              Matches to Predict
            </TabsTrigger>
            <TabsTrigger value="predictions" className="data-[state=active]:bg-white">
              My Predictions
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white">
              Top 15
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predict" className="space-y-4">
            <MatchesToPredict />
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <MyPredictions />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

