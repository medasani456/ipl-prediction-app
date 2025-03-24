"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
import type { Match, Team } from "@/types/match"
import AdminMatches from "@/components/admin/admin-matches"
import AdminCreateMatch from "@/components/admin/admin-create-match"
import AdminCompletedMatches from "@/components/admin/admin-completed-matches"
import AdminUsers from "@/components/admin/admin-users"
import { Download, Upload, Lock, Unlock, Trash2, RefreshCw, Eye } from "lucide-react"

// Teams data
export const teams: Team[] = [
  { id: "MI", name: "Mumbai Indians", code: "MI", color: "#004BA0" },
  { id: "CSK", name: "Chennai Super Kings", code: "CSK", color: "#FFFF00" },
  { id: "RCB", name: "Royal Challengers Bangalore", code: "RCB", color: "#EC1C24" },
  { id: "KKR", name: "Kolkata Knight Riders", code: "KKR", color: "#3A225D" },
  { id: "DC", name: "Delhi Capitals", code: "DC", color: "#0078BC" },
  { id: "RR", name: "Rajasthan Royals", code: "RR", color: "#EA1A85" },
  { id: "PBKS", name: "Punjab Kings", code: "PBKS", color: "#ED1B24" },
  { id: "SRH", name: "Sunrisers Hyderabad", code: "SRH", color: "#F7A721" },
  { id: "GT", name: "Gujarat Titans", code: "GT", color: "#1C1C1C" },
  { id: "LSG", name: "Lucknow Super Giants", code: "LSG", color: "#A72056" },
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [completedMatches, setCompletedMatches] = useState<Match[]>([])
  const [userCount, setUserCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [predictionsLocked, setPredictionsLocked] = useState(false)

  // Alert dialog states
  const [showClearCompletedDialog, setShowClearCompletedDialog] = useState(false)
  const [showClearUsersDialog, setShowClearUsersDialog] = useState(false)
  const [showResetLeaderboardDialog, setShowResetLeaderboardDialog] = useState(false)

  // Set fixed date to March 22, 2025
  const [currentDate] = useState(new Date(2025, 2, 22)) // Month is 0-indexed, so 2 = March

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn")

    if (!isAdminLoggedIn) {
      router.push("/admin/login")
      return
    }

    // Load data from localStorage if available
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const storedUpcomingMatches = localStorage.getItem("upcomingMatches")
      const storedCompletedMatches = localStorage.getItem("completedMatches")
      const storedUsers = localStorage.getItem("users")
      const storedPredictionsLocked = localStorage.getItem("predictionsLocked")

      if (storedUpcomingMatches) {
        const matches = JSON.parse(storedUpcomingMatches)
        // Ensure all matches have a visibility property and status property
        const updatedMatches = matches.map((match: Match) => ({
          ...match,
          visible: match.visible !== undefined ? match.visible : true,
          status: match.status || "scheduled",
        }))

        setUpcomingMatches(updatedMatches)
        localStorage.setItem("upcomingMatches", JSON.stringify(updatedMatches))
      }

      if (storedCompletedMatches) {
        const matches = JSON.parse(storedCompletedMatches)
        // Ensure all completed matches have a status property
        const updatedMatches = matches.map((match: Match) => ({
          ...match,
          status: "completed",
        }))
        setCompletedMatches(updatedMatches)
        localStorage.setItem("completedMatches", JSON.stringify(updatedMatches))
      }

      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        setUserCount(users.length)
      }

      if (storedPredictionsLocked) {
        setPredictionsLocked(storedPredictionsLocked === "true")
      }

      setIsLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn")
    localStorage.removeItem("adminEmail")
    router.push("/admin/login")
  }

  const handleCreateMatch = (newMatch: Match) => {
    const updatedMatches = [...upcomingMatches, newMatch]
    setUpcomingMatches(updatedMatches)

    // Save to localStorage
    localStorage.setItem("upcomingMatches", JSON.stringify(updatedMatches))
    return true
  }

  const handleDeleteMatch = (matchId: string) => {
    const updatedMatches = upcomingMatches.filter((match) => match.id !== matchId)
    setUpcomingMatches(updatedMatches)

    // Save to localStorage
    localStorage.setItem("upcomingMatches", JSON.stringify(updatedMatches))
  }

  const handleCompleteMatch = (matchId: string, winnerId: string) => {
    // Find the match
    const match = upcomingMatches.find((m) => m.id === matchId)
    if (!match) return

    // Find the winner team
    const winnerTeam = teams.find((team) => team.id === winnerId)
    if (!winnerTeam) return

    // Update the match with winner
    const completedMatch: Match = {
      ...match,
      status: "completed",
      winner: winnerId,
      winnerTeam,
    }

    // Remove from upcoming and add to completed
    const updatedUpcoming = upcomingMatches.filter((m) => m.id !== matchId)
    const updatedCompleted = [...completedMatches, completedMatch]

    setUpcomingMatches(updatedUpcoming)
    setCompletedMatches(updatedCompleted)

    // Save to localStorage
    localStorage.setItem("upcomingMatches", JSON.stringify(updatedUpcoming))
    localStorage.setItem("completedMatches", JSON.stringify(updatedCompleted))
  }

  // Match visibility functions
  const handleToggleMatchVisibility = (matchId: string, visible: boolean) => {
    const updatedMatches = upcomingMatches.map((match) => (match.id === matchId ? { ...match, visible } : match))

    setUpcomingMatches(updatedMatches)
    localStorage.setItem("upcomingMatches", JSON.stringify(updatedMatches))
  }

  // Export matches to JSON
  const handleExportMatches = () => {
    const data = {
      upcomingMatches,
      completedMatches,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "ipl-matches-export.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import matches from JSON
  const handleImportMatches = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        if (data.upcomingMatches && Array.isArray(data.upcomingMatches)) {
          setUpcomingMatches(data.upcomingMatches)
          localStorage.setItem("upcomingMatches", JSON.stringify(data.upcomingMatches))
        }

        if (data.completedMatches && Array.isArray(data.completedMatches)) {
          setCompletedMatches(data.completedMatches)
          localStorage.setItem("completedMatches", JSON.stringify(data.completedMatches))
        }

        alert("Matches imported successfully!")
      } catch (error) {
        console.error("Error importing matches:", error)
        alert("Failed to import matches. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  // Toggle predictions lock
  const handleTogglePredictionsLock = () => {
    const newState = !predictionsLocked
    setPredictionsLocked(newState)
    localStorage.setItem("predictionsLocked", newState.toString())
  }

  // Clear all completed matches
  const handleClearCompletedMatches = () => {
    setCompletedMatches([])
    localStorage.setItem("completedMatches", "[]")
    setShowClearCompletedDialog(false)
  }

  // Clear all users
  const handleClearAllUsers = () => {
    localStorage.setItem("users", "[]")
    setUserCount(0)
    setShowClearUsersDialog(false)
  }

  // Reset leaderboard
  const handleResetLeaderboard = () => {
    // Clear all user predictions
    localStorage.setItem("userPredictions", "[]")
    setShowResetLeaderboardDialog(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-secondary/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary/30">
      <header className="bg-primary py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">IPL Predictor Admin</h1>
            <div className="flex items-center gap-4">
              <div className="text-white bg-white/10 px-3 py-1 rounded-full">
                <span className="font-medium">Today: </span>
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
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
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleExportMatches} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Matches
            </Button>
            <div className="relative">
              <input type="file" id="import-file" className="hidden" accept=".json" onChange={handleImportMatches} />
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => document.getElementById("import-file")?.click()}
              >
                <Upload className="h-4 w-4" />
                Import Matches
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
            <div className="flex items-center space-x-2">
              <Switch id="predictions-lock" checked={predictionsLocked} onCheckedChange={handleTogglePredictionsLock} />
              <Label
                htmlFor="predictions-lock"
                className={predictionsLocked ? "text-destructive font-medium" : "text-primary font-medium"}
              >
                {predictionsLocked ? (
                  <span className="flex items-center gap-1">
                    <Lock className="h-4 w-4" /> Predictions Locked
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Unlock className="h-4 w-4" /> Predictions Allowed
                  </span>
                )}
              </Label>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="card-hover border shadow-md">
            <CardHeader className="pb-2 bg-secondary/50">
              <CardTitle className="text-xl text-primary">Available Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{upcomingMatches.length}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3 text-primary" />
                Shown to users: {upcomingMatches.filter((m) => m.visible).length}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border shadow-md">
            <CardHeader className="pb-2 bg-secondary/50">
              <CardTitle className="text-xl text-primary">Completed Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedMatches.length}</div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {completedMatches.length > 0
                    ? `Last: ${completedMatches[completedMatches.length - 1].winnerTeam?.name} won`
                    : "No results yet"}
                </div>
                {completedMatches.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setShowClearCompletedDialog(true)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border shadow-md">
            <CardHeader className="pb-2 bg-secondary/50">
              <CardTitle className="text-xl text-primary">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userCount}</div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">Registered users</div>
                {userCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setShowClearUsersDialog(true)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowResetLeaderboardDialog(true)}
          >
            <RefreshCw className="h-4 w-4" />
            Reset Leaderboard
          </Button>
        </div>

        <Tabs defaultValue="matches" className="space-y-4">
          <TabsList className="bg-primary">
            <TabsTrigger value="matches" className="data-[state=active]:bg-white">
              Manage Matches
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-white">
              Create Match
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white">
              Completed Matches
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white">
              Manage Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-4">
            <AdminMatches
              matches={upcomingMatches}
              teams={teams}
              onDelete={handleDeleteMatch}
              onComplete={handleCompleteMatch}
              onToggleVisibility={handleToggleMatchVisibility}
            />
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <AdminCreateMatch teams={teams} onCreate={handleCreateMatch} currentDate={currentDate} />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <AdminCompletedMatches matches={completedMatches} />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <AdminUsers />
          </TabsContent>
        </Tabs>
      </main>

      {/* Clear Completed Matches Dialog */}
      <AlertDialog open={showClearCompletedDialog} onOpenChange={setShowClearCompletedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Completed Matches?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all completed matches and their results. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCompletedMatches}
              className="bg-destructive text-destructive-foreground"
            >
              Clear All Completed Matches
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Users Dialog */}
      <AlertDialog open={showClearUsersDialog} onOpenChange={setShowClearUsersDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Users?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all user accounts. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAllUsers} className="bg-destructive text-destructive-foreground">
              Clear All Users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Leaderboard Dialog */}
      <AlertDialog open={showResetLeaderboardDialog} onOpenChange={setShowResetLeaderboardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Leaderboard?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all user predictions and reset the leaderboard. Users will keep their accounts but lose
              all prediction history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetLeaderboard} className="bg-destructive text-destructive-foreground">
              Reset Leaderboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

