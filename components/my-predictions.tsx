"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Match } from "@/types/match"

interface Prediction {
  id: string
  matchId: string
  userId: string
  team1Points: number
  team2Points: number
  result?: "pending" | "correct" | "incorrect"
  pointsEarned?: number
  createdAt: number
}

interface PredictionWithMatch extends Prediction {
  match: Match
  status: "Upcoming" | "Completed"
}

export default function MyPredictions() {
  const [predictions, setPredictions] = useState<PredictionWithMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // Set fixed date to March 21, 2025
  const currentTime = new Date(2025, 2, 21).getTime()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        // Get user email
        const userEmail = localStorage.getItem("userEmail")

        if (!userEmail) {
          setPredictions([])
          setIsLoading(false)
          return
        }

        // Get predictions from localStorage
        const storedPredictions = localStorage.getItem("userPredictions") || "[]"
        const storedUpcomingMatches = localStorage.getItem("upcomingMatches") || "[]"
        const storedCompletedMatches = localStorage.getItem("completedMatches") || "[]"

        const userPredictions = JSON.parse(storedPredictions).filter((p: Prediction) => p.userId === userEmail)
        const upcoming = JSON.parse(storedUpcomingMatches)
        const completed = JSON.parse(storedCompletedMatches)
        const allMatches = [...upcoming, ...completed]

        // Combine predictions with match data
        const predictionsWithMatches = userPredictions
          .map((prediction: Prediction) => {
            const match = allMatches.find((m: Match) => m.id === prediction.matchId)

            if (!match) {
              return null
            }

            // Determine if match is upcoming or completed
            const status = match.status === "completed" ? "Completed" : "Upcoming"

            // For completed matches, determine if prediction was correct
            let result = prediction.result
            let pointsEarned = 0

            if (status === "Completed" && match.winner) {
              // Replace this logic with the new point system
              if (match.winner === match.team1.id) {
                // Team 1 won - award points allocated to Team 1
                pointsEarned = prediction.team1Points
                result = prediction.team1Points > prediction.team2Points ? "correct" : "incorrect"
              } else if (match.winner === match.team2.id) {
                // Team 2 won - award points allocated to Team 2
                pointsEarned = prediction.team2Points
                result = prediction.team2Points > prediction.team1Points ? "correct" : "incorrect"
              }
            }

            return {
              ...prediction,
              match,
              status,
              result,
              pointsEarned,
            }
          })
          .filter(Boolean) as PredictionWithMatch[]

        setPredictions(predictionsWithMatches)
      } catch (error) {
        console.error("Error loading predictions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">My Predictions</h2>
        </div>
        <Card className="p-8 text-center">
          <CardContent>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading predictions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">My Predictions</h2>
      </div>

      {predictions.length > 0 ? (
        <div className="grid gap-4">
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No predictions made yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PredictionCard({ prediction }: { prediction: PredictionWithMatch }) {
  return (
    <Card>
      <CardHeader className="pb-2 bg-secondary/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {prediction.match.team1.code} vs {prediction.match.team2.code}
          </CardTitle>
          <Badge
            variant={
              prediction.status === "Upcoming" ? "outline" : prediction.result === "correct" ? "default" : "destructive"
            }
          >
            {prediction.status === "Upcoming"
              ? prediction.match.date
              : prediction.result === "correct"
                ? "Correct"
                : "Incorrect"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: prediction.match.team1.color }}
            >
              <span className="text-white font-bold">{prediction.match.team1.code}</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{prediction.match.team1.name}</div>
              <div className="text-muted-foreground">{prediction.team1Points} points</div>
            </div>
          </div>
          <div className="text-sm font-medium">VS</div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-right">
              <div className="font-medium">{prediction.match.team2.name}</div>
              <div className="text-muted-foreground">{prediction.team2Points} points</div>
            </div>
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: prediction.match.team2.color }}
            >
              <span className="text-white font-bold">{prediction.match.team2.code}</span>
            </div>
          </div>
        </div>

        {prediction.status === "Completed" && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Points earned:</div>
              <div className="font-bold text-primary">{prediction.pointsEarned} points</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {prediction.result === "correct"
                ? "Your prediction was correct! You earned the points you allocated to the winning team."
                : "Your prediction was incorrect, but you still earned the points you allocated to the winning team."}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

