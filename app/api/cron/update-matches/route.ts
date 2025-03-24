import { NextResponse } from "next/server"
import { fetchUpcomingMatches } from "@/lib/api-service"

/**
 * This API route is designed to be called by a CRON job daily
 * to update the matches in the database
 *
 * In a production environment, you would:
 * 1. Authenticate the request (e.g., using a secret key)
 * 2. Connect to a real database to store the matches
 * 3. Set up proper error handling and logging
 */
export async function GET() {
  try {
    // Fetch upcoming matches from the API
    const matches = await fetchUpcomingMatches()

    // In a real app, you would store these matches in a database
    // For example, using Prisma with a database like PostgreSQL:
    //
    // await prisma.match.deleteMany({
    //   where: { startTimestamp: { gt: Date.now() } }
    // });
    //
    // await prisma.match.createMany({
    //   data: matches
    // });

    // For demo purposes, we'll just return the matches
    return NextResponse.json({
      success: true,
      message: "Matches updated successfully",
      count: matches.length,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating matches:", error)
    return NextResponse.json({ success: false, message: "Failed to update matches" }, { status: 500 })
  }
}

