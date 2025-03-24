"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Match, Team } from "@/types/match"
import { CalendarIcon, Clock, MapPin, Eye, EyeOff } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface AdminCreateMatchProps {
  teams: Team[]
  onCreate: (match: Match) => boolean
  currentDate: Date
}

export default function AdminCreateMatch({ teams, onCreate, currentDate }: AdminCreateMatchProps) {
  const [team1Id, setTeam1Id] = useState("")
  const [team2Id, setTeam2Id] = useState("")
  const [venue, setVenue] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("19:30") // Default to 7:30 PM
  const [visible, setVisible] = useState(true) // Default to visible
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate inputs
    if (!team1Id || !team2Id || !venue || !date || !time) {
      setError("Please fill in all fields")
      return
    }

    if (team1Id === team2Id) {
      setError("Teams must be different")
      return
    }

    setIsSubmitting(true)

    try {
      // Find the selected teams
      const team1 = teams.find((team) => team.id === team1Id)
      const team2 = teams.find((team) => team.id === team2Id)

      if (!team1 || !team2) {
        setError("Invalid team selection")
        return
      }

      // Create match date and time
      const [hours, minutes] = time.split(":").map(Number)
      const matchDate = new Date(date)
      matchDate.setHours(hours, minutes, 0)

      // Format date for display - ensure proper formatting
      const formattedDate = format(matchDate, "MMM d, yyyy")

      // Format time for display - ensure proper formatting
      const formattedTime = format(matchDate, "h:mm a")

      // Create new match object with properly formatted date and time
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        team1,
        team2,
        date: formattedDate,
        time: formattedTime,
        venue,
        startTimestamp: matchDate.getTime(),
        status: "scheduled",
        visible: visible,
      }

      // Add the match
      const success = onCreate(newMatch)

      if (success) {
        // Reset form
        setTeam1Id("")
        setTeam2Id("")
        setVenue("")
        setDate(undefined)
        setTime("19:30")
        setVisible(true)
      }
    } catch (err) {
      setError("Failed to create match. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border shadow-md overflow-hidden">
      <CardHeader className="bg-secondary/50">
        <CardTitle className="text-xl text-primary">Create New Match</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="team1">Team 1</Label>
              <Select value={team1Id} onValueChange={setTeam1Id}>
                <SelectTrigger id="team1" className="bg-white">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: team.color }}></div>
                        {team.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team2">Team 2</Label>
              <Select value={team2Id} onValueChange={setTeam2Id}>
                <SelectTrigger id="team2" className="bg-white">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: team.color }}></div>
                        {team.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue" className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Venue
              </Label>
              <Input
                id="venue"
                placeholder="e.g. Wankhede Stadium, Mumbai"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < currentDate}
                    defaultMonth={currentDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility" className="block mb-2">
                Show to Users
              </Label>
              <div className="flex items-center space-x-2">
                <Switch id="visibility" checked={visible} onCheckedChange={setVisible} />
                <Label htmlFor="visibility" className="flex items-center gap-1">
                  {visible ? (
                    <span className="text-primary flex items-center gap-1">
                      <Eye className="h-4 w-4" /> Available for prediction
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <EyeOff className="h-4 w-4" /> Hidden from users
                    </span>
                  )}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                When a match is shown to users, they can make predictions for it until the match starts
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Match"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

