"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Match, Team } from "@/types/match"
import { Trash2, Trophy, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface AdminMatchesProps {
  matches: Match[]
  teams: Team[]
  onDelete: (matchId: string) => void
  onComplete: (matchId: string, winnerId: string) => void
  onToggleVisibility: (matchId: string, visible: boolean) => void
}

export default function AdminMatches({ matches, teams, onDelete, onComplete, onToggleVisibility }: AdminMatchesProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState<string>("")

  const handleCompleteMatch = () => {
    if (!selectedMatch || !selectedWinner) return

    onComplete(selectedMatch.id, selectedWinner)
    setShowCompleteDialog(false)
    setSelectedMatch(null)
    setSelectedWinner("")
  }

  const openCompleteDialog = (match: Match) => {
    setSelectedMatch(match)
    setSelectedWinner("")
    setShowCompleteDialog(true)
  }

  const handleToggleVisibility = (match: Match) => {
    onToggleVisibility(match.id, !match.visible)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Manage Matches</h2>
      </div>

      <div className="bg-muted/50 p-4 rounded-md mb-4">
        <h3 className="text-lg font-medium mb-2">Match Visibility Guide</h3>
        <p className="text-sm text-muted-foreground mb-2">
          When a match is{" "}
          <Badge variant="default" className="mx-1">
            Shown to Users
          </Badge>
          , it becomes available for prediction. Use the Show/Hide button to control which matches users can predict.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Shown = Available for prediction</span>
          </div>
          <div className="flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Hidden = Not available for prediction</span>
          </div>
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => (
            <Card key={match.id} className={`overflow-hidden border shadow-md ${!match.visible ? "opacity-70" : ""}`}>
              <CardHeader className="pb-2 bg-secondary/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {match.team1.code} vs {match.team2.code}
                  </CardTitle>
                  <Badge variant="outline" className="bg-white/50">
                    {match.date}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{match.venue}</div>
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

                <div className="mt-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Match Time:</span>
                    <span>{match.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={match.visible ? "default" : "outline"}>
                      {match.visible ? "Shown to Users" : "Hidden from Users"}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(match.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button
                      variant={match.visible ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleVisibility(match)}
                    >
                      {match.visible ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Show
                        </>
                      )}
                    </Button>
                  </div>
                  <Button variant="default" size="sm" onClick={() => openCompleteDialog(match)}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No matches. Create a new match to get started.</p>
          </CardContent>
        </Card>
      )}

      {/* Complete Match Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Complete Match</DialogTitle>
            <DialogDescription>
              Select the winner for {selectedMatch?.team1.name} vs {selectedMatch?.team2.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div
                    className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
                    style={{ backgroundColor: selectedMatch?.team1.color }}
                  >
                    <span className="text-white font-bold text-xl">{selectedMatch?.team1.code}</span>
                  </div>
                  <div className="font-medium">{selectedMatch?.team1.name}</div>
                </div>

                <div className="text-xl font-bold">VS</div>

                <div className="text-center">
                  <div
                    className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
                    style={{ backgroundColor: selectedMatch?.team2.color }}
                  >
                    <span className="text-white font-bold text-xl">{selectedMatch?.team2.code}</span>
                  </div>
                  <div className="font-medium">{selectedMatch?.team2.name}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Winner</label>
                <Select value={selectedWinner} onValueChange={setSelectedWinner}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select the winning team" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedMatch && (
                      <>
                        <SelectItem value={selectedMatch.team1.id}>{selectedMatch.team1.name}</SelectItem>
                        <SelectItem value={selectedMatch.team2.id}>{selectedMatch.team2.name}</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteMatch} disabled={!selectedWinner}>
              Save Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

