"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Trophy, AlertCircle } from "lucide-react"

interface UserScore {
  id: string
  name: string
  email: string
  totalPoints: number
  correctPredictions: number
  totalPredictions: number
  rank: number
  isCurrentUser?: boolean
}

export default function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [leaderboardData, setLeaderboardData] = useState<UserScore[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserScore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [noPredictions, setNoPredictions] = useState(false)

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true)

      try {
        // Get current user email
        const currentUserEmail = localStorage.getItem("userEmail")

        // Get all registered users
        const storedUsers = localStorage.getItem("users") || "[]"
        const users = JSON.parse(storedUsers)

        // Get all predictions and completed matches
        const storedPredictions = localStorage.getItem("userPredictions") || "[]"
        const completedMatches = localStorage.getItem("completedMatches") || "[]"

        const predictions = JSON.parse(storedPredictions)
        const matches = JSON.parse(completedMatches)

        // Check if there are any predictions
        if (predictions.length === 0) {
          setNoPredictions(true)
          setIsLoading(false)
          return
        }

        // Create a map of all users with initial scores
        const userScores: UserScore[] = users.map((user: any) => ({
          id: user.id || user.email,
          name: user.name,
          email: user.email,
          totalPoints: 0,
          correctPredictions: 0,
          totalPredictions: 0,
          rank: 0,
          isCurrentUser: user.email === currentUserEmail,
        }))

        // Calculate points for each user
        predictions.forEach((prediction: any) => {
          // Find the user in our array
          const userIndex = userScores.findIndex((u) => u.email === prediction.userId)
          if (userIndex === -1) return // Skip if user not found

          const user = userScores[userIndex]
          user.totalPredictions++

          // Find the match
          const match = matches.find((m: any) => m.id === prediction.matchId)
          if (!match || !match.winner) return // Skip if match not found or no winner

          // Check if prediction was correct and calculate points
          let pointsEarned = 0
          if (match.winner === match.team1.id) {
            // Team 1 won - award points allocated to Team 1
            pointsEarned = prediction.team1Points
            if (prediction.team1Points > prediction.team2Points) {
              user.correctPredictions++
            }
          } else if (match.winner === match.team2.id) {
            // Team 2 won - award points allocated to Team 2
            pointsEarned = prediction.team2Points
            if (prediction.team2Points > prediction.team1Points) {
              user.correctPredictions++
            }
          }

          // Add to total points
          user.totalPoints += pointsEarned
          userScores[userIndex] = user
        })

        // Sort by total points
        userScores.sort((a, b) => b.totalPoints - a.totalPoints)

        // Add rank
        const rankedUsers = userScores.map((user, index) => ({
          ...user,
          rank: index + 1,
        }))

        setLeaderboardData(rankedUsers)
        setFilteredUsers(rankedUsers.slice(0, 15))
        setNoPredictions(false)
      } catch (error) {
        console.error("Error loading leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredUsers(leaderboardData.slice(0, 15))
    } else {
      setFilteredUsers(
        leaderboardData.filter((user) => user.name.toLowerCase().includes(term.toLowerCase())).slice(0, 15),
      )
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Top 15 Leaderboard</h2>
        </div>
        <Card className="p-8 text-center">
          <CardContent>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Top 15 Leaderboard</h2>
      </div>

      {!noPredictions && (
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
      )}

      <Card className="border shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-secondary/50">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Top Predictors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {noPredictions ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">The leaderboard has been reset.</p>
              <p className="text-sm text-muted-foreground mt-2">
                No predictions have been made yet. Make predictions to appear on the leaderboard!
              </p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                    user.isCurrentUser ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 text-center font-bold ${
                        user.rank <= 3 ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {user.rank}
                    </div>
                    <Avatar className="h-8 w-8 border border-muted">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {user.name}
                        {user.isCurrentUser && (
                          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.correctPredictions}/{user.totalPredictions} correct predictions
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-primary">{user.totalPoints} pts</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

