"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { Match } from "@/types/match"
import { Clock, Calendar, MapPin, Lock } from "lucide-react"

export default function MatchesToPredict() {
  // Set fixed date to March 22, 2025
  const fixedDate = new Date(2025, 2, 22).getTime() // Month is 0-indexed, so 2 = March
  const [currentTime, setCurrentTime] = useState(fixedDate)
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [predictionsLocked, setPredictionsLocked] = useState(false)

  // Fetch matches on component mount
  useEffect(() => {
    const getMatches = async () => {
      setIsLoading(true)
      try {
        // Check if predictions are locked globally
        const storedPredictionsLocked = localStorage.getItem("predictionsLocked")
        setPredictionsLocked(storedPredictionsLocked === "true")

        // In a real app, you would fetch from your API
        // For demo purposes, we'll use localStorage which is populated by the admin
        const storedMatches = localStorage.getItem("upcomingMatches")

        if (storedMatches) {
          const allMatches = JSON.parse(storedMatches)

          // Only show matches that are explicitly marked as visible by the admin
          // and have not started yet
          const visibleMatches = allMatches.filter((match: Match) => match.visible === true)

          // Sort matches by start time (earliest first)
          visibleMatches.sort((a: Match, b: Match) => a.startTimestamp - b.startTimestamp)

          setMatches(visibleMatches)
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getMatches()

    // Set up an interval to check for new matches every minute
    const matchesInterval = setInterval(getMatches, 60000)

    return () => clearInterval(matchesInterval)
  }, [currentTime])

  // Add a useEffect to check for match start times and update the UI accordingly
  useEffect(() => {
    // Check every 30 seconds if any matches have started
    const checkMatchStartTimes = () => {
      const now = new Date().getTime()

      setMatches((prevMatches) =>
        prevMatches.map((match) => {
          // If the match has started, we'll update the UI to show it's started
          if (now >= match.startTimestamp) {
            return { ...match, hasStarted: true }
          }
          return match
        }),
      )
    }

    const interval = setInterval(checkMatchStartTimes, 30000) // Check every 30 seconds

    // Run once immediately
    checkMatchStartTimes()

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Matches to Predict</h2>
        </div>
        <Card className="p-8 text-center">
          <CardContent>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading matches...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Matches to Predict</h2>
        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
          <Calendar className="h-4 w-4 text-primary" />
          <div className="text-sm font-medium">
            {new Date(currentTime).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {predictionsLocked && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4" />
          <p className="text-sm font-medium">Predictions are currently locked by the administrator.</p>
        </div>
      )}

      {matches.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} currentTime={currentTime} predictionsLocked={predictionsLocked} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-gradient-to-r from-muted/50 to-muted/30">
          <CardContent>
            <p className="text-muted-foreground">No matches are currently available for prediction.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new matches.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Update the MatchCard component to properly handle match start time
function MatchCard({
  match,
  currentTime,
  predictionsLocked,
}: { match: Match; currentTime: number; predictionsLocked: boolean }) {
  const [open, setOpen] = useState(false)
  // Check if the current time is past the match start time
  const hasMatchStarted = currentTime >= match.startTimestamp
  // A match's predictions are locked if global predictions are locked OR if the match has started
  const isPredictionClosed = hasMatchStarted || predictionsLocked
  const timeRemaining = getTimeRemaining(match.startTimestamp, currentTime)

  // Check if user has already predicted this match
  const [hasPredicted, setHasPredicted] = useState(false)

  useEffect(() => {
    const checkPrediction = () => {
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) return

      const storedPredictions = localStorage.getItem("userPredictions")
      if (!storedPredictions) return

      const predictions = JSON.parse(storedPredictions)
      const hasPredicted = predictions.some((p: any) => p.matchId === match.id && p.userId === userEmail)

      setHasPredicted(hasPredicted)
    }

    checkPrediction()
  }, [match.id])

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader className="pb-2 bg-secondary/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {match.team1.code} vs {match.team2.code}
          </CardTitle>
          <Badge variant="outline" className="bg-white/50">
            {match.date} - {match.time}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {match.venue}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: match.team1.color }}
            >
              <span className="text-white font-bold">{match.team1.code}</span>
            </div>
            <div className="text-sm font-medium">{match.team1.name}</div>
          </div>
          <div className="text-sm font-bold text-primary">VS</div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">{match.team2.name}</div>
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: match.team2.color }}
            >
              <span className="text-white font-bold">{match.team2.code}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-center mb-4">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <Badge variant={isPredictionClosed ? "destructive" : "outline"}>
              {predictionsLocked
                ? "Predictions Locked by Admin"
                : hasMatchStarted
                  ? "Match Started - Predictions Locked"
                  : `Starts in: ${timeRemaining}`}
            </Badge>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={isPredictionClosed} variant={hasPredicted ? "outline" : "default"}>
              {predictionsLocked
                ? "Predictions Locked"
                : hasMatchStarted
                  ? "Match Started"
                  : hasPredicted
                    ? "Update Prediction"
                    : "Predict Winner"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <PredictionForm match={match} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// Helper function to format the time remaining
function getTimeRemaining(targetTime: number, currentTime: number): string {
  const timeRemaining = targetTime - currentTime

  if (timeRemaining <= 0) {
    return "Started"
  }

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

function PredictionForm({ match, onClose }: { match: Match; onClose: () => void }) {
  const [team1Points, setTeam1Points] = useState(5)
  const [team2Points, setTeam2Points] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user has already predicted this match
  useEffect(() => {
    const loadExistingPrediction = () => {
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) return

      const storedPredictions = localStorage.getItem("userPredictions")
      if (!storedPredictions) return

      const predictions = JSON.parse(storedPredictions)
      const existingPrediction = predictions.find((p: any) => p.matchId === match.id && p.userId === userEmail)

      if (existingPrediction) {
        setTeam1Points(existingPrediction.team1Points)
        setTeam2Points(existingPrediction.team2Points)
      }
    }

    loadExistingPrediction()
  }, [match.id])

  const handleTeam1PointsChange = (value: number[]) => {
    const newValue = value[0]
    setTeam1Points(newValue)
    setTeam2Points(10 - newValue)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Get user info
      const userId = localStorage.getItem("userEmail") || ""

      // Create prediction object
      const prediction = {
        id: `pred-${Date.now()}`,
        matchId: match.id,
        userId,
        team1Points,
        team2Points,
        result: "pending",
        createdAt: Date.now(),
      }

      // In a real app, you would call your API to save the prediction
      // For demo purposes, we'll save to localStorage
      const storedPredictions = localStorage.getItem("userPredictions") || "[]"
      const predictions = JSON.parse(storedPredictions)

      // Check if user already predicted this match
      const existingPredIndex = predictions.findIndex((p: any) => p.matchId === match.id && p.userId === userId)

      if (existingPredIndex >= 0) {
        // Update existing prediction
        predictions[existingPredIndex] = prediction
      } else {
        // Add new prediction
        predictions.push(prediction)
      }

      localStorage.setItem("userPredictions", JSON.stringify(predictions))

      // Show success message or notification
      onClose()
    } catch (error) {
      console.error("Failed to submit prediction", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl text-primary">Predict Match Winner</DialogTitle>
        <DialogDescription>Distribute your 10 points between the two teams based on your prediction.</DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: match.team1.color }}
              >
                <span className="text-white font-bold">{match.team1.code}</span>
              </div>
              <div className="font-medium">{match.team1.name}</div>
            </div>
            <div className="font-bold text-lg" style={{ color: match.team1.color }}>
              {team1Points} pts
            </div>
          </div>

          <Slider
            value={[team1Points]}
            min={0}
            max={10}
            step={1}
            onValueChange={handleTeam1PointsChange}
            className="py-4"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: match.team2.color }}
              >
                <span className="text-white font-bold">{match.team2.code}</span>
              </div>
              <div className="font-medium">{match.team2.name}</div>
            </div>
            <div className="font-bold text-lg" style={{ color: match.team2.color }}>
              {team2Points} pts
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-md text-sm">
          <p className="font-medium">How it works:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
            <li>You have 10 points to distribute between the two teams</li>
            <li>Points represent your confidence in each team winning</li>
            <li>You'll earn the points you assigned to the winning team</li>
            <li>Even if your prediction is incorrect, you'll still earn points allocated to the winning team</li>
          </ul>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Prediction"}
        </Button>
      </DialogFooter>
    </>
  )
}

