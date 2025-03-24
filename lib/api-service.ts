import type { Match, Team } from "@/types/match"

// Define the base URL for the cricket API
// Note: In a production app, you would use a real cricket API with proper authentication
const API_BASE_URL = "https://api.cricapi.com/v1"

// This would be stored as an environment variable in a real application
const API_KEY = "your-api-key"

/**
 * Fetches upcoming IPL matches from the cricket API
 * This function would be called daily to update the matches database
 */
export async function fetchUpcomingMatches(): Promise<Match[]> {
  try {
    // In a real implementation, you would make an actual API call
    // For demo purposes, we're returning mock data
    // const response = await fetch(`${API_BASE_URL}/matches?apikey=${API_KEY}&league=ipl`);
    // if (!response.ok) throw new Error('Failed to fetch matches');
    // const data = await response.json();

    // Mock data representing what we'd get from the API
    return generateMockMatches()
  } catch (error) {
    console.error("Error fetching upcoming matches:", error)
    return []
  }
}

/**
 * Generates mock IPL match data for demonstration purposes
 * In a real app, this would be replaced with actual API data
 */
function generateMockMatches(): Match[] {
  const teams: Team[] = [
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

  // Create upcoming matches
  const matches: Match[] = []

  // Add tomorrow's RCB vs KKR match
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Find RCB and KKR in our teams array
  const rcbTeam = teams.find((team) => team.code === "RCB")!
  const kkrTeam = teams.find((team) => team.code === "KKR")!

  // Set match time to 7:30 PM IST tomorrow
  const matchTime = "19:30:00"
  const matchDateTime = new Date(`${tomorrow.toISOString().split("T")[0]}T${matchTime}+05:30`)

  matches.push({
    id: "match-rcb-kkr-2025",
    team1: rcbTeam,
    team2: kkrTeam,
    date: formatDate(matchDateTime),
    time: "7:30 PM",
    venue: "M. Chinnaswamy Stadium, Bangalore",
    startTimestamp: matchDateTime.getTime(),
    details: {
      tournament: "IPL 2025",
      matchNumber: 24,
      season: "2025",
      umpires: ["Kumar Dharmasena", "Nitin Menon"],
      referee: "Javagal Srinath",
      weather: "Clear, 26°C",
      toss: "Pending",
    },
  })

  // Add a few more upcoming matches
  const now = new Date()

  for (let i = 2; i < 8; i++) {
    const matchDate = new Date(now)
    matchDate.setDate(matchDate.getDate() + i)

    // Create 1-2 matches per day
    const matchesPerDay = Math.random() > 0.5 ? 2 : 1

    for (let j = 0; j < matchesPerDay; j++) {
      // Select two random teams
      const teamIndices = getRandomTeamIndices(teams.length)
      const team1 = teams[teamIndices[0]]
      const team2 = teams[teamIndices[1]]

      // Set match time (either 3:30 PM or 7:30 PM IST)
      const matchTime = j === 0 ? "15:30:00" : "19:30:00"
      const matchDateTime = new Date(`${matchDate.toISOString().split("T")[0]}T${matchTime}+05:30`)

      matches.push({
        id: `match-${matches.length + 1}`,
        team1,
        team2,
        date: formatDate(matchDateTime),
        time: matchDateTime.getHours() > 16 ? "7:30 PM" : "3:30 PM",
        venue: getRandomVenue(),
        startTimestamp: matchDateTime.getTime(),
        details: {
          tournament: "IPL 2025",
          matchNumber: 24 + matches.length,
          season: "2025",
          umpires: ["Richard Illingworth", "Anil Chaudhary"],
          referee: "Ranjan Madugalle",
          weather: "Partly Cloudy, 28°C",
          toss: "Pending",
        },
      })
    }
  }

  return matches
}

/**
 * Returns two random, unique team indices
 */
function getRandomTeamIndices(teamCount: number): [number, number] {
  const index1 = Math.floor(Math.random() * teamCount)
  let index2 = Math.floor(Math.random() * teamCount)

  // Ensure we don't get the same team twice
  while (index2 === index1) {
    index2 = Math.floor(Math.random() * teamCount)
  }

  return [index1, index2]
}

/**
 * Returns a random IPL venue
 */
function getRandomVenue(): string {
  const venues = [
    "Wankhede Stadium, Mumbai",
    "M. Chinnaswamy Stadium, Bangalore",
    "Eden Gardens, Kolkata",
    "Arun Jaitley Stadium, Delhi",
    "MA Chidambaram Stadium, Chennai",
    "Punjab Cricket Association Stadium, Mohali",
    "Rajiv Gandhi International Stadium, Hyderabad",
    "Narendra Modi Stadium, Ahmedabad",
    "Sawai Mansingh Stadium, Jaipur",
    "Ekana Cricket Stadium, Lucknow",
  ]

  return venues[Math.floor(Math.random() * venues.length)]
}

/**
 * Formats a date as "MMM DD, YYYY" (e.g., "Apr 10, 2025")
 */
function formatDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

