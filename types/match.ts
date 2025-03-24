export interface Team {
  id: string
  name: string
  code: string
  color: string
}

export interface Match {
  id: string
  team1: Team
  team2: Team
  date: string
  time: string
  venue: string
  startTimestamp: number
  status: "scheduled" | "live" | "completed"
  visible: boolean
  winner?: string
  winnerTeam?: Team
}

export interface Prediction {
  id: string
  matchId: string
  userId: string
  team1Points: number
  team2Points: number
  result?: "pending" | "correct" | "incorrect"
  pointsEarned?: number
  createdAt: number
}

export interface User {
  id: string
  name: string
  email: string
  points: number
  correctPredictions: number
  totalPredictions: number
  rank: number
}

