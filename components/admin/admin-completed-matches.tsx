"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Match } from "@/types/match"
import { Trophy } from "lucide-react"

interface AdminCompletedMatchesProps {
  matches: Match[]
}

export default function AdminCompletedMatches({ matches }: AdminCompletedMatchesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Completed Matches</h2>
      </div>

      {matches.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => (
            <Card key={match.id} className="border shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-secondary/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {match.team1.code} vs {match.team2.code}
                  </CardTitle>
                  <Badge variant="outline">{match.date}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{match.venue}</div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${match.winner === match.team1.id ? "ring-2 ring-green-500" : ""}`}
                      style={{ backgroundColor: match.team1.color }}
                    >
                      <span className="text-white font-bold">{match.team1.code}</span>
                    </div>
                    <div className="text-sm font-medium">{match.team1.name}</div>
                  </div>
                  <div className="text-sm font-medium">VS</div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{match.team2.name}</div>
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${match.winner === match.team2.id ? "ring-2 ring-green-500" : ""}`}
                      style={{ backgroundColor: match.team2.color }}
                    >
                      <span className="text-white font-bold">{match.team2.code}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <Badge className="bg-primary">
                    <Trophy className="h-3 w-3 mr-1" />
                    {match.winnerTeam?.name} Won
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No completed matches yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

